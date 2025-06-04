from sqlalchemy import Column, Integer, String
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)  # Hashed password
    role = Column(String, default="user")
    department = Column(String, nullable=True)  # Thêm phòng ban nếu cần
