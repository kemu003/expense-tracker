from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes, csrf_exempt
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.db.models import Sum, Q
from django.utils import timezone
from datetime import timedelta, date
from calendar import monthrange
import logging
from .models import Expense, Income, Budget
from .serializers import ExpenseSerializer, IncomeSerializer, BudgetSerializer
from .permissions import IsOwner

logger = logging.getLogger('api')

class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        queryset = Expense.objects.filter(user=self.request.user)
        
        # Filtering
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        date_from = self.request.query_params.get('date_from', None)
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        
        date_to = self.request.query_params.get('date_to', None)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)
        
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(notes__icontains=search) |
                Q(category__icontains=search)
            )
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class IncomeViewSet(viewsets.ModelViewSet):
    serializer_class = IncomeSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        queryset = Income.objects.filter(user=self.request.user)
        
        # Filtering
        date_from = self.request.query_params.get('date_from', None)
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        
        date_to = self.request.query_params.get('date_to', None)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)
        
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(source__icontains=search) |
                Q(notes__icontains=search)
            )
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        queryset = Budget.objects.filter(user=self.request.user)
        
        month = self.request.query_params.get('month', None)
        if month:
            queryset = queryset.filter(month=month)
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def stats(self, request):
        user = request.user
        today = timezone.now().date()
        week_start = today - timedelta(days=today.weekday())
        month_start = today.replace(day=1)

        # Expenses
        today_exp = Expense.objects.filter(user=user, date=today).aggregate(Sum('amount'))['amount__sum'] or 0
        week_exp = Expense.objects.filter(user=user, date__gte=week_start).aggregate(Sum('amount'))['amount__sum'] or 0
        month_exp = Expense.objects.filter(user=user, date__gte=month_start).aggregate(Sum('amount'))['amount__sum'] or 0

        # Income
        month_inc = Income.objects.filter(user=user, date__gte=month_start).aggregate(Sum('amount'))['amount__sum'] or 0

        balance = month_inc - month_exp

        return Response({
            'today_expenses': today_exp,
            'week_expenses': week_exp,
            'month_expenses': month_exp,
            'month_income': month_inc,
            'balance': balance,
        })

class AnalyticsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def category_breakdown(self, request):
        user = request.user
        month_start = timezone.now().date().replace(day=1)
        
        expenses = Expense.objects.filter(user=user, date__gte=month_start)
        category_totals = expenses.values('category').annotate(total=Sum('amount')).order_by('-total')
        
        total = sum(item['total'] for item in category_totals)
        data = []
        for item in category_totals:
            data.append({
                'label': item['category'],
                'value': float(item['total']),
                'percentage': (item['total'] / total * 100) if total > 0 else 0,
            })
        
        return Response(data)

    @action(detail=False, methods=['get'])
    def monthly_trends(self, request):
        user = request.user
        today = timezone.now().date()
        months = []
        for i in range(5, -1, -1):
            year = today.year
            month = today.month - i
            while month <= 0:
                month += 12
                year -= 1
            months.append(f'{year}-{month:02}')
        
        expense_data = []
        income_data = []
        for month_str in months:
            year, mon = map(int, month_str.split('-'))
            start = date(year, mon, 1)
            end = date(year, mon, monthrange(year, mon)[1])
            
            exp_sum = Expense.objects.filter(user=user, date__gte=start, date__lte=end).aggregate(Sum('amount'))['amount__sum'] or 0
            inc_sum = Income.objects.filter(user=user, date__gte=start, date__lte=end).aggregate(Sum('amount'))['amount__sum'] or 0
            
            expense_data.append(float(exp_sum))
            income_data.append(float(inc_sum))
        
        return Response({
            'months': months,
            'expenses': expense_data,
            'income': income_data,
        })

@csrf_exempt
@api_view(['POST', 'OPTIONS'])
@permission_classes([AllowAny])
def register(request):
    # Handle preflight requests
    if request.method == 'OPTIONS':
        return Response(status=status.HTTP_200_OK)
    
    logger.debug(f"📝 Register request received | Content-Type: {request.META.get('CONTENT_TYPE')} | Data: {request.data}")
    
    email = request.data.get('email')
    password = request.data.get('password')
    name = request.data.get('name')
    
    logger.debug(f"🔍 Extracted fields | email: {email} | name: {name} | password_provided: {bool(password)}")
    
    if not email or not password or not name:
        error_msg = 'Email, password, and name are required'
        logger.warning(f"❌ Validation error: {error_msg}")
        return Response({'error': error_msg}, status=status.HTTP_400_BAD_REQUEST)
    
    if len(password) < 6:
        error_msg = 'Password must be at least 6 characters'
        logger.warning(f"❌ Validation error: {error_msg}")
        return Response({'error': error_msg}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(email=email).exists():
        error_msg = 'User with this email already exists'
        logger.warning(f"❌ Validation error: {error_msg} (email: {email})")
        return Response({'error': error_msg}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.create_user(username=email, email=email, password=password, first_name=name)
        logger.info(f"✅ User created successfully | ID: {user.id} | Email: {email}")
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        error_msg = f'Error creating user: {str(e)}'
        logger.error(f"❌ Exception during user creation: {error_msg}")
        return Response({'error': error_msg}, status=status.HTTP_400_BAD_REQUEST)