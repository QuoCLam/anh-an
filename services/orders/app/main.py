from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from . import models, schemas, crud
from .database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS cho phép gọi API từ FE
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Để "*" cho dev, production thì set domain FE cụ thể!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lấy tất cả orders
@app.get("/orders/", response_model=list[schemas.Order])
def get_orders(db: Session = Depends(get_db)):
    return crud.get_orders(db)

# Lấy 1 order theo id
@app.get("/orders/{order_id}", response_model=schemas.Order)
def get_order(order_id: int, db: Session = Depends(get_db)):
    orders = crud.get_orders(db)
    order = next((o for o in orders if o.id == order_id), None)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

# Tạo order
@app.post("/orders/", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    return crud.create_order(db, order)

# Xóa order
@app.delete("/orders/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    success = crud.delete_order(db, order_id)
    if not success:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"ok": True, "message": "Order deleted"}

# (Có thể bổ sung thêm các route PUT, PATCH update order khi cần.)
