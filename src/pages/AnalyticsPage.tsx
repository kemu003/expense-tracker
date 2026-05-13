import { useMemo } from 'react';
import { TrendingUp, TrendingDown, PieChart, Wallet, Sparkles, Lightbulb, AlertCircle, BarChart3, Calendar } from 'lucide-react';
import { Expense, Income, CATEGORY_COLORS, Category } from '../lib/supabase';
import { last6Months, monthLabel, startOfMonth } from '../utils/dates';
import { useAnalytics } from '../hooks/useAnalytics';
import { formatCurrency } from '../utils/currency';

interface AnalyticsPageProps {
  expenses: Expense[];
  income: Income[];
}

function fmt(n: number, currency: string = 'KES') {
  return formatCurrency(n, currency, true);
}

function InsightCard({ insight }: { insight: any }) {
  const colors = {
    info: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
    warning: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800',
    danger: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800',
  };

  return (
    <div className={`flex items-start gap-3 p-4 rounded-2xl border ${colors[insight.type as keyof typeof colors]} shadow-sm`}>
      <Sparkles size={16} className="mt-0.5 flex-shrink-0" />
      <p className="text-sm font-medium leading-relaxed">{insight.text}</p>
    </div>
  );
}

export default function AnalyticsPage({ expenses, income }: AnalyticsPageProps) {
  const { categoryBreakdown, monthlyTrends, insights, recommendations, monthlySummary, loading } = useAnalytics();

  const months = last6Months();
  const monthStart = startOfMonth();

  const categoryData = useMemo(() => {
    if (categoryBreakdown.length > 0) {
      return categoryBreakdown.map(item => ({
        label: item.label,
        value: parseFloat(item.value),
        color: CATEGORY_COLORS[item.label as Category] ?? '#94a3b8',
        percentage: item.percentage,
      }));
    }
    // Fallback to local calculation
    const map: Record<string, number> = {};
    expenses.filter(e => e.date >= monthStart).forEach(e => {
      map[e.category] = (map[e.category] ?? 0) + parseFloat(e.amount);
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({
        label,
        value,
        color: CATEGORY_COLORS[label as Category] ?? '#94a3b8',
        percentage: 0,
      }));
  }, [expenses, monthStart, categoryBreakdown]);

  const { expenseData, incomeData } = useMemo(() => {
    if (monthlyTrends) {
      return {
        expenseData: monthlyTrends.expenses,
        incomeData: monthlyTrends.income
      };
    }
    // Fallback to local calculation
    const expenseData = months.map(m =>
      expenses.filter(e => e.date.startsWith(m)).reduce((s, e) => s + parseFloat(e.amount), 0)
    );
    const incomeData = months.map(m =>
      income.filter(e => e.date.startsWith(m)).reduce((s, e) => s + parseFloat(e.amount), 0)
    );
    return { expenseData, incomeData };
  }, [expenses, income, months, monthlyTrends]);

  const totalExp = expenseData.reduce((a, b) => a + b, 0);
  const totalInc = incomeData.reduce((a, b) => a + b, 0);
  const avgExp = totalExp / 6;

  const savingsRate = totalInc ? ((totalInc - totalExp) / totalInc) * 100 : 0;

  if (loading && !monthlySummary) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Avg Monthly Expense</p>
          <p className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mt-2">{fmt(avgExp)}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Last 6 months</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Expenses</p>
          <p className="text-2xl lg:text-3xl font-bold text-red-500 dark:text-red-400 mt-2">{fmt(totalExp)}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">6-month period</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Income</p>
          <p className="text-2xl lg:text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{fmt(totalInc)}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">6-month period</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Savings Rate</p>
          <p className={`text-2xl lg:text-3xl font-bold mt-2 ${savingsRate >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>{savingsRate.toFixed(1)}%</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Income vs expenses</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* AI Insights - Restored UI integration */}
          {insights.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles size={20} className="text-blue-500" />
                <h2 className="font-bold text-slate-900 dark:text-white text-lg">AI Financial Insights</h2>
              </div>
              <div className="space-y-4">
                {insights.map((insight, i) => (
                  <InsightCard key={i} insight={insight} />
                ))}
              </div>
            </div>
          )}

          {/* Category breakdown */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50">
              <h2 className="font-bold text-slate-900 dark:text-white text-lg">Category Breakdown</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">This month's expenses by category</p>
            </div>
            {categoryData.length === 0 ? (
              <div className="py-16 text-center text-slate-500 dark:text-slate-400 text-sm">No expense data this month</div>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {categoryData.map((d, idx) => {
                  const pct = d.percentage || 0;
                  return (
                    <li key={d.label} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200 group animate-in fade-in duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="flex-1 text-sm font-semibold text-slate-900 dark:text-white">{d.label}</span>
                      <div className="flex-1 hidden sm:block">
                        <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: d.color }} />
                        </div>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 w-10 text-right font-medium">{pct.toFixed(0)}%</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white w-20 text-right">{fmt(d.value)}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Sidebar recommendations */}
        <div className="space-y-8">
          {recommendations.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <Lightbulb size={20} className="text-amber-500" />
                <h2 className="font-bold text-slate-900 dark:text-white text-lg">Smart Tips</h2>
              </div>
              <div className="space-y-6">
                {recommendations.map((rec, i) => (
                  <div key={i} className="space-y-2">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{rec.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{rec.text}</p>
                    <div className="pt-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        rec.impact === 'high' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        rec.impact === 'medium' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {rec.impact} Impact
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
