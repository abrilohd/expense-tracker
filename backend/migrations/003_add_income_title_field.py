"""
Migration 003: Add title field to income table
"""
import sqlite3
import sys
from pathlib import Path

# Add parent directory to path to import app modules
sys.path.insert(0, str(Path(__file__).parent.parent))

def migrate():
    """Add title column to income table"""
    conn = sqlite3.connect('expenses.db')
    cursor = conn.cursor()
    
    try:
        # Check if column already exists
        cursor.execute("PRAGMA table_info(income)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'title' not in columns:
            print("⚙️  Adding 'title' column to income table...")
            
            # Add title column with default value
            cursor.execute("""
                ALTER TABLE income 
                ADD COLUMN title TEXT NOT NULL DEFAULT 'Income'
            """)
            
            # Update existing records to have meaningful titles based on source
            cursor.execute("""
                UPDATE income 
                SET title = source || ' Income'
                WHERE title = 'Income'
            """)
            
            conn.commit()
            print("    Successfully added 'title' column to income table")
        else:
            print("ℹ️  Column 'title' already exists in income table")
            
    except Exception as e:
        conn.rollback()
        print(f"    Migration failed: {e}")
        raise
    finally:
        conn.close()

def rollback():
    """Remove title column from income table (SQLite doesn't support DROP COLUMN easily)"""
    print("     Warning: SQLite doesn't support DROP COLUMN. Manual intervention required.")
    print("To rollback, you would need to:")
    print("1. Create a new table without the title column")
    print("2. Copy data from the old table")
    print("3. Drop the old table")
    print("4. Rename the new table")

if __name__ == "__main__":
    migrate()
