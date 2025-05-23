from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas, crud
from .database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS cho phép mọi frontend truy cập (có thể chỉ định origin cụ thể)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Đổi thành ["http://localhost:5173"] nếu muốn an toàn hơn
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/orders/", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    return crud.create_order(db=db, order=order)

@app.get("/orders/", response_model=List[schemas.Order])
def list_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_orders(db=db, skip=skip, limit=limit)

@app.get("/tasks/today", response_model=List[schemas.Task])
def get_today_tasks(db: Session = Depends(get_db)):
    return crud.get_today_tasks(db=db)
