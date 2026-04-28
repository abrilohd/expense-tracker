"""
Application configuration using Pydantic Settings
Loads environment variables from .env file
"""
import os
import logging
from pathlib import Path
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

# Configure logging
logger = logging.getLogger(__name__)

# Get the backend directory (parent of app directory)
BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_FILE = BASE_DIR / ".env"

class Settings(BaseSettings):
    """
    Application settings loaded from environment variables
    """
    # Database configuration
    database_url: str = Field(default="sqlite:///./expenses.db", validation_alias="DATABASE_URL")
    
    # CORS configuration
    cors_origins: list = ["http://localhost:5173", "http://127.0.0.1:5173"]
    
    # API metadata
    app_name: str = "Personal Expense Tracker API"
    app_version: str = "1.0.0"
    app_description: str = "API for managing personal expenses"
    
    # JWT Authentication configuration
    secret_key: str = Field(default="your-super-secret-key-change-in-production", validation_alias="SECRET_KEY")
    algorithm: str = Field(default="HS256", validation_alias="ALGORITHM")
    access_token_expire_minutes: int = Field(default=30, validation_alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    
    # Google OAuth configuration
    google_client_id: str = Field(default="", validation_alias="GOOGLE_CLIENT_ID")
    google_client_secret: str = Field(default="", validation_alias="GOOGLE_CLIENT_SECRET")
    google_redirect_uri: str = Field(default="http://localhost:8000/auth/google/callback", validation_alias="GOOGLE_REDIRECT_URI")
    frontend_url: str = Field(default="http://localhost:5173", validation_alias="FRONTEND_URL")
    
    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE),
        env_file_encoding='utf-8',
        case_sensitive=False,
        extra="ignore"
    )

# Create global settings instance
settings = Settings()

# Log OAuth configuration status
if settings.google_client_id:
    logger.info(f"OAuth configured: Client ID loaded ({settings.google_client_id[:20]}...)")
else:
    logger.warning(f"GOOGLE_CLIENT_ID not loaded from {ENV_FILE}")
