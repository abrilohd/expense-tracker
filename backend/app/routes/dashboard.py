"""
Dashboard routes - spending summary and analytics for authenticated user
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract, cast, String
from datetime import datetime, timedelta
from typing import List

from app.db.database import get_db, engine
from app.models.expense import Expense
from app.models.user import User
from app.schemas.dashboard import DashboardResponse, CategorySummary, MonthlyTrend
from app.schemas.expense import ExpenseResponse
from app.core.security import get_current_user

# Create router instance
router = APIRouter()

# Helper function to format date as YYYY-MM for both SQLite and PostgreSQL
def get_month_format(date_column):
    """
    Returns the appropriate SQL function to format date as YYYY-MM
    Works with both SQLite (strftime) and PostgreSQL (to_char)
    """
    db_url = str(engine.url)
    if "postgresql" in db_url or "postgres" in db_url:
        # PostgreSQL uses to_char
        return func.to_char(date_column, 'YYYY-MM')
    else:
        # SQLite uses strftime
        return func.strftime('%Y-%m', date_column)

@router.get("", response_model=DashboardResponse)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get comprehensive spending summary and analytics for the authenticated user
    """
    # Base query for current user's expenses
    user_expenses = db.query(Expense).filter(Expense.user_id == current_user.id)
    
    # Calculate overall statistics using aggregations
    stats = db.query(
        func.sum(Expense.amount).label('total'),
        func.count(Expense.id).label('count'),
        func.avg(Expense.amount).label('average'),
        func.max(Expense.amount).label('highest'),
        func.min(Expense.amount).label('lowest')
    ).filter(Expense.user_id == current_user.id).first()
    
    # Handle case where user has no expenses
    total_expenses = float(stats.total) if stats.total else 0.0
    total_count = stats.count if stats.count else 0
    average_expense = float(stats.average) if stats.average else 0.0
    highest_expense = float(stats.highest) if stats.highest else 0.0
    lowest_expense = float(stats.lowest) if stats.lowest else 0.0
    
    # Calculate current month statistics
    current_month_start = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    current_month_stats = db.query(
        func.sum(Expense.amount).label('total'),
        func.count(Expense.id).label('count')
    ).filter(
        Expense.user_id == current_user.id,
        Expense.date >= current_month_start.date()
    ).first()
    
    current_month_total = float(current_month_stats.total) if current_month_stats.total else 0.0
    current_month_count = current_month_stats.count if current_month_stats.count else 0
    
    # Calculate category breakdown with percentages
    category_data = db.query(
        Expense.category,
        func.sum(Expense.amount).label('total'),
        func.count(Expense.id).label('count')
    ).filter(
        Expense.user_id == current_user.id
    ).group_by(
        Expense.category
    ).order_by(
        func.sum(Expense.amount).desc()
    ).all()
    
    # Build category summary list with percentages
    categories: List[CategorySummary] = []
    for cat in category_data:
        percentage = (float(cat.total) / total_expenses * 100) if total_expenses > 0 else 0.0
        categories.append(CategorySummary(
            category=cat.category,
            total=float(cat.total),
            count=cat.count,
            percentage=round(percentage, 2)
        ))
    
    # Calculate monthly trends for last 6 months
    six_months_ago = datetime.now() - timedelta(days=180)
    
    # Get the appropriate month format function for the database
    month_format = get_month_format(Expense.date)
    
    monthly_data = db.query(
        month_format.label('month'),
        func.sum(Expense.amount).label('total'),
        func.count(Expense.id).label('count')
    ).filter(
        Expense.user_id == current_user.id,
        Expense.date >= six_months_ago.date()
    ).group_by(
        month_format
    ).order_by(
        month_format.asc()
    ).all()
    
    # Build monthly trends list
    monthly_trends: List[MonthlyTrend] = []
    for month in monthly_data:
        monthly_trends.append(MonthlyTrend(
            month=month.month,
            total=float(month.total),
            count=month.count
        ))
    
    # Get recent 5 expenses
    recent_expenses_query = db.query(Expense).filter(
        Expense.user_id == current_user.id
    ).order_by(
        Expense.date.desc(),
        Expense.id.desc()
    ).limit(5).all()
    
    # Convert to ExpenseResponse schema
    recent_expenses: List[ExpenseResponse] = [
        ExpenseResponse.model_validate(expense) for expense in recent_expenses_query
    ]
    
    # Return complete dashboard response
    return DashboardResponse(
        total_expenses=total_expenses,
        total_count=total_count,
        average_expense=round(average_expense, 2),
        highest_expense=highest_expense,
        lowest_expense=lowest_expense,
        current_month_total=current_month_total,
        current_month_count=current_month_count,
        categories=categories,
        monthly_trends=monthly_trends,
        recent_expenses=recent_expenses
    )
