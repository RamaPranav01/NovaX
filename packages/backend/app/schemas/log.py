from sqlalchemy import Column, Integer, String, DateTime, JSON
from sqlalchemy.sql import func
from app.db.base_class import Base

class Log(Base):
    """
    SQLAlchemy model for storing cryptographically-chained log entries.
    """
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)

    # Core transaction details from the gateway
    request_data = Column(JSON, nullable=False)
    response_data = Column(JSON, nullable=False)
    verdict = Column(String, index=True, nullable=False)

    # --- V2 Columns for Immutable Chain ---

    # The SHA-256 hash of the current log entry's critical data.
    # Indexed for faster verification queries.
    log_hash = Column(String, unique=True, nullable=False, index=True)

    # The SHA-256 hash of the *previous* log entry, forming the chain.
    # This is nullable ONLY for the very first log (the "genesis block").
    previous_log_hash = Column(String, unique=True, nullable=True, index=True)

    # --- End V2 Columns ---

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())