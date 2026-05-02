import { useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';
import { Expense, Income, CATEGORY_COLORS, Category } from '../lib/supabase';
import { format, startOfWeek, startOfMonth } from '../utils/dates';
import { useDashboardStats } from '../hooks/useDashboard';
import { useAnalytics } from '../hooks/useAnalytics';

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

function fmt(n: number) {
  return 'KSh ' + n.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Dashboard({ expenses, income, onNavigate }: DashboardProps) {
  const { stats: apiStats, loading: statsLoading } = useDashboardStats();
  const { categoryBreakdown, loading: analyticsLoading } = useAnalytics();

  const today = new Date().toISOString().split('T')[0];
  const weekStart = startOfWeek();
  const monthStart = startOfMonth();

  // Fallback to local calculations if API fails
  const localStats = useMemo(() => {
    if (apiStats) return apiStats;
    const todayExp = expenses.filter(e => e.date === today).reduce((s, e) => s + parseFloat(e.amount), 0);
    const weekExp = expenses.filter(e => e.date >= weekStart).reduce((s, e) => s + parseFloat(e.amount), 0);
    const monthExp = expenses.filter(e => e.date >= monthStart).reduce((s, e) => s + parseFloat(e.amount), 0);
    const monthInc = income.filter(e => e.date >= monthStart).reduce((s, e) => s + parseFloat(e.amount), 0);
    const balance = monthInc - monthExp;
    return {
      today_expenses: todayExp.toFixed(2),
      week_expenses: weekExp.toFixed(2),
      month_expenses: monthExp.toFixed(2),
      month_income: monthInc.toFixed(2),
      balance: balance.toFixed(2)
    };
  }, [expenses, income, today, weekStart, monthStart, apiStats]);

  const recentExpenses = expenses.slice(0, 10);

  const categoryTotals = useMemo(() => {
    if (categoryBreakdown.length > 0) {
      return categoryBreakdown.map(item => [item.label, parseFloat(item.value)] as [string, number]);
    }
    // Fallback to local calculation
    const map: Record<string, number> = {};
    expenses.filter(e => e.date >= monthStart).forEach(e => {
      map[e.category] = (map[e.category] ?? 0) + parseFloat(e.amount);
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [expenses, monthStart, categoryBreakdown]);

  const maxCategory = categoryTotals[0]?.[1] ?? 1;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-900 dark:to-blue-800 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-100 text-sm font-semibold uppercase tracking-wide">Welcome back</p>
            <h2 className="text-3xl font-bold mt-2">Financial Overview</h2>
            <p className="text-blue-100 mt-2">Monitor your spending and income in real-time</p>
          </div>
          <Zap size={32} className="text-blue-200" />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard label="Today" value={fmt(parseFloat(localStats.today_expenses))} icon={Calendar} color="bg-blue-500" sub="expenses today" trend="neutral" />
        <StatCard label="This Week" value={fmt(parseFloat(localStats.week_expenses))} icon={TrendingDown} color="bg-orange-500" sub="weekly spend" trend="neutral" />
        <StatCard label="This Month" value={fmt(parseFloat(localStats.month_expenses))} icon={DollarSign} color="bg-red-500" sub="monthly expenses" trend="neutral" />
        <StatCard
          label="Balance"
          value={fmt(parseFloat(localStats.balance))}
          icon={TrendingUp}
          color={parseFloat(localStats.balance) >= 0 ? 'bg-green-500' : 'bg-red-500'}
          sub={`Income: ${fmt(parseFloat(localStats.month_income))}`}
          trend={parseFloat(localStats.balance) >= 0 ? 'up' : 'down'}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent transactions */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-lg">Recent Transactions</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Latest 10 expenses</p>
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
                  <span className="text-sm font-bold text-red-500 dark:text-red-400 flex-shrink-0">-{fmt(e.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Category breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50">
            <h2 className="font-bold text-slate-900 dark:text-white text-lg">Top Categories</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">This month's spending</p>
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
      </div>
    </div>
  );
}
