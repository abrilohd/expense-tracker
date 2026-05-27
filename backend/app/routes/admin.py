"""
Admin routes - protected admin-only endpoints
All routes require admin authentication
"""
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime, timedelta
from typing import Optional

from app.db.database import get_db
from app.models.user import User
from app.models.expense import Expense
from app.models.income import Income
from app.models.budget import Budget
from app.models.savings_goal import SavingsGoal
from app.models.recurring_transaction import RecurringTransaction
from app.core.security import get_current_admin_user, hash_password
from app.core.exceptions import NotFoundException, BadRequestException

# Create router instance
router = APIRouter()

@router.post("/create-first-admin", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_first_admin_user(
    email: str,
    password: str,
    name: str = "Admin User",
    db: Session = Depends(get_db)
):
    """
    Create the first admin user - ONLY works if no admin exists
    This is a public endpoint but only works once
    """
    # Check if any admin already exists
    existing_admin = db.query(User).filter(User.is_admin == True).first()
    
    if existing_admin:
        raise BadRequestException("Admin user already exists. Use the admin panel to create additional admins.")
    
    # Validate password
    if len(password) < 8:
        raise BadRequestException("Password must be at least 8 characters")
    
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == email).first()
    
    if existing_user:
        # Update existing user to admin
        existing_user.is_admin = True
        db.commit()
        db.refresh(existing_user)
        return {
            "message": "Existing user promoted to admin",
            "email": existing_user.email,
            "name": existing_user.name
        }
    
    # Create new admin user
    admin_user = User(
        email=email,
        name=name,
        hashed_password=hash_password(password),
        is_admin=True,
        is_active=True,
        provider='local'
    )
    
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)
    
    return {
        "message": "Admin user created successfully",
        "email": admin_user.email,
        "name": admin_user.name
    }


