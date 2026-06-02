"""
Quick script to check and fix database schema for production deployment
"""
import sqlite3
import os

def check_and_fix_income_table():
    """Check if income table has title field and add it if missing"""
    db_path = 'expenses.db'
    
    if not os.path.exists(db_path):
        print("    Database file not found. Run the app first to create it.")
        return False
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check current schema
        print("📊 Checking income table schema...")
        cursor.execute("PRAGMA table_info(income)")
        columns = cursor.fetchall()
        column_names = [col[1] for col in columns]
        
        print(f"   Current columns: {', '.join(column_names)}")
        
        # Check if title column exists
        if 'title' not in column_names:
            print("\n     WARNING: 'title' column is MISSING from income table!")
            print("   This will cause errors when adding income from frontend.")
            print("\n🔧 Adding 'title' column...")
            
            # Add title column with default value
            cursor.execute("""
                ALTER TABLE income 
                ADD COLUMN title TEXT NOT NULL DEFAULT 'Income'
            """)
            
            # Update existing records to have meaningful titles
            cursor.execute("""
                UPDATE income 
                SET title = source || ' Income'
                WHERE title = 'Income'
            """)
            
            conn.commit()
            print("    Successfully added 'title' column to income table")
            print("    Updated existing records with default titles")
            return True
        else:
            print("    Income table has 'title' column - schema is correct!")
            return True
            
    except Exception as e:
        conn.rollback()
        print(f"    Error: {e}")
        return False
    finally:
        conn.close()

def check_all_tables():
    """Display all tables and their schemas"""
    db_path = 'expenses.db'
    
    if not os.path.exists(db_path):
        print("    Database file not found")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        
        print("\n" + "="*60)
        print("DATABASE SCHEMA OVERVIEW")
        print("="*60)
        
        for table in tables:
            table_name = table[0]
            print(f"\n📋 Table: {table_name}")
            cursor.execute(f"PRAGMA table_info({table_name})")
            columns = cursor.fetchall()
            for col in columns:
                print(f"   - {col[1]} ({col[2]})")
        
        print("\n" + "="*60)
        
    finally:
        conn.close()

if __name__ == "__main__":
    print("🔍 DATABASE PRODUCTION READINESS CHECK")
    print("="*60)
    
    # Check and fix income table
    success = check_and_fix_income_table()
    
    # Show all tables
    check_all_tables()
    
    if success:
        print("\n    Database is ready for production deployment!")
    else:
        print("\n     Database needs attention before deployment!")
