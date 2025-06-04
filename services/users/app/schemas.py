from typing import Optional
from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str
    role: str = "user"
    department: str = None  # Thêm nếu muốn chọn phòng ban khi tạo user

class UserLogin(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    role: str
    department: Optional[str] = None   # Cho phép None

    class Config:
        orm_mode = True
