from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.lesson_service import LessonService

router = APIRouter()


def success_response(data, message: str = "OK"):
    return {
        "success": True,
        "message": message,
        "data": data,
    }


def lesson_error_response(exc: HTTPException):
    if isinstance(exc.detail, dict):
        return JSONResponse(status_code=exc.status_code, content=exc.detail)

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": str(exc.detail),
            "errorCode": "LESSON_ERROR",
            "details": None,
        },
    )


@router.get("/{lesson_id}", status_code=status.HTTP_200_OK)
def get_lesson_detail(lesson_id: int, db: Session = Depends(get_db)):
    try:
        lesson = LessonService.get_lesson_by_id(db, lesson_id)
    except HTTPException as exc:
        return lesson_error_response(exc)

    return success_response(LessonService.serialize_lesson_detail(lesson))


@router.get("/{lesson_id}/resources", status_code=status.HTTP_200_OK)
def get_lesson_resources(lesson_id: int, db: Session = Depends(get_db)):
    try:
        resources = LessonService.get_lesson_resources(db, lesson_id)
    except HTTPException as exc:
        return lesson_error_response(exc)

    return success_response(resources)
