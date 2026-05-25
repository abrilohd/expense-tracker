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
    phone_number = Column(String, nullable=True)  # Phone number
    
    # Password reset
    reset_token = Column(String, nullable=True)  # Password reset token
    reset_token_expires = Column(DateTime, nullable=True)  # Token expiration
    
    # Authentication provider
    provider = Column(String, default="local", nullable=False)  # "local" or "google"
    
    # User status
    is_active = Column(Boolean, default=True, nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationship: one user has many expenses
    expenses = relationship("Expense", back_populates="owner", cascade="all, delete-orphan")
    
    # Relationship: one user has many incomes
    incomes = relationship("Income", back_populates="owner", cascade="all, delete-orphan")
    
    # Relationship: one user has many budgets
    budgets = relationship("Budget", back_populates="owner", cascade="all, delete-orphan")
    
    # Relationship: one user has many savings goals
    savings_goals = relationship("SavingsGoal", back_populates="owner", cascade="all, delete-orphan")
