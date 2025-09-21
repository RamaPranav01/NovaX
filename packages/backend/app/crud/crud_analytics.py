from sqlalchemy.orm import Session
from sqlalchemy import func

from app.schemas import log as log_schemas

def get_analytics_summary(db: Session):
    """
    Queries the database to generate a summary of gateway analytics.
    
    This function performs efficient, database-level aggregations to
    calculate key metrics from the logs table.
    """
    # Use SQLAlchemy's `func` to perform SQL functions like COUNT.
    # The .scalar() method returns a single value instead of a full row.
    total_requests = db.query(func.count(log_schemas.Log.id)).scalar() or 0
    
    blocked_requests = db.query(func.count(log_schemas.Log.id)).filter(
        log_schemas.Log.verdict == "BLOCKED"
    ).scalar() or 0
    
    # Calculate the percentage of blocked requests, handling the case of zero total requests.
    block_rate = (blocked_requests / total_requests * 100) if total_requests > 0 else 0

    return {
        "total_requests": total_requests,
        "blocked_requests": blocked_requests,
        "allowed_requests": total_requests - blocked_requests,
        "block_rate_percentage": round(block_rate, 2)
    }