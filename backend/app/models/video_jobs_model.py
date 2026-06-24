# backend/app/models/video_job_model.py
from sqlalchemy import Column, Integer, String, Text, Enum, ForeignKey, DateTime, text
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum

class JobStatus(str, enum.Enum):
    pending = "pending"
    processing = "processing"
    completed = "completed"
    failed = "failed"

class VideoJob(Base):
    __tablename__ = "video_jobs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Đánh index cho trạng thái để Admin lọc nhanh trên Dashboard (ví dụ: xem các job đang thất bại 'failed')
    status = Column(Enum(JobStatus), default=JobStatus.pending, nullable=False, index=True)
    progress = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)

    # Khóa ngoại nối tới bài học cần bóc tách AI
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE", onupdate="CASCADE"), nullable=False, index=True)

    # Mối quan hệ ORM
    lesson = relationship("Lesson", back_populates="jobs")