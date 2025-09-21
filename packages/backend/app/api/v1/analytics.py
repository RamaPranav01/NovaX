from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field


from . import deps 
from app.crud import crud_analytics
from app.schemas.user import User 

class AnalyticsSummaryResponse(BaseModel):
    total_requests: int = Field(..., example=150)
    blocked_requests: int = Field(..., example=12)
    allowed_requests: int = Field(..., example=138)
    block_rate_percentage: float = Field(..., example=8.0)

router = APIRouter()

@router.get(
    "/analytics/summary",
    response_model=AnalyticsSummaryResponse,
    tags=["Analytics"]
)
def get_summary(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user) # Secure this endpoint
):
    """
    Retrieves a summary of gateway analytics.
    
    Provides key metrics like total requests, blocked requests, and block rate,
    calculated from the immutable log data. This endpoint requires authentication.
    """
    summary_data = crud_analytics.get_analytics_summary(db=db)
    return AnalyticsSummaryResponse(**summary_data)