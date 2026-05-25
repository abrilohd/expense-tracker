"""
Create admin user script
Sets a user as admin by email
"""
from sqlalchemy import create_engine, text
from app.core.config import settings

def create_admin(email: str):
    """Set a user as admin by email"""
    engine = create_engine(settings.database_url)
    
    with engine.connect() as conn:
        # Check if user exists
        result = conn.execute(
            text("SELECT id, email, name, is_admin FROM users WHERE email = :email"),
            {"email": email}
        )
        user = result.fetchone()
        
        if not user:
            print(f"❌ User with email '{email}' not found")
            print("\nAvailable users:")
            result = conn.execute(text("SELECT id, email, name FROM users"))
            for u in result.fetchall():
                print(f"   - {u[1]} (ID: {u[0]}, Name: {u[2]})")
            return
        
        # Check if already admin
        if user[3]:  # is_admin
            print(f"ℹ️  User '{email}' is already an admin")
            return
        
        # Update user to admin
        conn.execute(
            text("UPDATE users SET is_admin = 1 WHERE email = :email"),
            {"email": email}
        )
        conn.commit()
        
        print(f"✅ User '{email}' is now an admin!")
        print(f"   ID: {user[0]}")
        print(f"   Name: {user[2]}")
        print("\n🔐 Please logout and login again to refresh your token")

def list_admins():
    """List all admin users"""
    engine = create_engine(settings.database_url)
    
    with engine.connect() as conn:
        result = conn.execute(
            text("SELECT id, email, name FROM users WHERE is_admin = 1")
        )
        admins = result.fetchall()
        
        if not admins:
            print("ℹ️  No admin users found")
        else:
            print(f"👑 Admin Users ({len(admins)}):")
            for admin in admins:
                print(f"   - {admin[1]} (ID: {admin[0]}, Name: {admin[2]})")

if __name__ == "__main__":
    import sys
    
    print("🛡️  ExpenseTracker Admin User Manager\n")
    
    # Check arguments
    if len(sys.argv) < 2:
        print("Usage:")
        print("  Create admin:  python create_admin.py <email>")
        print("  List admins:   python create_admin.py --list")
        print("\nExample:")
        print("  python create_admin.py admin@example.com")
        sys.exit(1)
    
    # List admins
    if sys.argv[1] == "--list":
        list_admins()
        sys.exit(0)
    
    # Create admin
    email = sys.argv[1]
    create_admin(email)
