from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context
import sys
from pathlib import Path

# --- CORE FIX: Make alembic aware of the app's path ---
# This ensures that 'from app.core...' works correctly.
sys.path.append(str(Path(__file__).resolve().parents[1]))

# --- IMPORT YOUR APP'S MODELS AND SETTINGS ---
from app.core.config import settings
from app.db.base_class import Base
# --- THIS IS THE FINAL FIX ---
# We explicitly import all models here so that Base.metadata knows about them.
from app.schemas.user import User
from app.schemas.log import Log

# this is the Alembic Config object
config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Set the database URL from your application's settings
config.set_main_option('db_url', str(settings.DATABASE_URL))

# Set the target_metadata for 'autogenerate' support
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()


    