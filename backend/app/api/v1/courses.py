# backend/app/api/v1/courses.py
from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.course_service import CoursesService

router = APIRouter()

@router.get("/", status_code=status.HTTP_200_OK)
def get_all_published_courses(db = Depends(get_db)):
    courses_list = CoursesService.get_all_published_courses(db = db)
    return {
        "status": "success",
        "count": len(courses_list),
        "data": courses_list
    }

@router.get("/{id}", status_code=status.HTTP_200_OK)
def get_course_by_id(id: int, db = Depends(get_db)):
    course = CoursesService.get_course_by_id(id=id, db=db)
    return {
        "status": "success",
        "results": course
    }
    