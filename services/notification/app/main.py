from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from . import crud, models, schemas
from fastapi.middleware.cors import CORSMiddleware

# tạo bảng
models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/notifications/", response_model=schemas.Notification)
def create_notif(n: schemas.NotificationCreate, db: Session = Depends(get_db)):
    return crud.create_notification(db, n)


@app.get("/notifications/", response_model=list[schemas.Notification])
def read_notifs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    return crud.get_notifications(db, skip, limit)

