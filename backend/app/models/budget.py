"""
Budget model - defines the budgets table structure
"""
from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Budget(Base):
    """
    Budget model - represents the budgets table in the database
    """
    __tablename__ = "budgets"

    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign key to user
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Budget details
    budget_type = Column(String, nullable=False)  # "overall" or "category"
    category = Column(String, nullable=True, index=True)  # Null for overall budgets, required for category budgets
    amount = Column(Float, nullable=False)
    period_start = Column(Date, nullable=False, index=True)
    period_end = Column(Date, nullable=False, index=True)
    
    # Timestamp
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationship: budget belongs to one user
    owner = relationship("User", back_populates="budgets")
    
    # Composite index for efficient period queries
    __table_args__ = (
        Index('idx_budget_period', 'user_id', 'period_start', 'period_end'),
        Index('idx_budget_type_category', 'user_id', 'budget_type', 'category'),
    )
