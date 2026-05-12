from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from django.db.models import Sum, Q
from django.utils import timezone
from datetime import timedelta, date
from calendar import monthrange
import logging

from .models import Expense, Income, Budget
from .serializers import ExpenseSerializer, IncomeSerializer, BudgetSerializer
from .permissions import IsOwner, IsNotDemoUser
from .services import AnalyticsService
from .demo import setup_demo_account, DEMO_USER_EMAIL, DEMO_USER_PASSWORD

logger = logging.getLogger('api')


# =========================
# EXPENSE VIEWSET
# =========================
class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated, IsOwner, IsNotDemoUser]

    def get_queryset(self):
        queryset = Expense.objects.filter(user=self.request.user)

        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)

        date_from = self.request.query_params.get('date_from')
        if date_from:
            queryset = queryset.filter(date__gte=date_from)

        date_to = self.request.query_params.get('date_to')
        if date_to:
            queryset = queryset.filter(date__lte=date_to)

        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(notes__icontains=search) |
                Q(category__icontains=search)
            )

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# =========================
# INCOME VIEWSET
# =========================
class IncomeViewSet(viewsets.ModelViewSet):
    serializer_class = IncomeSerializer
    permission_classes = [IsAuthenticated, IsOwner, IsNotDemoUser]

    def get_queryset(self):
        queryset = Income.objects.filter(user=self.request.user)

        date_from = self.request.query_params.get('date_from')
        if date_from:
            queryset = queryset.filter(date__gte=date_from)

        date_to = self.request.query_params.get('date_to')
        if date_to:
            queryset = queryset.filter(date__lte=date_to)

        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(source__icontains=search) |
                Q(notes__icontains=search)
            )

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# =========================
# BUDGET VIEWSET
# =========================
class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated, IsOwner, IsNotDemoUser]

    def get_queryset(self):
        queryset = Budget.objects.filter(user=self.request.user)

        month = self.request.query_params.get('month')
        if month:
            queryset = queryset.filter(month=month)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# =========================
# DASHBOARD
# =========================
class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def stats(self, request):
        user = request.user
        today = timezone.now().date()
        week_start = today - timedelta(days=today.weekday())
        month_start = today.replace(day=1)

        today_exp = Expense.objects.filter(user=user, date=today).aggregate(Sum('amount'))['amount__sum'] or 0
        week_exp = Expense.objects.filter(user=user, date__gte=week_start).aggregate(Sum('amount'))['amount__sum'] or 0
        month_exp = Expense.objects.filter(user=user, date__gte=month_start).aggregate(Sum('amount'))['amount__sum'] or 0

        month_inc = Income.objects.filter(user=user, date__gte=month_start).aggregate(Sum('amount'))['amount__sum'] or 0

        balance = month_inc - month_exp

        return Response({
            'today_expenses': today_exp,
            'week_expenses': week_exp,
            'month_expenses': month_exp,
            'month_income': month_inc,
            'balance': balance,
        })


# =========================
# ANALYTICS
# =========================
class AnalyticsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def category_breakdown(self, request):
        user = request.user
        month_start = timezone.now().date().replace(day=1)

        expenses = Expense.objects.filter(user=user, date__gte=month_start)
        category_totals = expenses.values('category').annotate(total=Sum('amount')).order_by('-total')

        # Ensure total is safely calculated, treating None as 0
        total = sum((item['total'] or 0) for item in category_totals)
        data = []

        for item in category_totals:
            item_total = float(item['total'] or 0)
            data.append({
                'label': item['category'],
                'value': item_total,
                'percentage': (item_total / total * 100) if total > 0 else 0,
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

    @action(detail=False, methods=['get'])
    def insights(self, request):
        insights = AnalyticsService.get_ai_insights(request.user)
        return Response(insights)

    @action(detail=False, methods=['get'])
    def recommendations(self, request):
        recommendations = AnalyticsService.get_recommendations(request.user)
        return Response(recommendations)

    @action(detail=False, methods=['get'])
    def monthly_summary(self, request):
        summary = AnalyticsService.get_monthly_summary(request.user)
        return Response(summary)


# =========================
# REGISTER (FIXED)
# =========================
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        name = request.data.get('name')

        if not email or not password or not name:
            return Response({'error': 'Email, password, and name are required'}, status=400)

        if len(password) < 6:
            return Response({'error': 'Password must be at least 6 characters'}, status=400)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'User with this email already exists'}, status=400)

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=name
        )

        return Response({'message': 'User created successfully'}, status=201)

    except Exception as e:
        logger.error(f"Registration Error: {str(e)}", exc_info=True)
        return Response({'error': 'An internal server error occurred.', 'detail': str(e)}, status=500)


# =========================
# DEMO LOGIN
# =========================
@api_view(['POST'])
@permission_classes([AllowAny])
def demo_login(request):
    """
    Demo login endpoint.
    Sets up demo account with sample data and returns JWT tokens.
    """
    try:
        # Setup or reset demo account with sample data
        setup_result = setup_demo_account()
        demo_user = setup_result['user']
        
        logger.info(f"Demo account accessed: {demo_user.email}")
        
        # Use TokenObtainPairView to get tokens for demo user
        from rest_framework_simplejwt.tokens import RefreshToken
        
        refresh = RefreshToken.for_user(demo_user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': demo_user.id,
                'email': demo_user.email,
                'first_name': demo_user.first_name,
                'is_demo': True,
            },
            'message': 'Demo account loaded with sample data. Changes will be reset on logout.',
        }, status=200)
        
    except Exception as e:
        logger.error(f"Demo Login Error: {str(e)}", exc_info=True)
        return Response({'error': 'Failed to load demo account', 'detail': str(e)}, status=500)