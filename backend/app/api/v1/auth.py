# backend/app/api/v1/auth.py
from fastapi import APIRouter, status, Query
from app.schemas.auth import UserRegisterInput, UserLoginInput
from app.services.auth_service import AuthService

router = APIRouter()

# tài khoản --------------------------------------
@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegisterInput):
    # Route gọi Service xử lý nghiệp vụ đăng ký
    saved_user = AuthService.register_user(user_data)
    return {
        "status": "success",
        "message": "Đăng ký tài khoản thành công!",
        "data": saved_user
    }
    
@router.post("/login")
def login(login_data: UserLoginInput):
    # Route gọi Service xử lý nghiệp vụ đăng nhập
    result = AuthService.login_user(
        username_input=login_data.username, 
        password_input=login_data.password
    )
    return {
        "status": "success",
        "message": "Đăng nhập thành công!",
        "access_token": result["token"],
        "token_type": "bearer",
        "user": {
            "id": result["id"],
            "username": result["username"],
            "role": result["role"]
        }
    }


    
