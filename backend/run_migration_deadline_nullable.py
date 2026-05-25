"""
Migration: Make deadline column nullable in savings_goals
SQLite doesn't support ALTER COLUMN, so we need to recreate the table
"""
import sqlite3

def run_migration(db_path: str = "expenses.db"):
    """Make deadline nullable in savings_goals table"""
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        print("🔄 Making deadline column nullable...")
        
        # Step 1: Create new table with nullable deadline
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS savings_goals_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                name VARCHAR(100) NOT NULL,
                target_amount FLOAT NOT NULL,
                current_amount FLOAT DEFAULT 0.0 NOT NULL,
                deadline DATE NULL,
                status VARCHAR DEFAULT 'active' NOT NULL,
                emoji TEXT DEFAULT '💳',
                color TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
                completed_at DATETIME,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)
        
        # Step 2: Copy data from old table to new table
        cursor.execute("""
            INSERT INTO savings_goals_new 
            SELECT id, user_id, name, target_amount, current_amount, 
                   deadline, status, emoji, color, created_at, completed_at
            FROM savings_goals
        """)
        
        # Step 3: Drop old table
        cursor.execute("DROP TABLE savings_goals")
        
        # Step 4: Rename new table to original name
        cursor.execute("ALTER TABLE savings_goals_new RENAME TO savings_goals")
        
        # Step 5: Recreate indexes
        cursor.execute("CREATE INDEX IF NOT EXISTS ix_savings_goals_user_id ON savings_goals(user_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS ix_savings_goals_deadline ON savings_goals(deadline)")
        cursor.execute("CREATE INDEX IF NOT EXISTS ix_savings_goals_status ON savings_goals(status)")
        
        conn.commit()
        print("✅ Migration completed successfully!")
        print("   - Deadline column is now nullable")
        print("   - All data preserved")
        print("   - Indexes recreated")
        return True
        
    except sqlite3.Error as e:
        print(f"❌ Migration failed: {e}")
        conn.rollback()
        return False
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    print("🚀 Running Migration: Make deadline nullable")
    print("=" * 60)
    success = run_migration("expenses.db")
    if not success:
        exit(1)
