"""
Application constants and enums
Centralized location for all constant values used across the application
"""
from enum import Enum


# API Configuration
API_V1_PREFIX = "/api/v1"
API_TITLE = "Expense Tracker API"
API_VERSION = "1.0.0"
API_DESCRIPTION = """
Personal finance tracking API with JWT authentication, expense management, 
analytics dashboard, and AI-powered spending insights.

## Features
- 🔐 JWT Authentication with Google OAuth
- 💰 Expense & Income Tracking
- 📊 Budget Management
- 🎯 Savings Goals
- 🔄 Recurring Transactions
- 📈 Reports & Insights
- 👤 User Profile Management
"""

# Pagination
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100

# Authentication
ACCESS_TOKEN_EXPIRE_MINUTES = 30
RESET_TOKEN_EXPIRE_HOURS = 1
MIN_PASSWORD_LENGTH = 8

# Budget Status Thresholds
BUDGET_WARNING_THRESHOLD = 0.8  # 80% utilization
BUDGET_EXCEEDED_THRESHOLD = 1.0  # 100% utilization


class BudgetType(str, Enum):
    """Budget type enumeration"""
    OVERALL = "overall"
    CATEGORY = "category"


class BudgetStatus(str, Enum):
    """Budget status enumeration"""
    SAFE = "safe"
    WARNING = "warning"
    EXCEEDED = "exceeded"


class TransactionType(str, Enum):
    """Transaction type enumeration"""
    EXPENSE = "expense"
    INCOME = "income"


class Frequency(str, Enum):
    """Recurring transaction frequency"""
    DAILY = "daily"
    WEEKLY = "weekly"
    BIWEEKLY = "biweekly"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    YEARLY = "yearly"


class AuthProvider(str, Enum):
    """Authentication provider"""
    LOCAL = "local"
    GOOGLE = "google"


# Expense Categories
EXPENSE_CATEGORIES = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Healthcare",
    "Education",
    "Travel",
    "Personal Care",
    "Gifts & Donations",
    "Other"
]

# Income Sources
INCOME_SOURCES = [
    "Salary",
    "Freelance",
    "Business",
    "Investment",
    "Rental",
    "Gift",
    "Other"
]

# Payment Methods
PAYMENT_METHODS = [
    "Cash",
    "Credit Card",
    "Debit Card",
    "Bank Transfer",
    "Mobile Payment",
    "Other"
]
