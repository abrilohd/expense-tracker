"""
Database migration script - Add title column to income table
This runs during Railway startup
"""
import sys
from sqlalchemy import inspect, text
from app.db.database import engine
from app.models import Income

def migrate_income_title():
    """Add title column to income table if it doesn't exist"""
    try:
        # Check if income table has title column
        inspector = inspect(engine)
        
        # Get all tables
        tables = inspector.get_table_names()
        if 'income' not in tables:
            print('ℹ️  Income table does not exist yet, skipping migration')
            return True
        
        # Get columns
        columns = [col['name'] for col in inspector.get_columns('income')]
        print(f'📋 Current income table columns: {", ".join(columns)}')
        
        if 'title' not in columns:
            print('⚙️  Adding title column to income table...')
            
            with engine.begin() as conn:
                # PostgreSQL syntax for adding column with default
                conn.execute(text(
                    "ALTER TABLE income "
                    "ADD COLUMN title VARCHAR(200) NOT NULL DEFAULT 'Income'"
                ))
                print('✅ Added title column')
                
                # Update existing records
                result = conn.execute(text(
                    "UPDATE income "
                    "SET title = source || ' Income' "
                    "WHERE title = 'Income'"
                ))
                print(f'✅ Updated {result.rowcount} existing income records')
            
            return True
        else:
            print('✅ Income table already has title column')
            return True
            
    except Exception as e:
        print(f'❌ Migration failed: {e}')
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    success = migrate_income_title()
    sys.exit(0 if success else 1)
