from sqlalchemy.orm import Session
from . import models, schemas
from datetime import datetime, timedelta

def create_order(db: Session, order: schemas.OrderCreate):
    db_order = models.Order(
        customer_name=order.customer_name,
        order_date=order.order_date,
        delivery_date=order.delivery_date,
        note=order.note or "",
        status="pending_confirm"
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    # Add order items
    for item in order.items:
        db_item = models.OrderItem(
            order_id=db_order.id,
            product_name=item.product_name,
            quantity=item.quantity,
            unit=item.unit
        )
        db.add(db_item)
    db.commit()

    # Tạo 4 task cho từng công đoạn
    task_types = ["Thiết kế", "Đăng ký công bố", "Thí nghiệm", "Thu mua"]
    for task_type in task_types:
        db_task = models.Task(
            order_id=db_order.id,
            type=task_type,
            status="pending"
        )
        db.add(db_task)
    db.commit()
    db.refresh(db_order)
    return db_order

def get_orders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Order).offset(skip).limit(limit).all()

def get_today_tasks(db: Session):
    today = datetime.now().date()
    tomorrow = today + timedelta(days=1)
    return db.query(models.Task).filter(
        models.Task.status == "pending",
        models.Task.created_at >= today,
        models.Task.created_at < tomorrow
    ).all()
