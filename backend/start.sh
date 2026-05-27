#!/bin/bash
# Railway startup script - Initializes database and starts FastAPI server

echo "🚀 Starting Expense Tracker API..."

# Initialize database tables (creates all tables if they don't exist)
echo "📊 Initializing database..."
python -c "
from app.db.database import Base, engine
from app.models import *

Base.metadata.create_all(bind=engine)
print('✅ Database tables created')
"

# Create admin user if ADMIN_EMAIL and ADMIN_PASSWORD are set
echo "👤 Checking for admin user configuration..."
python create_admin_startup.py

# Start the FastAPI server
echo "🌐 Starting uvicorn server..."
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
