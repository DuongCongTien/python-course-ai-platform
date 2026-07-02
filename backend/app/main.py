# backend/app/main.py
import os
import sys

# Tự động thêm thư mục gốc của dự án vào hệ thống tìm kiếm của Python
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.auth import router as auth_router
from app.api.v1.courses import router as courses_router
from app.api.v1.lessons import router as lessons_router
from app.api.v1.users import router as users_router

app = FastAPI(title="Python Course AI Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(courses_router, prefix="/api/v1/courses", tags=["Courses"])
app.include_router(lessons_router, prefix="/api/v1/lessons", tags=["Lessons"])
app.include_router(users_router, prefix="/api/v1/users", tags=["Users"])

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=3000, reload=True)
