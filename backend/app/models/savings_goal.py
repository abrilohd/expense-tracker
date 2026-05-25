"""
Savings Goal model - defines the savings_goals table structure
"""
from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class SavingsGoal(Base):
    """
    Savings Goal model - represents the savings_goals table in the database
    """
    __tablename__ = "savings_goals"

    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign key to user
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Goal details
    name = Column(String(100), nullable=False)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0, nullable=False)
    deadline = Column(Date, nullable=True, index=True)
    status = Column(String, default="active", nullable=False, index=True)  # active, completed, cancelled
    emoji = Column(String(10), default='💳', nullable=True)
    color = Column(String(20), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    
    # Relationship: goal belongs to one user
    owner = relationship("User", back_populates="savings_goals")
