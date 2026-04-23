"""
SQLAlchemy models - defines the database table structure
"""
from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class Expense(Base):
    """
    Expense model - represents the expenses table in the database
    """
    __tablename__ = "expenses"

    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Expense details
    title = Column(String, nullable=False, index=True)
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=False, index=True)
    date = Column(Date, nullable=False)
    description = Column(String, nullable=True)
    
    # Foreign key to users table
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationship: many expenses belong to one user
    owner = relationship("User", back_populates="expenses")
