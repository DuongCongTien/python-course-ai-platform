# backend/app/models/__init__.py

# 1. Các bảng độc lập (Cấp 1)
from .users_model import User
from .courses_model import Course

# 2. Các bảng phụ thuộc cấp 2
from .chapters_model import Chapter

# 3. Các bảng phụ thuộc cấp 3
from .lessons_model import Lesson

# 4. Các bảng phụ thuộc cấp 4 (Hạ tầng AI & Chat)
from .video_jobs_model import VideoJob
from .chat_sessions_model import ChatSession
from .chat_messages_model import ChatMessage