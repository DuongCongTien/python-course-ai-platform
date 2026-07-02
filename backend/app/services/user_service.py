from fastapi import Header, status, Query, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.users_model import User
from app.services.auth_service import AuthService
from app.schemas.user import UserUpdateInput, UserUpdatePassword

from jose import jwt, JWTError
import os
from app.core.database import get_db
from sqlalchemy import or_

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM")

class UserService:
    
    @staticmethod
    def verify_current_user(token: str, db: Session):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("sub")
            
            if not user_id:
                return None
            user = db.query(User).filter(User.id == int(user_id)).first()
            return user
            
        except JWTError:
            return None
    
    @staticmethod
    def get_total_users(db: Session) : 
        return db.query(User).Count()
    
    @staticmethod
    def get_user_by_name(name: str, db: Session) : 
        if not name: 
            return []
        search_keyword = f"%{name}%"    
        users = db.query(User).filter(
            or_(
                User.username.like(search_keyword),
                User.full_name.like(search_keyword)
            )
        ).all()
        return users
    
    @staticmethod
    def get_user_by_id(id: int, db: Session) : 
        user = db.query(User).filter(User.id == id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy người dùng có id: {id}"
            )
        return user
    
    def get_current_user(
        authorization: str = Header(...), # Bắt buộc phải có Header Authorization
        db: Session = Depends(get_db)      
    ) -> User:
        
        if not authorization.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Header Authorization phải có định dạng 'Bearer <token>'"
            )
        
        token = authorization.split(" ")[1]
        
        user = UserService.verify_current_user(token, db)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token không hợp lệ hoặc người dùng không tồn tại"
            )
            
        return user
    
    def update_user(id=id, user_input=UserUpdateInput, db=Session):
        user = UserService.get_user_by_id(id=id, db=db)
        update_data = user_input.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(user, key, value)
        db.commit()
        db.refresh(user)
        return user
    
    def update_user_password(id: int, user_password: UserUpdatePassword, db: Session):
        user = UserService.get_user_by_id(id=id, db=db)
        if not user:
            raise HTTPException(status_code=404, detail="không tìm thấy người dùng!")
        
        old_password = user_password.old_password
        new_password = user_password.new_password
        if (old_password == new_password):
            raise HTTPException(status_code=400, detail="Yêu cầu mật khẩu khác!")

        if(AuthService.verify_password(old_password, user.password)):
            new_valid_password = AuthService.hash_password(new_password)
            user.password = new_valid_password 
            db.commit()
            db.refresh(user)
        else:
            raise HTTPException(status_code=400, detail="Mật khẩu cũ không chính xác!")
        

        
    
    
    