# app/routers/orders.py
"""Router xử lý endpoints cho đơn hàng.
Hiện tại có 2 endpoint:
- POST /orders/  : tạo đơn mới và sinh kèm notification cho các phòng ban liên quan
- GET  /orders/  : trả về tất cả đơn (kèm items, notifications)
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, database, schemas

router = APIRouter()

# ----------------- POST /orders/ -----------------


@router.post("/", response_model=schemas.Order, status_code=201)
def create_order(
    order: schemas.OrderCreate,
    db: Session = Depends(
        database.get_db)) -> schemas.Order:
    """
    Tạo mới một đơn hàng cùng danh sách sản phẩm (items), sau đó sinh notification
    cho 4 phòng ban: Thiết kế, Đăng ký công bố, Thí nghiệm, Thu mua.
    """
    try:
        # 1. Tạo order
        new_order = crud.create_order(db, order)

        # 2. Sinh notification cho 4 phòng ban
        initial_depts = [
            ("Thiết kế", "Chờ xác nhận thiết kế"),
            ("Đăng ký công bố", "Chờ xác nhận đăng ký công bố"),
            ("Thí nghiệm", "Chờ xác nhận thí nghiệm"),
            ("Thu mua", "Chờ xác nhận thu mua"),
        ]
        for dept, label in initial_depts:
            notif_in = schemas.NotificationCreate(
                order_id=new_order.id,
                message=f"Đơn SO{1000 + new_order.id}: {label} – phòng {dept}"
            )
            crud.create_notification(db, notif_in)

        return new_order
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ----------------- GET /orders/ ------------------
@router.get("/", response_model=list[schemas.Order])
def get_orders(db: Session = Depends(database.get_db)) -> list[schemas.Order]:
    """Trả về toàn bộ danh sách đơn hàng (kèm items, notifications)."""
    return crud.get_orders(db)
