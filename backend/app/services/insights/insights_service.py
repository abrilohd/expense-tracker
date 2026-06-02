"""
Insights Engine - Rule-based spending pattern analysis service
"""
from typing import List
from datetime import datetime, timedelta
from collections import defaultdict
from app.schemas.insights import Insight
from app.models.expense import Expense

class InsightsEngine:
    """
    Analyzes user spending patterns and generates actionable insights
    """
    
    def __init__(self, expenses: List[Expense], period_days: int = 30):
        """
        Initialize the insights engine with user expenses
        
        Args:
            expenses: List of user's expense records
            period_days: Analysis window in days
        """
        self.expenses = expenses
        self.period_days = period_days
        self.insights: List[Insight] = []
        
        # Calculate date boundaries
        self.today = datetime.now().date()
        self.period_start = self.today - timedelta(days=period_days)
        
        # Filter expenses within the analysis period
        self.current_expenses = [
            e for e in expenses 
            if e.date >= self.period_start
        ]
    
    def generate_insights(self) -> List[Insight]:
        """
        Run all insight rules and return triggered insights
        """
        self.insights = []
        
        # RULE 8: Check if user has no expenses (run first)
        if not self.current_expenses:
            self.insights.append(Insight(
                type="info",
                title="No expenses recorded",
                message=f"No expenses recorded in the last {self.period_days} days. Start tracking to get insights!",
                value=None
            ))
            return self.insights
        
        # Run all insight rules
        self._rule_top_spending_category()
        self._rule_spending_increase_warning()
        self._rule_spending_decrease_success()
        self._rule_daily_average_tip()
        self._rule_big_transaction_warning()
        self._rule_most_active_category()
        self._rule_weekend_vs_weekday_spending()
        
        # Ensure at least one insight is returned
        if not self.insights:
            total = sum(e.amount for e in self.current_expenses)
            self.insights.append(Insight(
                type="info",
                title="Spending tracked",
                message=f"You have tracked {len(self.current_expenses)} expenses totaling ${total:.2f} in the last {self.period_days} days.",
                value=total
            ))
        
        return self.insights
    
    def _rule_top_spending_category(self):
        """
        RULE 1: Identify the category with highest spending percentage
        """
        if not self.current_expenses:
            return
        
        # Calculate total per category
        category_totals = defaultdict(float)
        for expense in self.current_expenses:
            category_totals[expense.category] += expense.amount
        
        # Find top category
        total_spending = sum(category_totals.values())
        if total_spending == 0:
            return
        
        top_category = max(category_totals.items(), key=lambda x: x[1])
        percentage = (top_category[1] / total_spending) * 100
        
        self.insights.append(Insight(
            type="info",
            title="Top spending category",
            message=f"You spent {percentage:.1f}% of your budget on {top_category[0]} this period",
            value=round(percentage, 1)
        ))
    
    def _rule_spending_increase_warning(self):
        """
        RULE 2: Warn if spending increased by more than 20% compared to previous period
        """
        # Calculate current period total
        current_total = sum(e.amount for e in self.current_expenses)
        
        # Calculate previous period total
        previous_start = self.period_start - timedelta(days=self.period_days)
        previous_expenses = [
            e for e in self.expenses 
            if previous_start <= e.date < self.period_start
        ]
        
        if not previous_expenses:
            return
        
        previous_total = sum(e.amount for e in previous_expenses)
        if previous_total == 0:
            return
        
        # Calculate percentage change
        change = ((current_total - previous_total) / previous_total) * 100
        
        if change > 20:
            self.insights.append(Insight(
                type="warning",
                title="Spending increased",
                message=f"Your spending increased by {change:.1f}% compared to the previous period",
                value=round(change, 1)
            ))
    
    def _rule_spending_decrease_success(self):
        """
        RULE 3: Celebrate if spending decreased by more than 10% compared to previous period
        """
        # Calculate current period total
        current_total = sum(e.amount for e in self.current_expenses)
        
        # Calculate previous period total
        previous_start = self.period_start - timedelta(days=self.period_days)
        previous_expenses = [
            e for e in self.expenses 
            if previous_start <= e.date < self.period_start
        ]
        
        if not previous_expenses:
            return
        
        previous_total = sum(e.amount for e in previous_expenses)
        if previous_total == 0:
            return
        
        # Calculate percentage change
        change = ((previous_total - current_total) / previous_total) * 100
        
        if change > 10:
            self.insights.append(Insight(
                type="success",
                title="Spending reduced",
                message=f"Great job! You reduced spending by {change:.1f}% this period",
                value=round(change, 1)
            ))
    
    def _rule_daily_average_tip(self):
        """
        RULE 4: Calculate and report daily average spending
        """
        if not self.current_expenses:
            return
        
        total = sum(e.amount for e in self.current_expenses)
        daily_average = total / self.period_days
        
        self.insights.append(Insight(
            type="info",
            title="Daily average spending",
            message=f"You are spending an average of ${daily_average:.2f} per day this period",
            value=round(daily_average, 2)
        ))
    
    def _rule_big_transaction_warning(self):
        """
        RULE 5: Warn about large transactions (>30% of period total)
        """
        if not self.current_expenses:
            return
        
        total = sum(e.amount for e in self.current_expenses)
        if total == 0:
            return
        
        # Find expenses that are more than 30% of total
        for expense in self.current_expenses:
            percentage = (expense.amount / total) * 100
            if percentage > 30:
                self.insights.append(Insight(
                    type="warning",
                    title="Large expense detected",
                    message=f"Large expense detected: '{expense.title}' was {percentage:.1f}% of your spending this period",
                    value=round(percentage, 1)
                ))
                break  # Only report the first large transaction
    
    def _rule_most_active_category(self):
        """
        RULE 6: Identify category with most transactions
        """
        if not self.current_expenses:
            return
        
        # Count transactions per category
        category_counts = defaultdict(int)
        for expense in self.current_expenses:
            category_counts[expense.category] += 1
        
        # Find most active category
        most_active = max(category_counts.items(), key=lambda x: x[1])
        
        if most_active[1] > 1:  # Only show if more than 1 transaction
            self.insights.append(Insight(
                type="tip",
                title="Most active category",
                message=f"You made the most transactions in {most_active[0]} ({most_active[1]} purchases)",
                value=float(most_active[1])
            ))
    
    def _rule_weekend_vs_weekday_spending(self):
        """
        RULE 7: Compare weekend vs weekday spending patterns
        """
        if not self.current_expenses:
            return
        
        weekend_total = 0.0
        weekend_count = 0
        weekday_total = 0.0
        weekday_count = 0
        
        for expense in self.current_expenses:
            # Convert date to datetime to get weekday (0=Monday, 6=Sunday)
            expense_datetime = datetime.combine(expense.date, datetime.min.time())
            weekday = expense_datetime.weekday()
            
            if weekday >= 5:  # Saturday (5) or Sunday (6)
                weekend_total += expense.amount
                weekend_count += 1
            else:
                weekday_total += expense.amount
                weekday_count += 1
        
        # Calculate averages
        if weekend_count == 0 or weekday_count == 0:
            return
        
        weekend_avg = weekend_total / weekend_count
        weekday_avg = weekday_total / weekday_count
        
        # Check if weekend spending is significantly higher
        if weekend_avg > weekday_avg * 2:
            self.insights.append(Insight(
                type="tip",
                title="Weekend spending pattern",
                message="You tend to spend more on weekends",
                value=round(weekend_avg, 2)
            ))
