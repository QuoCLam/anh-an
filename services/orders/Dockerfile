FROM python:3.10-slim

# (1) Cài curl để healthcheck nếu cần
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# (2) Cài dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# (3) Copy Alembic config và migration scripts
COPY alembic.ini .
COPY alembic ./alembic

# (4) Copy toàn bộ code Python
COPY app ./app

# (5) Lệnh khởi động: upgrade db rồi chạy FastAPI
CMD alembic upgrade head && \
    uvicorn app.main:app --host 0.0.0.0 --port 8000
