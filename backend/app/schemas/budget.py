"""
Budget schemas - defines request/response data validation models for budgets
"""
from pydantic import BaseModel, Field, field_validator, model_validator
from datetime import date, datetime
from typing import Optional, Literal
from enum import Enum

class BudgetType(str, Enum):
    """Valid budget types"""
    OVERALL = "overall"
    CATEGORY = "category"

class BudgetStatus(str, Enum):
    """Budget status based on utilization"""
    SAFE = "safe"  # < 80%
    WARNING = "warning"  # 80-100%
    EXCEEDED = "exceeded"  # > 100%

class BudgetCreate(BaseModel):
    """
    Schema for creating a new budget
    """
    budget_type: BudgetType
    category: Optional[str] = None
    amount: float = Field(..., gt=0, description="Budget amount must be greater than 0")
    period_start: date
    period_end: date
    
    @field_validator('period_end')
    @classmethod
    def period_end_after_start(cls, v: date, info) -> date:
        """Ensure period_end is after period_start"""
        if 'period_start' in info.data and v <= info.data['period_start']:
            raise ValueError('period_end must be after period_start')
        return v
    
    @model_validator(mode='after')
    def validate_category_for_type(self):
        """Validate category based on budget_type"""
        if self.budget_type == BudgetType.CATEGORY and not self.category:
            raise ValueError('category is required for category budgets')
        if self.budget_type == BudgetType.OVERALL and self.category:
            raise ValueError('category must be null for overall budgets')
        return self

class BudgetUpdate(BaseModel):
    """
    Schema for updating a budget - all fields optional
    """
    budget_type: Optional[BudgetType] = None
    category: Optional[str] = None
    amount: Optional[float] = Field(None, gt=0)
    period_start: Optional[date] = None
    period_end: Optional[date] = None
    
    @model_validator(mode='after')
    def validate_period(self):
        """Ensure period_end is after period_start if both provided"""
        if self.period_start and self.period_end and self.period_end <= self.period_start:
            raise ValueError('period_end must be after period_start')
        return self

class BudgetResponse(BaseModel):
    """
    Schema for budget responses
    """
    id: int
    user_id: int
    budget_type: str
    category: Optional[str]
    amount: float
    period_start: date
    period_end: date
    created_at: datetime

    class Config:
        from_attributes = True

class BudgetStatusResponse(BaseModel):
    """
    Schema for budget status with utilization
    """
    budget: BudgetResponse
    spent_amount: float
    remaining_amount: float
    utilization_percentage: float
    status: BudgetStatus
    is_active: bool  # True if current date is within period

class BudgetListResponse(BaseModel):
    """
    Schema for paginated budget list response
    """
    items: list[BudgetResponse]
    total: int

class BudgetStatusListResponse(BaseModel):
    """
    Schema for list of budget statuses
    """
    budgets: list[BudgetStatusResponse]
    total_budgets: int
    active_budgets: int
    warning_count: int
    exceeded_count: int
