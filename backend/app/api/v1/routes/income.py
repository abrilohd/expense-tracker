"""
Income routes - all CRUD operations for income
Protected: All routes require authentication
"""
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date

from app.db.database import get_db
from app.models.income import Income
from app.models.user import User
from app.schemas.income import IncomeCreate, IncomeUpdate, IncomeResponse, IncomeListResponse
from app.core.security import get_current_user
from app.core.exceptions import NotFoundException, ForbiddenException

# Create router instance
router = APIRouter()

# CREATE - Add new income
@router.post("", response_model=IncomeResponse, status_code=status.HTTP_201_CREATED)
def create_income(
    income: IncomeCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new income record for the authenticated user
    """
    # Create income with current user's ID
    db_income = Income(**income.model_dump(), user_id=current_user.id)
    db.add(db_income)
    db.commit()
    db.refresh(db_income)
    return db_income

# READ - Get all income for current user with filtering and search
@router.get("", response_model=IncomeListResponse)
def get_income(
    # Filtering parameters
    source: Optional[str] = Query(None, description="Filter by income source"),
    start_date: Optional[date] = Query(None, description="Filter income from this date"),
    end_date: Optional[date] = Query(None, description="Filter income up to this date"),
    search: Optional[str] = Query(None, description="Search by description (case-insensitive, partial match)"),
    min_amount: Optional[float] = Query(None, ge=0, description="Filter income above this amount"),
    max_amount: Optional[float] = Query(None, ge=0, description="Filter income below this amount"),
    # Sorting parameters
    sort_by: str = Query("date", pattern="^(date|amount)$", description="Sort by date or amount"),
    order: str = Query("desc", pattern="^(asc|desc)$", description="Sort order: asc or desc"),
    # Pagination parameters
    skip: int = Query(0, ge=0, description="Pagination offset"),
    limit: int = Query(20, ge=1, le=100, description="Pagination limit (max 100)"),
    # Dependencies
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve income for the authenticated user with optional filtering, search, sorting, and pagination
    """
    # Start with base query filtered by current user
    query = db.query(Income).filter(Income.user_id == current_user.id)
    
    # Apply source filter (exact match)
    if source:
        query = query.filter(Income.source == source)
    
    # Apply date range filters
    if start_date:
        query = query.filter(Income.date >= start_date)
    if end_date:
        query = query.filter(Income.date <= end_date)
    
    # Apply search filter (case-insensitive partial match on description)
    if search:
        query = query.filter(Income.description.ilike(f"%{search}%"))
    
    # Apply amount range filters
    if min_amount is not None:
        query = query.filter(Income.amount >= min_amount)
    if max_amount is not None:
        query = query.filter(Income.amount <= max_amount)
    
    # Get total count before pagination
    total = query.count()
    
    # Apply sorting
    if sort_by == "date":
        query = query.order_by(Income.date.desc() if order == "desc" else Income.date.asc())
    elif sort_by == "amount":
        query = query.order_by(Income.amount.desc() if order == "desc" else Income.amount.asc())
    
    # Apply pagination
    incomes = query.offset(skip).limit(limit).all()
    
    # Return paginated response with metadata
    return IncomeListResponse(
        items=incomes,
        total=total,
        skip=skip,
        limit=limit
    )

# READ - Get single income by ID
@router.get("/{income_id}", response_model=IncomeResponse)
def get_income_by_id(
    income_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve a specific income by ID (only if owned by current user)
    """
    income = db.query(Income).filter(Income.id == income_id).first()
    
    # Check if income exists
    if income is None:
        raise NotFoundException(f"Income with id {income_id} not found")
    
    # Check if income belongs to current user
    if income.user_id != current_user.id:
        raise ForbiddenException("Not authorized to access this income")
    
    return income

# UPDATE - Update existing income
@router.put("/{income_id}", response_model=IncomeResponse)
def update_income(
    income_id: int, 
    income: IncomeUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update an existing income by ID (only if owned by current user)
    """
    db_income = db.query(Income).filter(Income.id == income_id).first()
    
    # Check if income exists
    if db_income is None:
        raise NotFoundException(f"Income with id {income_id} not found")
    
    # Check if income belongs to current user
    if db_income.user_id != current_user.id:
        raise ForbiddenException("Not authorized to modify this income")
    
    # Update only provided fields
    update_data = income.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_income, key, value)
    
    db.commit()
    db.refresh(db_income)
    return db_income

# DELETE - Remove income
@router.delete("/{income_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_income(
    income_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete an income by ID (only if owned by current user)
    """
    db_income = db.query(Income).filter(Income.id == income_id).first()
    
    # Check if income exists
    if db_income is None:
        raise NotFoundException(f"Income with id {income_id} not found")
    
    # Check if income belongs to current user
    if db_income.user_id != current_user.id:
        raise ForbiddenException("Not authorized to delete this income")
    
    db.delete(db_income)
    db.commit()
    return None
