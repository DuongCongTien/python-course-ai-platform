# backend/app/models/chat_message_model.py
from sqlalchemy import Column, Integer, Text, Enum, ForeignKey, DateTime, text
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum

class SenderType(str, enum.Enum):
    user = "user"
    ai = "ai"

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    sender = Column(Enum(SenderType), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"), nullable=False)

    # Khóa ngoại kết nối vào Phiên chat (Đánh index cực kỳ quan trọng để lôi lịch sử chat đổ lên UI bên phải)
    session_id = Column(Integer, ForeignKey("chat_sessions.id", ondelete="CASCADE", onupdate="CASCADE"), nullable=False, index=True)

    # Mối quan hệ ORM
    session = relationship("ChatSession", back_populates="messages")
    