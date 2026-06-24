# backend/app/database.py
# ------------------------------
# | test database connection:  |
# |  1. cd backend             |
# |  2. python -m app.database |
# ------------------------------

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# chi dung khi test connection:
if __name__ == "__main__":
    print("[INFO] Dang kiem tra ket noi va truy van du lieu tu Model...")
    try:
        # 1. Import cac Model can test vao day de tranh bi vong lap import ngam
        from app.models import Course, User
        
        # 2. Mo mot phien lam viec voi DB
        db = SessionLocal()
        
        print("\n--- TEST 1: Lay danh sach khoa hoc tu bang 'courses' ---")
        # Chay lenh ORM lay tat ca khoa hoc dang duoc public
        active_courses = db.query(Course).filter(Course.is_published == True).all()
        
        if active_courses:
            print(f"[SUCCESS] Tim thay {len(active_courses)} khoa hoc trong MySQL:")
            for course in active_courses:
                print(f" - ID: {course.id} | Ten: {course.title} | Cap do: {course.level}")
        else:
            print("[WARNING] Ket noi DB on dinh nhung bang 'courses' dang trong (chua chay file seed_data.sql).")

        print("\n--- TEST 2: Lay thong tin tai khoan admin tu bang 'users' ---")
        admin_user = db.query(User).filter(User.username == "admin").first()
        if admin_user:
            print(f"[SUCCESS] Tim thay tai khoan: {admin_user.full_name} ({admin_user.email})")
        else:
            print("[WARNING] Khong tim thay tai khoan 'admin' trong bang 'users'.")
            
        db.close()
        print("\n" + "="*50)
        print("[SUCCESS] TOAN BO HE THONG MODEL VA DATABASE DA THONG SUOT TRON TRU!")
        print("="*50 + "\n")
        
    except Exception as e:
        print("\n" + "!"*50)
        print("[ERROR] LOI TRUY VAN MODEL!")
        print(f"Chi tiet: {e}")
        print("!"*50 + "\n")