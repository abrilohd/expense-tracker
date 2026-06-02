"""
Migration 002: Add emoji and color columns to savings_goals table
"""
import sqlite3
import sys
from pathlib import Path

def run_migration(db_path: str = "expenses.db"):
    """Add emoji and color columns to savings_goals table"""
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if columns already exist
        cursor.execute("PRAGMA table_info(savings_goals)")
        columns = [column[1] for column in cursor.fetchall()]
        
        # Add emoji column if it doesn't exist
        if 'emoji' not in columns:
            print("Adding 'emoji' column to savings_goals table...")
            cursor.execute("""
                ALTER TABLE savings_goals 
                ADD COLUMN emoji TEXT DEFAULT '💳'
            """)
            print("    Added 'emoji' column")
        else:
            print("⏭️  'emoji' column already exists")
        
        # Add color column if it doesn't exist
        if 'color' not in columns:
            print("Adding 'color' column to savings_goals table...")
            cursor.execute("""
                ALTER TABLE savings_goals 
                ADD COLUMN color TEXT DEFAULT NULL
            """)
            print("    Added 'color' column")
        else:
            print("⏭️  'color' column already exists")
        
        conn.commit()
        print("\n    Migration 002 completed successfully!")
        return True
        
    except sqlite3.Error as e:
        print(f"    Migration failed: {e}")
        return False
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    db_path = sys.argv[1] if len(sys.argv) > 1 else "expenses.db"
    success = run_migration(db_path)
    sys.exit(0 if success else 1)
