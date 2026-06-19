import datetime
import json
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Optional

import models
import schemas
import auth
from database import engine, get_db, Base
from ai_service import AIService

# Create DB Tables if they do not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AstraFit AI Backend API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_origin_regex="https://.*\\.trycloudflare\\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper function to award XP & update streaks
def award_xp_and_update_streak(user: models.User, xp_to_add: int, db: Session):
    user.xp += xp_to_add
    
    # Check streak logic
    today = datetime.datetime.utcnow().date()
    if user.last_active_date:
        last_active = user.last_active_date.date()
        if last_active == today:
            pass # Already active today, streak remains
        elif last_active == today - datetime.timedelta(days=1):
            user.current_streak += 1 # Streak continues
        else:
            user.current_streak = 1 # Streak reset but active today
    else:
        user.current_streak = 1 # First activity

    user.last_active_date = datetime.datetime.utcnow()
    db.commit()
    db.refresh(user)
    return user

@app.get("/")
def read_root():
    return {"status": "AstraFit AI Backend is active and operational!"}

# --- AUTH ENDPOINTS ---

@app.post("/api/auth/register", response_model=schemas.UserResponse)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pass = auth.get_password_hash(user_in.password)
    new_user = models.User(
        email=user_in.email,
        hashed_password=hashed_pass,
        full_name=user_in.full_name,
        xp=0,
        current_streak=0
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/api/auth/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# Traditional login via JSON for API ease
@app.post("/api/auth/login", response_model=schemas.Token)
def login_json(user_in: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if not user or not auth.verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/users/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.put("/api/users/biometrics", response_model=schemas.UserResponse)
def update_biometrics(
    biometrics: schemas.BiometricUpdate, 
    current_user: models.User = Depends(auth.get_current_user), 
    db: Session = Depends(get_db)
):
    current_user.height = biometrics.height
    current_user.weight = biometrics.weight
    current_user.age = biometrics.age
    current_user.gender = biometrics.gender
    current_user.goal = biometrics.goal
    
    db.commit()
    db.refresh(current_user)
    return current_user


@app.post("/api/vision/estimate-biometrics")
async def estimate_biometrics_endpoint(
    file: UploadFile = File(...),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Estimate user biometrics (height, weight, age, gender, goal) from an uploaded image to autofill forms."""
    try:
        contents = await file.read()
        analysis = AIService.estimate_biometrics_from_photo(contents)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Biometrics estimation failed: {str(e)}")


# --- VISION AI ENDPOINTS ---

@app.post("/api/vision/equipment")
async def analyze_equipment_file(
    file: UploadFile = File(...), 
    current_user: models.User = Depends(auth.get_current_user)
):
    """Uploaded photo is processed with Gemini to detect gym equipment."""
    try:
        contents = await file.read()
        analysis = AIService.analyze_gym_equipment(contents)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload or vision analysis failed: {str(e)}")

@app.post("/api/vision/selfie", response_model=schemas.BodyCompositionResponse)
async def analyze_selfie_file(
    file: UploadFile = File(...),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Processes full body selfie, updates user body stats, targets and returns composition results."""
    # Ensure biometrics exist
    if not current_user.height or not current_user.weight:
        raise HTTPException(
            status_code=400, 
            detail="Tolong lengkapi profil biometrik Anda (tinggi, berat badan, dll) terlebih dahulu sebelum menganalisis foto tubuh!"
        )
    
    try:
        contents = await file.read()
        analysis = AIService.analyze_body_selfie(
            contents,
            height=current_user.height,
            weight=current_user.weight,
            age=current_user.age or 25,
            gender=current_user.gender or "Laki-laki",
            goal=current_user.goal or "Stay Fit"
        )
        
        # Save analysis to database
        macros = analysis.get("macronutrient_targets", {})
        astra_recs_list = analysis.get("astra_recommendations", [])
        astra_recs_str = json.dumps(astra_recs_list) if astra_recs_list else "[]"
        
        body_comp = models.BodyComposition(
            user_id=current_user.id,
            estimated_body_fat=analysis.get("estimated_body_fat", "Unknown"),
            somatotype=analysis.get("somatotype", "Unknown"),
            muscle_distribution_analysis=analysis.get("muscle_distribution_analysis", ""),
            recommended_workout_focus=analysis.get("recommended_workout_focus", ""),
            astra_recommendations=astra_recs_str,
            cal_target=float(macros.get("calories", 2000)),
            protein_target=float(macros.get("protein", 120)),
            carbs_target=float(macros.get("carbs", 220)),
            fat_target=float(macros.get("fat", 65))
        )
        db.add(body_comp)
        db.commit()
        db.refresh(body_comp)
        
        # Award 50 XP for doing Body Composition Sync
        award_xp_and_update_streak(current_user, 50, db)
        
        return body_comp
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Body analysis failed: {str(e)}")

@app.post("/api/vision/food")
async def analyze_food_file(
    file: UploadFile = File(...),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Uploaded food photo is processed with Gemini to calculate caloric/macro distribution."""
    try:
        contents = await file.read()
        nutrition = AIService.analyze_food_plate(contents)
        return nutrition
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Food analysis failed: {str(e)}")


# --- LOGS & JOURNAL ENDPOINTS ---

@app.post("/api/logs/workout", response_model=schemas.WorkoutLogResponse)
def log_workout(
    log_in: schemas.WorkoutLogCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Logs exercise set completed with a gym equipment."""
    new_log = models.WorkoutLog(
        user_id=current_user.id,
        equipment_name=log_in.equipment_name,
        sets=log_in.sets,
        reps=log_in.reps,
        weight_kg=log_in.weight_kg,
        rpe=log_in.rpe
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    
    # Award 15 XP for logging a workout set
    award_xp_and_update_streak(current_user, 15, db)
    
    return new_log

@app.post("/api/logs/food", response_model=schemas.FoodLogResponse)
def log_food(
    log_in: schemas.FoodLogCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Logs a meal consumed into daily food history."""
    new_log = models.FoodLog(
        user_id=current_user.id,
        food_name=log_in.food_name,
        calories=log_in.calories,
        protein_g=log_in.protein_g,
        carbs_g=log_in.carbs_g,
        fats_g=log_in.fats_g,
        portion=log_in.portion,
        fitness_compatibility=log_in.fitness_compatibility,
        improvement_tips=log_in.improvement_tips
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    
    # Award 10 XP for logging a meal
    award_xp_and_update_streak(current_user, 10, db)
    
    return new_log


# --- TELEMETRY DASHBOARD ---

@app.get("/api/dashboard", response_model=schemas.DashboardResponse)
def get_dashboard(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches user metrics, today's logs, and macro goals."""
    # Get latest body composition
    latest_comp = db.query(models.BodyComposition)\
        .filter(models.BodyComposition.user_id == current_user.id)\
        .order_by(models.BodyComposition.created_at.desc())\
        .first()
        
    # Get workout logs (recent 10)
    workouts = db.query(models.WorkoutLog)\
        .filter(models.WorkoutLog.user_id == current_user.id)\
        .order_by(models.WorkoutLog.created_at.desc())\
        .limit(10)\
        .all()
        
    # Get today's food logs
    today_start = datetime.datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    foods = db.query(models.FoodLog)\
        .filter(models.FoodLog.user_id == current_user.id, models.FoodLog.created_at >= today_start)\
        .all()
        
    # Compute totals
    calories_consumed = sum(f.calories for f in foods)
    protein_consumed = sum(f.protein_g for f in foods)
    carbs_consumed = sum(f.carbs_g for f in foods)
    fats_consumed = sum(f.fats_g for f in foods)
    
    # Default goals or from latest composition
    cal_target = latest_comp.cal_target if latest_comp else 2000.0
    protein_target = latest_comp.protein_target if latest_comp else 120.0
    carbs_target = latest_comp.carbs_target if latest_comp else 220.0
    fat_target = latest_comp.fat_target if latest_comp else 65.0
    
    daily_totals = {
        "calories_consumed": round(calories_consumed, 1),
        "protein_consumed": round(protein_consumed, 1),
        "carbs_consumed": round(carbs_consumed, 1),
        "fats_consumed": round(fats_consumed, 1),
        "calories_target": cal_target,
        "protein_target": protein_target,
        "carbs_target": carbs_target,
        "fats_target": fat_target
    }
    
    return {
        "user": current_user,
        "latest_body_composition": latest_comp,
        "workout_logs": workouts,
        "food_logs": foods,
        "daily_totals": daily_totals
    }
