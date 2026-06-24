# backend/app/models/user_model.py
from sqlalchemy import Column, Integer, String, Enum, DateTime, text
from sqlalchemy.orm import relationship 
from app.core.database import Base
import enum

class UserRole(str, enum.Enum):
    admin = "admin"
    teacher = "teacher"
    student = "student"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    username = Column(String(50), nullable=False, unique=True, index=True)
    email = Column(String(100), nullable=False, unique=True, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    
    role = Column(Enum(UserRole), default=UserRole.student, nullable=False)
    
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"), nullable=False)
    updated_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"), nullable=False)
    
    chat_sessions = relationship("ChatSession", back_populates="user", cascade="all, delete-orphan")