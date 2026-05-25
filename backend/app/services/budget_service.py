"""
Budget service - business logic for budget calculations and alerts
"""
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import date, datetime
from typing import List, Optional

from app.models.budget import Budget
from app.models.expense import Expense
from app.schemas.budget import BudgetStatusResponse, BudgetStatus, BudgetResponse

class BudgetService:
    """Service class for budget-related business logic"""
    
    @staticmethod
    def calculate_spent_amount(
        budget: Budget,
        db: Session
    ) -> float:
        """
        Calculate total spent amount for a budget
        
        For overall budgets: sum all expenses in period
        For category budgets: sum expenses in category for period
        """
        query = db.query(func.sum(Expense.amount)).filter(
            Expense.user_id == budget.user_id,
            Expense.date >= budget.period_start,
            Expense.date <= budget.period_end
        )
        
        # Add category filter for category budgets
        if budget.budget_type == "category" and budget.category:
            query = query.filter(Expense.category == budget.category)
        
        spent = query.scalar()
        return float(spent) if spent else 0.0
    
    @staticmethod
    def calculate_budget_status(
        budget: Budget,
        spent_amount: float
    ) -> BudgetStatus:
        """
        Determine budget status based on utilization percentage
        
        - safe: < 80%
        - warning: 80-100%
        - exceeded: > 100%
        """
        utilization = (spent_amount / budget.amount) * 100 if budget.amount > 0 else 0
        
        if utilization >= 100:
            return BudgetStatus.EXCEEDED
        elif utilization >= 80:
            return BudgetStatus.WARNING
        else:
            return BudgetStatus.SAFE
    
    @staticmethod
    def is_budget_active(budget: Budget) -> bool:
        """Check if budget is currently active (today is within period)"""
        today = date.today()
        return budget.period_start <= today <= budget.period_end
    
    @staticmethod
    def get_budget_status(
        budget: Budget,
        db: Session
    ) -> BudgetStatusResponse:
        """
        Get complete budget status with calculations
        """
        spent_amount = BudgetService.calculate_spent_amount(budget, db)
        remaining_amount = budget.amount - spent_amount
        utilization_percentage = (spent_amount / budget.amount) * 100 if budget.amount > 0 else 0
        status = BudgetService.calculate_budget_status(budget, spent_amount)
        is_active = BudgetService.is_budget_active(budget)
        
        return BudgetStatusResponse(
            budget=BudgetResponse.model_validate(budget),
            spent_amount=round(spent_amount, 2),
            remaining_amount=round(remaining_amount, 2),
            utilization_percentage=round(utilization_percentage, 2),
            status=status,
            is_active=is_active
        )
    
    @staticmethod
    def check_budget_uniqueness(
        user_id: int,
        budget_type: str,
        category: Optional[str],
        period_start: date,
        period_end: date,
        db: Session,
        exclude_budget_id: Optional[int] = None
    ) -> bool:
        """
        Check if a budget already exists for the same type/category/period
        
        Returns True if unique (no conflict), False if duplicate exists
        """
        query = db.query(Budget).filter(
            Budget.user_id == user_id,
            Budget.budget_type == budget_type,
            # Check for overlapping periods
            and_(
                Budget.period_start <= period_end,
                Budget.period_end >= period_start
            )
        )
        
        # Add category filter for category budgets
        if budget_type == "category":
            query = query.filter(Budget.category == category)
        
        # Exclude current budget when updating
        if exclude_budget_id:
            query = query.filter(Budget.id != exclude_budget_id)
        
        existing = query.first()
        return existing is None
    
    @staticmethod
    def get_budget_alerts(
        user_id: int,
        db: Session
    ) -> List[dict]:
        """
        Get list of budget alerts for budgets that are in warning or exceeded status
        
        Returns list of alert dictionaries with budget info and status
        """
        # Get all active budgets for user
        today = date.today()
        budgets = db.query(Budget).filter(
            Budget.user_id == user_id,
            Budget.period_start <= today,
            Budget.period_end >= today
        ).all()
        
        alerts = []
        for budget in budgets:
            status_response = BudgetService.get_budget_status(budget, db)
            
            # Only create alerts for warning or exceeded budgets
            if status_response.status in [BudgetStatus.WARNING, BudgetStatus.EXCEEDED]:
                alert = {
                    "budget_id": budget.id,
                    "budget_name": budget.category if budget.budget_type == "category" else "Overall Budget",
                    "budget_type": budget.budget_type,
                    "category": budget.category,
                    "amount": budget.amount,
                    "spent_amount": status_response.spent_amount,
                    "utilization_percentage": status_response.utilization_percentage,
                    "status": status_response.status.value,
                    "severity": "critical" if status_response.status == BudgetStatus.EXCEEDED else "warning"
                }
                alerts.append(alert)
        
        # Sort by severity (exceeded first) then by utilization percentage
        alerts.sort(key=lambda x: (0 if x['severity'] == 'critical' else 1, -x['utilization_percentage']))
        
        return alerts
