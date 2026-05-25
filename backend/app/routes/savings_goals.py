"""
Savings Goals routes - all CRUD operations for savings goals
Protected: All routes require authentication
"""
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Optional

from app.db.database import get_db
from app.models.savings_goal import SavingsGoal
from app.models.user import User
from app.schemas.savings_goal import (
    SavingsGoalCreate,
    SavingsGoalUpdate,
    SavingsGoalResponse,
    SavingsGoalListResponse,
    SavingsGoalStatus,
    SavingsGoalContribution
)
from app.services.savings_goal_service import SavingsGoalService
from app.core.security import get_current_user
from app.core.exceptions import NotFoundException, ForbiddenException

# Create router instance
router = APIRouter()

# CREATE - Add new savings goal
@router.post("", response_model=SavingsGoalResponse, status_code=status.HTTP_201_CREATED)
def create_savings_goal(
    goal: SavingsGoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new savings goal for the authenticated user
    """
    # Create savings goal with current user's ID and default values
    db_goal = SavingsGoal(
        **goal.model_dump(),
        user_id=current_user.id,
        current_amount=0.0,
        status="active"
    )
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    
    # Return enriched response with computed fields
    return SavingsGoalService.enrich_goal_response(db_goal)

# READ - Get all savings goals for current user
@router.get("", response_model=list[SavingsGoalResponse])
def get_savings_goals(
    # Filtering parameters
    status_filter: Optional[SavingsGoalStatus] = Query(None, description="Filter by status"),
    # Dependencies
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve all savings goals for the authenticated user with optional status filter
    Returns array of goals for frontend compatibility
    """
    # Start with base query filtered by current user
    query = db.query(SavingsGoal).filter(SavingsGoal.user_id == current_user.id)
    
    # Apply status filter if provided
    if status_filter:
        query = query.filter(SavingsGoal.status == status_filter.value)
    
    # Order by deadline (nearest first, nulls last), then by created_at
    query = query.order_by(SavingsGoal.deadline.asc().nullslast(), SavingsGoal.created_at.desc())
    
    # Get all goals
    goals = query.all()
    
    # Enrich each goal with computed fields
    enriched_goals = [SavingsGoalService.enrich_goal_response(goal) for goal in goals]
    
    # Return array directly for frontend compatibility
    return enriched_goals

# READ - Get single savings goal by ID
@router.get("/{goal_id}", response_model=SavingsGoalResponse)
def get_savings_goal_by_id(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve a specific savings goal by ID (only if owned by current user)
    """
    goal = db.query(SavingsGoal).filter(SavingsGoal.id == goal_id).first()
    
    # Check if goal exists
    if goal is None:
        raise NotFoundException(f"Savings goal with id {goal_id} not found")
    
    # Check if goal belongs to current user
    if goal.user_id != current_user.id:
        raise ForbiddenException("Not authorized to access this savings goal")
    
    # Return enriched response with computed fields
    return SavingsGoalService.enrich_goal_response(goal)

# UPDATE - Update existing savings goal
@router.put("/{goal_id}", response_model=SavingsGoalResponse)
def update_savings_goal(
    goal_id: int,
    goal_update: SavingsGoalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update an existing savings goal by ID (only if owned by current user)
    """
    db_goal = db.query(SavingsGoal).filter(SavingsGoal.id == goal_id).first()
    
    # Check if goal exists
    if db_goal is None:
        raise NotFoundException(f"Savings goal with id {goal_id} not found")
    
    # Check if goal belongs to current user
    if db_goal.user_id != current_user.id:
        raise ForbiddenException("Not authorized to modify this savings goal")
    
    # Update only provided fields
    update_data = goal_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_goal, key, value)
    
    # Check if goal should be marked as completed
    SavingsGoalService.check_goal_completion(db_goal, db)
    
    db.commit()
    db.refresh(db_goal)
    
    # Return enriched response with computed fields
    return SavingsGoalService.enrich_goal_response(db_goal)

# DELETE - Remove savings goal
@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_savings_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a savings goal by ID (only if owned by current user)
    """
    db_goal = db.query(SavingsGoal).filter(SavingsGoal.id == goal_id).first()
    
    # Check if goal exists
    if db_goal is None:
        raise NotFoundException(f"Savings goal with id {goal_id} not found")
    
    # Check if goal belongs to current user
    if db_goal.user_id != current_user.id:
        raise ForbiddenException("Not authorized to delete this savings goal")
    
    db.delete(db_goal)
    db.commit()
    return None

# CONTRIBUTE - Add funds to savings goal
@router.post("/{goal_id}/contribute", response_model=SavingsGoalResponse)
def contribute_to_savings_goal(
    goal_id: int,
    contribution: SavingsGoalContribution,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Add contribution to a savings goal (only if owned by current user)
    """
    db_goal = db.query(SavingsGoal).filter(SavingsGoal.id == goal_id).first()
    
    # Check if goal exists
    if db_goal is None:
        raise NotFoundException(f"Savings goal with id {goal_id} not found")
    
    # Check if goal belongs to current user
    if db_goal.user_id != current_user.id:
        raise ForbiddenException("Not authorized to contribute to this savings goal")
    
    # Add contribution to current amount
    db_goal.current_amount += contribution.amount
    
    # Check if goal should be marked as completed
    SavingsGoalService.check_goal_completion(db_goal, db)
    
    db.commit()
    db.refresh(db_goal)
    
    # Return enriched response with computed fields
    return SavingsGoalService.enrich_goal_response(db_goal)
