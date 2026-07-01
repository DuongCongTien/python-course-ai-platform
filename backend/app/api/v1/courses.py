from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.course_service import CoursesService

router = APIRouter()


def success_response(data, message: str = "OK"):
    return {
        "success": True,
        "message": message,
        "data": data,
    }


def course_error_response(exc: HTTPException):
    if isinstance(exc.detail, dict):
        return JSONResponse(status_code=exc.status_code, content=exc.detail)

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": str(exc.detail),
            "errorCode": "COURSE_ERROR",
            "details": None,
        },
    )


@router.get("/", status_code=status.HTTP_200_OK)
def get_all_published_courses(
    keyword: str | None = Query(default=None),
    level: str | None = Query(default=None, pattern="^(beginner|intermediate|advanced)$"),
    page: int = Query(default=1, ge=1),
    pageSize: int = Query(default=12, ge=1, le=100),
    db: Session = Depends(get_db),
):
    data = CoursesService.get_published_courses(
        db=db,
        keyword=keyword,
        level=level,
        page=page,
        page_size=pageSize,
    )
    return success_response(data)


@router.get("/featured", status_code=status.HTTP_200_OK)
def get_featured_courses(
    limit: int = Query(default=6, ge=1, le=20),
    db: Session = Depends(get_db),
):
    data = CoursesService.get_featured_courses(db=db, limit=limit)
    return success_response(data)


@router.get("/{course_id}", status_code=status.HTTP_200_OK)
def get_course_by_id(course_id: str, db: Session = Depends(get_db)):
    try:
        course = CoursesService.get_course_by_identifier(identifier=course_id, db=db)
    except HTTPException as exc:
        return course_error_response(exc)
    return success_response(CoursesService.serialize_course_detail(course))


@router.get("/{course_id}/lessons", status_code=status.HTTP_200_OK)
def get_course_lessons(course_id: str, db: Session = Depends(get_db)):
    try:
        data = CoursesService.get_course_lessons(identifier=course_id, db=db)
    except HTTPException as exc:
        return course_error_response(exc)
    return success_response(data)
