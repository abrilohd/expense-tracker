"""
Savings Goal schemas - defines request/response data validation models for savings goals
"""
from pydantic import BaseModel, Field, field_validator
from datetime import date, datetime
from typing import Optional
from enum import Enum

class SavingsGoalStatus(str, Enum):
    """Valid savings goal statuses"""
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class SavingsGoalCreate(BaseModel):
    """
    Schema for creating a new savings goal
    """
    name: str = Field(..., min_length=2, max_length=100, description="Goal name")
    target_amount: float = Field(..., gt=0, description="Target amount must be greater than 0")
    deadline: Optional[date] = Field(None, description="Goal deadline (optional)")
    emoji: Optional[str] = Field('💳', max_length=10, description="Goal emoji icon")
    color: Optional[str] = Field(None, max_length=20, description="Goal color hex code")
    
    @field_validator('deadline')
    @classmethod
    def deadline_must_be_future(cls, v: Optional[date]) -> Optional[date]:
        """Ensure deadline is in the future if provided"""
        if v and v <= date.today():
            raise ValueError('Deadline must be in the future')
        return v

class SavingsGoalUpdate(BaseModel):
    """
    Schema for updating a savings goal - all fields optional
    """
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    target_amount: Optional[float] = Field(None, gt=0)
    current_amount: Optional[float] = Field(None, ge=0)
    deadline: Optional[date] = None
    status: Optional[SavingsGoalStatus] = None
    emoji: Optional[str] = Field(None, max_length=10)
    color: Optional[str] = Field(None, max_length=20)
    
    @field_validator('deadline')
    @classmethod
    def deadline_must_be_future(cls, v: Optional[date]) -> Optional[date]:
        """Ensure deadline is in the future if provided"""
        if v and v <= date.today():
            raise ValueError('Deadline must be in the future')
        return v
    
    @field_validator('current_amount')
    @classmethod
    def current_amount_non_negative(cls, v: Optional[float]) -> Optional[float]:
        """Ensure current amount is non-negative"""
        if v is not None and v < 0:
            raise ValueError('Current amount cannot be negative')
        return v

class SavingsGoalResponse(BaseModel):
    """
    Schema for savings goal responses with computed fields
    """
    id: int
    user_id: int
    name: str
    target_amount: float
    current_amount: float
    saved_amount: float  # Alias for current_amount (frontend compatibility)
    deadline: Optional[date]
    status: str
    created_at: datetime
    completed_at: Optional[datetime]
    emoji: Optional[str]
    color: Optional[str]
    
    # Computed fields
    progress_percentage: float
    percentage: float  # Alias for progress_percentage (frontend compatibility)
    days_remaining: Optional[int]
    is_overdue: bool

    class Config:
        from_attributes = True

class SavingsGoalListResponse(BaseModel):
    """
    Schema for paginated savings goals list response
    """
    items: list[SavingsGoalResponse]
    total: int
    active_count: int
    completed_count: int
    total_target: float
    total_saved: float

class SavingsGoalContribution(BaseModel):
    """
    Schema for adding contribution to savings goal
    """
    amount: float = Field(..., gt=0, description="Contribution amount must be greater than 0")
