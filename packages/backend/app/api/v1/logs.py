from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from app.crud import crud_log
from . import deps
from app.models import log as log_models
from app.schemas import log as log_schemas
from app.schemas.user import User
from app.core.security import calculate_log_hash

# This response model is good, no changes needed
class VerificationResponse(BaseModel):
    status: str = Field(..., example="ok")
    message: str = Field(..., example="Log chain integrity verified successfully.")
    logs_checked: int = Field(..., example=150)


router = APIRouter()

@router.get(
    "/{log_id}/report",
    response_model=log_schemas.Log, # Explicitly use the schema for response
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
    log_entry = crud_log.get_log(db=db, log_id=log_id)
    if not log_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Log with ID {log_id} not found."
        )
    return log_entry


@router.post("/", response_model=log_schemas.Log, status_code=201)
def create_log_entry(
    *,
    db: Session = Depends(deps.get_db),
    log_in: log_schemas.LogCreate,  # EDIT: Use Pydantic schema for input
    current_user: User = Depends(deps.get_current_user) # EDIT: Secure this endpoint
):
    """
    Create a new cryptographically-chained log entry.
    """
    return crud_log.create_log(db=db, log_in=log_in)


@router.get("/verify-chain/", response_model=VerificationResponse)
def verify_log_chain(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Verifies the integrity of the entire immutable log chain.
    """
    # EDIT: Use an iterator instead of .all() to save memory
    logs_query = db.query(log_models.Log).order_by(log_models.Log.id.asc())
    
    previous_log_hash = None
    logs_checked = 0
    is_first_log = True

    for current_log in logs_query:
        if is_first_log:
            # Check the genesis block (first log)
            if current_log.previous_log_hash is not None:
                raise HTTPException(status_code=500, detail="Chain broken: Genesis block has a previous_log_hash.")
            is_first_log = False
        else:
            # Check the chain link
            if previous_log_hash != current_log.previous_log_hash:
                raise HTTPException(status_code=500, detail=f"Chain link broken at log ID {current_log.id}.")

        # Verify the data integrity of the current log
        log_data_for_hash = {
            "request_data": current_log.request_data,
            "response_data": current_log.response_data,
            "verdict": current_log.verdict
        }
        recalculated_hash = calculate_log_hash(log_data_for_hash, current_log.previous_log_hash)
        if recalculated_hash != current_log.log_hash:
            raise HTTPException(status_code=500, detail=f"Data tampering detected at log ID {current_log.id}.")

        previous_log_hash = current_log.log_hash
        logs_checked += 1
    
    if logs_checked == 0:
        return VerificationResponse(status="ok", message="Log chain is empty.", logs_checked=0)

    return VerificationResponse(status="ok", message="Log chain integrity verified.", logs_checked=logs_checked)