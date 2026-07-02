# backend/app/api/v1/auth.py
import os
from fastapi import APIRouter, status, Depends, HTTPException
from app.schemas.auth import UserRegisterInput, UserLoginInput, GoogleLoginInput
from app.services.auth_service import AuthService
from app.models.users_model import User, UserRole
from sqlalchemy.orm import Session
from dotenv import load_dotenv
load_dotenv()
from app.core.database import get_db
from google.oauth2 import id_token
from google.auth.transport import requests
from fastapi import APIRouter, Depends, HTTPException, status

router = APIRouter()

GOOGLE_CLIENT_ID = os.getenv("CLIENT_ID")

@router.post("/google-login")
def google_login(login_input: GoogleLoginInput, db: Session = Depends(get_db)):
    # Gọi service, để service tự ném ra HTTPException nếu có lỗi (ValueError/Exception)
    result = AuthService.google_login(login_input, db=db)
    
    return {
        "status": "success",
        "message": "Đăng nhập bằng Google thành công!",
        "access_token": result["access_token"],
        "token_type": result["token_type"],
        "user": {
            "id": result["user"].id,
            "username": result["user"].username,
            "role": result["user"].role.value
        }
    }


# tài khoản --------------------------------------
@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegisterInput, db = Depends(get_db)):
    # Route gọi Service xử lý nghiệp vụ đăng ký
    try:   
        saved_user = AuthService.register_user(user_data, db = db)
        if not saved_user:
            # 409 conflic
            raise HTTPException(status_code=409, detail="username hoặc email đã được sử dụng!")
    except Exception as e:
        print(f"LỖI 500 TẠI ROUTER: {str(e)}")
        raise e # -->500 postman
    return {
        "status": "success",
        "message": "Đăng ký tài khoản thành công!",
        "data": saved_user
    }
    
@router.post("/login")
def login(login_input: UserLoginInput, db = Depends(get_db)):
    try: 
        result = AuthService.authenticate_user(
            username=login_input.username, 
            password=login_input.password,
            db = db
        )
        if not result:
            raise HTTPException(status_code=401, detail="Tài khoản hoặc mật khẩu sai")
    except Exception as e:
        raise e # Để FastAPI vẫn báo 500 trên Postman
    return {
        "status": "success",
        "message": "Đăng nhập thành công!",
        "access_token": result["access_token"],
        "token_type": "bearer",
        "user": {
            "id": result["user"].id,
            "username": result["user"].username,
            "role": result["user"].role.value
        }
    }


    
