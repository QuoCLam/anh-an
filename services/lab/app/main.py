from fastapi import FastAPI
from app.routers import lab_test
from app.database import create_db_and_tables

app = FastAPI(title="Lab Service - Anh An")

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(lab_test.router, prefix="/lab-tests", tags=["Lab Test"])
