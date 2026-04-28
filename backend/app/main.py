"""
FastAPI main application - Personal Expense Tracker API
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from contextlib import asynccontextmanager

from app.core.config import settings
from app.db.database import engine, Base
from app.routes import expenses, auth, dashboard, insights, google_auth
from app.core.exceptions import AppException
from app.core.error_handlers import (
    handle_app_exception,
    handle_validation_error,
    handle_generic_exception
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup and shutdown events
    """
    # Startup: Create database tables if they don't exist
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown: Cleanup (if needed)

# Initialize FastAPI app with metadata
app = FastAPI(
    title="Expense Tracker API",
    description="Personal finance tracking API with JWT authentication, expense management, analytics dashboard, and AI-powered spending insights",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS middleware for React frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Register exception handlers for consistent error responses
app.add_exception_handler(AppException, handle_app_exception)
app.add_exception_handler(RequestValidationError, handle_validation_error)
app.add_exception_handler(Exception, handle_generic_exception)

# Include routers with proper prefixes and tags
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(google_auth.router, prefix="/auth", tags=["Google OAuth"])
app.include_router(expenses.router, prefix="/expenses", tags=["Expenses"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(insights.router, prefix="/insights", tags=["Insights"])

# Root endpoint
@app.get("/", tags=["Root"])
def read_root():
    """
    Welcome endpoint - API health check
    """
    return {
        "message": "Expense Tracker API",
        "version": "1.0.0",
        "status": "running"
    }

# OAuth config check endpoint (for debugging)
@app.get("/auth/oauth-status", tags=["Authentication"])
def oauth_status():
    """
    Check OAuth configuration status
    """
    return {
        "oauth_configured": bool(settings.google_client_id),
        "client_id_present": bool(settings.google_client_id),
        "client_id_preview": settings.google_client_id[:20] + "..." if settings.google_client_id else "NOT SET",
        "redirect_uri": settings.google_redirect_uri,
        "frontend_url": settings.frontend_url
    }

# PASSWORD UPDATE ENDPOINT - Added directly to main app
from fastapi import Depends, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.schemas.user import PasswordUpdate
from app.core.security import hash_password, verify_password, get_current_user
from app.core.exceptions import UnauthorizedException

@app.put("/auth/update-password", response_model=dict, status_code=status.HTTP_200_OK, tags=["Authentication"])
def update_user_password(
    password_data: PasswordUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update user password - requires current password verification
    """
    # Verify current password
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise UnauthorizedException("Current password is incorrect")
    
    # Update to new password
    current_user.hashed_password = hash_password(password_data.new_password)
    db.commit()
    
    return {"message": "Password updated successfully"}
