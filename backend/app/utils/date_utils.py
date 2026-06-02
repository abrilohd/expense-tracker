"""
Date and time utility functions
"""
from datetime import datetime, date, timedelta, timezone
from typing import Tuple


def get_current_utc_datetime() -> datetime:
    """
    Get current UTC datetime without timezone info (for SQLite compatibility)
    """
    return datetime.now(timezone.utc).replace(tzinfo=None)


def get_current_date() -> date:
    """
    Get current date
    """
    return date.today()


def get_month_range(year: int, month: int) -> Tuple[date, date]:
    """
    Get the first and last day of a given month
    
    Args:
        year: Year (e.g., 2024)
        month: Month (1-12)
    
    Returns:
        Tuple of (first_day, last_day) of the month
    """
    first_day = date(year, month, 1)
    
    # Get last day by going to first day of next month and subtracting 1 day
    if month == 12:
        last_day = date(year + 1, 1, 1) - timedelta(days=1)
    else:
        last_day = date(year, month + 1, 1) - timedelta(days=1)
    
    return first_day, last_day


def get_current_month_range() -> Tuple[date, date]:
    """
    Get the first and last day of the current month
    
    Returns:
        Tuple of (first_day, last_day) of current month
    """
    today = get_current_date()
    return get_month_range(today.year, today.month)


def get_date_range_days(start_date: date, end_date: date) -> int:
    """
    Calculate number of days between two dates
    
    Args:
        start_date: Start date
        end_date: End date
    
    Returns:
        Number of days (inclusive)
    """
    return (end_date - start_date).days + 1


def is_date_in_range(check_date: date, start_date: date, end_date: date) -> bool:
    """
    Check if a date falls within a date range (inclusive)
    
    Args:
        check_date: Date to check
        start_date: Range start date
        end_date: Range end date
    
    Returns:
        True if date is in range, False otherwise
    """
    return start_date <= check_date <= end_date


def add_months(source_date: date, months: int) -> date:
    """
    Add months to a date
    
    Args:
        source_date: Starting date
        months: Number of months to add (can be negative)
    
    Returns:
        New date with months added
    """
    month = source_date.month - 1 + months
    year = source_date.year + month // 12
    month = month % 12 + 1
    day = min(source_date.day, [31, 29 if year % 4 == 0 and (year % 100 != 0 or year % 400 == 0) else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1])
    return date(year, month, day)
