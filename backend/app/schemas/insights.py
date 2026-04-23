"""
Insights schemas - defines response models for spending pattern analysis
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime

class Insight(BaseModel):
    """
    Individual spending insight with type, title, message, and optional value
    """
    type: Literal["warning", "success", "tip", "info"]
    title: str = Field(..., max_length=100)
    message: str
    value: Optional[float] = None

class InsightsResponse(BaseModel):
    """
    Complete insights response with analysis metadata
    """
    insights: List[Insight]
    generated_at: datetime
    period_days: int  # Analysis window in days
