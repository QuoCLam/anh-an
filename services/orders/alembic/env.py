"""
Alembic env cho orders_service – CHỈ tạo/sửa 3 bảng:
    orders, order_items, tasks
"""

from __future__ import annotations
import os, sys
from pathlib import Path
from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

# ─── add repo paths ──────────────────────────────────────────
ROOT = Path(__file__).resolve().parents[2]      # repo gốc
SERVICES = ROOT / "services"
sys.path[:0] = [str(SERVICES / "orders"), str(SERVICES / "users")]

# ─── import Base của các module ─────────────────────────────
from app.models import Base as OrdersBase               # orders_service/app/models.py
from app.models import Base as UsersBase                # users_service/app/models.py

# ─── config & logging ───────────────────────────────────────
config = context.config
fileConfig(config.config_file_name)

database_url = os.getenv("DATABASE_URL")
if database_url:
    config.set_main_option("sqlalchemy.url", database_url)

# ─── gom metadata + khai bảng mình sở hữu ───────────────────
target_metadata = OrdersBase.metadata
MY_TABLES = {"orders", "order_items", "tasks"}

def include_object(obj, name, type_, reflected, compare_to):
    #   Bỏ qua mọi thứ KHÔNG thuộc orders_service
    if type_ == "table":
        return name in MY_TABLES
    if type_ in {"index", "column"}:
        return obj.table.name in MY_TABLES
    return False

# ─── helper configure ───────────────────────────────────────
def _ctx(**kw):
    return dict(
        target_metadata=target_metadata,
        compare_type=True,
        include_object=include_object,
        literal_binds=kw.get("literal_binds", False),
        dialect_opts=kw.get("dialect_opts", {}),
        connection=kw.get("connection"),
    )

# ─── offline / online runners ───────────────────────────────
def run_migrations_offline():
    context.configure(**_ctx(literal_binds=True, dialect_opts={"paramstyle": "named"}))
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    engine = engine_from_config(config.get_section(config.config_ini_section),
                                prefix="sqlalchemy.", poolclass=pool.NullPool)
    with engine.connect() as conn:
        context.configure(**_ctx(connection=conn))
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
