import hashlib
import json
from datetime import datetime, timedelta, timezone
from typing import Any, Dict

from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ALGORITHM = "HS256"


def create_access_token(subject: str | Any, expires_delta: timedelta | None = None) -> str:
    """
    Generates a JWT access token.
    """
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain password against its hashed version.
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Hashes a plain password.
    """
    return pwd_context.hash(password)



def calculate_log_hash(
    log_data: Dict[str, Any], previous_log_hash: str | None
) -> str:
    """
    Creates a deterministic SHA-256 hash for a log entry.

    The hash is created from a sorted JSON representation of the log's
    critical data, combined with the hash of the previous log. This
    forms the immutable cryptographic chain.

    Args:
        log_data: A dictionary containing the log's request, response,
                  and verdict data.
        previous_log_hash: The hash of the preceding log in the chain.
                           This will be None for the genesis block.

    Returns:
        A hex-encoded SHA-256 hash as a string.
    """
   
    canonical_string = json.dumps(log_data, sort_keys=True).encode('utf-8')

    
    block_to_hash = (previous_log_hash or "").encode('utf-8') + canonical_string

    return hashlib.sha256(block_to_hash).hexdigest()