from fastapi import APIRouter
from .mailer import send_email, logger

router = APIRouter()


@router.post("/notify")
async def notify(data: dict):
    try:
        send_email(data)                # gửi thật (sẽ lỗi vì chưa config)
        status = "sent"
    except Exception as e:
        logger.warning("Send email failed: %s", e)
        status = "failed"               # ↩︎ vẫn trả HTTP 200!
    return {"status": status}