@router.get("/stats", response_model=dict)
def get_system_statistics(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    """
    Get comprehensive system statistics
    Admin only
    """
    # User statistics
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    inactive_users = total_users - active_users
    admin_users = db.query(User).filter(User.is_admin == True).count()
    
    # New users in last 30 days
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    new_users_30d = db.query(User).filter(User.created_at >= thirty_days_ago).count()
    
    # Transaction statistics
    total_expenses = db.query(Expense).count()
    total_income = db.query(Income).count()
    total_budgets = db.query(Budget).count()
    total_savings_goals = db.query(SavingsGoal).count()
    total_recurring = db.query(RecurringTransaction).count()
    
    # Financial statistics
    total_expense_amount = db.query(func.sum(Expense.amount)).scalar() or 0
    total_income_amount = db.query(func.sum(Income.amount)).scalar() or 0
    
    # Active recurring transactions
    active_recurring = db.query(RecurringTransaction).filter(
        RecurringTransaction.is_active == True
    ).count()
    
    # Active budgets
    active_budgets = db.query(Budget).filter(
        Budget.period_end >= datetime.utcnow().date()
    ).count()
    
    # Active savings goals
    active_savings_goals = db.query(SavingsGoal).filter(
        SavingsGoal.status == 'active'
    ).count()
    
    return {
        "users": {
            "total": total_users,
            "active": active_users,
            "inactive": inactive_users,
            "admins": admin_users,
            "new_last_30_days": new_users_30d
        },
        "transactions": {
            "total_expenses": total_expenses,
            "total_income": total_income,
            "total_budgets": total_budgets,
            "total_savings_goals": total_savings_goals,
            "total_recurring": total_recurring
        },
        "financial": {
            "total_expense_amount": round(total_expense_amount, 2),
            "total_income_amount": round(total_income_amount, 2),
            "net_balance": round(total_income_amount - total_expense_amount, 2)
        },
        "active": {
            "recurring_transactions": active_recurring,
            "budgets": active_budgets,
            "savings_goals": active_savings_goals
        }
    }

@router.get("/users", response_model=dict)
def list_all_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    is_admin: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    """
    List all users with filtering and pagination
    Admin only
    """
    # Build query
    query = db.query(User)
    
    # Apply filters
    if search:
        query = query.filter(
            (User.email.contains(search)) | 
            (User.name.contains(search) if User.name else False)
        )
    
    if is_active is not None:
        query = query.filter(User.is_active == is_active)
    
    if is_admin is not None:
        query = query.filter(User.is_admin == is_admin)
    
    # Get total count
    total = query.count()
    
    # Get paginated results
    users = query.order_by(User.created_at.desc()).offset(skip).limit(limit).all()
    
    # Format user data
    user_list = []
    for user in users:
        # Get user statistics
        expense_count = db.query(Expense).filter(Expense.user_id == user.id).count()
        income_count = db.query(Income).filter(Income.user_id == user.id).count()
        budget_count = db.query(Budget).filter(Budget.user_id == user.id).count()
        
        user_list.append({
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "phone_number": user.phone_number,
            "provider": user.provider,
            "is_active": user.is_active,
            "is_admin": user.is_admin,
            "created_at": user.created_at.isoformat(),
            "stats": {
                "expenses": expense_count,
                "income": income_count,
                "budgets": budget_count
            }
        })
    
    return {
        "users": user_list,
        "total": total,
        "skip": skip,
        "limit": limit
    }

@router.get("/users/{user_id}", response_model=dict)
def get_user_details(
    user_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    """
    Get detailed information about a specific user
    Admin only
    """
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise NotFoundException("User not found")
    
    # Get comprehensive statistics
    expense_count = db.query(Expense).filter(Expense.user_id == user.id).count()
    income_count = db.query(Income).filter(Income.user_id == user.id).count()
    budget_count = db.query(Budget).filter(Budget.user_id == user.id).count()
    savings_goal_count = db.query(SavingsGoal).filter(SavingsGoal.user_id == user.id).count()
    recurring_count = db.query(RecurringTransaction).filter(RecurringTransaction.user_id == user.id).count()
    
    # Financial totals
    total_expenses = db.query(func.sum(Expense.amount)).filter(Expense.user_id == user.id).scalar() or 0
    total_income = db.query(func.sum(Income.amount)).filter(Income.user_id == user.id).scalar() or 0
    
    # Recent activity
    recent_expenses = db.query(Expense).filter(Expense.user_id == user.id).order_by(Expense.date.desc()).limit(5).all()
    recent_income = db.query(Income).filter(Income.user_id == user.id).order_by(Income.date.desc()).limit(5).all()
    
    return {
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "phone_number": user.phone_number,
            "provider": user.provider,
            "is_active": user.is_active,
            "is_admin": user.is_admin,
            "created_at": user.created_at.isoformat()
        },
        "statistics": {
            "expenses": expense_count,
            "income": income_count,
            "budgets": budget_count,
            "savings_goals": savings_goal_count,
            "recurring_transactions": recurring_count,
            "total_expense_amount": round(total_expenses, 2),
            "total_income_amount": round(total_income, 2),
            "net_balance": round(total_income - total_expenses, 2)
        },
        "recent_activity": {
            "expenses": [
                {
                    "id": e.id,
                    "title": e.title,
                    "amount": e.amount,
                    "category": e.category,
                    "date": e.date.isoformat()
                }
                for e in recent_expenses
            ],
            "income": [
                {
                    "id": i.id,
                    "amount": i.amount,
                    "source": i.source,
                    "date": i.date.isoformat()
                }
                for i in recent_income
            ]
        }
    }

@router.put("/users/{user_id}/toggle-active", response_model=dict)
def toggle_user_active_status(
    user_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    """
    Toggle user active/inactive status (block/unblock)
    Admin only
    """
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise NotFoundException("User not found")
    
    # Prevent admin from deactivating themselves
    if user.id == admin_user.id:
        raise Exception("Cannot deactivate your own account")
    
    # Toggle status
    user.is_active = not user.is_active
    db.commit()
    db.refresh(user)
    
    return {
        "message": f"User {'activated' if user.is_active else 'deactivated'} successfully",
        "user_id": user.id,
        "is_active": user.is_active
    }

@router.put("/users/{user_id}/toggle-admin", response_model=dict)
def toggle_user_admin_status(
    user_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    """
    Toggle user admin status
    Admin only
    """
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise NotFoundException("User not found")
    
    # Prevent admin from removing their own admin status
    if user.id == admin_user.id:
        raise Exception("Cannot modify your own admin status")
    
    # Toggle admin status
    user.is_admin = not user.is_admin
    db.commit()
    db.refresh(user)
    
    return {
        "message": f"User admin status {'granted' if user.is_admin else 'revoked'} successfully",
        "user_id": user.id,
        "is_admin": user.is_admin
    }

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    """
    Delete a user and all their data
    Admin only - use with caution
    """
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise NotFoundException("User not found")
    
    # Prevent admin from deleting themselves
    if user.id == admin_user.id:
        raise Exception("Cannot delete your own account")
    
    # Delete user (cascade will delete all related data)
    db.delete(user)
    db.commit()
    
    return None

@router.get("/categories/usage", response_model=dict)
def get_category_usage_statistics(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    """
    Get usage statistics for all expense categories
    Admin only
    """
    # Get category usage
    category_stats = db.query(
        Expense.category,
        func.count(Expense.id).label('count'),
        func.sum(Expense.amount).label('total_amount'),
        func.avg(Expense.amount).label('avg_amount')
    ).group_by(Expense.category).all()
    
    categories = []
    for stat in category_stats:
        categories.append({
            "category": stat.category,
            "count": stat.count,
            "total_amount": round(stat.total_amount, 2),
            "average_amount": round(stat.avg_amount, 2)
        })
    
    # Sort by count descending
    categories.sort(key=lambda x: x['count'], reverse=True)
    
    return {
        "categories": categories,
        "total_categories": len(categories)
    }

@router.get("/activity/recent", response_model=dict)
def get_recent_system_activity(
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    """
    Get recent system activity across all users
    Admin only
    """
    # Get recent expenses
    recent_expenses = db.query(Expense).order_by(Expense.created_at.desc()).limit(limit).all()
    
    # Get recent income
    recent_income = db.query(Income).order_by(Income.created_at.desc()).limit(limit).all()
    
    # Get recent users
    recent_users = db.query(User).order_by(User.created_at.desc()).limit(10).all()
    
    return {
        "recent_expenses": [
            {
                "id": e.id,
                "user_id": e.user_id,
                "title": e.title,
                "amount": e.amount,
                "category": e.category,
                "date": e.date.isoformat(),
                "created_at": e.created_at.isoformat()
            }
            for e in recent_expenses
        ],
        "recent_income": [
            {
                "id": i.id,
                "user_id": i.user_id,
                "amount": i.amount,
                "source": i.source,
                "date": i.date.isoformat(),
                "created_at": i.created_at.isoformat()
            }
            for i in recent_income
        ],
        "recent_users": [
            {
                "id": u.id,
                "email": u.email,
                "name": u.name,
                "provider": u.provider,
                "created_at": u.created_at.isoformat()
            }
            for u in recent_users
        ]
    }
