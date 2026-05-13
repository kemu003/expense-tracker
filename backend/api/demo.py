"""
Demo account utilities for the SpendWise application.
Handles creation and management of demo user accounts with sample data.

All demo data uses Kenya Shilling (KES) currency exclusively.
"""

from django.contrib.auth.models import User
from django.utils import timezone
from datetime import datetime, timedelta
from decimal import Decimal
from .models import Expense, Income, Budget


# Demo Configuration
DEMO_USER_EMAIL = 'demo@example.com'
DEMO_USER_PASSWORD = 'demo123'
DEMO_USER_NAME = 'Demo User'
DEMO_CURRENCY = 'KES'  # Kenya Shilling - all demo data uses KES
DEMO_CURRENCY_SYMBOL = 'KSh'
DEMO_LOCALE = 'en-KE'


def create_or_update_demo_user():
    """Create or update the demo user account."""
    demo_user, created = User.objects.get_or_create(
        username=DEMO_USER_EMAIL,
        defaults={
            'email': DEMO_USER_EMAIL,
            'first_name': DEMO_USER_NAME,
            'is_active': True,
        }
    )
    
    # Update password (in case it was changed)
    demo_user.set_password(DEMO_USER_PASSWORD)
    demo_user.save()
    
    return demo_user, created


def create_sample_expenses(demo_user):
    """Create sample expense data for the demo user in KES (Kenya Shilling)."""
    # Clear existing demo expenses
    Expense.objects.filter(user=demo_user).delete()
    
    today = timezone.now().date()
    
    sample_expenses = [
        # Recent expenses in KES
        {
            'title': 'Lunch at Cafe',
            'amount': Decimal('1625.00'),
            'currency': DEMO_CURRENCY,
            'category': 'Food',
            'date': today,
            'notes': 'Casual lunch with colleagues',
        },
        {
            'title': 'Uber to Office',
            'amount': Decimal('1138.00'),
            'currency': DEMO_CURRENCY,
            'category': 'Transport',
            'date': today,
            'notes': 'Morning commute',
        },
        {
            'title': 'Electricity Bill',
            'amount': Decimal('11050.00'),
            'currency': DEMO_CURRENCY,
            'category': 'Bills',
            'date': today - timedelta(days=1),
            'notes': 'Monthly electricity',
        },
        {
            'title': 'Movie Tickets',
            'amount': Decimal('3640.00'),
            'currency': DEMO_CURRENCY,
            'category': 'Entertainment',
            'date': today - timedelta(days=2),
            'notes': 'Cinema with friends',
        },
        {
            'title': 'Gym Membership',
            'amount': Decimal('5850.00'),
            'currency': DEMO_CURRENCY,
            'category': 'Health',
            'date': today - timedelta(days=3),
            'notes': 'Monthly subscription',
        },
        {
            'title': 'Groceries',
            'amount': Decimal('8490.00'),
            'currency': DEMO_CURRENCY,
            'category': 'Food',
            'date': today - timedelta(days=4),
            'notes': 'Weekly grocery shopping',
        },
        {
            'title': 'Internet Bill',
            'amount': Decimal('7800.00'),
            'currency': DEMO_CURRENCY,
            'category': 'Bills',
            'date': today - timedelta(days=5),
            'notes': 'Monthly internet',
        },
        {
            'title': 'Shopping - Clothes',
            'amount': Decimal('15600.00'),
            'currency': DEMO_CURRENCY,
            'category': 'Shopping',
            'date': today - timedelta(days=6),
            'notes': 'Summer collection',
        },
        {
            'title': 'Coffee',
            'amount': Decimal('585.00'),
            'currency': DEMO_CURRENCY,
            'category': 'Food',
            'date': today - timedelta(days=7),
            'notes': 'Morning coffee',
        },
        {
            'title': 'Fuel',
            'amount': Decimal('6500.00'),
            'currency': DEMO_CURRENCY,
            'category': 'Transport',
            'date': today - timedelta(days=8),
            'notes': 'Car refuel',
        },
        {
            'title': 'Restaurant Dinner',
            'amount': Decimal('9750.00'),
            'currency': DEMO_CURRENCY,
            'category': 'Food',
            'date': today - timedelta(days=9),
            'notes': 'Dinner with family',
        },
        {
            'title': 'Book Purchase',
            'amount': Decimal('3379.00'),
            'currency': DEMO_CURRENCY,
            'category': 'Shopping',
            'date': today - timedelta(days=10),
            'notes': 'Self-help book',
        },
    ]
    
    created_expenses = []
    for exp_data in sample_expenses:
        expense = Expense.objects.create(user=demo_user, **exp_data)
        created_expenses.append(expense)
    
    return created_expenses


