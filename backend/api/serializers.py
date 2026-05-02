from rest_framework import serializers
from .models import Expense, Income, Budget

class ExpenseSerializer(serializers.ModelSerializer):
    user_id = serializers.ReadOnlyField(source='user.id')

    class Meta:
        model = Expense
        fields = ['id', 'user_id', 'title', 'amount', 'category', 'date', 'notes', 'created_at']
        read_only_fields = ['id', 'user_id', 'created_at']

class IncomeSerializer(serializers.ModelSerializer):
    user_id = serializers.ReadOnlyField(source='user.id')

    class Meta:
        model = Income
        fields = ['id', 'user_id', 'amount', 'source', 'date', 'notes', 'created_at']
        read_only_fields = ['id', 'user_id', 'created_at']

class BudgetSerializer(serializers.ModelSerializer):
    user_id = serializers.ReadOnlyField(source='user.id')

    class Meta:
        model = Budget
        fields = ['id', 'user_id', 'category', 'month', 'amount', 'created_at']
        read_only_fields = ['id', 'user_id', 'created_at']