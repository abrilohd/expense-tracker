"""
Pydantic schemas - defines request/response data validation models
"""
from pydantic import BaseModel, Field, field_validator
from datetime import date, datetime
from typing import Optional, List, Literal

class ExpenseBase(BaseModel):
    """
    Base schema with common expense fields and validation
    """
    title: str = Field(..., min_length=2, max_length=100)
    amount: float = Field(..., gt=0)
    category: Literal[
        "Food", 
        "Transport", 
        "Housing", 
        "Entertainment", 
        "Health", 
        "Shopping", 
        "Education", 
        "Other"
    ]
    date: date
    description: Optional[str] = Field(None, max_length=500)
    
    @field_validator('title')
    @classmethod
    def title_must_be_valid(cls, v: str) -> str:
        """Strip whitespace and validate title length"""
        v = v.strip()
        if len(v) < 2:
            raise ValueError('Title must be at least 2 characters after removing whitespace')
        return v
    
    @field_validator('amount')
    @classmethod
    def amount_must_be_positive(cls, v: float) -> float:
        """Ensure amount is positive"""
        if v <= 0:
            raise ValueError('Amount must be greater than 0')
        return v
    
    @field_validator('date')
    @classmethod
    def date_cannot_be_future(cls, v: date) -> date:
        """Ensure date is not in the future"""
        if v > datetime.now().date():
            raise ValueError('Date cannot be in the future')
        return v
    
    @field_validator('description')
    @classmethod
    def description_strip_whitespace(cls, v: Optional[str]) -> Optional[str]:
        """Strip whitespace from description if provided"""
        if v:
            v = v.strip()
            return v if v else None
        return v

class ExpenseCreate(ExpenseBase):
    """
    Schema for creating a new expense (inherits all fields from ExpenseBase)
    user_id is automatically assigned from JWT token, not from request
    """
    pass

class ExpenseResponse(ExpenseBase):
    """
    Schema for expense responses - includes the database ID and user_id
    """
    id: int
    user_id: int

    class Config:
        # Enables compatibility with SQLAlchemy models
        from_attributes = True

class ExpenseListResponse(BaseModel):
    """
    Schema for paginated expense list responses with metadata
    """
    items: List[ExpenseResponse]
    total: int
    skip: int
    limit: int
