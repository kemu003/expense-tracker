"""
Demo account utilities for the SpendWise application.
Handles creation and management of demo user accounts with sample data.
"""

from django.contrib.auth.models import User
from django.utils import timezone
from datetime import datetime, timedelta
from decimal import Decimal
from .models import Expense, Income, Budget


DEMO_USER_EMAIL = 'demo@example.com'
DEMO_USER_PASSWORD = 'demo123'
DEMO_USER_NAME = 'Demo User'


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
    """Create sample expense data for the demo user."""
    # Clear existing demo expenses
    Expense.objects.filter(user=demo_user).delete()
    
    today = timezone.now().date()
    
    sample_expenses = [
        # Recent expenses
        {
            'title': 'Lunch at Cafe',
            'amount': Decimal('12.50'),
            'currency': 'USD',
            'category': 'Food',
            'date': today,
            'notes': 'Casual lunch with colleagues',
        },
        {
            'title': 'Uber to Office',
            'amount': Decimal('8.75'),
            'currency': 'USD',
            'category': 'Transport',
            'date': today,
            'notes': 'Morning commute',
        },
        {
            'title': 'Electricity Bill',
            'amount': Decimal('85.00'),
            'currency': 'USD',
            'category': 'Bills',
            'date': today - timedelta(days=1),
            'notes': 'Monthly electricity',
        },
        {
            'title': 'Movie Tickets',
            'amount': Decimal('28.00'),
            'currency': 'USD',
            'category': 'Entertainment',
            'date': today - timedelta(days=2),
            'notes': 'Cinema with friends',
        },
        {
            'title': 'Gym Membership',
            'amount': Decimal('45.00'),
            'currency': 'USD',
            'category': 'Health',
            'date': today - timedelta(days=3),
            'notes': 'Monthly subscription',
        },
        {
            'title': 'Groceries',
            'amount': Decimal('65.30'),
            'currency': 'USD',
            'category': 'Food',
            'date': today - timedelta(days=4),
            'notes': 'Weekly grocery shopping',
        },
        {
            'title': 'Internet Bill',
            'amount': Decimal('60.00'),
            'currency': 'USD',
            'category': 'Bills',
            'date': today - timedelta(days=5),
            'notes': 'Monthly internet',
        },
        {
            'title': 'Shopping - Clothes',
            'amount': Decimal('120.00'),
            'currency': 'USD',
            'category': 'Shopping',
            'date': today - timedelta(days=6),
            'notes': 'Summer collection',
        },
        {
            'title': 'Coffee',
            'amount': Decimal('4.50'),
            'currency': 'USD',
            'category': 'Food',
            'date': today - timedelta(days=7),
            'notes': 'Morning coffee',
        },
        {
            'title': 'Gas',
            'amount': Decimal('50.00'),
            'currency': 'USD',
            'category': 'Transport',
            'date': today - timedelta(days=8),
            'notes': 'Car refuel',
        },
        {
            'title': 'Restaurant Dinner',
            'amount': Decimal('75.00'),
            'currency': 'USD',
            'category': 'Food',
            'date': today - timedelta(days=9),
            'notes': 'Dinner with family',
        },
        {
            'title': 'Book Purchase',
            'amount': Decimal('25.99'),
            'currency': 'USD',
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
    """Create sample income data for the demo user."""
    # Clear existing demo income
    Income.objects.filter(user=demo_user).delete()
    
    today = timezone.now().date()
    
    sample_income = [
        {
            'amount': Decimal('3000.00'),
            'currency': 'USD',
            'source': 'Monthly Salary',
            'date': today - timedelta(days=15),
            'notes': 'Regular salary payment',
        },
        {
            'amount': Decimal('250.00'),
            'currency': 'USD',
            'source': 'Freelance Project',
            'date': today - timedelta(days=5),
            'notes': 'Web design project',
        },
        {
            'amount': Decimal('100.00'),
            'currency': 'USD',
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
    """Create sample budget data for the demo user."""
    # Clear existing demo budgets
    Budget.objects.filter(user=demo_user).delete()
    
    today = timezone.now().date()
    current_month = today.strftime('%Y-%m')
    
    sample_budgets = [
        {
            'category': 'Food',
            'month': current_month,
            'amount': Decimal('300.00'),
            'currency': 'USD',
        },
        {
            'category': 'Transport',
            'month': current_month,
            'amount': Decimal('200.00'),
            'currency': 'USD',
        },
        {
            'category': 'Entertainment',
            'month': current_month,
            'amount': Decimal('150.00'),
            'currency': 'USD',
        },
        {
            'category': 'Shopping',
            'month': current_month,
            'amount': Decimal('250.00'),
            'currency': 'USD',
        },
        {
            'category': 'Health',
            'month': current_month,
            'amount': Decimal('200.00'),
            'currency': 'USD',
        },
        {
            'category': 'Bills',
            'month': current_month,
            'amount': Decimal('400.00'),
            'currency': 'USD',
        },
    ]
    
    created_budgets = []
    for bud_data in sample_budgets:
        budget = Budget.objects.create(user=demo_user, **bud_data)
        created_budgets.append(budget)
    
    return created_budgets


def setup_demo_account():
    """Set up or reset the complete demo account with sample data."""
    demo_user, created = create_or_update_demo_user()
    
    # Create sample data
    expenses = create_sample_expenses(demo_user)
    income = create_sample_income(demo_user)
    budgets = create_sample_budgets(demo_user)
    
    return {
        'user': demo_user,
        'created': created,
        'expenses': len(expenses),
        'income': len(income),
        'budgets': len(budgets),
    }
