"""
Create test users for development
"""
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash


def create_test_users():
    """Create test users for development"""
    db = SessionLocal()
    
    test_users = [
        {
            "email": "test@example.com",
            "full_name": "Test User",
            "password": "test1234",
            "is_admin": False
        },
        {
            "email": "demo@example.com",
            "full_name": "Demo User",
            "password": "demo1234",
            "is_admin": False
        }
    ]
    
    try:
        for user_data in test_users:
            existing_user = db.query(User).filter(User.email == user_data["email"]).first()
            
            if existing_user:
                print(f"     User {user_data['email']} already exists")
                continue
            
            hashed_password = get_password_hash(user_data["password"])
            user = User(
                email=user_data["email"],
                full_name=user_data["full_name"],
                hashed_password=hashed_password,
                is_admin=user_data["is_admin"],
                is_active=True
            )
            db.add(user)
            db.commit()
            print(f"    Created test user: {user_data['email']} (password: {user_data['password']})")
        
        print("\n    Test users created successfully!")
        
    except Exception as e:
        print(f"    Error creating test users: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    print("🔄 Creating test users...\n")
    create_test_users()
