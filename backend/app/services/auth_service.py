# backend/app/services/auth_service.py
import os
from datetime import datetime, timedelta, timezone
import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from app.models.users_model import User, UserRole

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 1440)) # Mặc định 1 ngày

class AuthService:
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Mã hóa mật khẩu thô thành chuỗi hash an toàn để lưu vào DB"""
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Kiểm tra mật khẩu thô người dùng nhập có khớp với chuỗi hash trong DB không"""
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
        """Tạo chuỗi JWT Access Token chứa thông tin định danh định kỳ"""
        to_encode = data.copy()
        
        # Thiết lập thời gian hết hạn cho Token
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            
        to_encode.update({"exp": expire})
        
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    @staticmethod
    def register_user(db: Session, user_data) -> User:
        """Xử lý logic đăng ký tài khoản mới (user_data nhận vào từ Pydantic Schema)"""
        existing_user = db.query(User).filter(
            (User.email == user_data.email) | (User.username == user_data.username)
        ).first()
        
        if existing_user:
            return None # Trả về None để tầng Route biết và bốc lỗi HTTPException phù hợp

        hashed_pwd = AuthService.hash_password(user_data.password)
        
        new_user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hashed_pwd,
            full_name=user_data.full_name,
            avatar_url=user_data.avatar_url,
            role=UserRole.student 
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user

    @staticmethod
    def authenticate_user(db: Session, login_data) -> dict | None:
        """Xử lý logic xác thực đăng nhập và trả về token cùng thông tin cơ bản"""
        user = db.query(User).filter(
            (User.email == login_data.username_or_email) | 
            (User.username == login_data.username_or_email)
        ).first()
        
        if not user:
            return None
            
        if not AuthService.verify_password(login_data.password, user.hashed_password):
            return None
            
        token_data = {
            "sub": str(user.id),
            "username": user.username,
            "role": user.role.value 
        }
        
        access_token = AuthService.create_access_token(data=token_data)
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }