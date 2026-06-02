"""
Dependency injection utilities for FastAPI
Centralized dependencies for authentication, database sessions, and common utilities
"""
from typing import Generator
from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.security import get_current_user, get_current_admin_user
from app.models.user import User

# Re-export commonly used dependencies for convenience
__all__ = [
    "get_db",
    "get_current_user",
    "get_current_admin_user",
]


def get_db_session() -> Generator[Session, None, None]:
    """
    Database session dependency
    Alias for get_db for consistency
    """
    return get_db()


def get_authenticated_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Get authenticated user dependency
    Alias for get_current_user for clarity
    """
    return current_user


def get_admin_user(
    admin_user: User = Depends(get_current_admin_user)
) -> User:
    """
    Get authenticated admin user dependency
    Alias for get_current_admin_user for clarity
    """
    return admin_user
