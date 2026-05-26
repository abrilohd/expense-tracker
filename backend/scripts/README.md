# Backend Scripts

Utility scripts for database management and user administration.

## Database Management

### Initialize Database
Creates all database tables from scratch:
```bash
python scripts/init_db.py
```

### Run Migrations
Applies all database migrations (adds new columns, tables, indexes):
```bash
python scripts/migrate.py
```

**Note:** Run this after pulling new code to ensure your database schema is up to date.

## User Management

### Create Admin User
Creates a new admin user or upgrades an existing user to admin:
```bash
python scripts/create_admin.py
```

Interactive prompts will ask for:
- Email address
- Full name
- Password (minimum 8 characters)

### Create Test Users
Creates test users for development:
```bash
python scripts/create_test_user.py
```

Creates:
- `test@example.com` (password: `test1234`)
- `demo@example.com` (password: `demo1234`)

### Reset Password
Resets a user's password:
```bash
python scripts/reset_password.py
```

Interactive prompts will ask for:
- User email
- New password (minimum 8 characters)

### Emergency Password Reset
Direct password reset without email (for emergencies):
```bash
python scripts/emergency_password_reset.py
```

Interactive prompts will ask for:
- User email
- New password (minimum 8 characters)

**Use this when:**
- Email service is not configured
- User cannot access their email
- Testing password reset locally

### Test Password Reset Flow
Tests the password reset functionality:
```bash
python scripts/test_password_reset.py
```

This script:
- Generates a reset token for test user
- Validates token expiration logic
- Simulates password reset
- Provides reset URL for testing

## Quick Start

For a fresh installation:

```bash
# 1. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Initialize database
python scripts/init_db.py

# 4. Run migrations
python scripts/migrate.py

# 5. Create admin user
python scripts/create_admin.py

# 6. (Optional) Create test users
python scripts/create_test_user.py
```

## Notes

- All scripts must be run from the `backend` directory
- Ensure your `.env` file is configured with the correct `DATABASE_URL`
- Scripts are idempotent - safe to run multiple times
- Migration script checks for existing columns/tables before creating them
