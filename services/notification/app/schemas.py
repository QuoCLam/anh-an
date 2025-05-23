from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class NotificationCreate(BaseModel):
    order_id: int
    message: str

class Notification(BaseModel):
    id: int
    order_id: int
    message: str
    created_at: datetime
    sent_at: Optional[datetime]

    class Config:
        orm_mode = True