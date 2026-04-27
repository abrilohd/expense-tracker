"""
Google OAuth authentication routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from datetime import timedelta
import httpx
from urllib.parse import urlencode

from app.db.database import get_db
from app.models.user import User
from app.core.security import create_access_token
from app.core.config import settings
from app.core.exceptions import BadRequestException, UnauthorizedException

# Create router instance
router = APIRouter()

# Google OAuth URLs
GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"


@router.get("/google/login")
async def google_login():
    """
    Redirect user to Google OAuth consent screen
    """
    # Build Google OAuth URL with required parameters
    params = {
        "client_id": settings.google_client_id,
        "redirect_uri": settings.google_redirect_uri,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent"
    }
    
    google_auth_url = f"{GOOGLE_AUTH_URL}?{urlencode(params)}"
    
    return RedirectResponse(url=google_auth_url)


@router.get("/google/callback")
async def google_callback(code: str = None, error: str = None, db: Session = Depends(get_db)):
    """
    Handle Google OAuth callback
    Exchange authorization code for access token and create/login user
    """
    # Check for errors from Google
    if error:
        # Redirect to frontend with error
        error_url = f"{settings.frontend_url}/login?error=google_auth_failed"
        return RedirectResponse(url=error_url)
    
    if not code:
        error_url = f"{settings.frontend_url}/login?error=no_code_provided"
        return RedirectResponse(url=error_url)
    
    try:
        # Exchange authorization code for access token
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                GOOGLE_TOKEN_URL,
                data={
                    "code": code,
                    "client_id": settings.google_client_id,
                    "client_secret": settings.google_client_secret,
                    "redirect_uri": settings.google_redirect_uri,
                    "grant_type": "authorization_code"
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            
            if token_response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to exchange code for token"
                )
            
            token_data = token_response.json()
            access_token = token_data.get("access_token")
            
            if not access_token:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No access token received"
                )
            
            # Fetch user info from Google
            userinfo_response = await client.get(
                GOOGLE_USERINFO_URL,
                headers={"Authorization": f"Bearer {access_token}"}
            )
            
            if userinfo_response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to fetch user info"
                )
            
            user_info = userinfo_response.json()
            
            # Extract user data
            email = user_info.get("email")
            name = user_info.get("name")
            picture = user_info.get("picture")
            
            if not email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email not provided by Google"
                )
            
            # Check if user exists
            user = db.query(User).filter(User.email == email).first()
            
            if user:
                # User exists - update profile if needed
                if user.provider == "local":
                    # User registered with email/password, now linking Google
                    user.provider = "google"
                    user.name = name
                    user.picture = picture
                    db.commit()
                    db.refresh(user)
                elif user.provider == "google":
                    # Update Google profile info
                    user.name = name
                    user.picture = picture
                    db.commit()
                    db.refresh(user)
            else:
                # Create new user (Google signup)
                user = User(
                    email=email,
                    name=name,
                    picture=picture,
                    provider="google",
                    hashed_password=None,  # No password for Google users
                    is_active=True
                )
                db.add(user)
                db.commit()
                db.refresh(user)
            
            # Generate JWT token
            access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
            jwt_token = create_access_token(
                data={"sub": user.email},
                expires_delta=access_token_expires
            )
            
            # Redirect to frontend with token
            redirect_url = f"{settings.frontend_url}/dashboard?token={jwt_token}"
            return RedirectResponse(url=redirect_url)
            
    except HTTPException as he:
        # Re-raise HTTP exceptions
        error_url = f"{settings.frontend_url}/login?error={he.detail}"
        return RedirectResponse(url=error_url)
    except Exception as e:
        # Handle unexpected errors
        print(f"Google OAuth error: {str(e)}")
        error_url = f"{settings.frontend_url}/login?error=authentication_failed"
        return RedirectResponse(url=error_url)
