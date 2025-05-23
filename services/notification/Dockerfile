# Sử dụng base image Python 3.10 slim
FROM python:3.10-slim

# Cài đặt curl cho healthcheck
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy và cài dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy mã nguồn ứng dụng (Notification sẽ tự tạo bảng qua SQLAlchemy)
COPY app ./app
ENV PYTHONPATH=/app

# Khởi Uvicorn trực tiếp (Base.metadata.create_all trong code sẽ tạo bảng)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]