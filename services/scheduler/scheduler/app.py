import os
from celery import Celery
from dotenv import load_dotenv

load_dotenv()
redis_url = os.getenv("REDIS_URL", "redis://redis:6379/0")

# Celery instance **phải** đặt tên mặc định `celery`
celery = Celery(
    "scheduler",
    broker=redis_url,
    backend=redis_url,
    include=["scheduler.tasks"],   # ← đường dẫn gói đúng
)

celery.conf.beat_schedule = {
    "notify-every-minute": {
        "task": "scheduler.tasks.notify_new_orders",
        "schedule": 60,
    }
}

# Tắt import mặc định 'app'
celery.conf.imports = ()
