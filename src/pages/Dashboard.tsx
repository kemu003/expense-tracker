import { useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, ArrowUpRight, ArrowDownRight, Zap, Sparkles, Lightbulb, AlertCircle, PieChart, Wallet, Target } from 'lucide-react';
import { Expense, Income, CATEGORY_COLORS, Category } from '../lib/supabase';
import { format, startOfWeek, startOfMonth } from '../utils/dates';
import { useDashboardStats } from '../hooks/useDashboard';
import { useAnalytics } from '../hooks/useAnalytics';
import { formatCurrency } from '../utils/currency';
import PeriodFilter from '../components/PeriodFilter';
import { DatePeriod, filterExpensesByPeriod, filterIncomeByPeriod, calculateTotalExpenses, calculateTotalIncome, getCategoryBreakdown } from '../utils/dateFiltering';

interface DashboardProps {
  expenses: Expense[];
  income: Income[];
  onNavigate: (page: string) => void;
}

function StatCard({ label, value, sub, icon: Icon, color, trend }: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col gap-4 hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</span>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} shadow-lg shadow-current/20 group-hover:scale-110 group-hover:shadow-current/40 transition-all duration-300`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      <div>
        <p className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">{value}</p>
        {sub && (
          <p className={`text-xs mt-2 flex items-center gap-1 font-semibold ${
            trend === 'up' ? 'text-green-600 dark:text-green-400' :
            trend === 'down' ? 'text-red-500 dark:text-red-400' :
            'text-slate-500 dark:text-slate-400'
          }`}>
            {trend === 'up' && <ArrowUpRight size={14} />}
            {trend === 'down' && <ArrowDownRight size={14} />}
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

function InsightItem({ insight }: { insight: any }) {
  const colors = {
    info: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300',
    danger: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300',
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border border-transparent text-xs font-medium ${colors[insight.type as keyof typeof colors]}`}>
      <Sparkles size={14} className="flex-shrink-0" />
      <span>{insight.text}</span>
    </div>
  );
}

function fmt(n: number, currency: string = 'KES') {
  return formatCurrency(n, currency);
}

