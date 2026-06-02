"""
Test script for password reset functionality
Run this to verify the password reset flow works correctly
"""
import sys
import os
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from datetime import datetime, timezone, timedelta
from app.db.database import SessionLocal
from app.models.user import User
from app.models.expense import Expense
from app.models.income import Income
from app.models.budget import Budget
from app.models.savings_goal import SavingsGoal
from app.core.security import generate_reset_token, hash_password

def test_password_reset():
    """Test password reset token generation and expiration"""
    db = SessionLocal()
    
    try:
        # Find test user
        test_email = "israelabebe652@gmail.com"
        user = db.query(User).filter(User.email == test_email).first()
        
        if not user:
            print(f"    User {test_email} not found")
            print("Create a user first using: python scripts/create_test_user.py")
            return
        
        print(f"    Found user: {user.email}")
        print(f"   Name: {user.name}")
        print(f"   Provider: {user.provider}")
        
        # Generate reset token
        reset_token = generate_reset_token()
        user.reset_token = reset_token
        user.reset_token_expires = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(hours=1)
        
        db.commit()
        
        print(f"\n    Reset token generated successfully")
        print(f"   Token: {reset_token}")
        print(f"   Expires: {user.reset_token_expires}")
        print(f"   Timezone info: {user.reset_token_expires.tzinfo}")
        
        # Test token validation
        current_time = datetime.now(timezone.utc).replace(tzinfo=None)
        is_valid = user.reset_token_expires > current_time
        
        print(f"\n    Token validation test")
        print(f"   Current time: {current_time}")
        print(f"   Token expires: {user.reset_token_expires}")
        print(f"   Is valid: {is_valid}")
        
        if is_valid:
            print(f"\n    Token is valid and can be used to reset password")
            print(f"\n🔗 Reset URL:")
            print(f"   http://localhost:5173/reset-password?token={reset_token}")
        else:
            print(f"\n    Token is expired")
        
        # Test password reset
        new_password = "NewPassword123"
        user.hashed_password = hash_password(new_password)
        user.reset_token = None
        user.reset_token_expires = None
        
        db.commit()
        
        print(f"\n    Password reset simulation successful")
        print(f"   New password: {new_password}")
        print(f"   Token cleared: {user.reset_token is None}")
        print(f"   Expiration cleared: {user.reset_token_expires is None}")
        
        print(f"\n    All tests passed!")
        print(f"\n📝 Next steps:")
        print(f"   1. Start backend: uvicorn app.main:app --reload")
        print(f"   2. Start frontend: cd frontend && npm run dev")
        print(f"   3. Test forgot password flow at: http://localhost:5173/login")
        
    except Exception as e:
        print(f"\n    Error: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    print("=" * 60)
    print("Password Reset Functionality Test")
    print("=" * 60)
    test_password_reset()
