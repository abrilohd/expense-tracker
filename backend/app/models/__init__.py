"""
Models module - Import all models here to ensure SQLAlchemy can resolve relationships
"""

# Import all models so SQLAlchemy can resolve relationships
from app.models.user import User
from app.models.expense import Expense
from app.models.income import Income
from app.models.budget import Budget
from app.models.savings_goal import SavingsGoal
from app.models.recurring_transaction import RecurringTransaction

# Export all models
__all__ = [
    'User',
    'Expense',
    'Income',
    'Budget',
    'SavingsGoal',
    'RecurringTransaction',
]
