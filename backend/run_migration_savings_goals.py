"""
Database migration script for savings_goals table
Run this script to create the savings_goals table in the database
"""
import sys
from pathlib import Path

# Add parent directory to path to import app modules
sys.path.append(str(Path(__file__).parent))

from sqlalchemy import create_engine, inspect
from app.db.database import DATABASE_URL, Base
from app.models.savings_goal import SavingsGoal
from app.models.user import User

def run_migration():
    """Create savings_goals table if it doesn't exist"""
    print("🚀 Starting savings_goals table migration...")
    
    # Create engine
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
    
    # Check if table already exists
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    
    if "savings_goals" in existing_tables:
        print("⚠️  Table 'savings_goals' already exists. Skipping creation.")
        print("✅ Migration check complete!")
        return
    
    # Create only the savings_goals table
    print("📝 Creating savings_goals table...")
    SavingsGoal.__table__.create(engine)
    
    print("✅ Migration completed successfully!")
    print("\n📊 Table structure:")
    print("   - id (Primary Key)")
    print("   - user_id (Foreign Key -> users.id)")
    print("   - name (String, max 100 chars)")
    print("   - target_amount (Float)")
    print("   - current_amount (Float, default 0.0)")
    print("   - deadline (Date)")
    print("   - status (String, default 'active')")
    print("   - created_at (DateTime)")
    print("   - completed_at (DateTime, nullable)")
    print("\n🎯 Ready to track savings goals!")

if __name__ == "__main__":
    run_migration()
