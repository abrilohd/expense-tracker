"""
Services Module
Business logic layer organized by domain
"""
from app.services.budget.budget_service import BudgetService
from app.services.auth.email_service import EmailService
from app.services.insights.insights_service import InsightsEngine
from app.services.recurring.recurring_service import RecurringService
from app.services.reports.report_service import ReportService
from app.services.savings.savings_goal_service import SavingsGoalService

__all__ = [
    "BudgetService",
    "EmailService",
    "InsightsEngine",
    "RecurringService",
    "ReportService",
    "SavingsGoalService",
]
