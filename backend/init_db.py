"""
Database initialization script
Run this once to create all tables in PostgreSQL
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.database import engine, Base
from app.models.user import User
from app.models.expense import Expense

def init_database():
    """Create all database tables"""
    print("🔧 Initializing database...")
    print(f"📊 Database URL: {engine.url}")
    
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
        print("📋 Tables created:")
        print("   - users")
        print("   - expenses")
        
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        sys.exit(1)

if __name__ == "__main__":
    init_database()
