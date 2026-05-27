# app/services/recurring_engine.py
from datetime import date, timedelta
from typing import List
from sqlalchemy.orm import Session

from app.models.recurring import RecurringTransaction
from app.models.transaction import Transaction


def should_generate(recurring: RecurringTransaction, today: date) -> bool:
    if not recurring.is_active:
        return False

    if recurring.end_date and today > recurring.end_date:
        return False

    if recurring.start_date > today:
        return False

    return True


def next_occurrence_date(recurring: RecurringTransaction, last_date: date) -> date:
    if recurring.frequency == "daily":
        return last_date + timedelta(days=1)

    if recurring.frequency == "weekly":
        return last_date + timedelta(weeks=1)

    if recurring.frequency == "monthly":
        return last_date + timedelta(days=30)

    if recurring.frequency == "yearly":
        return last_date + timedelta(days=365)

    return last_date


def generate_due_transactions(db: Session, today: date):
    recurrences = db.query(RecurringTransaction).all()

    created = []

    for r in recurrences:
        if not should_generate(r, today):
            continue

        # prevent duplicate generation
        if r.last_generated_at and r.last_generated_at.date() == today:
            continue

        # create transaction
        txn = Transaction(
            user_id=r.user_id,
            title=r.title,
            amount=r.amount,
            transaction_type=r.transaction_type,
            category_or_source=r.category_or_source,
            description=r.description,
            payment_method=r.payment_method,
            date=today
        )

        db.add(txn)

        # update tracking
        r.last_generated_at = today

        created.append(txn)

    db.commit()
    return created