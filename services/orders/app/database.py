# app/database.py
# Cấu hình kết nối database cho Orders service, sử dụng biến môi trường
# trong .env

import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# 1. Load biến môi trường từ file .env ở gốc project
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)

# 2. Đọc chuỗi kết nối DATABASE_URL
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL not set in .env")

# 3. Khởi tạo SQLAlchemy engine và SessionLocal
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Base class cho các mô hình ORM
Base = declarative_base()

# 5. Dependency để lấy phiên làm việc với DB


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