export default function Dashboard({ expenses, income, onNavigate }: DashboardProps) {
  const [activePeriod, setActivePeriod] = useState<DatePeriod>('month');
  const { stats: apiStats, loading: statsLoading } = useDashboardStats();
  const { categoryBreakdown, insights, recommendations, monthlySummary, loading: analyticsLoading } = useAnalytics();

  const today = new Date().toISOString().split('T')[0];
  const weekStart = startOfWeek();
  const monthStart = startOfMonth();

  // Filter expenses and income based on selected period
  const filteredExpenses = useMemo(() => {
    return filterExpensesByPeriod(expenses, activePeriod);
  }, [expenses, activePeriod]);

  const filteredIncome = useMemo(() => {
    return filterIncomeByPeriod(income, activePeriod);
  }, [income, activePeriod]);

  // Fallback to local calculations if API fails
  const localStats = useMemo(() => {
    const periodExpenses = calculateTotalExpenses(filteredExpenses);
    const periodIncome = calculateTotalIncome(filteredIncome);
    const balance = periodIncome - periodExpenses;

    // For display purposes, show breakdown by day/week/month depending on period
    let todayExp = 0;
    let weekExp = 0;
    let monthExp = 0;
    let monthInc = 0;

    if (activePeriod === 'today') {
      todayExp = periodExpenses;
      weekExp = calculateTotalExpenses(expenses.filter(e => e.date >= weekStart));
      monthExp = calculateTotalExpenses(expenses.filter(e => e.date >= monthStart));
      monthInc = calculateTotalIncome(income.filter(i => i.date >= monthStart));
    } else if (activePeriod === 'week') {
      todayExp = calculateTotalExpenses(expenses.filter(e => e.date === today));
      weekExp = periodExpenses;
      monthExp = calculateTotalExpenses(expenses.filter(e => e.date >= monthStart));
      monthInc = calculateTotalIncome(income.filter(i => i.date >= monthStart));
    } else if (activePeriod === 'month') {
      todayExp = calculateTotalExpenses(expenses.filter(e => e.date === today));
      weekExp = calculateTotalExpenses(expenses.filter(e => e.date >= weekStart));
      monthExp = periodExpenses;
      monthInc = periodIncome;
    } else {
      // For year or custom, show period totals
      todayExp = calculateTotalExpenses(expenses.filter(e => e.date === today));
      weekExp = calculateTotalExpenses(expenses.filter(e => e.date >= weekStart));
      monthExp = calculateTotalExpenses(expenses.filter(e => e.date >= monthStart));
      monthInc = periodIncome;
    }

    if (monthlySummary && activePeriod === 'month') {
      return {
        today_expenses: todayExp.toFixed(2),
        week_expenses: weekExp.toFixed(2),
        month_expenses: monthExp.toFixed(2),
        month_income: monthlySummary.total_income.toFixed(2),
        balance: (monthlySummary.total_income - monthExp).toFixed(2)
      };
    }

    return {
      today_expenses: todayExp.toFixed(2),
      week_expenses: weekExp.toFixed(2),
      month_expenses: monthExp.toFixed(2),
      month_income: monthInc.toFixed(2),
      balance: balance.toFixed(2)
    };
  }, [filteredExpenses, filteredIncome, activePeriod, expenses, income, today, weekStart, monthStart, monthlySummary]);

  const recentExpenses = useMemo(() => {
    return filteredExpenses.slice(0, 10);
  }, [filteredExpenses]);

  const categoryTotals = useMemo(() => {
    if (categoryBreakdown.length > 0 && activePeriod === 'month') {
      return categoryBreakdown.map(item => [item.label, parseFloat(item.value)] as [string, number]);
    }
    // Use filtered expenses for category breakdown
    const categoryMap = getCategoryBreakdown(filteredExpenses);
    return Object.entries(categoryMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [filteredExpenses, activePeriod, categoryBreakdown]);

  const maxCategory = categoryTotals[0]?.[1] ?? 1;

  if (analyticsLoading && !monthlySummary) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-900 dark:to-blue-800 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-100 text-sm font-semibold uppercase tracking-wide">Welcome back</span>
              {monthlySummary && (
                <span className="px-2 py-0.5 rounded-full bg-blue-500/30 text-[10px] font-bold border border-blue-400/30 flex items-center gap-1">
                  <Sparkles size={10} /> AI POWERED
                </span>
              )}
            </div>
            <h2 className="text-3xl font-bold">Financial Overview</h2>
            <p className="text-blue-100 mt-2">Monitor your spending and income in real-time</p>
          </div>
          <Zap size={32} className="text-blue-200" />
        </div>
      </div>

      {/* Period Filter */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
        <PeriodFilter activePeriod={activePeriod} onPeriodChange={setActivePeriod} />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 transition-all duration-500">
        <StatCard 
          label={activePeriod === 'today' ? 'Today' : 'Daily Average'} 
          value={fmt(parseFloat(localStats.today_expenses))} 
          icon={Calendar} 
          color="bg-blue-500" 
          sub={activePeriod === 'today' ? 'expenses today' : 'daily spending'} 
          trend="neutral" 
        />
        <StatCard 
          label={activePeriod === 'week' ? 'This Week' : 'Weekly Total'} 
          value={fmt(parseFloat(localStats.week_expenses))} 
          icon={TrendingDown} 
          color="bg-orange-500" 
          sub={activePeriod === 'week' ? 'weekly spend' : 'weekly spending'} 
          trend="neutral" 
        />
        <StatCard 
          label={activePeriod === 'month' ? 'This Month' : 'Period Total'} 
          value={fmt(parseFloat(localStats.month_expenses))} 
          icon={DollarSign} 
          color="bg-red-500" 
          sub={monthlySummary && activePeriod === 'month' ? `${monthlySummary.expense_trend.toFixed(1)}% from last month` : "period expenses"}
          trend={monthlySummary && activePeriod === 'month' ? (monthlySummary.expense_trend > 0 ? 'up' : monthlySummary.expense_trend < 0 ? 'down' : 'neutral') : 'neutral'} 
        />
        <StatCard
          label="Balance"
          value={fmt(parseFloat(localStats.balance))}
          icon={TrendingUp}
          color={parseFloat(localStats.balance) >= 0 ? 'bg-green-500' : 'bg-red-500'}
          sub={activePeriod === 'month' && monthlySummary ? `Savings Rate: ${Math.round(monthlySummary.savings_rate)}%` : `Period: ${activePeriod}`}
          trend={parseFloat(localStats.balance) >= 0 ? 'up' : 'down'}
        />
      </div>

      {/* AI Insights Bar - Subtle integration */}
      {insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.slice(0, 3).map((insight, i) => (
            <InsightItem key={i} insight={insight} />
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent transactions */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white text-lg">Recent Transactions</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Latest 10 for {activePeriod === 'today' ? 'today' : activePeriod === 'week' ? 'this week' : activePeriod === 'month' ? 'this month' : 'this period'}</p>
              </div>
              <button onClick={() => onNavigate('expenses')} className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold hover:underline transition-colors">View all</button>
            </div>
            {recentExpenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
                <DollarSign size={40} className="mb-3 opacity-20" />
                <p className="text-sm font-medium">No expenses yet</p>
                <button onClick={() => onNavigate('expenses')} className="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:underline">Add your first expense</button>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentExpenses.map((e, i) => (
                  <li key={e.id} className={`flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200 ${i === 0 ? 'bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-950/20' : ''}`}>
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md"
                      style={{ backgroundColor: CATEGORY_COLORS[e.category as Category] }}
                    >
                      {e.category[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{e.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{e.category} · {format(e.date)}</p>
                    </div>
                    <span className="text-sm font-bold text-red-500 dark:text-red-400 flex-shrink-0">-{fmt(parseFloat(e.amount))}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recommendations - Subtle Section */}
          {recommendations.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb size={18} className="text-amber-500" />
                <h3 className="font-bold text-slate-900 dark:text-white">Smart Savings Tips</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.slice(0, 2).map((rec, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">{rec.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{rec.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Category breakdown */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50">
              <h2 className="font-bold text-slate-900 dark:text-white text-lg">Top Categories</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{activePeriod === 'today' ? "Today's spending" : activePeriod === 'week' ? "This week's spending" : activePeriod === 'month' ? "This month's spending" : "Period spending"}</p>
            </div>
            {categoryTotals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
                <p className="text-sm">No spending data yet</p>
              </div>
            ) : (
              <ul className="p-6 space-y-5">
                {categoryTotals.map(([cat, total], idx) => (
                  <li key={cat} className="space-y-2.5 animate-in fade-in duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat as Category] ?? '#94a3b8' }} />
                        <span className="font-medium text-slate-900 dark:text-white text-sm">{cat}</span>
                      </div>
                      <span className="text-slate-600 dark:text-slate-400 text-sm font-semibold">{fmt(total)}</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${(total / maxCategory) * 100}%`,
                          backgroundColor: CATEGORY_COLORS[cat as Category] ?? '#94a3b8'
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Predictions widget */}
          {monthlySummary && (
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Target size={18} />
                <h3 className="font-bold">Monthly Prediction</h3>
              </div>
              <p className="text-xs text-indigo-100 mb-1">Estimated total spending</p>
              <p className="text-2xl font-bold mb-4">{fmt(monthlySummary.predicted_monthly_spending)}</p>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-1000" 
                  style={{ width: `${Math.min((monthlySummary.total_expenses / monthlySummary.predicted_monthly_spending) * 100, 100)}%` }} 
                />
              </div>
              <p className="text-[10px] mt-2 text-indigo-100 font-medium">Based on your current daily average</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
