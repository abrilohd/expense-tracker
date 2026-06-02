"""
FastAPI main application - Personal Expense Tracker API
"""
import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.constants import API_TITLE, API_VERSION, API_DESCRIPTION
from app.db.database import engine, Base
from app.api.v1.api_router import api_router
from app.core.exceptions import AppException
from app.core.error_handlers import (
    handle_app_exception,
    handle_validation_error,
    handle_generic_exception
)

# Configure logging
logger = logging.getLogger(__name__)

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
    title=API_TITLE,
    description=API_DESCRIPTION,
    version=API_VERSION,
    lifespan=lifespan
)

# Configure CORS middleware for React frontends
# Read allowed origins from environment variable or use defaults
allowed_origins_str = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000"
)
allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",") if origin.strip()]

# Log CORS configuration for debugging
logger.info(f"🌐 CORS Configuration:")
logger.info(f"   ALLOWED_ORIGINS env var: {os.getenv('ALLOWED_ORIGINS', 'NOT SET')}")
logger.info(f"   Parsed origins ({len(allowed_origins)}): {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

# Register exception handlers for consistent error responses
app.add_exception_handler(AppException, handle_app_exception)
app.add_exception_handler(RequestValidationError, handle_validation_error)
app.add_exception_handler(Exception, handle_generic_exception)

# Include API v1 router
app.include_router(api_router)

# Root endpoint
@app.get("/", tags=["Root"])
def read_root():
    """
    Welcome endpoint - API health check
    """
    return {
        "message": "Expense Tracker API",
        "version": API_VERSION,
        "status": "running",
        "docs": "/docs"
    }

# Health check endpoint for Railway/Render
@app.get("/health", tags=["Root"])
async def health_check():
    """
    Health check endpoint for deployment platforms
    """
    return {
        "status": "ok",
        "service": "expense-tracker-api"
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

# CORS config check endpoint (for debugging)
@app.get("/debug/cors", tags=["Root"])
def cors_debug():
    """
    Check CORS configuration - shows what origins are allowed
    """
    allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "NOT SET")
    return {
        "allowed_origins_env": allowed_origins_str,
        "allowed_origins_parsed": allowed_origins,
        "frontend_url": settings.frontend_url,
        "note": "If ALLOWED_ORIGINS is 'NOT SET', only localhost origins are allowed"
    }
