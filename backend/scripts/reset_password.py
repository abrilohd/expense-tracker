"""
Reset user password
"""
import sys
from pathlib import Path
from getpass import getpass

sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash


def reset_password(email: str, new_password: str):
    """Reset a user's password"""
    db = SessionLocal()
    
    try:
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            print(f"    User with email {email} not found")
            sys.exit(1)
        
        user.hashed_password = get_password_hash(new_password)
        user.reset_token = None
        user.reset_token_expires = None
        db.commit()
        
        print(f"    Password reset successfully for {email}")
        
    except Exception as e:
        print(f"    Error resetting password: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()


def main():
    """Main entry point"""
    print("🔐 Password Reset\n")
    
    email = input("Enter user email: ").strip()
    if not email:
        print("    Email is required")
        sys.exit(1)
    
    new_password = getpass("Enter new password: ")
    if len(new_password) < 8:
        print("    Password must be at least 8 characters")
        sys.exit(1)
    
    confirm_password = getpass("Confirm new password: ")
    if new_password != confirm_password:
        print("    Passwords do not match")
        sys.exit(1)
    
    reset_password(email, new_password)


if __name__ == "__main__":
    main()
