from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class OrderItemBase(BaseModel):
    product_name: str
    quantity: int
    unit: str


class OrderItemCreate(OrderItemBase):
    pass


class OrderItem(OrderItemBase):
    id: int

    class Config:
        orm_mode = True


class TaskBase(BaseModel):
    type: str
    status: str


class TaskCreate(TaskBase):
    pass


class Task(TaskBase):
    id: int
    order_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class OrderBase(BaseModel):
    customer_name: str
    order_date: datetime
    delivery_date: datetime
    note: Optional[str] = ""


class OrderCreate(OrderBase):
    items: List[OrderItemCreate]


class Order(OrderBase):
    id: int
    status: str
    created_at: datetime
    updated_at: datetime
    items: List[OrderItem] = []
    tasks: List[Task] = []

    class Config:
        orm_mode = True
