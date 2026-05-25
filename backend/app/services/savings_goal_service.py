"""
Savings Goal Service - Business logic for savings goals
"""
from datetime import date, datetime
from sqlalchemy.orm import Session
from app.models.savings_goal import SavingsGoal
from app.schemas.savings_goal import SavingsGoalResponse

class SavingsGoalService:
    """Service class for savings goal business logic"""
    
    @staticmethod
    def calculate_progress(goal: SavingsGoal) -> dict:
        """
        Calculate progress percentage and days remaining for a savings goal
        
        Args:
            goal: SavingsGoal model instance
            
        Returns:
            dict with progress_percentage, days_remaining, and is_overdue
        """
        # Calculate progress percentage
        if goal.target_amount > 0:
            progress_percentage = min((goal.current_amount / goal.target_amount) * 100, 100)
        else:
            progress_percentage = 0
        
        # Calculate days remaining (only if deadline exists)
        days_remaining = None
        is_overdue = False
        if goal.deadline:
            today = date.today()
            days_remaining = (goal.deadline - today).days
            is_overdue = days_remaining < 0 and goal.status == "active"
        
        return {
            "progress_percentage": round(progress_percentage, 2),
            "days_remaining": days_remaining,
            "is_overdue": is_overdue
        }
    
    @staticmethod
    def check_goal_completion(goal: SavingsGoal, db: Session) -> bool:
        """
        Check if goal is completed and update status if needed
        
        Args:
            goal: SavingsGoal model instance
            db: Database session
            
        Returns:
            True if goal was just completed, False otherwise
        """
        # Check if current amount meets or exceeds target
        if goal.current_amount >= goal.target_amount and goal.status == "active":
            goal.status = "completed"
            goal.completed_at = datetime.utcnow()
            db.commit()
            return True
        
        return False
    
    @staticmethod
    def enrich_goal_response(goal: SavingsGoal) -> dict:
        """
        Enrich a savings goal with computed fields for response
        
        Args:
            goal: SavingsGoal model instance
            
        Returns:
            dict with all goal fields plus computed fields
        """
        progress_data = SavingsGoalService.calculate_progress(goal)
        
        return {
            "id": goal.id,
            "user_id": goal.user_id,
            "name": goal.name,
            "target_amount": goal.target_amount,
            "current_amount": goal.current_amount,
            "saved_amount": goal.current_amount,  # Alias for frontend compatibility
            "deadline": goal.deadline,
            "status": goal.status,
            "created_at": goal.created_at,
            "completed_at": goal.completed_at,
            "emoji": goal.emoji,
            "color": goal.color,
            "progress_percentage": progress_data["progress_percentage"],
            "percentage": progress_data["progress_percentage"],  # Alias for frontend compatibility
            "days_remaining": progress_data["days_remaining"],
            "is_overdue": progress_data["is_overdue"]
        }
    
    @staticmethod
    def calculate_list_summary(goals: list[SavingsGoal]) -> dict:
        """
        Calculate summary statistics for a list of goals
        
        Args:
            goals: List of SavingsGoal model instances
            
        Returns:
            dict with total, active_count, completed_count, total_target, total_saved
        """
        total = len(goals)
        active_count = sum(1 for g in goals if g.status == "active")
        completed_count = sum(1 for g in goals if g.status == "completed")
        total_target = sum(g.target_amount for g in goals if g.status == "active")
        total_saved = sum(g.current_amount for g in goals if g.status == "active")
        
        return {
            "total": total,
            "active_count": active_count,
            "completed_count": completed_count,
            "total_target": round(total_target, 2),
            "total_saved": round(total_saved, 2)
        }
