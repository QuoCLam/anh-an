FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install psycopg2-binary
RUN pip install --upgrade bcrypt
RUN pip install --no-cache-dir -r requirements.txt
COPY alembic.ini /app/alembic.ini
COPY alembic /app/alembic
COPY app /app/app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]