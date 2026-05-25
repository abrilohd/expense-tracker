"""
Authentication routes - user registration, login, and profile
"""
from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta, datetime, timezone

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
    """
    # Find user by email
    user = db.query(User).filter(User.email == request.email).first()
    
    # Always return success to prevent email enumeration
    if not user:
        return {"message": "If the email exists, a password reset link has been sent"}
    
    # Check if user is using OAuth (Google)
    if user.provider != "local":
        raise BadRequestException("Password reset is not available for OAuth accounts")
    
    # Generate reset token
    reset_token = generate_reset_token()
    user.reset_token = reset_token
    user.reset_token_expires = datetime.now(timezone.utc) + timedelta(hours=1)  # Token valid for 1 hour
    
    db.commit()
    
    # Send password reset email
    email_result = EmailService.send_password_reset_email(
        to_email=user.email,
        reset_token=reset_token,
        user_name=user.name
    )
    
    # Log email sending result (for debugging)
    if not email_result.get("success"):
        print(f"Failed to send password reset email: {email_result.get('error')}")
    
    # Always return success message (don't expose email sending failures)
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
    if not user.reset_token_expires or user.reset_token_expires < datetime.now(timezone.utc):
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
