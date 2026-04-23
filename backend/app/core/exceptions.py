"""
Custom exception classes for consistent error handling
"""
from typing import Optional

class AppException(Exception):
    """
    Base application exception with status code and message
    """
    def __init__(
        self, 
        message: str, 
        status_code: int = 500, 
        details: Optional[str] = None
    ):
        self.message = message
        self.status_code = status_code
        self.details = details
        super().__init__(self.message)

class NotFoundException(AppException):
    """
    Exception for resource not found (404)
    """
    def __init__(self, message: str = "Resource not found", details: Optional[str] = None):
        super().__init__(message=message, status_code=404, details=details)

class ForbiddenException(AppException):
    """
    Exception for forbidden access (403)
    """
    def __init__(self, message: str = "Access forbidden", details: Optional[str] = None):
        super().__init__(message=message, status_code=403, details=details)

class BadRequestException(AppException):
    """
    Exception for bad request (400)
    """
    def __init__(self, message: str = "Bad request", details: Optional[str] = None):
        super().__init__(message=message, status_code=400, details=details)

class UnauthorizedException(AppException):
    """
    Exception for unauthorized access (401)
    """
    def __init__(self, message: str = "Unauthorized", details: Optional[str] = None):
        super().__init__(message=message, status_code=401, details=details)
