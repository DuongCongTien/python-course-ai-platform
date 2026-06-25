from fastapi import APIRouter, status, Query, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.users_model import User
from sqlalchemy import or_

class UserService:
    
    # tìm kiếm (nhiều người) bằng name
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
    
    # tìm kiếm (1 người) bằng id
    @staticmethod
    def get_user_by_id(id: int, db: Session) : 
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