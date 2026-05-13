from django.db.models import Sum, Avg, Count
from django.utils import timezone
from datetime import timedelta, date
from calendar import monthrange
from .models import Expense, Income, Budget
from .demo import DEMO_CURRENCY, DEMO_USER_EMAIL

class CurrencyService:
    # Static exchange rates for "Preparation" phase
    # In production, these would come from an API
    RATES = {
        'KES': 1.0,
        'USD': 129.50,
        'EUR': 140.20,
        'GBP': 165.40,
        'NGN': 0.08,
        'ZAR': 7.10,
    }

    @classmethod
    def convert(cls, amount, from_currency, to_currency='KES'):
        if from_currency == to_currency:
            return float(amount)
        
        # Convert to KES first (our base)
        amount_in_kes = float(amount) * cls.RATES.get(from_currency, 1.0)
        
        # Convert from KES to target
        target_amount = amount_in_kes / cls.RATES.get(to_currency, 1.0)
        return target_amount

class AnalyticsService:
    @staticmethod
    def _get_total_in_kes(queryset, amount_field='amount'):
        total = 0
        for item in queryset:
            amount = getattr(item, amount_field)
            currency = getattr(item, 'currency', 'KES')
            total += CurrencyService.convert(amount, currency, 'KES')
        return total

    @staticmethod
    def get_monthly_summary(user):
        today = timezone.now().date()
        month_start = today.replace(day=1)
        prev_month_end = month_start - timedelta(days=1)
        prev_month_start = prev_month_end.replace(day=1)

        demo_filter = {'currency': DEMO_CURRENCY} if user.email == DEMO_USER_EMAIL else {}

        # Current Month
        curr_expenses = Expense.objects.filter(user=user, date__gte=month_start, date__lte=today, **demo_filter)
        curr_total_exp = AnalyticsService._get_total_in_kes(curr_expenses)
        
        curr_income = Income.objects.filter(user=user, date__gte=month_start, date__lte=today, **demo_filter)
        curr_total_inc = AnalyticsService._get_total_in_kes(curr_income)
        
        # Previous Month
        prev_expenses = Expense.objects.filter(user=user, date__gte=prev_month_start, date__lte=prev_month_end, **demo_filter)
        prev_total_exp = AnalyticsService._get_total_in_kes(prev_expenses)
        
        prev_income = Income.objects.filter(user=user, date__gte=prev_month_start, date__lte=prev_month_end, **demo_filter)
        prev_total_inc = AnalyticsService._get_total_in_kes(prev_income)

        savings = curr_total_inc - curr_total_exp
        savings_rate = (savings / curr_total_inc * 100) if curr_total_inc > 0 else 0

        # Highest spending category
        highest_cat = curr_expenses.values('category').annotate(total=Sum('amount')).order_by('-total').first()
        highest_category = highest_cat['category'] if highest_cat else "None"

        # Prediction
        days_passed = today.day
        days_in_month = monthrange(today.year, today.month)[1]
        daily_avg = curr_total_exp / days_passed if days_passed > 0 else 0
        predicted_spending = daily_avg * days_in_month

        # Trends
        exp_trend = ((float(curr_total_exp) - float(prev_total_exp)) / float(prev_total_exp) * 100) if prev_total_exp > 0 else 0
        inc_trend = ((float(curr_total_inc) - float(prev_total_inc)) / float(prev_total_inc) * 100) if prev_total_inc > 0 else 0

        return {
            'total_income': float(curr_total_inc),
            'total_expenses': float(curr_total_exp),
            'total_savings': float(savings),
            'savings_rate': float(savings_rate),
            'highest_spending_category': highest_category,
            'predicted_monthly_spending': float(predicted_spending),
            'income_trend': float(inc_trend),
            'expense_trend': float(exp_trend)
        }

    @staticmethod
    def get_ai_insights(user):
        insights = []
        today = timezone.now().date()
        
        # 1. Weekly comparison
        this_week_start = today - timedelta(days=today.weekday())
        prev_week_start = this_week_start - timedelta(days=7)
        prev_week_end = this_week_start - timedelta(days=1)

        demo_filter = {'currency': DEMO_CURRENCY} if user.email == DEMO_USER_EMAIL else {}

        this_week_qs = Expense.objects.filter(user=user, date__gte=this_week_start, **demo_filter)
        this_week_exp = AnalyticsService._get_total_in_kes(this_week_qs)

        prev_week_qs = Expense.objects.filter(user=user, date__gte=prev_week_start, date__lte=prev_week_end, **demo_filter)
        prev_week_exp = AnalyticsService._get_total_in_kes(prev_week_qs)

        if prev_week_exp > 0:
            diff = ((float(this_week_exp) - float(prev_week_exp)) / float(prev_week_exp)) * 100
            if diff > 10:
                insights.append({
                    'type': 'warning',
                    'text': f"Your spending increased by {abs(diff):.1f}% this week compared to last.",
                    'icon': 'trending-up'
                })
            elif diff < -10:
                insights.append({
                    'type': 'success',
                    'text': f"Great job! You spent {abs(diff):.1f}% less this week than last.",
                    'icon': 'trending-down'
                })

        # 2. Budget alerts
        month_start = today.replace(day=1)
        demo_filter = {'currency': DEMO_CURRENCY} if user.email == DEMO_USER_EMAIL else {}
        budgets = Budget.objects.filter(user=user, month=today.strftime('%Y-%m'))
        for budget in budgets:
            exp_qs = Expense.objects.filter(user=user, category=budget.category, date__gte=month_start, **demo_filter)
            # Convert expenses to budget's currency for accurate comparison
            exp_sum_kes = AnalyticsService._get_total_in_kes(exp_qs)
            exp_sum = CurrencyService.convert(exp_sum_kes, 'KES', budget.currency)
            
            usage = (float(exp_sum) / float(budget.amount)) * 100
            if usage >= 100:
                insights.append({
                    'type': 'danger',
                    'text': f"You've exceeded your {budget.category} budget ({budget.currency})!",
                    'icon': 'alert-circle'
                })
            elif usage >= 90:
                insights.append({
                    'type': 'warning',
                    'text': f"You've used {usage:.1f}% of your {budget.category} budget.",
                    'icon': 'alert-triangle'
                })
            elif usage >= 75:
                insights.append({
                    'type': 'info',
                    'text': f"You've reached 75% of your {budget.category} budget.",
                    'icon': 'info'
                })

        # 3. Highest category
        highest_cat = Expense.objects.filter(user=user, date__gte=month_start, **({'currency': DEMO_CURRENCY} if user.email == DEMO_USER_EMAIL else {})).values('category').annotate(total=Sum('amount')).order_by('-total').first()
        if highest_cat:
            insights.append({
                'type': 'info',
                'text': f"Your highest spending category this month is {highest_cat['category']}.",
                'icon': 'pie-chart'
            })

        # 4. Low balance trend
        curr_total_inc = Income.objects.filter(user=user, date__gte=month_start, **({'currency': DEMO_CURRENCY} if user.email == DEMO_USER_EMAIL else {})).aggregate(Sum('amount'))['amount__sum'] or 0
        curr_total_exp = Expense.objects.filter(user=user, date__gte=month_start, **({'currency': DEMO_CURRENCY} if user.email == DEMO_USER_EMAIL else {})).aggregate(Sum('amount'))['amount__sum'] or 0
        balance = float(curr_total_inc) - float(curr_total_exp)
        if balance < 1000 and curr_total_inc > 0:
            insights.append({
                'type': 'warning',
                'text': "Low balance alert: Your remaining funds for this month are low.",
                'icon': 'wallet'
            })

        return insights

    @staticmethod
    def get_recommendations(user):
        recommendations = []
        today = timezone.now().date()
        month_start = today.replace(day=1)

        # 1. Savings opportunity
        highest_cat = Expense.objects.filter(user=user, date__gte=month_start, **({'currency': DEMO_CURRENCY} if user.email == DEMO_USER_EMAIL else {})).values('category').annotate(total=Sum('amount')).order_by('-total').first()
        if highest_cat:
            potential_saving = float(highest_cat['total']) * 0.1
            recommendations.append({
                'title': "Cut back on " + highest_cat['category'],
                'text': f"Reducing {highest_cat['category']} spending by 10% could save you KES {potential_saving:,.0f} monthly.",
                'impact': 'high'
            })

        # 2. Weekend spending
        weekend_exp = Expense.objects.filter(user=user, date__gte=month_start, date__week_day__in=[1, 7], **({'currency': DEMO_CURRENCY} if user.email == DEMO_USER_EMAIL else {})).aggregate(Sum('amount'))['amount__sum'] or 0
        weekday_exp = Expense.objects.filter(user=user, date__gte=month_start, date__week_day__in=[2, 3, 4, 5, 6], **({'currency': DEMO_CURRENCY} if user.email == DEMO_USER_EMAIL else {})).aggregate(Sum('amount'))['amount__sum'] or 0
        
        if float(weekend_exp) > float(weekday_exp) * 0.5:
            recommendations.append({
                'title': "Weekend Spender",
                'text': "Your weekend spending is significantly higher than weekdays. Consider a weekend budget.",
                'impact': 'medium'
            })

        # 3. Frequent small purchases
        small_purchases = Expense.objects.filter(user=user, date__gte=month_start, amount__lt=500, **({'currency': DEMO_CURRENCY} if user.email == DEMO_USER_EMAIL else {})).count()
        if small_purchases > 10:
            recommendations.append({
                'title': "Small Purchases Add Up",
                'text': f"You've made {small_purchases} small purchases this month. These can drain your budget quickly.",
                'impact': 'low'
            })

        return recommendations
