"""
API v1 Router
Aggregates all v1 endpoints into a single router
"""
from fastapi import APIRouter

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

# Create main API router
api_router = APIRouter()

# Include all route modules with their prefixes and tags
api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"]
)

api_router.include_router(
    google_auth.router,
    prefix="/auth",
    tags=["Google OAuth"]
)

api_router.include_router(
    admin.router,
    prefix="/admin",
    tags=["Admin"]
)

api_router.include_router(
    expenses.router,
    prefix="/expenses",
    tags=["Expenses"]
)

api_router.include_router(
    income.router,
    prefix="/income",
    tags=["Income"]
)

api_router.include_router(
    balance.router,
    prefix="/balance",
    tags=["Balance"]
)

api_router.include_router(
    budgets.router,
    prefix="/budgets",
    tags=["Budgets"]
)

api_router.include_router(
    savings_goals.router,
    prefix="/savings-goals",
    tags=["Savings Goals"]
)

api_router.include_router(
    recurring.router,
    prefix="/recurring",
    tags=["Recurring Transactions"]
)

api_router.include_router(
    reports.router,
    prefix="/reports",
    tags=["Reports"]
)

api_router.include_router(
    dashboard.router,
    prefix="/dashboard",
    tags=["Dashboard"]
)

api_router.include_router(
    insights.router,
    prefix="/insights",
    tags=["Insights"]
)
