import os
from typing import cast
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Bắt buộc biến môi trường phải được set, rồi ép kiểu về str
DATABASE_URL = os.getenv('DATABASE_URL')
if DATABASE_URL is None:
    raise RuntimeError("DATABASE_URL environment variable is not set")
DATABASE_URL = cast(str, DATABASE_URL)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
