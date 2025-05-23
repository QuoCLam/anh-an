from fastapi import APIRouter, HTTPException
from app import crud, schemas, database

router = APIRouter(prefix="/sample-tasks")


@router.get("/", response_model=list[schemas.SampleTask])
def list_tasks(reminder_date: str):
    try:
        return crud.get_sample_tasks(reminder_date)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
