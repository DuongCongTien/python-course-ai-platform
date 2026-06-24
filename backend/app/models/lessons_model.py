# backend/app/models/lesson_model.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, text
from sqlalchemy.orm import relationship
from app.core.database import Base

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    video_url = Column(String(500), nullable=False)
    code_stub = Column(Text, nullable=True)
    transcript = Column(Text, nullable=True) # Lưu transcript video dài để RAG AI đọc
    order_index = Column(Integer, nullable=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"), nullable=False)

    # Khóa ngoại nối lên Chương học
    chapter_id = Column(Integer, ForeignKey("chapters.id", ondelete="CASCADE", onupdate="CASCADE"), nullable=False, index=True)

    # Mối quan hệ ORM
    chapter = relationship("Chapter", back_populates="lessons")
    jobs = relationship("VideoJob", back_populates="lesson", cascade="all, delete-orphan")