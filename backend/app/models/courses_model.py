# backend/app/models/course_model.py
from sqlalchemy import Column, Integer, String, Text, Boolean, Enum, DateTime, text
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum

class CourseLevel(str, enum.Enum):
    basic = "basic"
    intermediate = "intermediate"
    advanced = "advanced"

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    thumbnail_url = Column(String(500), nullable=True)
    level = Column(Enum(CourseLevel), default=CourseLevel.basic, nullable=False)
    is_published = Column(Boolean, default=False, nullable=False, index=True)
    
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"), nullable=False)
    updated_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"), nullable=False)
    
    chapters = relationship("Chapter", back_populates="course", cascade="all, delete-orphan")