def create_sample_income(demo_user):
    """Create sample income data for the demo user in KES (Kenya Shilling)."""
    # Clear existing demo income
    Income.objects.filter(user=demo_user).delete()
    
    today = timezone.now().date()
    
    sample_income = [
        {
            'amount': Decimal('390000.00'),
            'currency': DEMO_CURRENCY,
            'source': 'Monthly Salary',
            'date': today - timedelta(days=15),
            'notes': 'Regular salary payment',
        },
        {
            'amount': Decimal('32500.00'),
            'currency': DEMO_CURRENCY,
            'source': 'Freelance Project',
            'date': today - timedelta(days=5),
            'notes': 'Web design project',
        },
        {
            'amount': Decimal('13000.00'),
            'currency': DEMO_CURRENCY,
            'source': 'Cashback Rewards',
            'date': today - timedelta(days=2),
            'notes': 'Credit card rewards',
        },
    ]
    
    created_income = []
    for inc_data in sample_income:
        income = Income.objects.create(user=demo_user, **inc_data)
        created_income.append(income)
    
    return created_income


def create_sample_budgets(demo_user):
    """Create sample budget data for the demo user in KES (Kenya Shilling)."""
    # Clear existing demo budgets
    Budget.objects.filter(user=demo_user).delete()
    
    today = timezone.now().date()
    current_month = today.strftime('%Y-%m')
    
    sample_budgets = [
        {
            'category': 'Food',
            'month': current_month,
            'amount': Decimal('39000.00'),
            'currency': DEMO_CURRENCY,
        },
        {
            'category': 'Transport',
            'month': current_month,
            'amount': Decimal('26000.00'),
            'currency': DEMO_CURRENCY,
        },
        {
            'category': 'Entertainment',
            'month': current_month,
            'amount': Decimal('19500.00'),
            'currency': DEMO_CURRENCY,
        },
        {
            'category': 'Shopping',
            'month': current_month,
            'amount': Decimal('32500.00'),
            'currency': DEMO_CURRENCY,
        },
        {
            'category': 'Health',
            'month': current_month,
            'amount': Decimal('26000.00'),
            'currency': DEMO_CURRENCY,
        },
        {
            'category': 'Bills',
            'month': current_month,
            'amount': Decimal('52000.00'),
            'currency': DEMO_CURRENCY,
        },
    ]
    
    created_budgets = []
    for bud_data in sample_budgets:
        budget = Budget.objects.create(user=demo_user, **bud_data)
        created_budgets.append(budget)
    
    return created_budgets


def normalize_demo_currency_to_kes(demo_user):
    """
    Ensure all demo user records use KES currency exclusively.
    Fixes any mixed currency data from previous imports or migrations.
    """
    # Update all demo expenses to KES
    Expense.objects.filter(user=demo_user).exclude(currency=DEMO_CURRENCY).update(
        currency=DEMO_CURRENCY
    )
    
    # Update all demo income to KES
    Income.objects.filter(user=demo_user).exclude(currency=DEMO_CURRENCY).update(
        currency=DEMO_CURRENCY
    )
    
    # Update all demo budgets to KES
    Budget.objects.filter(user=demo_user).exclude(currency=DEMO_CURRENCY).update(
        currency=DEMO_CURRENCY
    )
    
    logger_info = (
        f"✅ Normalized demo currency to {DEMO_CURRENCY} for user {demo_user.email}"
    )
    return logger_info


def setup_demo_account():
    """Set up or reset the complete demo account with sample data."""
    demo_user, created = create_or_update_demo_user()
    
    # Create sample data
    expenses = create_sample_expenses(demo_user)
    income = create_sample_income(demo_user)
    budgets = create_sample_budgets(demo_user)
    
    # Normalize any existing demo records to KES
    try:
        normalize_demo_currency_to_kes(demo_user)
    except Exception:
        # Continue even if normalization fails for non-demo records
        pass
    
    return {
        'user': demo_user,
        'created': created,
        'expenses': len(expenses),
        'income': len(income),
        'budgets': len(budgets),
    }
