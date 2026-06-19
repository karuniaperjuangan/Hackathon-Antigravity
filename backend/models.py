import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    
    # Biometric Data
    height = Column(Float, nullable=True)
    weight = Column(Float, nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    goal = Column(String, nullable=True) # e.g., "Lose Weight", "Gain Muscle", "Stay Fit"
    
    # Gamification
    xp = Column(Integer, default=0)
    current_streak = Column(Integer, default=0)
    last_active_date = Column(DateTime, nullable=True)

    workout_logs = relationship("WorkoutLog", back_populates="user", cascade="all, delete-orphan")
    food_logs = relationship("FoodLog", back_populates="user", cascade="all, delete-orphan")
    body_compositions = relationship("BodyComposition", back_populates="user", cascade="all, delete-orphan")


class WorkoutLog(Base):
    __tablename__ = "workout_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    equipment_name = Column(String, nullable=False)
    sets = Column(Integer, default=3)
    reps = Column(Integer, default=12)
    weight_kg = Column(Float, default=0.0)
    rpe = Column(String, nullable=True) # Rate of Perceived Exertion
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="workout_logs")


class FoodLog(Base):
    __tablename__ = "food_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    food_name = Column(String, nullable=False)
    calories = Column(Float, nullable=False)
    protein_g = Column(Float, nullable=False)
    carbs_g = Column(Float, nullable=False)
    fats_g = Column(Float, nullable=False)
    portion = Column(String, nullable=True)
    fitness_compatibility = Column(Text, nullable=True)
    improvement_tips = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="food_logs")


class BodyComposition(Base):
    __tablename__ = "body_compositions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    estimated_body_fat = Column(String, nullable=True)
    somatotype = Column(String, nullable=True) # Ectomorph/Mesomorph/Endomorph
    muscle_distribution_analysis = Column(Text, nullable=True)
    recommended_workout_focus = Column(Text, nullable=True)
    
    # Astra Group personalized business integration
    astra_recommendations = Column(Text, nullable=True)
    
    # Daily Macronutrient Targets (Calculated by AI)
    cal_target = Column(Float, nullable=True)
    protein_target = Column(Float, nullable=True)
    carbs_target = Column(Float, nullable=True)
    fat_target = Column(Float, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="body_compositions")
