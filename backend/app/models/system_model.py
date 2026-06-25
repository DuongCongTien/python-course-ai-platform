import enum
from sqlalchemy import Column, ForeignKey, BigInteger, Integer, String, Enum, Boolean, DateTime, Text, text
from sqlalchemy.orm import relationship
from app.core.database import Base

class EnrollmentStatus(str, enum.Enum):
    active = "active"
    completed = "completed"
    cancelled = "cancelled"

class ContactStatus(str, enum.Enum):
    new = "new"
    processing = "processing"
    resolved = "resolved"

class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(BigInteger, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    status = Column(Enum(EnrollmentStatus), default=EnrollmentStatus.active, nullable=False)
    enrolled_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")

class LessonProgress(Base):
    __tablename__ = "lesson_progress"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    lesson_id = Column(BigInteger, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    watched_seconds = Column(Integer, default=0)
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    last_accessed_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))

    user = relationship("User", back_populates="progress_records")
    lesson = relationship("Lesson", back_populates="progress_records")

class LearningActivity(Base):
    __tablename__ = "learning_activities"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    activity_type = Column(Enum("video", "quiz", "ai", "account", "certificate", "course"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    related_course_id = Column(BigInteger, ForeignKey("courses.id", ondelete="SET NULL"), nullable=True)
    related_lesson_id = Column(BigInteger, ForeignKey("lessons.id", ondelete="SET NULL"), nullable=True)
    related_quiz_id = Column(BigInteger, ForeignKey("quizzes.id", ondelete="SET NULL"), nullable=True)
    action_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    user = relationship("User", back_populates="activities")
    course = relationship("Course", back_populates="activities")
    lesson = relationship("Lesson", back_populates="activities")
    quiz = relationship("Quiz", back_populates="activities")

class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False)
    phone = Column(String(20), nullable=True)
    subject = Column(String(100), nullable=True)
    message = Column(Text, nullable=False)
    status = Column(Enum(ContactStatus), default=ContactStatus.new, nullable=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    type = Column(String(50), default="general")
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    user = relationship("User", back_populates="notifications")

class AdminAuditLog(Base):
    __tablename__ = "admin_audit_logs"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    admin_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    action = Column(String(100), nullable=False)
    target_table = Column(String(100), nullable=False)
    target_id = Column(BigInteger, nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    admin = relationship("User", back_populates="audit_logs")