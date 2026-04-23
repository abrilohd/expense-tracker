"""
User schemas - defines request/response data validation models for users
"""
from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime
from typing import Optional
import re

class UserCreate(BaseModel):
    """
    Schema for user registration with validation
    """
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    
    @field_validator('password')
    @classmethod
    def password_must_contain_number(cls, v: str) -> str:
        """Ensure password contains at least one number"""
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one number')
        return v

class UserResponse(BaseModel):
    """
    Schema for user responses - excludes password
    """
    id: int
    email: str
    is_active: bool
    created_at: datetime

    class Config:
        # Enables compatibility with SQLAlchemy models
        from_attributes = True

class Token(BaseModel):
    """
    Schema for JWT token response
    """
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """
    Schema for decoded token data
    """
    email: Optional[str] = None
