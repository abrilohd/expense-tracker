"""
Expense routes - all CRUD operations for expenses
Protected: All routes require authentication
"""
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List, Optional
from datetime import date

from app.db.database import get_db
from app.models.expense import Expense
from app.models.user import User
from app.schemas.expense import ExpenseCreate, ExpenseResponse, ExpenseListResponse
from app.core.security import get_current_user
from app.core.exceptions import NotFoundException, ForbiddenException

# Create router instance
router = APIRouter()

# CREATE - Add new expense
@router.post("", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_expense(
    expense: ExpenseCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new expense record for the authenticated user
    """
    # Create expense with current user's ID
    db_expense = Expense(**expense.model_dump(), user_id=current_user.id)
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

# READ - Get all expenses for current user with filtering and search
@router.get("", response_model=ExpenseListResponse)
def get_expenses(
    # Filtering parameters
    category: Optional[str] = Query(None, description="Filter by exact category match"),
    start_date: Optional[date] = Query(None, description="Filter expenses from this date"),
    end_date: Optional[date] = Query(None, description="Filter expenses up to this date"),
    search: Optional[str] = Query(None, description="Search by title (case-insensitive, partial match)"),
    min_amount: Optional[float] = Query(None, ge=0, description="Filter expenses above this amount"),
    max_amount: Optional[float] = Query(None, ge=0, description="Filter expenses below this amount"),
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
    Retrieve expenses for the authenticated user with optional filtering, search, sorting, and pagination
    """
    # Start with base query filtered by current user
    query = db.query(Expense).filter(Expense.user_id == current_user.id)
    
    # Apply category filter (exact match)
    if category:
        query = query.filter(Expense.category == category)
    
    # Apply date range filters
    if start_date:
        query = query.filter(Expense.date >= start_date)
    if end_date:
        query = query.filter(Expense.date <= end_date)
    
    # Apply search filter (case-insensitive partial match on title)
    if search:
        query = query.filter(Expense.title.ilike(f"%{search}%"))
    
    # Apply amount range filters
    if min_amount is not None:
        query = query.filter(Expense.amount >= min_amount)
    if max_amount is not None:
        query = query.filter(Expense.amount <= max_amount)
    
    # Get total count before pagination
    total = query.count()
    
    # Apply sorting
    if sort_by == "date":
        query = query.order_by(Expense.date.desc() if order == "desc" else Expense.date.asc())
    elif sort_by == "amount":
        query = query.order_by(Expense.amount.desc() if order == "desc" else Expense.amount.asc())
    
    # Apply pagination
    expenses = query.offset(skip).limit(limit).all()
    
    # Return paginated response with metadata
    return ExpenseListResponse(
        items=expenses,
        total=total,
        skip=skip,
        limit=limit
    )

# READ - Get single expense by ID
@router.get("/{expense_id}", response_model=ExpenseResponse)
def get_expense(
    expense_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve a specific expense by ID (only if owned by current user)
    """
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    
    # Check if expense exists
    if expense is None:
        raise NotFoundException(f"Expense with id {expense_id} not found")
    
    # Check if expense belongs to current user
    if expense.user_id != current_user.id:
        raise ForbiddenException("Not authorized to access this expense")
    
    return expense

# UPDATE - Update existing expense
@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(
    expense_id: int, 
    expense: ExpenseCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update an existing expense by ID (only if owned by current user)
    """
    db_expense = db.query(Expense).filter(Expense.id == expense_id).first()
    
    # Check if expense exists
    if db_expense is None:
        raise NotFoundException(f"Expense with id {expense_id} not found")
    
    # Check if expense belongs to current user
    if db_expense.user_id != current_user.id:
        raise ForbiddenException("Not authorized to modify this expense")
    
    # Update fields
    for key, value in expense.model_dump().items():
        setattr(db_expense, key, value)
    
    db.commit()
    db.refresh(db_expense)
    return db_expense

# DELETE - Remove expense
@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(
    expense_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete an expense by ID (only if owned by current user)
    """
    db_expense = db.query(Expense).filter(Expense.id == expense_id).first()
    
    # Check if expense exists
    if db_expense is None:
        raise NotFoundException(f"Expense with id {expense_id} not found")
    
    # Check if expense belongs to current user
    if db_expense.user_id != current_user.id:
        raise ForbiddenException("Not authorized to delete this expense")
    
    db.delete(db_expense)
    db.commit()
    return None
