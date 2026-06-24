# backend/app/models/chapter_model.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, text
from sqlalchemy.orm import relationship
from app.core.database import Base

class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    order_index = Column(Integer, nullable=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"), nullable=False)

    # Khóa ngoại nối sang bảng 'courses' (Được đánh index=True để load menu lộ trình học siêu nhanh)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE", onupdate="CASCADE"), nullable=False, index=True)

    course = relationship("Course", back_populates="chapters")
    lessons = relationship("Lesson", back_populates="chapter", cascade="all, delete-orphan")
    