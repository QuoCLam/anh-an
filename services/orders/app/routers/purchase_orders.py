from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from app import crud, schemas, database   # nhảy thẳng lên package app


router = APIRouter()

def get_db():
    db = database.SessionLocal();
    try: yield db
    finally: db.close()

@router.get("/", response_model=List[schemas.PurchaseOrder])
def list_purchase_orders(skip: int = 0, limit: int = 100, reminderDate: Optional[date] = None, db: Session = Depends(get_db)):
    return crud.get_purchase_orders(db, skip, limit, reminderDate)

@router.post("/", response_model=schemas.PurchaseOrder, status_code=201)
def create_po(po: schemas.PurchaseOrderCreate, db: Session = Depends(get_db)):
    return crud.create_purchase_order(db, po)

@router.put("/{po_id}", response_model=schemas.PurchaseOrder)
def update_po(po_id: str, po: schemas.PurchaseOrderUpdate, db: Session = Depends(get_db)):
    return crud.update_purchase_order(db, po_id, po)

@router.delete("/{po_id}", status_code=204)
def delete_po(po_id: str, db: Session = Depends(get_db)):
    crud.delete_purchase_order(db, po_id)