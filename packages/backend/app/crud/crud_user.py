from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.models.user import UserCreate
from app.schemas.user import User


def get_user_by_email(db: Session, *, email: str) -> User | None:
    """
    Looks up a user by their email address.
    """
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, *, obj_in: UserCreate) -> User:
    """
    Creates a new user in the database.
    """
    # Create a database-compatible dictionary from the input data
    db_obj = User(
        email=obj_in.email,
        hashed_password=get_password_hash(obj_in.password),
        is_active=True,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj