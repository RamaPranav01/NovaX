from pydantic import BaseModel, Field
from typing import Dict, Any

# This file contains the Pydantic models for your API data shapes.

class LogCreate(BaseModel):
    """Pydantic model for creating a new log."""
    request_data: Dict[str, Any] = Field(..., example={"prompt": "What is the capital of France?"})
    response_data: Dict[str, Any] = Field(..., example={"llm_response": "The capital of France is Paris."})
    verdict: str = Field(..., example="ALLOWED")


class Log(BaseModel):
    """
    Pydantic model for reading a log from the database.
    This includes all database-generated fields.
    """
    id: int
    request_data: Dict[str, Any]
    response_data: Dict[str, Any]
    verdict: str
    log_hash: str
    previous_log_hash: str | None
    created_at: Any # Using 'Any' for datetime from DB is common for simplicity

    # --- THIS IS THE FINAL FIX ---
    # This 'Config' class with 'from_attributes = True' is the magic instruction.
    # It tells Pydantic that it's okay to read data from a database object (like a SQLAlchemy model)
    # and not just from a dictionary. This will fix the 500 Internal Server Error.
    class Config:
        from_attributes = True