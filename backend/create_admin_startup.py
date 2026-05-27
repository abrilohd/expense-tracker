#!/usr/bin/env python3
"""
Admin user creation script for Railway startup
Reads ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_NAME from environment variables
"""
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.database import SessionLocal
from app.models import *  # Import all models first
from app.models.user import User
from app.core.security import hash_password


def create_admin():
    """Create or update admin user from environment variables"""
    
    # Get environment variables
    email = os.getenv('ADMIN_EMAIL')
    password = os.getenv('ADMIN_PASSWORD')
    name = os.getenv('ADMIN_NAME', 'Admin User')
    
    # Validate inputs
    if not email:
        print('ℹ️  ADMIN_EMAIL not set, skipping admin creation')
        return
    
    if not password:
        print('ℹ️  ADMIN_PASSWORD not set, skipping admin creation')
        return
    
    if len(password) < 8:
        print('⚠️  ADMIN_PASSWORD must be at least 8 characters')
        return
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Check if user exists
        existing = db.query(User).filter(User.email == email).first()
        
        if existing:
            # Update existing user to admin
            existing.is_admin = True
            db.commit()
            print(f'✅ Updated existing user {email} to admin')
        else:
            # Create new admin user
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
            print(f'✅ Created new admin user: {email}')
        
        print(f'🔐 Admin credentials configured:')
        print(f'   Email: {email}')
        print(f'   Name: {name}')
        
    except Exception as e:
        print(f'❌ Admin creation failed: {e}')
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()


if __name__ == '__main__':
    create_admin()
