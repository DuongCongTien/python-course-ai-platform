# backend/app/api/v1/courses.py
from fastapi import APIRouter, status, Query, Depends, HTTPException
from app.services.auth_service import AuthService
from app.services.user_service import UserService
from app.core.database import get_db

router = APIRouter()

@router.get("/me")
def get_current_user_profile(token: str = Query(..., description="Truyền Access Token vào đây để lấy profile")):
    user_profile = AuthService.verify_current_user(token)
    return {
        "status": "success",
        "user": user_profile
    }
    
@router.get("/find/{name}")
def get_user_by_name(name = str, db = Depends(get_db)):
    user_list = UserService.get_user_by_name(name = name, db = db)
    return {
        "status": "success",
        "count" : len(user_list),
        "user_list": user_list
    }
    
@router.get("/find/{id}")
def get_user_by_id(id = int, db = Depends(get_db)):
    user = UserService.get_user_by_id(id = id, db = db)
    return {
        "status": "success",
        "user": user
    }

    
