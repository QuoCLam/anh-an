from sqlalchemy.orm import Session
from . import models, schemas


def create_notification(db: Session, n: schemas.NotificationCreate):
    obj = models.Notification(**n.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def get_notifications(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Notification).offset(skip).limit(limit).all()