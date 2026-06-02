#!/bin/bash
# Railway startup script - Initializes database and starts FastAPI server

echo "🚀 Starting Expense Tracker API..."

# Initialize database tables (creates all tables if they don't exist)
echo "📊 Initializing database..."
python -c "
from app.db.database import Base, engine
from app.models import *
import sqlalchemy as sa
from sqlalchemy import inspect, text

# Create all tables if they don't exist
Base.metadata.create_all(bind=engine)
print('✅ Database tables created')

# Check if income table has title column
inspector = inspect(engine)
columns = [col['name'] for col in inspector.get_columns('income')]

if 'title' not in columns:
    print('⚙️  Adding title column to income table...')
    with engine.connect() as conn:
        # PostgreSQL syntax for adding column with default
        conn.execute(text('''
            ALTER TABLE income 
            ADD COLUMN title VARCHAR(200) NOT NULL DEFAULT 'Income'
        '''))
        # Update existing records
        conn.execute(text('''
            UPDATE income 
            SET title = source || ' Income'
            WHERE title = 'Income'
        '''))
        conn.commit()
    print('✅ Added title column to income table')
else:
    print('✅ Income table schema is up to date')
"

# Create admin user if ADMIN_EMAIL and ADMIN_PASSWORD are set
echo "👤 Checking for admin user configuration..."
python create_admin_startup.py

# Start the FastAPI server
echo "🌐 Starting uvicorn server..."
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
