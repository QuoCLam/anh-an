# services/orders_service/app/seed_data.py
from datetime import datetime
from sqlalchemy.orm import Session

from app.database import SessionLocal            # hàm tạo session đã có sẵn
from app import models                           # đã khai báo models.Order

SAMPLE_ORDERS = [
    {"customer_name": "Alice", "item": "Cà phê", "quantity": 2, "status": "pending"},
    {"customer_name": "Bob", "item": "Trà sữa", "quantity": 1, "status": "pending"},
    {"customer_name": "Chris", "item": "Latte", "quantity": 3, "status": "done"},
]


def seed(db: Session) -> None:
    objs = [
        models.Order(
            customer_name=o["customer_name"],
            item=o["item"],
            quantity=o["quantity"],
            status=o["status"],
            created_at=datetime.utcnow(),
        )
        for o in SAMPLE_ORDERS
    ]
    db.add_all(objs)
    db.commit()
    print(f"✔  Đã thêm {len(objs)} order mẫu")


if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed(db)
    finally:
        db.close()
