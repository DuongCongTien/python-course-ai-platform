from fastapi import APIRouter, status, Query, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.courses_model import Course

class CoursesService:
    
    @staticmethod
    def get_all_published_courses(db: Session) : 
        courses = db.query(Course).filter(Course.is_published == True).all()
        if not courses:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Khong tim thay khoa hoc voi ID: {id}"
            )
        return courses
    
    @staticmethod
    def get_course_by_id(id: int, db: Session) :
        course = db.query(Course).filter(Course.id == id).first()
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Khong tim thay khoa hoc voi ID: {id}"
            )
        return course
