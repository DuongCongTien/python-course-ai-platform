# backend/app/api/v1/courses.py
from fastapi import APIRouter, status, Query, Depends, HTTPException
from app.services.user_service import UserService
from app.schemas.user import UserUpdateInput, UserUpdatePassword
from sqlalchemy.orm import Session
from app.models.users_model import User


from app.core.database import get_db

router = APIRouter()

@router.get("/me")
def get_current_user_profile(token: str = Query(..., description="Truyền Access Token vào đây để lấy profile"),db = Depends(get_db)):
    user_profile = UserService.verify_current_user(token, db=db)
    return {
        "status": "success",
        "user": user_profile
    }
    
# chỉ trả về số lượng users
@router.get("/total_users")
def get_total_users(db = Depends(get_db)):
    total_users = UserService.get_total_users(db = db)
    return {
        "status": "success",
        "total_users" : len(total_users),
    }
    
@router.get("/find/{name}")
def get_user_by_name(name : str, db = Depends(get_db)):
    user_list = UserService.get_user_by_name(name = name, db = db)
    return {
        "status": "success",
        "count" : len(user_list),
        "user_list": user_list
    }
    
@router.get("/find/{id}")
def get_user_by_id(id : int, db = Depends(get_db)):
    user = UserService.get_user_by_id(id = id, db = db)
    return {
        "status": "success",
        "user": user
    }

@router.patch("/update/{id}")
def update_user_by_id(
    id: int, 
    user_input: UserUpdateInput, 
    current_user: User = Depends(UserService.get_current_user), 
    db = Depends(get_db)
):
    if current_user.role.value != "admin" and current_user.id != id:
        raise HTTPException(
            status_code=403, 
            detail="Bạn không có quyền sửa thông tin của người khác!"
        )

    updated_user = UserService.update_user(id=id, user_input=user_input, db=db)
    
    return {
        "status": "success",
        "message": "Cập nhật thành công",
        "user": updated_user
    } 
    
@router.post("/update/password/{id}")
def update_user_by_id(
    id: int, 
    user_password: UserUpdatePassword, 
    current_user: User = Depends(UserService.get_current_user), 
    db = Depends(get_db)
):
    if current_user.role.value != "admin" and current_user.id != id:
        raise HTTPException(
            status_code=403, 
            detail="Bạn không có quyền sửa thông tin của người khác!"
        )

    UserService.update_user_password(id=id, user_password=user_password, db=db)
    
    return {
        "status": "success",
        "message": "Cập nhật mật khẩu thành công",
    }   

    
