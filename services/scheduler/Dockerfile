FROM python:3.10-slim
RUN apt-get update && apt-get install -y build-essential curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# sao chép toàn bộ mã nguồn (chứa thư mục scheduler/)
COPY . .

CMD ["celery", "-A", "scheduler.app", "worker", "--beat", "--loglevel=info"]
