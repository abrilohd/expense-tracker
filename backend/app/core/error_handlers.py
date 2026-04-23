"""
FastAPI exception handlers for consistent error responses
"""
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.core.exceptions import AppException

async def handle_app_exception(request: Request, exc: AppException) -> JSONResponse:
    """
    Handle custom application exceptions
    Returns consistent JSON error response
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "status_code": exc.status_code,
            "message": exc.message,
            "details": exc.details
        }
    )

async def handle_validation_error(request: Request, exc: RequestValidationError) -> JSONResponse:
    """
    Handle Pydantic validation errors
    Converts technical validation errors to user-friendly messages
    """
    # Extract field errors in plain English
    errors = []
    for error in exc.errors():
        field = " -> ".join(str(loc) for loc in error["loc"])
        message = error["msg"]
        errors.append(f"{field}: {message}")
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": True,
            "status_code": 422,
            "message": "Validation failed",
            "details": errors
        }
    )

async def handle_generic_exception(request: Request, exc: Exception) -> JSONResponse:
    """
    Handle all unhandled exceptions
    Prevents internal errors from being exposed to clients
    """
    # Log the actual error for debugging (in production, use proper logging)
    print(f"Unhandled exception: {type(exc).__name__}: {str(exc)}")
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": True,
            "status_code": 500,
            "message": "Internal server error",
            "details": None
        }
    )
