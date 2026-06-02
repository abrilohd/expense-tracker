"""
Unified database migration script
Consolidates all migrations into a single, organized system
"""
import sys
from pathlib import Path
from sqlalchemy import create_engine, text, inspect
from datetime import datetime

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from app.core.config import settings
from app.db.database import Base
from app.models.user import User
from app.models.expense import Expense
from app.models.income import Income
from app.models.budget import Budget
from app.models.savings_goal import SavingsGoal
from app.models.recurring_transaction import RecurringTransaction


class MigrationRunner:
    """Handles database migrations in a structured way"""
    
    def __init__(self):
        self.engine = create_engine(settings.database_url)
        self.inspector = inspect(self.engine)
        
    def column_exists(self, table_name: str, column_name: str) -> bool:
        """Check if a column exists in a table"""
        columns = [col['name'] for col in self.inspector.get_columns(table_name)]
        return column_name in columns
    
    def table_exists(self, table_name: str) -> bool:
        """Check if a table exists"""
        return table_name in self.inspector.get_table_names()
    
    def add_column_safe(self, conn, table: str, column: str, column_type: str, default=None):
        """Safely add a column if it doesn't exist"""
        if not self.column_exists(table, column):
            default_clause = f" DEFAULT {default}" if default is not None else ""
            conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {column} {column_type}{default_clause};"))
            print(f"    Added {column} to {table}")
        else:
            print(f"     {column} already exists in {table}")
    
    def run_all_migrations(self):
        """Run all migrations in order"""
        print("🔄 Starting database migrations...\n")
        
        with self.engine.connect() as conn:
            # Migration 1: User profile and password reset fields
            print("📝 Migration 1: User profile and password reset fields")
            self.add_column_safe(conn, "users", "phone_number", "VARCHAR")
            self.add_column_safe(conn, "users", "reset_token", "VARCHAR")
            self.add_column_safe(conn, "users", "reset_token_expires", "TIMESTAMP")
            
            # Migration 2: Admin functionality
            print("\n📝 Migration 2: Admin functionality")
            self.add_column_safe(conn, "users", "is_admin", "BOOLEAN NOT NULL", "0")
            
            # Migration 3: Income table
            print("\n📝 Migration 3: Income table")
            if not self.table_exists("income"):
                conn.execute(text("""
                    CREATE TABLE income (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        amount REAL NOT NULL,
                        source VARCHAR NOT NULL,
                        date DATE NOT NULL,
                        description VARCHAR,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                    );
                """))
                conn.execute(text("CREATE INDEX idx_income_user_id ON income(user_id);"))
                conn.execute(text("CREATE INDEX idx_income_date ON income(date);"))
                conn.execute(text("CREATE INDEX idx_income_source ON income(source);"))
                print("    Created income table with indexes")
            else:
                print("     Income table already exists")
            
            # Migration 4: Budgets table
            print("\n📝 Migration 4: Budgets table")
            if not self.table_exists("budgets"):
                Budget.__table__.create(self.engine)
                print("    Created budgets table")
            else:
                print("     Budgets table already exists")
            
            # Migration 5: Savings goals emoji and color
            print("\n📝 Migration 5: Savings goals emoji and color")
            if self.table_exists("savings_goals"):
                self.add_column_safe(conn, "savings_goals", "emoji", "VARCHAR", "'  '")
                self.add_column_safe(conn, "savings_goals", "color", "VARCHAR", "'#3B82F6'")
            
            # Migration 6: Savings goals deadline nullable
            print("\n📝 Migration 6: Savings goals deadline nullable")
            # SQLite doesn't support ALTER COLUMN, so we skip this for existing tables
            if self.table_exists("savings_goals") and self.column_exists("savings_goals", "deadline"):
                print("     Deadline column exists (nullable status cannot be changed in SQLite)")
            
            # Migration 7: Recurring transactions table
            print("\n📝 Migration 7: Recurring transactions table")
            if not self.table_exists("recurring_transactions"):
                RecurringTransaction.__table__.create(self.engine)
                print("    Created recurring_transactions table")
            else:
                print("     Recurring transactions table already exists")
            
            conn.commit()
        
        print("\n    All migrations completed successfully!")
        print("\n📊 Database schema is up to date")


def main():
    """Main entry point"""
    try:
        runner = MigrationRunner()
        runner.run_all_migrations()
    except Exception as e:
        print(f"\n    Migration failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
