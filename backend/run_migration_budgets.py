"""
Database migration script for budgets table
Run this script to create the budgets table in the database
"""
import sys
from pathlib import Path

# Add parent directory to path to import app modules
sys.path.append(str(Path(__file__).parent))

from sqlalchemy import create_engine, inspect
from app.db.database import DATABASE_URL, Base
from app.models.budget import Budget
from app.models.user import User

def run_migration():
    """Create budgets table if it doesn't exist"""
    print("🔄 Starting budgets table migration...")
    
    # Create engine
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
    
    # Check if budgets table already exists
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    
    if "budgets" in existing_tables:
        print("✅ Budgets table already exists. No migration needed.")
        return
    
    # Create budgets table
    print("📝 Creating budgets table...")
    Budget.__table__.create(engine)
    
    print("✅ Migration completed successfully!")
    print("📊 Budgets table created with columns:")
    print("   - id (Primary Key)")
    print("   - user_id (Foreign Key to users)")
    print("   - budget_type (overall or category)")
    print("   - category (nullable)")
    print("   - amount")
    print("   - period_start")
    print("   - period_end")
    print("   - created_at")
    print("\n🎯 Indexes created:")
    print("   - idx_budget_period (user_id, period_start, period_end)")
    print("   - idx_budget_type_category (user_id, budget_type, category)")

if __name__ == "__main__":
    try:
        run_migration()
    except Exception as e:
        print(f"❌ Migration failed: {str(e)}")
        sys.exit(1)
