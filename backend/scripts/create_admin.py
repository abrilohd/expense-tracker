"""
Create an admin user
Consolidated admin user creation script
"""
import sys
from pathlib import Path
from getpass import getpass

sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash


def create_admin_user(email: str, password: str, full_name: str = "Admin User"):
    """Create an admin user"""
    db = SessionLocal()
    
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == email).first()
        
        if existing_user:
            # Update existing user to admin
            existing_user.is_admin = True
            db.commit()
            print(f"✅ Updated existing user {email} to admin")
        else:
            # Create new admin user
            hashed_password = get_password_hash(password)
            admin_user = User(
                email=email,
                full_name=full_name,
                hashed_password=hashed_password,
                is_admin=True,
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            print(f"✅ Created new admin user: {email}")
        
        print(f"🔐 Admin credentials:")
        print(f"   Email: {email}")
        print(f"   Password: {'*' * len(password)}")
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()


def main():
    """Main entry point"""
    print("🔐 Admin User Creation\n")
    
    email = input("Enter admin email: ").strip()
    if not email:
        print("❌ Email is required")
        sys.exit(1)
    
    full_name = input("Enter full name (default: Admin User): ").strip() or "Admin User"
    
    password = getpass("Enter password: ")
    if len(password) < 8:
        print("❌ Password must be at least 8 characters")
        sys.exit(1)
    
    confirm_password = getpass("Confirm password: ")
    if password != confirm_password:
        print("❌ Passwords do not match")
        sys.exit(1)
    
    create_admin_user(email, password, full_name)


if __name__ == "__main__":
    main()
