"""
Recurring Transaction model - for automatic expense/income generation
"""
from sqlalchemy import Column, Integer, String, Float, Date, Boolean, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import date, datetime
import enum

from app.db.database import Base

class TransactionType(str, enum.Enum):
    """Transaction type enum"""
    EXPENSE = "expense"
    INCOME = "income"

class Frequency(str, enum.Enum):
    """Recurrence frequency enum"""
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    YEARLY = "yearly"

class RecurringTransaction(Base):
    """
    Recurring Transaction model for automatic transaction generation
    
    Supports both expenses and income with configurable frequency
    """
    __tablename__ = "recurring_transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    
    # Transaction details
    transaction_type = Column(SQLEnum(TransactionType), nullable=False)
    title = Column(String(200), nullable=False)
    amount = Column(Float, nullable=False)
    category_or_source = Column(String(100), nullable=False)  # Category for expense, Source for income
    description = Column(String(500), nullable=True)
    payment_method = Column(String(50), nullable=True)  # For expenses only
    
    # Recurrence settings
    frequency = Column(SQLEnum(Frequency), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)  # Optional end date
    next_occurrence = Column(Date, nullable=False)
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_generated_at = Column(DateTime(timezone=True), nullable=True)
    
    def __repr__(self):
        return f"<RecurringTransaction {self.title} ({self.frequency})>"
