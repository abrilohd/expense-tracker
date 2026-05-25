"""
Create a test user for password reset testing
This user will have provider='local' so password reset will work
"""
import sys
import os
from sqlalchemy.orm import Session

# Add app directory to path
sys.path.insert(0, os.path.dirname(__file__))

from app.db.database import SessionLocal, engine
# Import all models to ensure relationships are loaded
from app.models.user import User
from app.models.expense import Expense
from app.models.income import Income
from app.models.budget import Budget
from app.models.savings_goal import SavingsGoal
from app.core.security import hash_password

def create_test_user():
    """
    Create a test user with local authentication
    """
    print("=" * 60)
    print("CREATING TEST USER FOR PASSWORD RESET")
    print("=" * 60)
    
    # Create database session
    db: Session = SessionLocal()
    
    try:
        # Test user details
        test_email = "test@example.com"
        test_password = "Password123"
        test_name = "Test User"
        
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == test_email).first()
        
        if existing_user:
            print(f"\n⚠️  User already exists: {test_email}")
            print(f"   Provider: {existing_user.provider}")
            print(f"   Name: {existing_user.name}")
            
            # If it's an OAuth user, update to local
            if existing_user.provider != "local":
                print(f"\n🔄 Converting OAuth user to local user...")
                existing_user.provider = "local"
                existing_user.hashed_password = hash_password(test_password)
                db.commit()
                print(f"✅ User converted to local authentication")
            else:
                # Update password
                print(f"\n🔄 Updating password...")
                existing_user.hashed_password = hash_password(test_password)
                db.commit()
                print(f"✅ Password updated")
            
            user = existing_user
        else:
            # Create new user
            print(f"\n📝 Creating new user...")
            user = User(
                email=test_email,
                hashed_password=hash_password(test_password),
                name=test_name,
                provider="local",  # Important: local provider for password reset
                is_active=True
            )
            
            db.add(user)
            db.commit()
            db.refresh(user)
            
            print(f"✅ User created successfully")
        
        # Display user details
        print(f"\n" + "=" * 60)
        print("TEST USER CREDENTIALS")
        print("=" * 60)
        print(f"\n📧 Email:    {test_email}")
        print(f"🔑 Password: {test_password}")
        print(f"👤 Name:     {test_name}")
        print(f"🔐 Provider: {user.provider}")
        print(f"✅ Active:   {user.is_active}")
        
        print(f"\n" + "=" * 60)
        print("HOW TO TEST PASSWORD RESET")
        print("=" * 60)
        print(f"\n1. Open: http://localhost:5173/login")
        print(f"2. Click: 'Forgot password?'")
        print(f"3. Enter: {test_email}")
        print(f"4. Click: 'Send Reset Link'")
        print(f"5. Check: Your email inbox (if configured)")
        print(f"6. Or use: Backend logs to get reset token")
        print(f"7. Reset: Password to something new")
        print(f"8. Login: With new password")
        
        print(f"\n" + "=" * 60)
        print("ALTERNATIVE: USE YOUR REAL EMAIL")
        print("=" * 60)
        print(f"\nTo test with your real email (abrsh067@gmail.com):")
        print(f"1. Register a NEW account at /register")
        print(f"2. Use email: abrsh067+test@gmail.com")
        print(f"   (Gmail ignores +test, delivers to abrsh067@gmail.com)")
        print(f"3. Use password: Password123")
        print(f"4. This will create a LOCAL account")
        print(f"5. Then test password reset with this account")
        
        print(f"\n" + "=" * 60)
        
        return user
        
    except Exception as e:
        print(f"\n❌ Error creating user: {str(e)}")
        db.rollback()
        return None
    finally:
        db.close()

def check_existing_users():
    """
    Check all existing users and their providers
    """
    print("\n" + "=" * 60)
    print("EXISTING USERS IN DATABASE")
    print("=" * 60)
    
    db: Session = SessionLocal()
    
    try:
        users = db.query(User).all()
        
        if not users:
            print("\n⚠️  No users found in database")
            return
        
        print(f"\nFound {len(users)} user(s):\n")
        
        for user in users:
            print(f"📧 Email: {user.email}")
            print(f"   Provider: {user.provider}")
            print(f"   Name: {user.name or 'N/A'}")
            print(f"   Active: {user.is_active}")
            print(f"   Has Password: {'Yes' if user.hashed_password else 'No'}")
            print(f"   Can Reset Password: {'Yes' if user.provider == 'local' else 'No (OAuth account)'}")
            print()
        
    except Exception as e:
        print(f"\n❌ Error checking users: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    print("\n🔧 TEST USER SETUP FOR PASSWORD RESET")
    
    # Check existing users first
    check_existing_users()
    
    # Create/update test user
    user = create_test_user()
    
    if user:
        print("\n✅ Setup complete! You can now test password reset.")
    else:
        print("\n❌ Setup failed. Check the error above.")

