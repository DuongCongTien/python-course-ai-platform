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


# chỉ dùng khi test connection:

# if __name__ == "__main__":
#     print("🔄 Đang tiến hành kết nối thử tới MySQL Docker...")
#     try:
#         # Tạo một phiên làm việc tạm thời
#         db = SessionLocal()
        
#         # Chạy một câu lệnh SQL thuần đơn giản nhất để test phản hồi của DB
#         # Lệnh này chỉ yêu cầu MySQL trả về số 1
#         from sqlalchemy import text
#         result = db.execute(text("SELECT 1")).fetchone()
        
#         if result and result[0] == 1:
#             print("\n" + "="*50)
#             print("KẾT NỐI THÀNH CÔNG RỒI BẠN ƠI!")
#             print(f"Đã thông suốt tới Database: {DB_NAME} (Port: {DB_PORT})")
#             print("="*50 + "\n")
            
#         db.close()
#     except Exception as e:
#         print("\n" + "!"*50)
#         print("KẾT NỐI THẤT BẠI! Vui lòng kiểm tra lại:")
#         print(f"Lỗi chi tiết: {e}")
#         print("!"*50 + "\n")