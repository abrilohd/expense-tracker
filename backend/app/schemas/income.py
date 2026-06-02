"""
Income schemas - defines request/response data validation models for income
"""
from pydantic import BaseModel, Field, field_validator
from datetime import date, datetime
from typing import Optional
from enum import Enum

class IncomeSource(str, Enum):
    """Valid income sources"""
    SALARY = "Salary"
    BUSINESS = "Business"
    FREELANCING = "Freelancing"
    INVESTMENT = "Investment"
    GIFTS = "Gifts"
    RENTAL = "Rental"
    OTHER = "Other"

class IncomeCreate(BaseModel):
    """
    Schema for creating a new income record
    """
    title: str = Field(..., min_length=1, max_length=200, description="Income title/name")
    amount: float = Field(..., gt=0, description="Income amount must be greater than 0")
    source: IncomeSource
    date: date
    description: Optional[str] = Field(None, max_length=500)
    
    @field_validator('date')
    @classmethod
    def date_not_in_future(cls, v: date) -> date:
        """Ensure date is not in the future"""
        if v > date.today():
            raise ValueError('Income date cannot be in the future')
        return v

class IncomeUpdate(BaseModel):
    """
    Schema for updating an income record - all fields optional
    """
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    amount: Optional[float] = Field(None, gt=0)
    source: Optional[IncomeSource] = None
    date: Optional[date] = None
    description: Optional[str] = Field(None, max_length=500)
    
    @field_validator('date')
    @classmethod
    def date_not_in_future(cls, v: Optional[date]) -> Optional[date]:
        """Ensure date is not in the future"""
        if v and v > date.today():
            raise ValueError('Income date cannot be in the future')
        return v

class IncomeResponse(BaseModel):
    """
    Schema for income responses
    """
    id: int
    user_id: int
    title: str
    amount: float
    source: str
    date: date
    description: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class IncomeListResponse(BaseModel):
    """
    Schema for paginated income list response
    """
    items: list[IncomeResponse]
    total: int
    skip: int
    limit: int
