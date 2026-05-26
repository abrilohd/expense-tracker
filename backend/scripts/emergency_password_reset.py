"""
Emergency Password Reset Script
Use this to reset a user's password directly in the database
"""
import sys
from pathlib import Path
from getpass import getpass

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.user import User
from app.core.security import hash_password


def emergency_reset_password():
    """Reset password for a specific user"""
    print("=" * 60)
    print("🚨 EMERGENCY PASSWORD RESET")
    print("=" * 60)
    print()
    
    # Get email
    email = input("Enter user email: ").strip()
    if not email:
        print("❌ Email is required")
        sys.exit(1)
    
    # Get new password
    new_password = getpass("Enter new password (min 8 chars, must contain number): ")
    if len(new_password) < 8:
        print("❌ Password must be at least 8 characters")
        sys.exit(1)
    
    if not any(char.isdigit() for char in new_password):
        print("❌ Password must contain at least one number")
        sys.exit(1)
    
    confirm_password = getpass("Confirm new password: ")
    if new_password != confirm_password:
        print("❌ Passwords do not match")
        sys.exit(1)
    
    # Update database
    db = SessionLocal()
    
    try:
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            print(f"❌ User with email {email} not found")
            sys.exit(1)
        
        # Hash and update password
        user.hashed_password = hash_password(new_password)
        
        # Clear any existing reset tokens
        user.reset_token = None
        user.reset_token_expires = None
        
        db.commit()
        
        print()
        print("=" * 60)
        print("✅ PASSWORD RESET SUCCESSFUL!")
        print("=" * 60)
        print(f"📧 Email: {email}")
        print(f"🔐 New password: {'*' * len(new_password)}")
        print()
        print("You can now login with your new password!")
        print("=" * 60)
        
    except Exception as e:
        print(f"❌ Error resetting password: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    emergency_reset_password()
