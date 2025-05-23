from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import crud, schemas, database

router = APIRouter()


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[schemas.Notification])
def read_notifications(
        skip: int = 0,
        limit: int = 100,
        db: Session = Depends(get_db)):
    return crud.get_notifications(db, skip=skip, limit=limit)


@router.post("/", response_model=schemas.Notification)
def create_notification(
        notification: schemas.NotificationCreate,
        db: Session = Depends(get_db)):
    return crud.create_notification(db, notification)
