from fastapi import APIRouter, status, Query, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.users_model import User
from sqlalchemy import or_

class UserService:
    
    @staticmethod
    def get_total_users(db: Session) : 
        return db.query(User).Count()
    
    @staticmethod
    def get_user_by_name(name: str, db: Session) : 
        # ng dùng k nhập gì:
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