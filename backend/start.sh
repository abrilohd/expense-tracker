#!/bin/bash

echo " Starting Expense Tracker API..."

echo " Initializing database..."

python -c "
from app.db.database import Base, engine
import app.models.user
import app.models.expense

Base.metadata.create_all(bind=engine)

print(' Database tables created')
"

echo " Starting uvicorn server..."

uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}