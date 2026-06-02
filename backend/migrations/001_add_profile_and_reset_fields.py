"""
Migration: Add phone_number, reset_token, and reset_token_expires to users table
"""
from sqlalchemy import text

def upgrade(connection):
    """Add new columns to users table"""
    
    # Add phone_number column
    connection.execute(text("""
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS phone_number VARCHAR;
    """))
    
    # Add reset_token column
    connection.execute(text("""
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS reset_token VARCHAR;
    """))
    
    # Add reset_token_expires column
    connection.execute(text("""
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP;
    """))
    
    print("    Migration completed: Added phone_number, reset_token, and reset_token_expires columns")

def downgrade(connection):
    """Remove columns from users table"""
    
    connection.execute(text("""
        ALTER TABLE users 
        DROP COLUMN IF EXISTS phone_number,
        DROP COLUMN IF EXISTS reset_token,
        DROP COLUMN IF EXISTS reset_token_expires;
    """))
    
    print("    Rollback completed: Removed phone_number, reset_token, and reset_token_expires columns")

if __name__ == "__main__":
    # Run migration manually
    from app.db.database import engine
    
    with engine.connect() as conn:
        upgrade(conn)
        conn.commit()
