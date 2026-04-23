"""
Insights routes - AI-powered spending pattern analysis
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.database import get_db
from app.models.expense import Expense
from app.models.user import User
from app.schemas.insights import InsightsResponse
from app.core.security import get_current_user
from app.services.insights import InsightsEngine

# Create router instance
router = APIRouter()

@router.get("", response_model=InsightsResponse)
def get_insights(
    days: int = Query(30, ge=1, le=365, description="Analysis period in days (max 365)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get AI-powered spending insights for the authenticated user
    
    Analyzes spending patterns and returns actionable insights based on:
    - Category spending distribution
    - Spending trends over time
    - Transaction patterns
    - Unusual spending behavior
    """
    # Fetch all user expenses (InsightsEngine will filter by period)
    user_expenses = db.query(Expense).filter(
        Expense.user_id == current_user.id
    ).order_by(Expense.date.desc()).all()
    
    # Initialize insights engine with user's expenses
    engine = InsightsEngine(expenses=user_expenses, period_days=days)
    
    # Generate insights using rule-based analysis
    insights = engine.generate_insights()
    
    # Return insights response with metadata
    return InsightsResponse(
        insights=insights,
        generated_at=datetime.now(),
        period_days=days
    )
