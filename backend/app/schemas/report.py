"""
Report schemas - defines request/response data validation models for reports
"""
from pydantic import BaseModel, Field
from datetime import date
from typing import Dict, List, Any, Literal

class ReportRequest(BaseModel):
    """Schema for custom report generation"""
    start_date: date
    end_date: date

class QuickReportRequest(BaseModel):
    """Schema for quick report generation"""
    period: Literal["this_month", "last_month", "this_year", "last_year", "last_30_days", "last_90_days"]

class ReportPeriod(BaseModel):
    """Report period information"""
    start_date: str
    end_date: str
    days: int

class ReportSummary(BaseModel):
    """Report summary statistics"""
    total_income: float
    total_expenses: float
    balance: float
    income_count: int
    expense_count: int
    avg_daily_expense: float
    avg_daily_income: float
    highest_category: str | None
    highest_source: str | None

class CategoryData(BaseModel):
    """Category breakdown data"""
    total: float
    count: int
    percentage: float

class MonthlyTrend(BaseModel):
    """Monthly trend data"""
    month: str
    income: float
    expenses: float
    balance: float

class TopExpense(BaseModel):
    """Top expense data"""
    id: int
    title: str
    amount: float
    category: str
    date: str
    description: str | None

class ReportResponse(BaseModel):
    """Complete report response"""
    period: ReportPeriod
    summary: ReportSummary
    category_breakdown: Dict[str, CategoryData]
    source_breakdown: Dict[str, CategoryData]
    top_expenses: List[TopExpense]
    monthly_trends: List[MonthlyTrend]
    generated_at: str
