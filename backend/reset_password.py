"""
Reset user password script
"""
from sqlalchemy import create_engine, text
from app.core.config import settings
from app.core.security import hash_password

def reset_password(email: str, new_password: str):
    """Reset password for a user"""
    engine = create_engine(settings.database_url)
    
    with engine.connect() as conn:
        # Check if user exists
        result = conn.execute(
            text("SELECT id, email, name FROM users WHERE email = :email"),
            {"email": email}
        )
        user = result.fetchone()
        
        if not user:
            print(f"❌ User with email '{email}' not found")
            return
        
        # Hash new password
        hashed = hash_password(new_password)
        
        # Update password
        conn.execute(
            text("UPDATE users SET hashed_password = :pwd WHERE email = :email"),
            {"pwd": hashed, "email": email}
        )
        conn.commit()
        
        print(f"✅ Password updated for '{email}'!")
        print(f"   ID: {user[0]}")
        print(f"   Name: {user[2]}")
        print("\n🔐 You can now login with the new password")

if __name__ == "__main__":
    import sys
    
    print("🔐 ExpenseTracker Password Reset\n")
    
    if len(sys.argv) < 3:
        print("Usage: python reset_password.py <email> <new_password>")
        print("\nExample:")
        print("  python reset_password.py email@gmail.com MyNewPassword123")
        sys.exit(1)
    
    email = sys.argv[1]
    new_password = sys.argv[2]
    
    if len(new_password) < 8:
        print("❌ Password must be at least 8 characters long")
        sys.exit(1)
    
    reset_password(email, new_password)
