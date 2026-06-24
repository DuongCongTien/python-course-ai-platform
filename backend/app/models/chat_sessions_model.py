# backend/app/models/chat_session_model.py
from sqlalchemy import Column, Integer, ForeignKey, DateTime, text
from sqlalchemy.orm import relationship
from app.core.database import Base

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"), nullable=False)

    # Cặp đôi khóa ngoại bắt buộc phải đánh index để kiểm tra lịch sử chat cũ của user tại bài học đó
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE", onupdate="CASCADE"), nullable=False, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE", onupdate="CASCADE"), nullable=False, index=True)

    # Mối quan hệ ORM
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")
    user = relationship("User", back_populates="chat_sessions")