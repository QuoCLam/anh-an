from fastapi import APIRouter
from .mailer import send_email, logger

router = APIRouter()


@router.post("/notify")
async def notify(data: dict):
    try:
        # Bạn có thể muốn validate data thành models.Notification trước khi gửi
        send_email(data)
        status = "sent"
    except Exception as e:
        logger.warning("Send email failed: %s", e)
        status = "failed"
    return {"status": status}
