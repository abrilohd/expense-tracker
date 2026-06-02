"""
Recurring Transaction routes - API endpoints for recurring transactions
Protected: All routes require authentication
"""
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date

from app.db.database import get_db
from app.models.user import User
from app.models.recurring_transaction import RecurringTransaction
from app.schemas.recurring_transaction import (
    RecurringTransactionCreate,
    RecurringTransactionUpdate,
    RecurringTransactionResponse,
    RecurringTransactionListResponse
)
from app.services.recurring.recurring_service import RecurringService
from app.core.security import get_current_user
from app.core.exceptions import NotFoundException

# Create router instance
router = APIRouter()

@router.post("", response_model=RecurringTransactionResponse, status_code=status.HTTP_201_CREATED)
def create_recurring_transaction(
    recurring_data: RecurringTransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new recurring transaction
    
    Automatically calculates next_occurrence from start_date
    """
    # Create recurring transaction
    recurring = RecurringTransaction(
        user_id=current_user.id,
        transaction_type=recurring_data.transaction_type,
        title=recurring_data.title,
        amount=recurring_data.amount,
        category_or_source=recurring_data.category_or_source,
        description=recurring_data.description,
        payment_method=recurring_data.payment_method,
        frequency=recurring_data.frequency,
        start_date=recurring_data.start_date,
        end_date=recurring_data.end_date,
        next_occurrence=recurring_data.start_date,  # First occurrence is start date
        is_active=True
    )
    
    db.add(recurring)
    db.commit()
    db.refresh(recurring)
    
    return recurring

@router.get("", response_model=RecurringTransactionListResponse)
def list_recurring_transactions(
    transaction_type: Optional[str] = Query(None, description="Filter by type: expense or income"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List all recurring transactions for the current user
    
    Supports filtering by type and active status
    """
    # Build query
    query = db.query(RecurringTransaction).filter(
        RecurringTransaction.user_id == current_user.id
    )
    
    # Apply filters
    if transaction_type:
        query = query.filter(RecurringTransaction.transaction_type == transaction_type)
    
    if is_active is not None:
        query = query.filter(RecurringTransaction.is_active == is_active)
    
    # Get total count
    total = query.count()
    
    # Get active/inactive counts
    active_count = db.query(RecurringTransaction).filter(
        RecurringTransaction.user_id == current_user.id,
        RecurringTransaction.is_active == True
    ).count()
    
    inactive_count = total - active_count
    
    # Get paginated results
    items = query.order_by(RecurringTransaction.next_occurrence).offset(skip).limit(limit).all()
    
    return {
        "items": items,
        "total": total,
        "active_count": active_count,
        "inactive_count": inactive_count
    }

@router.get("/{recurring_id}", response_model=RecurringTransactionResponse)
def get_recurring_transaction(
    recurring_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a single recurring transaction by ID"""
    recurring = db.query(RecurringTransaction).filter(
        RecurringTransaction.id == recurring_id,
        RecurringTransaction.user_id == current_user.id
    ).first()
    
    if not recurring:
        raise NotFoundException("Recurring transaction not found")
    
    return recurring

@router.put("/{recurring_id}", response_model=RecurringTransactionResponse)
def update_recurring_transaction(
    recurring_id: int,
    recurring_data: RecurringTransactionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a recurring transaction"""
    recurring = db.query(RecurringTransaction).filter(
        RecurringTransaction.id == recurring_id,
        RecurringTransaction.user_id == current_user.id
    ).first()
    
    if not recurring:
        raise NotFoundException("Recurring transaction not found")
    
    # Update fields
    update_data = recurring_data.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(recurring, field, value)
    
    # Recalculate next occurrence if frequency or start_date changed
    if 'frequency' in update_data or 'start_date' in update_data:
        recurring.next_occurrence = RecurringService.calculate_next_occurrence(
            recurring.start_date,
            recurring.frequency
        )
    
    db.commit()
    db.refresh(recurring)
    
    return recurring

@router.delete("/{recurring_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_recurring_transaction(
    recurring_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a recurring transaction"""
    recurring = db.query(RecurringTransaction).filter(
        RecurringTransaction.id == recurring_id,
        RecurringTransaction.user_id == current_user.id
    ).first()
    
    if not recurring:
        raise NotFoundException("Recurring transaction not found")
    
    db.delete(recurring)
    db.commit()
    
    return None

@router.post("/{recurring_id}/toggle", response_model=RecurringTransactionResponse)
def toggle_recurring_transaction(
    recurring_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Toggle active status of a recurring transaction"""
    recurring = db.query(RecurringTransaction).filter(
        RecurringTransaction.id == recurring_id,
        RecurringTransaction.user_id == current_user.id
    ).first()
    
    if not recurring:
        raise NotFoundException("Recurring transaction not found")
    
    recurring.is_active = not recurring.is_active
    db.commit()
    db.refresh(recurring)
    
    return recurring

@router.post("/{recurring_id}/generate-now", response_model=dict)
def generate_transaction_now(
    recurring_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Manually trigger generation of transaction from recurring"""
    recurring = db.query(RecurringTransaction).filter(
        RecurringTransaction.id == recurring_id,
        RecurringTransaction.user_id == current_user.id
    ).first()
    
    if not recurring:
        raise NotFoundException("Recurring transaction not found")
    
    success = RecurringService.generate_transaction(recurring, db)
    
    if success:
        return {
            "message": "Transaction generated successfully",
            "next_occurrence": recurring.next_occurrence.isoformat()
        }
    else:
        return {
            "message": "Failed to generate transaction",
            "error": "An error occurred during generation"
        }

@router.get("/{recurring_id}/upcoming", response_model=dict)
def get_upcoming_occurrences(
    recurring_id: int,
    count: int = Query(5, ge=1, le=20),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get upcoming occurrence dates for a recurring transaction"""
    recurring = db.query(RecurringTransaction).filter(
        RecurringTransaction.id == recurring_id,
        RecurringTransaction.user_id == current_user.id
    ).first()
    
    if not recurring:
        raise NotFoundException("Recurring transaction not found")
    
    occurrences = RecurringService.get_upcoming_occurrences(recurring, count)
    
    return {
        "recurring_id": recurring_id,
        "title": recurring.title,
        "upcoming_dates": [d.isoformat() for d in occurrences]
    }

@router.post("/process-due", response_model=dict)
def process_due_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Process all due recurring transactions for current user
    
    This endpoint can be called manually or via scheduled job
    """
    # Filter by user in the service
    results = RecurringService.process_due_recurring_transactions(db)
    
    return {
        "message": "Recurring transactions processed",
        "results": results
    }
