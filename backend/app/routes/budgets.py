"""
Budget routes - all CRUD operations for budgets with status tracking
Protected: All routes require authentication
"""
from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date

from app.db.database import get_db
from app.models.budget import Budget
from app.models.user import User
from app.schemas.budget import (
    BudgetCreate, 
    BudgetUpdate, 
    BudgetResponse, 
    BudgetListResponse,
    BudgetStatusResponse,
    BudgetStatusListResponse
)
from app.services.budget_service import BudgetService
from app.core.security import get_current_user
from app.core.exceptions import NotFoundException, ForbiddenException, BadRequestException

# Create router instance
router = APIRouter()

# CREATE - Add new budget
@router.post("", response_model=BudgetResponse, status_code=status.HTTP_201_CREATED)
def create_budget(
    budget: BudgetCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new budget for the authenticated user
    
    Validates:
    - Amount must be positive
    - Period end must be after period start
    - Category required for category budgets
    - No duplicate budgets for same type/category/period
    """
    # Check for duplicate budget
    is_unique = BudgetService.check_budget_uniqueness(
        user_id=current_user.id,
        budget_type=budget.budget_type.value,
        category=budget.category,
        period_start=budget.period_start,
        period_end=budget.period_end,
        db=db
    )
    
    if not is_unique:
        budget_name = budget.category if budget.budget_type.value == "category" else "Overall"
        raise BadRequestException(
            f"A {budget_name} budget already exists for this period. "
            "Please delete the existing budget or choose a different period."
        )
    
    # Create budget with current user's ID
    # Convert enum to string value for database
    budget_data = budget.model_dump()
    budget_data['budget_type'] = budget.budget_type.value  # Convert enum to string
    
    db_budget = Budget(
        **budget_data,
        user_id=current_user.id
    )
    db.add(db_budget)
    db.commit()
    db.refresh(db_budget)
    return db_budget

# READ - Get all budgets for current user
@router.get("", response_model=BudgetListResponse)
def get_budgets(
    active_only: bool = Query(False, description="Filter to only active budgets (current period)"),
    budget_type: Optional[str] = Query(None, description="Filter by budget type (overall or category)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve budgets for the authenticated user with optional filtering
    """
    # Start with base query filtered by current user
    query = db.query(Budget).filter(Budget.user_id == current_user.id)
    
    # Apply active filter
    if active_only:
        today = date.today()
        query = query.filter(
            Budget.period_start <= today,
            Budget.period_end >= today
        )
    
    # Apply budget type filter
    if budget_type:
        query = query.filter(Budget.budget_type == budget_type)
    
    # Order by period_start descending (newest first)
    budgets = query.order_by(Budget.period_start.desc()).all()
    
    return BudgetListResponse(
        items=budgets,
        total=len(budgets)
    )

# READ - Get budget status with utilization
@router.get("/status", response_model=BudgetStatusListResponse)
def get_budget_status(
    active_only: bool = Query(True, description="Only show active budgets"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get budget status with spent amounts and utilization percentages
    
    Returns detailed status for each budget including:
    - Spent amount
    - Remaining amount
    - Utilization percentage
    - Status (safe, warning, exceeded)
    """
    # Get budgets
    query = db.query(Budget).filter(Budget.user_id == current_user.id)
    
    if active_only:
        today = date.today()
        query = query.filter(
            Budget.period_start <= today,
            Budget.period_end >= today
        )
    
    budgets = query.all()
    
    # Calculate status for each budget
    budget_statuses = []
    warning_count = 0
    exceeded_count = 0
    active_count = 0
    
    for budget in budgets:
        budget_status = BudgetService.get_budget_status(budget, db)
        budget_statuses.append(budget_status)
        
        if budget_status.is_active:
            active_count += 1
        
        if budget_status.status.value == "warning":
            warning_count += 1
        elif budget_status.status.value == "exceeded":
            exceeded_count += 1
    
    # Sort by status (exceeded first, then warning, then safe) and utilization
    budget_statuses.sort(
        key=lambda x: (
            0 if x.status.value == "exceeded" else 1 if x.status.value == "warning" else 2,
            -x.utilization_percentage
        )
    )
    
    return BudgetStatusListResponse(
        budgets=budget_statuses,
        total_budgets=len(budgets),
        active_budgets=active_count,
        warning_count=warning_count,
        exceeded_count=exceeded_count
    )

# READ - Get budget alerts
@router.get("/alerts", response_model=list[dict])
def get_budget_alerts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get budget alerts for budgets in warning or exceeded status
    
    Returns list of alerts with budget details and severity
    """
    alerts = BudgetService.get_budget_alerts(current_user.id, db)
    return alerts

# READ - Get single budget by ID
@router.get("/{budget_id}", response_model=BudgetResponse)
def get_budget(
    budget_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve a specific budget by ID (only if owned by current user)
    """
    budget = db.query(Budget).filter(Budget.id == budget_id).first()
    
    # Check if budget exists
    if budget is None:
        raise NotFoundException(f"Budget with id {budget_id} not found")
    
    # Check if budget belongs to current user
    if budget.user_id != current_user.id:
        raise ForbiddenException("Not authorized to access this budget")
    
    return budget

# READ - Get single budget status by ID
@router.get("/{budget_id}/status", response_model=BudgetStatusResponse)
def get_budget_status_by_id(
    budget_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get detailed status for a specific budget
    """
    budget = db.query(Budget).filter(Budget.id == budget_id).first()
    
    # Check if budget exists
    if budget is None:
        raise NotFoundException(f"Budget with id {budget_id} not found")
    
    # Check if budget belongs to current user
    if budget.user_id != current_user.id:
        raise ForbiddenException("Not authorized to access this budget")
    
    return BudgetService.get_budget_status(budget, db)

# UPDATE - Update existing budget
@router.put("/{budget_id}", response_model=BudgetResponse)
def update_budget(
    budget_id: int, 
    budget: BudgetUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update an existing budget by ID (only if owned by current user)
    """
    db_budget = db.query(Budget).filter(Budget.id == budget_id).first()
    
    # Check if budget exists
    if db_budget is None:
        raise NotFoundException(f"Budget with id {budget_id} not found")
    
    # Check if budget belongs to current user
    if db_budget.user_id != current_user.id:
        raise ForbiddenException("Not authorized to modify this budget")
    
    # Update only provided fields
    update_data = budget.model_dump(exclude_unset=True)
    
    # If updating period or type/category, check uniqueness
    if any(key in update_data for key in ['budget_type', 'category', 'period_start', 'period_end']):
        new_budget_type = update_data.get('budget_type', db_budget.budget_type)
        new_category = update_data.get('category', db_budget.category)
        new_period_start = update_data.get('period_start', db_budget.period_start)
        new_period_end = update_data.get('period_end', db_budget.period_end)
        
        is_unique = BudgetService.check_budget_uniqueness(
            user_id=current_user.id,
            budget_type=new_budget_type.value if hasattr(new_budget_type, 'value') else new_budget_type,
            category=new_category,
            period_start=new_period_start,
            period_end=new_period_end,
            db=db,
            exclude_budget_id=budget_id
        )
        
        if not is_unique:
            raise BadRequestException("A budget with these parameters already exists")
    
    # Apply updates
    for key, value in update_data.items():
        if hasattr(value, 'value'):  # Handle enum values
            setattr(db_budget, key, value.value)
        else:
            setattr(db_budget, key, value)
    
    db.commit()
    db.refresh(db_budget)
    return db_budget

# DELETE - Remove budget
@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_budget(
    budget_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a budget by ID (only if owned by current user)
    """
    db_budget = db.query(Budget).filter(Budget.id == budget_id).first()
    
    # Check if budget exists
    if db_budget is None:
        raise NotFoundException(f"Budget with id {budget_id} not found")
    
    # Check if budget belongs to current user
    if db_budget.user_id != current_user.id:
        raise ForbiddenException("Not authorized to delete this budget")
    
    db.delete(db_budget)
    db.commit()
    return None
