from pydantic import BaseModel
from typing import Optional

# ---------------------- Department ----------------------

class DepartmentOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True  # Pydantic v2

class DepartmentCreate(BaseModel):
    name: str

class DepartmentUpdate(BaseModel):
    name: str

# ------------------------- User -------------------------

class UserOut(BaseModel):
    id: int
    username: str
    role: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    department: Optional[DepartmentOut] = None

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    username: str
    password: str                 # bắt buộc khi create
    role: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    department_id: Optional[int] = None

class UserUpdate(BaseModel):      # dùng cho PUT
    username: str
    password: Optional[str] = None  # có thể bỏ trống
    role: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    department_id: Optional[int] = None

# ------------------------- Token ------------------------

class Token(BaseModel):
    access_token: str
    token_type: str
