from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

# Auth / User Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    goal: Optional[str] = None
    xp: int
    current_streak: int
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class BiometricUpdate(BaseModel):
    height: float
    weight: float
    age: int
    gender: str
    goal: str

# Workout Logs
class WorkoutLogCreate(BaseModel):
    equipment_name: str
    sets: int
    reps: int
    weight_kg: float
    rpe: Optional[str] = None

class WorkoutLogResponse(BaseModel):
    id: int
    equipment_name: str
    sets: int
    reps: int
    weight_kg: float
    rpe: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Food Logs
class FoodLogCreate(BaseModel):
    food_name: str
    calories: float
    protein_g: float
    carbs_g: float
    fats_g: float
    portion: Optional[str] = None
    fitness_compatibility: Optional[str] = None
    improvement_tips: Optional[str] = None

class FoodLogResponse(BaseModel):
    id: int
    food_name: str
    calories: float
    protein_g: float
    carbs_g: float
    fats_g: float
    portion: Optional[str] = None
    fitness_compatibility: Optional[str] = None
    improvement_tips: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Body Composition
class BodyCompositionCreate(BaseModel):
    estimated_body_fat: str
    somatotype: str
    muscle_distribution_analysis: str
    recommended_workout_focus: str
    astra_recommendations: Optional[str] = None
    cal_target: float
    protein_target: float
    carbs_target: float
    fat_target: float

class BodyCompositionResponse(BaseModel):
    id: int
    estimated_body_fat: str
    somatotype: str
    muscle_distribution_analysis: str
    recommended_workout_focus: str
    astra_recommendations: Optional[str] = None
    cal_target: float
    protein_target: float
    carbs_target: float
    fat_target: float
    created_at: datetime

    class Config:
        from_attributes = True

# Dashboard
class DashboardResponse(BaseModel):
    user: UserResponse
    latest_body_composition: Optional[BodyCompositionResponse] = None
    workout_logs: List[WorkoutLogResponse] = []
    food_logs: List[FoodLogResponse] = []
    daily_totals: Dict[str, float] = {
        "calories_consumed": 0.0,
        "protein_consumed": 0.0,
        "carbs_consumed": 0.0,
        "fats_consumed": 0.0,
        "calories_target": 2000.0,
        "protein_target": 120.0,
        "carbs_target": 220.0,
        "fats_target": 65.0
    }
