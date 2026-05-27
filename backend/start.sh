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
if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ]; then
    echo "👤 Creating admin user..."
    python -c "
from app.db.database import SessionLocal
from app.models import *
from app.models.user import User
from app.core.security import hash_password
import os

db = SessionLocal()
try:
    email = os.getenv('ADMIN_EMAIL')
    password = os.getenv('ADMIN_PASSWORD')
    name = os.getenv('ADMIN_NAME', 'Admin User')
    
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        existing.is_admin = True
        db.commit()
        print(f'✅ Updated {email} to admin')
    else:
        admin = User(
            email=email,
            name=name,
            hashed_password=hash_password(password),
            is_admin=True,
            is_active=True,
            provider='local'
        )
        db.add(admin)
        db.commit()
        print(f'✅ Created admin: {email}')
except Exception as e:
    print(f'⚠️  Admin creation failed: {e}')
    db.rollback()
finally:
    db.close()
"
else
    echo "ℹ️  No admin credentials provided (set ADMIN_EMAIL and ADMIN_PASSWORD to create admin)"
fi

# Start the FastAPI server
echo "🌐 Starting uvicorn server..."
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
