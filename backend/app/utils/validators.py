"""
Validation utility functions
"""
import re
from typing import Optional


def validate_email(email: str) -> bool:
    """
    Validate email format
    
    Args:
        email: Email address to validate
    
    Returns:
        True if valid, False otherwise
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validate_password_strength(password: str) -> tuple[bool, Optional[str]]:
    """
    Validate password strength
    
    Requirements:
    - At least 8 characters
    - Contains at least one number
    
    Args:
        password: Password to validate
    
    Returns:
        Tuple of (is_valid, error_message)
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not any(char.isdigit() for char in password):
        return False, "Password must contain at least one number"
    
    return True, None


def validate_amount(amount: float) -> tuple[bool, Optional[str]]:
    """
    Validate monetary amount
    
    Args:
        amount: Amount to validate
    
    Returns:
        Tuple of (is_valid, error_message)
    """
    if amount <= 0:
        return False, "Amount must be greater than zero"
    
    if amount > 999999999.99:
        return False, "Amount is too large"
    
    # Check for reasonable decimal places (max 2)
    if round(amount, 2) != amount:
        return False, "Amount can have at most 2 decimal places"
    
    return True, None


def sanitize_string(text: str, max_length: Optional[int] = None) -> str:
    """
    Sanitize string input by trimming whitespace and limiting length
    
    Args:
        text: Text to sanitize
        max_length: Maximum length (optional)
    
    Returns:
        Sanitized string
    """
    sanitized = text.strip()
    
    if max_length and len(sanitized) > max_length:
        sanitized = sanitized[:max_length]
    
    return sanitized
