import smtplib
from email.message import EmailMessage
from tenacity import retry, wait_exponential, stop_after_attempt


@retry(wait=wait_exponential(min=1, max=60), stop=stop_after_attempt(3))
def send_email(
        recipient,
        subject,
        body,
        smtp_host,
        smtp_port,
        username,
        password):
    msg = EmailMessage()
    msg['From'] = username
    msg['To'] = recipient
    msg['Subject'] = subject
    msg.set_content(body)
    with smtplib.SMTP(smtp_host, smtp_port) as s:
        s.starttls()
        s.login(username, password)
        s.send_message(msg)
