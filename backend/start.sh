#!/bin/bash

echo "🚀 Starting Expense Tracker API..."

echo "📊 Initializing database..."

python -c "from app.db.database import Base, engine; import app.models.user, app.models.expense, app.models.income, app.models.budget, app.models.savings_goal, app.models.recurring_transaction; Base.metadata.create_all(bind=engine); print('✅ Database tables created')"

# Admin creation (safe)
if [ -n \"$ADMIN_EMAIL\" ] && [ -n \"$ADMIN_PASSWORD\" ]; then
    echo "👤 Creating admin user..."

    python -c "
from app.db.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash
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
        print('✅ Admin updated')
    else:
        admin = User(
            email=email,
            name=name,
            hashed_password=get_password_hash(password),
            is_admin=True,
            is_active=True,
            provider='local'
        )
        db.add(admin)
        db.commit()
        print('✅ Admin created')

except Exception as e:
    print('⚠️ Admin creation error:', e)
    db.rollback()
finally:
    db.close()
"
else
    echo "ℹ️ No admin credentials provided"
fi

echo "🌐 Starting uvicorn server..."
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}