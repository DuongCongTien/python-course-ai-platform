# backend/app/api/v1/auth.py
from fastapi import APIRouter, status, Query
# Import cấu trúc đầu vào (Schema) và tầng xử lý (Service)
from backend.app.schemas.auth import UserRegisterInput, UserLoginInput
from backend.app.services.auth_service import AuthService

router = APIRouter()

# khóa học --------------------------------------
@router.get("/", status_code=status.HTTP_200_OK)
def get_all_courses():
    """
    API Lấy danh sách toàn bộ khóa học để hiển thị lên Trang chủ / Trang khóa học (Tuần 2)
    """
    # 1. Gọi sang tầng Service để xử lý kéo dữ liệu từ DB
    courses_list = CoursesService.get_all_published_courses()
    
    # 2. Trả dữ liệu JSON chuẩn về cho Frontend React
    return {
        "status": "success",
        "results": len(courses_list),
        "data": courses_list
    }