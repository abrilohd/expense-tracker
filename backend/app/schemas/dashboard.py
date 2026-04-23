"""
Dashboard schemas - defines response models for spending summary
"""
from pydantic import BaseModel
from typing import List
from app.schemas.expense import ExpenseResponse

class CategorySummary(BaseModel):
    """
    Summary of expenses by category
    """
    category: str
    total: float
    count: int
    percentage: float

class MonthlyTrend(BaseModel):
    """
    Monthly spending trend data
    """
    month: str  # Format: "2026-04"
    total: float
    count: int

class DashboardResponse(BaseModel):
    """
    Complete dashboard response with spending analytics
    """
    # Overall statistics
    total_expenses: float
    total_count: int
    average_expense: float
    highest_expense: float
    lowest_expense: float
    
    # Current month statistics
    current_month_total: float
    current_month_count: int
    
    # Category breakdown
    categories: List[CategorySummary]
    
    # Trends over time
    monthly_trends: List[MonthlyTrend]  # Last 6 months
    
    # Recent activity
    recent_expenses: List[ExpenseResponse]  # Last 5 expenses
