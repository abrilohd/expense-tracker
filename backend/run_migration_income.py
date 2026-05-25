"""
Run database migration to add income table
"""
import sys
from sqlalchemy import create_engine, text
from app.core.config import settings

def run_migration():
    """Execute the migration"""
    engine = create_engine(settings.database_url)
    
    with engine.connect() as conn:
        print("🔄 Running migration: Create income table...")
        
        try:
            # Create income table
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS income (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    amount REAL NOT NULL,
                    source VARCHAR NOT NULL,
                    date DATE NOT NULL,
                    description VARCHAR,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                );
            """))
            print("✅ Created income table")
            
            # Create indexes for better query performance
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_income_user_id ON income(user_id);
            """))
            print("✅ Created index on user_id")
            
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_income_date ON income(date);
            """))
            print("✅ Created index on date")
            
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_income_source ON income(source);
            """))
            print("✅ Created index on source")
            
            conn.commit()
            print("\n✅ Migration completed successfully!")
            
        except Exception as e:
            if "already exists" in str(e).lower():
                print("⚠️  Income table already exists")
            else:
                raise

if __name__ == "__main__":
    try:
        run_migration()
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        sys.exit(1)
