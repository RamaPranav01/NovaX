from sqlalchemy.orm import Session


from app.core.security import calculate_log_hash
from app.models import log as log_models 
from app.schemas import log as log_schemas 


def get_log(db: Session, log_id: int) -> log_schemas.Log | None:
    """
    Fetches a single log entry from the database by its primary key.
    """
    return db.query(log_schemas.Log).filter(log_schemas.Log.id == log_id).first()


def get_last_log(db: Session) -> log_schemas.Log | None:
    """
    Fetches the most recent log entry from the database.
    """
    return db.query(log_schemas.Log).order_by(log_schemas.Log.id.desc()).first()


def create_log(db: Session, *, log_in: log_models.LogCreate) -> log_schemas.Log:
    """
    Creates a new, cryptographically-chained log entry in the database.
    """
    
    last_log = get_last_log(db)
    previous_log_hash = last_log.log_hash if last_log else None

   
    log_data_for_hash = {
        "request_data": log_in.request_data,
        "response_data": log_in.response_data,
        "verdict": log_in.verdict,
    }

   
    current_log_hash = calculate_log_hash(
        log_data=log_data_for_hash,
        previous_log_hash=previous_log_hash
    )


    db_log = log_schemas.Log(
        request_data=log_in.request_data,
        response_data=log_in.response_data,
        verdict=log_in.verdict,
        log_hash=current_log_hash,
        previous_log_hash=previous_log_hash,
    )


    db.add(db_log)
    db.commit()
    db.refresh(db_log)

    return db_log