"""
Recurring Transaction service - business logic for recurring transactions
"""
from sqlalchemy.orm import Session
from datetime import date, datetime, timedelta
from dateutil.relativedelta import relativedelta
from typing import List, Optional
import logging

from app.models.recurring_transaction import RecurringTransaction, Frequency, TransactionType
from app.models.expense import Expense
from app.models.income import Income

logger = logging.getLogger(__name__)

class RecurringService:
    """Service for managing recurring transactions"""
    
    @staticmethod
    def calculate_next_occurrence(current_date: date, frequency: Frequency) -> date:
        """
        Calculate next occurrence date based on frequency
        
        Args:
            current_date: Current occurrence date
            frequency: Recurrence frequency
            
        Returns:
            Next occurrence date
        """
        if frequency == Frequency.DAILY:
            return current_date + timedelta(days=1)
        elif frequency == Frequency.WEEKLY:
            return current_date + timedelta(weeks=1)
        elif frequency == Frequency.MONTHLY:
            return current_date + relativedelta(months=1)
        elif frequency == Frequency.YEARLY:
            return current_date + relativedelta(years=1)
        else:
            raise ValueError(f"Invalid frequency: {frequency}")
    
    @staticmethod
    def should_generate(recurring: RecurringTransaction, today: date = None) -> bool:
        """
        Check if recurring transaction should generate a new transaction
        
        Args:
            recurring: Recurring transaction instance
            today: Current date (defaults to today)
            
        Returns:
            True if should generate, False otherwise
        """
        if today is None:
            today = date.today()
        
        # Check if active
        if not recurring.is_active:
            return False
        
        # Check if next occurrence is today or in the past
        if recurring.next_occurrence > today:
            return False
        
        # Check if end date has passed
        if recurring.end_date and today > recurring.end_date:
            return False
        
        return True
    
    @staticmethod
    def generate_transaction(recurring: RecurringTransaction, db: Session) -> bool:
        """
        Generate a new expense or income from recurring transaction
        
        Args:
            recurring: Recurring transaction instance
            db: Database session
            
        Returns:
            True if generated successfully, False otherwise
        """
        try:
            if recurring.transaction_type == TransactionType.EXPENSE:
                # Create expense
                expense = Expense(
                    user_id=recurring.user_id,
                    title=recurring.title,
                    amount=recurring.amount,
                    category=recurring.category_or_source,
                    date=recurring.next_occurrence,
                    description=recurring.description
                )
                db.add(expense)
            
            elif recurring.transaction_type == TransactionType.INCOME:
                # Create income
                income = Income(
                    user_id=recurring.user_id,
                    amount=recurring.amount,
                    source=recurring.category_or_source,
                    date=recurring.next_occurrence,
                    description=recurring.description
                )
                db.add(income)
            
            # Update recurring transaction
            recurring.last_generated_at = datetime.utcnow()
            recurring.next_occurrence = RecurringService.calculate_next_occurrence(
                recurring.next_occurrence,
                recurring.frequency
            )
            
            # Check if should deactivate (past end date)
            if recurring.end_date and recurring.next_occurrence > recurring.end_date:
                recurring.is_active = False
            
            db.commit()
            return True
            
        except Exception as e:
            db.rollback()
            logger.error(f"Error generating transaction from recurring {recurring.id}: {e}")
            return False
    
    @staticmethod
    def process_due_recurring_transactions(db: Session, today: date = None) -> dict:
        """
        Process all due recurring transactions
        
        Args:
            db: Database session
            today: Current date (defaults to today)
            
        Returns:
            Dictionary with processing results
        """
        if today is None:
            today = date.today()
        
        # Get all active recurring transactions
        recurring_list = db.query(RecurringTransaction).filter(
            RecurringTransaction.is_active == True,
            RecurringTransaction.next_occurrence <= today
        ).all()
        
        results = {
            "total_processed": 0,
            "successful": 0,
            "failed": 0,
            "deactivated": 0
        }
        
        for recurring in recurring_list:
            results["total_processed"] += 1
            
            # Check if should generate
            if RecurringService.should_generate(recurring, today):
                success = RecurringService.generate_transaction(recurring, db)
                
                if success:
                    results["successful"] += 1
                    
                    # Check if was deactivated
                    if not recurring.is_active:
                        results["deactivated"] += 1
                else:
                    results["failed"] += 1
        
        return results
    
    @staticmethod
    def get_upcoming_occurrences(
        recurring: RecurringTransaction,
        count: int = 5
    ) -> List[date]:
        """
        Get list of upcoming occurrence dates
        
        Args:
            recurring: Recurring transaction instance
            count: Number of occurrences to return
            
        Returns:
            List of upcoming dates
        """
        occurrences = []
        current_date = recurring.next_occurrence
        
        for _ in range(count):
            # Check if past end date
            if recurring.end_date and current_date > recurring.end_date:
                break
            
            occurrences.append(current_date)
            current_date = RecurringService.calculate_next_occurrence(
                current_date,
                recurring.frequency
            )
        
        return occurrences
