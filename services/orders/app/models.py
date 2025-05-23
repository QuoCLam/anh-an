from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String, nullable=False)
    order_date = Column(DateTime, nullable=False)
    delivery_date = Column(DateTime, nullable=False)
    note = Column(String, default="")
    status = Column(String, default="pending_confirm")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    items = relationship("OrderItem", back_populates="order", cascade="all, delete")
    tasks = relationship("Task", back_populates="order", cascade="all, delete")

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_name = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    unit = Column(String, nullable=False)
    order = relationship("Order", back_populates="items")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    type = Column(String, nullable=False)  # 'Thiết kế', 'Đăng ký công bố', 'Thí nghiệm', 'Thu mua'
    status = Column(String, default="pending")  # 'pending', 'done', 'canceled'
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    order = relationship("Order", back_populates="tasks")
