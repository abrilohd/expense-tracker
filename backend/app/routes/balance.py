"""
Balance routes - calculate income vs expenses balance
Protected: All routes require authentication
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, datetime
from dateutil.relativedelta import relativedelta

from app.db.database import get_db
from app.models.expense import Expense
from app.models.income import Income
from app.models.user import User
from app.core.security import get_current_user

# Create router instance
router = APIRouter()

@router.get("")
def get_balance(
    period: str = Query("all", pattern="^(all|month|year)$", description="Time period: all, month, or year"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Calculate balance (income - expenses) for the authenticated user
    
    Returns:
    - balance: Total income minus total expenses
    - total_income: Sum of all income
    - total_expenses: Sum of all expenses
    - current_month_balance: Balance for current month
    - current_month_income: Income for current month
    - current_month_expenses: Expenses for current month
    - period_balance: Balance for selected period
    - period_income: Income for selected period
    - period_expenses: Expenses for selected period
    """
    
    # Calculate all-time totals
    total_income = db.query(func.sum(Income.amount)).filter(
        Income.user_id == current_user.id
    ).scalar() or 0.0
    
    total_expenses = db.query(func.sum(Expense.amount)).filter(
        Expense.user_id == current_user.id
    ).scalar() or 0.0
    
    all_time_balance = total_income - total_expenses
    
    # Calculate current month totals
    today = date.today()
    month_start = date(today.year, today.month, 1)
    
    current_month_income = db.query(func.sum(Income.amount)).filter(
        Income.user_id == current_user.id,
        Income.date >= month_start
    ).scalar() or 0.0
    
    current_month_expenses = db.query(func.sum(Expense.amount)).filter(
        Expense.user_id == current_user.id,
        Expense.date >= month_start
    ).scalar() or 0.0
    
    current_month_balance = current_month_income - current_month_expenses
    
    # Calculate period-specific totals based on query parameter
    if period == "month":
        period_income = current_month_income
        period_expenses = current_month_expenses
        period_balance = current_month_balance
        period_label = "This Month"
    elif period == "year":
        year_start = date(today.year, 1, 1)
        
        period_income = db.query(func.sum(Income.amount)).filter(
            Income.user_id == current_user.id,
            Income.date >= year_start
        ).scalar() or 0.0
        
        period_expenses = db.query(func.sum(Expense.amount)).filter(
            Expense.user_id == current_user.id,
            Expense.date >= year_start
        ).scalar() or 0.0
        
        period_balance = period_income - period_expenses
        period_label = "This Year"
    else:  # all
        period_income = total_income
        period_expenses = total_expenses
        period_balance = all_time_balance
        period_label = "All Time"
    
    # Calculate previous month for comparison
    prev_month_start = month_start - relativedelta(months=1)
    prev_month_end = month_start - relativedelta(days=1)
    
    prev_month_income = db.query(func.sum(Income.amount)).filter(
        Income.user_id == current_user.id,
        Income.date >= prev_month_start,
        Income.date <= prev_month_end
    ).scalar() or 0.0
    
    prev_month_expenses = db.query(func.sum(Expense.amount)).filter(
        Expense.user_id == current_user.id,
        Expense.date >= prev_month_start,
        Expense.date <= prev_month_end
    ).scalar() or 0.0
    
    prev_month_balance = prev_month_income - prev_month_expenses
    
    # Calculate month-over-month change
    if prev_month_balance != 0:
        balance_change_percent = ((current_month_balance - prev_month_balance) / abs(prev_month_balance)) * 100
    else:
        balance_change_percent = 100.0 if current_month_balance > 0 else 0.0
    
    # Determine trend
    if current_month_balance > prev_month_balance:
        trend = "up"
    elif current_month_balance < prev_month_balance:
        trend = "down"
    else:
        trend = "stable"
    
    return {
        # All-time totals
        "balance": round(all_time_balance, 2),
        "total_income": round(total_income, 2),
        "total_expenses": round(total_expenses, 2),
        
        # Current month
        "current_month_balance": round(current_month_balance, 2),
        "current_month_income": round(current_month_income, 2),
        "current_month_expenses": round(current_month_expenses, 2),
        
        # Selected period
        "period": period,
        "period_label": period_label,
        "period_balance": round(period_balance, 2),
        "period_income": round(period_income, 2),
        "period_expenses": round(period_expenses, 2),
        
        # Trends
        "prev_month_balance": round(prev_month_balance, 2),
        "balance_change_percent": round(balance_change_percent, 2),
        "trend": trend,
        
        # Counts
        "income_count": db.query(Income).filter(Income.user_id == current_user.id).count(),
        "expense_count": db.query(Expense).filter(Expense.user_id == current_user.id).count(),
    }
