"""
Database migration script for admin functionality
Adds is_admin field to users table
"""
from sqlalchemy import create_engine, text
from app.core.config import settings

def run_migration():
    """Add is_admin field to users table"""
    engine = create_engine(settings.database_url)
    
    with engine.connect() as conn:
        # Add is_admin column to users table
        try:
            conn.execute(text("""
                ALTER TABLE users ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT 0
            """))
            conn.commit()
            print("✅ Added is_admin column to users table")
        except Exception as e:
            if "duplicate column name" in str(e).lower():
                print("ℹ️  is_admin column already exists")
            else:
                print(f"❌ Error: {e}")
                raise
        
        print("✅ Migration completed successfully!")
        print("ℹ️  To create an admin user, update a user manually:")
        print("   UPDATE users SET is_admin = 1 WHERE email = 'admin@example.com';")

if __name__ == "__main__":
    print("🔄 Running admin migration...")
    run_migration()
