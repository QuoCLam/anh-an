import os
import logging
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from app import models

# Tạo logger để các module khác import
logger = logging.getLogger(__name__)

SG_API_KEY = os.getenv("SENDGRID_API_KEY")
FROM_EMAIL = os.getenv("FROM_EMAIL", "no-reply@example.com")


def send_email(notif: models.Notification) -> None:
    to_email = notif.payload["to"]          # <— lấy từ order/customer
    subject = notif.payload.get("subject", "Order Update")
    html_body = notif.payload.get("html", "")
    message = Mail(FROM_EMAIL, to_email, subject, html_body)
    sg = SendGridAPIClient(SG_API_KEY)
    sg.send(message)
