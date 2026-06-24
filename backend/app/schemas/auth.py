# backend/app/schemas/auth.py
from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegisterInput(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: Optional[str] = "student"

class UserLoginInput(BaseModel):
    username: str
    password: str