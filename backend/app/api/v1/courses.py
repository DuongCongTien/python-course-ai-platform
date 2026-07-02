# backend/app/api/v1/courses.py
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.users_model import User
from app.services.course_service import CoursesService
from app.services.progress_service import ProgressService

router = APIRouter()


def success_response(data, message: str = "OK"):
    return {
        "success": True,
        "message": message,
        "data": data,
    }


@router.get("/", status_code=status.HTTP_200_OK)
def get_published_courses(
    keyword: str | None = Query(default=None),
    level: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    pageSize: int = Query(default=12, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return success_response(
        CoursesService.get_published_courses(
            db=db,
            keyword=keyword,
            level=level,
            page=page,
            page_size=pageSize,
        )
    )


@router.get("/featured", status_code=status.HTTP_200_OK)
def get_featured_courses(
    limit: int = Query(default=6, ge=1, le=20),
    db: Session = Depends(get_db),
):
    return success_response(CoursesService.get_featured_courses(db=db, limit=limit))


@router.get("/{course_id}/continue", status_code=status.HTTP_200_OK)
def get_course_continue(
    course_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return success_response(ProgressService.get_course_continue(db, int(current_user.id), course_id))


@router.get("/{course_id}/progress", status_code=status.HTTP_200_OK)
def get_course_progress(
    course_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return success_response(ProgressService.get_course_progress(db, int(current_user.id), course_id))


@router.get("/{course_id}/lessons", status_code=status.HTTP_200_OK)
def get_course_lessons(course_id: str, db: Session = Depends(get_db)):
    return success_response(CoursesService.get_course_lessons(course_id, db))


@router.get("/{course_id}", status_code=status.HTTP_200_OK)
def get_course_by_id(course_id: str, db: Session = Depends(get_db)):
    return success_response(CoursesService.serialize_course_detail(CoursesService.get_course_by_identifier(course_id, db)))
