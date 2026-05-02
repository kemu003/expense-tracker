from django.contrib import admin
from .models import Expense, Income, Budget

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ['title', 'amount', 'category', 'date', 'user']
    list_filter = ['category', 'date', 'user']
    search_fields = ['title', 'notes']

@admin.register(Income)
class IncomeAdmin(admin.ModelAdmin):
    list_display = ['source', 'amount', 'date', 'user']
    list_filter = ['date', 'user']
    search_fields = ['source', 'notes']

@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ['category', 'month', 'amount', 'user']
    list_filter = ['category', 'month', 'user']