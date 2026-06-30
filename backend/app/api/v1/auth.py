# backend/app/api/v1/auth.py
from fastapi import APIRouter, status, Depends, HTTPException
from app.schemas.auth import UserRegisterInput, UserLoginInput
from app.services.auth_service import AuthService
from app.core.database import get_db

router = APIRouter()

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
        print(f"❌ LỖI 500 TẠI ROUTER: {str(e)}")
        raise e 
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
        # In ra chi tiết lỗi 500 thực sự là gì
        print(f"❌ LỖI 500 TẠI ROUTER: {str(e)}")
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


    
