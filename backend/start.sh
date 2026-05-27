#!/bin/bash
# Railway startup script
# Initializes database and starts the FastAPI server

echo "🚀 Starting Expense Tracker API..."

# Initialize database tables (creates all tables if they don't exist)
echo "📊 Initializing database..."
python -c "from app.db.database import Base, engine; Base.metadata.create_all(bind=engine); print('✅ Database tables created')"

# Start the FastAPI server
echo "🌐 Starting uvicorn server..."
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
