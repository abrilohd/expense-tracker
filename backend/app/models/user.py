"""
User model - defines the users table structure
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class User(Base):
    """
    User model - represents the users table in the database
    """
    __tablename__ = "users"

    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # User credentials
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=True)  # Nullable for Google OAuth users
    
    # User profile
    name = Column(String, nullable=True)  # Full name from Google
    picture = Column(String, nullable=True)  # Profile picture URL from Google
    
    # Authentication provider
    provider = Column(String, default="local", nullable=False)  # "local" or "google"
    
    # User status
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationship: one user has many expenses
    expenses = relationship("Expense", back_populates="owner", cascade="all, delete-orphan")
