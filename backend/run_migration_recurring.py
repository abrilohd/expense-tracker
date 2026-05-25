"""
Database migration script for recurring transactions table
Run this to add the recurring_transactions table to the database
"""
from sqlalchemy import create_engine, text
from app.core.config import settings

def run_migration():
    """Create recurring_transactions table"""
    engine = create_engine(settings.database_url)
    
    with engine.connect() as conn:
        # Create recurring_transactions table
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS recurring_transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                transaction_type VARCHAR(10) NOT NULL,
                title VARCHAR(200) NOT NULL,
                amount FLOAT NOT NULL,
                category_or_source VARCHAR(100) NOT NULL,
                description VARCHAR(500),
                payment_method VARCHAR(50),
                frequency VARCHAR(20) NOT NULL,
                start_date DATE NOT NULL,
                end_date DATE,
                next_occurrence DATE NOT NULL,
                is_active BOOLEAN NOT NULL DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_generated_at TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """))
        
        # Create indexes for better query performance
        conn.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_recurring_user_id 
            ON recurring_transactions(user_id)
        """))
        
        conn.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_recurring_next_occurrence 
            ON recurring_transactions(next_occurrence)
        """))
        
        conn.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_recurring_is_active 
            ON recurring_transactions(is_active)
        """))
        
        conn.commit()
        print("✅ Migration completed successfully!")
        print("✅ recurring_transactions table created")
        print("✅ Indexes created for performance")

if __name__ == "__main__":
    print("🔄 Running recurring transactions migration...")
    run_migration()
