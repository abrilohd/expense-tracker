"""
Run database migration to add profile and password reset fields
"""
import sys
from sqlalchemy import create_engine, text
from app.core.config import settings

def run_migration():
    """Execute the migration"""
    engine = create_engine(settings.database_url)
    
    with engine.connect() as conn:
        print("🔄 Running migration: Add profile and password reset fields...")
        
        try:
            # Add phone_number column
            conn.execute(text("ALTER TABLE users ADD COLUMN phone_number VARCHAR;"))
            print("✅ Added phone_number column")
        except Exception as e:
            if "duplicate column name" in str(e).lower():
                print("⚠️  phone_number column already exists")
            else:
                raise
        
        try:
            # Add reset_token column
            conn.execute(text("ALTER TABLE users ADD COLUMN reset_token VARCHAR;"))
            print("✅ Added reset_token column")
        except Exception as e:
            if "duplicate column name" in str(e).lower():
                print("⚠️  reset_token column already exists")
            else:
                raise
        
        try:
            # Add reset_token_expires column
            conn.execute(text("ALTER TABLE users ADD COLUMN reset_token_expires TIMESTAMP;"))
            print("✅ Added reset_token_expires column")
        except Exception as e:
            if "duplicate column name" in str(e).lower():
                print("⚠️  reset_token_expires column already exists")
            else:
                raise
        
        conn.commit()
        print("\n✅ Migration completed successfully!")

if __name__ == "__main__":
    try:
        run_migration()
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        sys.exit(1)
