"""
Income model - defines the income table structure
"""
from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Income(Base):
    """
    Income model - represents the income table in the database
    """
    __tablename__ = "income"

    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign key to user
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Income details
    amount = Column(Float, nullable=False)
    source = Column(String, nullable=False, index=True)  # Salary, Business, Freelancing, Gifts, Other
    date = Column(Date, nullable=False, index=True)
    description = Column(String, nullable=True)
    
    # Timestamp
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationship: income belongs to one user
    owner = relationship("User", back_populates="incomes")
