# backend/app/api/v1/admin_courses.py
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.users_model import User, UserRole
from app.schemas.course import CourseCreateInput, CourseUpdateInput
from app.services.course_service import CoursesService

router = APIRouter()


def get_current_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """
    Tái sử dụng get_current_user thật (giải mã JWT, lấy user từ DB) đang dùng
    cho courses.py / lessons.py / progress.py, chỉ thêm check role == admin.
    """
    if current_user.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chỉ admin mới có quyền truy cập chức năng này.",
        )
    return current_user


def success_response(data, message: str = "OK"):
    return {
        "success": True,
        "message": message,
        "data": data,
    }


@router.get("", status_code=status.HTTP_200_OK)
def get_courses_admin(
    keyword: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, alias="pageSize", ge=1, le=100),
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
):
    return success_response(
        CoursesService.get_all_courses_admin(
            db=db,
            keyword=keyword,
            page=page,
            page_size=page_size,
        )
    )


@router.post("", status_code=status.HTTP_201_CREATED)
def create_course_admin(
    payload: CourseCreateInput,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user),
):
    course = CoursesService.create_course_admin(payload, admin_id=int(admin.id), db=db)
    return success_response(
        CoursesService.serialize_course_admin_item(course),
        "Tạo khóa học thành công!",
    )


@router.patch("/{course_id}", status_code=status.HTTP_200_OK)
def update_course_admin(
    course_id: int,
    payload: CourseUpdateInput,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
):
    course = CoursesService.update_course_admin(course_id, payload, db=db)
    return success_response(
        CoursesService.serialize_course_admin_item(course),
        "Cập nhật khóa học thành công!",
    )


@router.delete("/{course_id}", status_code=status.HTTP_200_OK)
def delete_course_admin(
    course_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
):
    result = CoursesService.delete_course_admin(course_id, db=db)
    return success_response(result, "Xóa khóa học thành công!")