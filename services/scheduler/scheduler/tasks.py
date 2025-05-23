import os
import logging
import requests
from celery import shared_task

logger = logging.getLogger(__name__)

ORDERS_API = os.getenv("ORDERS_SERVICE_URL", "http://orders_service:8000")
NOTIF_API = os.getenv("NOTIF_SERVICE_URL", "http://notification_service:8001")


@shared_task
def notify_new_orders():
    """Pull pending orders and send notifications.

    The orders service exposes the list of orders via `/orders` and accepts
    `status` as a query‑string filter (e.g. `/orders?status=pending`).  We ask
    for the pending ones and, for each order returned, POST a notification to
    the notification service.
    """
    try:
        # GET /orders?status=pending – returns 200 and a JSON array
        resp = requests.get(
            f"{ORDERS_API}/orders", params={"status": "pending"}, timeout=5
        )
        resp.raise_for_status()
    except requests.RequestException as exc:
        logger.error("Failed to fetch pending orders: %s", exc, exc_info=True)
        raise

    for order in resp.json():
        try:
            requests.post(
                f"{NOTIF_API}/notifications/",
                json={
                    "order_id": order["id"],
                    "message": f"Đơn mới #{order['id']} cần xử lý",
                },
                timeout=5,
            )
        except requests.RequestException as exc:
            logger.error(
                "Failed to notify order %s: %s", 
                order.get("id"), 
                exc, 
                exc_info=True
            )
            # continue processing the rest of the orders
