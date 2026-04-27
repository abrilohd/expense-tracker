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
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev servers
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
