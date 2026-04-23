"""
Database configuration and session management
Supports SQLite (development) and PostgreSQL (production)
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Get DATABASE_URL from settings
DATABASE_URL = settings.database_url

# Create engine with conditional connect_args for SQLite
if DATABASE_URL.startswith("sqlite"):
    # SQLite requires check_same_thread=False for FastAPI
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    # PostgreSQL and other databases don't need special connect_args
    engine = create_engine(DATABASE_URL)

# SessionLocal: factory for creating database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base: declarative base class for ORM models
Base = declarative_base()

# Dependency function to get database session
def get_db():
    """
    Yields a database session and ensures it's closed after use.
    Use with FastAPI's Depends() for dependency injection.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
