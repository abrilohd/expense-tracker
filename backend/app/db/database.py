"""
Database configuration and session management
Supports SQLite (development) and PostgreSQL (production)
"""
import logging
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Configure logging
logger = logging.getLogger(__name__)

# Get DATABASE_URL from settings
DATABASE_URL = settings.database_url

# Log the database URL (hide password for security)
if "postgresql" in DATABASE_URL or "postgres" in DATABASE_URL:
    # Hide password in logs
    safe_url = DATABASE_URL.split("@")[1] if "@" in DATABASE_URL else DATABASE_URL
    logger.info(f"Using PostgreSQL database: ...@{safe_url}")
else:
    logger.info(f"Using database: {DATABASE_URL}")

# Railway PostgreSQL fix — replace postgres:// with postgresql://
if DATABASE_URL.startswith("postgres://"):
    logger.info("Converting postgres:// to postgresql:// for SQLAlchemy compatibility")
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Create engine with conditional configuration for SQLite vs PostgreSQL
if "sqlite" in DATABASE_URL:
    # SQLite requires check_same_thread=False for FastAPI
    logger.info("Configuring SQLite engine for local development")
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    # PostgreSQL with connection pooling for production
    logger.info("Configuring PostgreSQL engine with connection pooling")
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,  # Verify connections before using them
        pool_size=5,         # Number of connections to maintain
        max_overflow=10      # Maximum overflow connections
    )

logger.info("Database engine created successfully")

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
