"""
Recurring Transaction schemas - request/response validation
"""
from pydantic import BaseModel, Field, field_validator
from datetime import date, datetime
from typing import Optional, Literal

# Transaction type and frequency literals
TransactionType = Literal["expense", "income"]
Frequency = Literal["daily", "weekly", "monthly", "yearly"]

class RecurringTransactionBase(BaseModel):
    """Base schema for recurring transaction"""
    transaction_type: TransactionType
    title: str = Field(..., min_length=1, max_length=200)
    amount: float = Field(..., gt=0)
    category_or_source: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    payment_method: Optional[str] = Field(None, max_length=50)
    frequency: Frequency
    start_date: date
    end_date: Optional[date] = None
    
    @field_validator('end_date')
    @classmethod
    def validate_end_date(cls, v, info):
        if v and info.data.get('start_date') and v <= info.data['start_date']:
            raise ValueError('end_date must be after start_date')
        return v

class RecurringTransactionCreate(RecurringTransactionBase):
    """Schema for creating recurring transaction"""
    pass

class RecurringTransactionUpdate(BaseModel):
    """Schema for updating recurring transaction"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    amount: Optional[float] = Field(None, gt=0)
    category_or_source: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    payment_method: Optional[str] = Field(None, max_length=50)
    frequency: Optional[Frequency] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_active: Optional[bool] = None

class RecurringTransactionResponse(RecurringTransactionBase):
    """Schema for recurring transaction response"""
    id: int
    user_id: int
    next_occurrence: date
    is_active: bool
    created_at: datetime
    last_generated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class RecurringTransactionListResponse(BaseModel):
    """Schema for paginated recurring transaction list"""
    items: list[RecurringTransactionResponse]
    total: int
    active_count: int
    inactive_count: int
