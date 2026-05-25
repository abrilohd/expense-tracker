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
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    
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
    name: Optional[str] = None
    phone_number: Optional[str] = None
    picture: Optional[str] = None
    provider: str
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

class PasswordUpdate(BaseModel):
    """
    Schema for password update request
    """
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=8, max_length=100)
    
    @field_validator('new_password')
    @classmethod
    def password_must_contain_number(cls, v: str) -> str:
        """Ensure password contains at least one number"""
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one number')
        return v

class ForgotPasswordRequest(BaseModel):
    """
    Schema for forgot password request
    """
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    """
    Schema for password reset with token
    """
    token: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=8, max_length=100)
    
    @field_validator('new_password')
    @classmethod
    def password_must_contain_number(cls, v: str) -> str:
        """Ensure password contains at least one number"""
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one number')
        return v

class ProfileUpdate(BaseModel):
    """
    Schema for profile update request
    """
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone_number: Optional[str] = Field(None, pattern=r'^\+?[1-9]\d{1,14}$')
    
    @field_validator('phone_number')
    @classmethod
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        """Validate phone number format (E.164 international format)"""
        if v is None or v.strip() == "":
            return None
        # Basic validation for international phone format
        if not re.match(r'^\+?[1-9]\d{1,14}$', v):
            raise ValueError('Phone number must be in international format (e.g., +1234567890)')
        return v
