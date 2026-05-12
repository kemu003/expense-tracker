"""
Management command to set up the demo account with sample data.

Usage: python manage.py setup_demo
"""

from django.core.management.base import BaseCommand
from api.demo import setup_demo_account


class Command(BaseCommand):
    help = 'Set up or reset the demo account with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Setting up demo account...')
        
        result = setup_demo_account()
        
        self.stdout.write(self.style.SUCCESS('✅ Demo account setup complete!'))
        self.stdout.write(f'   User: {result["user"].email}')
        self.stdout.write(f'   Created: {result["created"]}')
        self.stdout.write(f'   Sample Expenses: {result["expenses"]}')
        self.stdout.write(f'   Sample Income: {result["income"]}')
        self.stdout.write(f'   Sample Budgets: {result["budgets"]}')
        self.stdout.write('')
        self.stdout.write('Demo credentials:')
        self.stdout.write('  Email: demo@example.com')
        self.stdout.write('  Password: demo123')
