from sqlalchemy.orm import Session
import json

from app.core.security import calculate_log_hash
from app.models import log as log_models     # This is the SQLAlchemy model
from app.schemas import log as log_schemas   # This is the Pydantic schema


def get_log(db: Session, log_id: int) -> log_models.Log | None:
    """
    Fetches a single log entry from the database by its primary key.
    - Correction: Queries the SQLAlchemy model 'log_models.Log'.
    """
    return db.query(log_models.Log).filter(log_models.Log.id == log_id).first()


def get_last_log(db: Session) -> log_models.Log | None:
    """
    Fetches the most recent log entry from the database.
    - Correction: Queries the SQLAlchemy model 'log_models.Log'.
    """
    return db.query(log_models.Log).order_by(log_models.Log.id.desc()).first()


def create_log(db: Session, *, log_in: log_schemas.LogCreate) -> log_models.Log:
    """
    Creates a new, cryptographically-chained log entry in the database.
    - Correction: Accepts the Pydantic schema 'log_schemas.LogCreate' as input.
    - Correction: Creates an instance of the SQLAlchemy model 'log_models.Log'.
    """
    
    last_log = get_last_log(db)
    previous_log_hash = last_log.log_hash if last_log else None
    log_data_for_hash = log_in.model_dump()

    current_log_hash = calculate_log_hash(
        log_data=json.dumps(log_data_for_hash, sort_keys=True),
        previous_log_hash=previous_log_hash
    )

    db_log = log_models.Log(
        **log_in.model_dump(),
        log_hash=current_log_hash,
        previous_log_hash=previous_log_hash,
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)

    return db_log