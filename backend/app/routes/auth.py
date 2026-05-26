"""
Authentication routes - user registration, login, and profile
"""
from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta, datetime, timezone
import logging
import os

from app.db.database import get_db
from app.models.user import User
from app.schemas.user import (
    UserCreate, 
    UserResponse, 
    Token, 
    PasswordUpdate, 
    ForgotPasswordRequest, 
    ResetPasswordRequest,
    ProfileUpdate
)
from app.core.security import (
    hash_password, 
    verify_password, 
    create_access_token, 
    get_current_user,
    generate_reset_token
)
from app.core.config import settings

logger = logging.getLogger(__name__)
from app.core.exceptions import BadRequestException, UnauthorizedException, ForbiddenException
from app.services.email_service import EmailService

# Create router instance
router = APIRouter()

# REGISTER - Create new user
@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user account
    """
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise BadRequestException("Email already registered")
    
    # Create new user with hashed password
    db_user = User(
        email=user.email,
        hashed_password=hash_password(user.password),
        name=user.name if user.name else None
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

# LOGIN - Authenticate user and return JWT token
@router.post("/login", response_model=Token)
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Login with email and password, returns JWT access token
    """
    # Find user by email (username field contains email)
    user = db.query(User).filter(User.email == form_data.username).first()
    
    # Verify user exists and password is correct
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise UnauthorizedException("Incorrect email or password")
    
    # Check if user is active
    if not user.is_active:
        raise ForbiddenException("Inactive user account")
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

# GET CURRENT USER - Return logged-in user profile
@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user profile
    """
    return current_user

# UPDATE PASSWORD - Change user password
@router.put("/update-password", response_model=dict, status_code=status.HTTP_200_OK)
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

# FORGOT PASSWORD - Request password reset token
@router.post("/forgot-password", response_model=dict, status_code=status.HTTP_200_OK)
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    """
    Request password reset - generates token and sends email via Resend
    In development mode (when email is not configured), returns the reset token
    """
    # Find user by email
    user = db.query(User).filter(User.email == request.email).first()
    
    # Always return success to prevent email enumeration
    if not user:
        return {"message": "If the email exists, a password reset link has been sent"}
    
    # Check if user is using OAuth (Google) - only check if user exists
    if user.provider and user.provider != "local":
        # For OAuth users, return success message but don't send email
        # This prevents revealing which accounts use OAuth
        return {"message": "If the email exists, a password reset link has been sent"}
    
    # Generate reset token
    reset_token = generate_reset_token()
    user.reset_token = reset_token
    # Store as naive datetime (SQLite doesn't support timezone-aware datetimes)
    # Convert timezone-aware datetime to naive UTC for database storage
    user.reset_token_expires = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(hours=1)  # Token valid for 1 hour
    
    db.commit()
    
    # Send password reset email
    email_result = EmailService.send_password_reset_email(
        to_email=user.email,
        reset_token=reset_token,
        user_name=user.name
    )
    
    # Log email sending result (for debugging)
    if not email_result.get("success"):
        error_msg = email_result.get('error', 'Unknown error')
        logger.warning(f"Failed to send password reset email to {user.email}: {error_msg}")
        
        # In development mode, return the token for testing
        if settings.debug:
            logger.info(f"Development mode: Reset token for {user.email}: {reset_token}")
            
            # Check if it's a Resend test mode limitation
            if "testing emails" in error_msg.lower() or "verify a domain" in error_msg.lower():
                return {
                    "message": "⚠️ Email service is in test mode. Please use the reset link below or verify your domain at resend.com/domains",
                    "reset_token": reset_token,
                    "reset_url": f"{os.getenv('APP_URL', 'http://localhost:5173')}/reset-password?token={reset_token}",
                    "dev_mode": True,
                    "note": "Resend is in test mode. You can only send to your verified email or verify a domain."
                }
            
            return {
                "message": "Email service not configured. Use the token below for testing.",
                "reset_token": reset_token,
                "reset_url": f"{os.getenv('APP_URL', 'http://localhost:5173')}/reset-password?token={reset_token}",
                "dev_mode": True
            }
    
    # Always return success message (don't expose email sending failures in production)
    return {
        "message": "If the email exists, a password reset link has been sent"
    }

# RESET PASSWORD - Reset password using token
@router.post("/reset-password", response_model=dict, status_code=status.HTTP_200_OK)
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    """
    Reset password using the token from forgot-password endpoint
    """
    # Find user by reset token
    user = db.query(User).filter(User.reset_token == request.token).first()
    
    if not user:
        raise BadRequestException("Invalid or expired reset token")
    
    # Check if token is expired
    # Use naive datetime for comparison (SQLite stores naive datetimes)
    # Convert timezone-aware datetime to naive UTC for comparison
    current_time = datetime.now(timezone.utc).replace(tzinfo=None)
    if not user.reset_token_expires:
        raise BadRequestException("Invalid or expired reset token")
    
    if user.reset_token_expires < current_time:
        raise BadRequestException("Invalid or expired reset token")
    
    # Update password and clear reset token
    user.hashed_password = hash_password(request.new_password)
    user.reset_token = None
    user.reset_token_expires = None
    
    db.commit()
    
    return {"message": "Password reset successfully"}

# UPDATE PROFILE - Update user profile information
@router.put("/profile", response_model=UserResponse, status_code=status.HTTP_200_OK)
def update_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update user profile - name and phone number
    """
    # Update name if provided
    if profile_data.name is not None:
        current_user.name = profile_data.name
    
    # Update phone number if provided
    if profile_data.phone_number is not None:
        current_user.phone_number = profile_data.phone_number
    
    db.commit()
    db.refresh(current_user)
    
    return current_user
