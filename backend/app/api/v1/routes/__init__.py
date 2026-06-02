"""
API v1 Routes Module
Aggregates all route modules for easy import
"""
from app.api.v1.routes import (
    auth,
    admin,
    expenses,
    income,
    balance,
    budgets,
    savings_goals,
    recurring,
    reports,
    dashboard,
    insights,
    google_auth
)

__all__ = [
    "auth",
    "admin",
    "expenses",
    "income",
    "balance",
    "budgets",
    "savings_goals",
    "recurring",
    "reports",
    "dashboard",
    "insights",
    "google_auth"
]
