from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# The engine is the central point of contact with the database.
# It interprets the DATABASE_URL and manages a pool of connections.
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

# SessionLocal is a "factory" for creating new database sessions.
# When we need to talk to the database in an API request, we will
# create an instance of this SessionLocal class.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)