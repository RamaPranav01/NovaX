from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from app.crud import crud_log
from . import deps
from app.models import log as log_models
from app.schemas import log as log_schemas
from app.schemas.user import User
from app.core.security import calculate_log_hash


class VerificationResponse(BaseModel):
    status: str = Field(..., example="ok")
    message: str = Field(..., example="Log chain integrity verified successfully.")
    logs_checked: int = Field(..., example=150)


router = APIRouter()

@router.get(
    "/{log_id}/report",
    response_model=log_models.Log,
    tags=["Logs"]
)
def get_audit_report(
    log_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Retrieves a detailed audit report for a single log entry.
    """
    # The call now correctly uses the imported 'crud_log' module.
    log_entry = crud_log.get_log(db=db, log_id=log_id)
    if not log_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Log with ID {log_id} not found."
        )
    return log_entry


@router.post("/", response_model=log_models.Log, status_code=201)
def create_log_entry(
    *,
    db: Session = Depends(deps.get_db),
    log_in: log_models.LogCreate,
):
    """
    Create a new cryptographically-chained log entry.
    """
    return crud_log.create_log(db=db, log_in=log_in)


@router.get("/verify-chain/", response_model=VerificationResponse)
def verify_log_chain(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user) # Secure this endpoint
):
    """
    Verifies the integrity of the entire immutable log chain.
    """
    all_logs = db.query(log_schemas.Log).order_by(log_schemas.Log.id.asc()).all()
    if not all_logs:
        return VerificationResponse(status="ok", message="Log chain is empty.", logs_checked=0)

    if all_logs[0].previous_log_hash is not None:
        raise HTTPException(status_code=500, detail="Chain broken: Genesis block has a previous_log_hash.")
    for i in range(1, len(all_logs)):
        prev_log = all_logs[i-1]
        current_log = all_logs[i]
        if prev_log.log_hash != current_log.previous_log_hash:
            raise HTTPException(status_code=500, detail=f"Chain link broken at log ID {current_log.id}.")
        log_data_for_hash = {
            "request_data": current_log.request_data,
            "response_data": current_log.response_data,
            "verdict": current_log.verdict
        }
        recalculated_hash = calculate_log_hash(log_data_for_hash, prev_log.log_hash)
        if recalculated_hash != current_log.log_hash:
            raise HTTPException(status_code=500, detail=f"Data tampering at log ID {current_log.id}.")

    return VerificationResponse(status="ok", message="Log chain integrity verified.", logs_checked=len(all_logs))