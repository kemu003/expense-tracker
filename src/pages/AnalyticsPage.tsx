import { useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Wallet, 
  Sparkles, 
  Lightbulb, 
  AlertCircle,
  TrendingUp as TrendingUpIcon,
  BarChart3,
  Calendar
} from 'lucide-react';
import { Expense, Income, CATEGORY_COLORS, Category } from '../lib/supabase';
import { last6Months, monthLabel, startOfMonth } from '../utils/dates';
import { useAnalytics } from '../hooks/useAnalytics';

interface AnalyticsPageProps {
  expenses: Expense[];
  income: Income[];
}

function fmt(n: number) {
  return 'KSh ' + n.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function InsightCard({ insight }: { insight: any }) {
  const colors = {
    info: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
    warning: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800',
    danger: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800',
  };

  const Icons = {
    'trending-up': TrendingUp,
    'trending-down': TrendingDown,
    'alert-circle': AlertCircle,
    'alert-triangle': AlertCircle,
    'info': Lightbulb,
    'pie-chart': PieChart,
    'wallet': Wallet,
  };

  const Icon = Icons[insight.icon as keyof typeof Icons] || Lightbulb;

  return (
    <div className={`flex items-start gap-4 p-5 rounded-[1.5rem] border ${colors[insight.type as keyof typeof colors]} transition-all duration-300 hover:scale-[1.02] cursor-default shadow-sm`}>
      <div className="mt-1">
        <Icon size={20} />
      </div>
      <p className="text-sm font-bold leading-relaxed">{insight.text}</p>
    </div>
  );
}

function RecommendationCard({ rec }: { rec: any }) {
  const impactColors = {
    high: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400',
    medium: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400',
    low: 'text-slate-600 bg-slate-50 dark:bg-slate-800 dark:text-slate-400',
  };

  return (
    <div className="bg-white dark:bg-slate-800/40 p-6 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 group hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Lightbulb size={16} />
          </div>
          <h4 className="font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{rec.title}</h4>
        </div>
        <span className={`text-[10px] uppercase tracking-widest font-black px-2.5 py-1 rounded-full ${impactColors[rec.impact as keyof typeof impactColors]}`}>
          {rec.impact} impact
        </span>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{rec.text}</p>
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
    // Fallback
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-black text-slate-400 animate-pulse uppercase tracking-widest">Generating Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Intelligence & Analytics</h2>
        <p className="text-sm text-slate-500 font-medium mt-1">Advanced financial breakdown and AI-driven recommendations.</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-500 group">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
            <BarChart3 size={24} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Monthly Spend</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">{fmt(avgExp)}</p>
          <div className="mt-4 flex items-center gap-2">
            <Calendar size={12} className="text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400">PAST 6 MONTHS</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-500 group">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-600 mb-6 group-hover:scale-110 transition-transform">
            <TrendingDown size={24} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Outflow</p>
          <p className="text-2xl font-black text-rose-500 mt-1 tracking-tight">{fmt(totalExp)}</p>
          <div className="mt-4 flex items-center gap-2">
            <TrendingUpIcon size={12} className="text-rose-400" />
            <span className="text-[10px] font-bold text-rose-400 uppercase">Analysis Period</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-500 group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
            <TrendingUp size={24} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Inflow</p>
          <p className="text-2xl font-black text-emerald-600 mt-1 tracking-tight">{fmt(totalInc)}</p>
          <div className="mt-4 flex items-center gap-2">
            <Wallet size={12} className="text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Total Revenue</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-500 group">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${savingsRate >= 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
            <Sparkles size={24} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Savings Rate</p>
          <p className={`text-2xl font-black mt-1 tracking-tight ${savingsRate >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>{savingsRate.toFixed(1)}%</p>
          <div className="mt-4 flex items-center gap-2">
            <PieChart size={12} className="text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase">Efficiency Score</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Insights & Recommendations */}
        <div className="space-y-8">
          <section className="bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-inner">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                <Sparkles size={20} />
              </div>
              <h3 className="font-black text-slate-900 dark:text-white text-xl tracking-tight uppercase tracking-wider">AI Insights</h3>
            </div>
            <div className="space-y-4">
              {insights.length > 0 ? (
                insights.map((insight, i) => <InsightCard key={i} insight={insight} />)
              ) : (
                <p className="text-sm text-slate-400 text-center py-12 font-bold uppercase tracking-widest">Insufficient data for insights</p>
              )}
            </div>
          </section>

          <section className="bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-inner">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
                <Lightbulb size={20} />
              </div>
              <h3 className="font-black text-slate-900 dark:text-white text-xl tracking-tight uppercase tracking-wider">Recommendations</h3>
            </div>
            <div className="space-y-4">
              {recommendations.length > 0 ? (
                recommendations.map((rec, i) => <RecommendationCard key={i} rec={rec} />)
              ) : (
                <p className="text-sm text-slate-400 text-center py-12 font-bold uppercase tracking-widest">Collecting more data...</p>
              )}
            </div>
          </section>
        </div>

        {/* Category breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl">
          <div className="px-8 py-8 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/20">
                <PieChart size={20} />
              </div>
              <div>
                <h2 className="font-black text-slate-900 dark:text-white text-xl tracking-tight uppercase tracking-wider">Spending Structure</h2>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Category Analysis</p>
              </div>
            </div>
          </div>
          
          {categoryData.length === 0 ? (
            <div className="py-32 text-center text-slate-300">
              <PieChart size={64} className="mx-auto opacity-10 mb-4" />
              <p className="font-black text-lg">No category data</p>
            </div>
          ) : (
            <div className="p-4">
              <ul className="space-y-1">
                {categoryData.map((d, idx) => {
                  const pct = d.percentage || 0;
                  return (
                    <li key={d.label} className="flex items-center gap-6 px-6 py-5 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300 group">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-lg shadow-current/20 group-hover:scale-110 transition-transform" style={{ backgroundColor: d.color }}>
                        {d.label[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-base font-bold text-slate-900 dark:text-white">{d.label}</span>
                          <span className="text-sm font-black text-slate-900 dark:text-white">{fmt(d.value)}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                            <div className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm" style={{ width: `${pct}%`, backgroundColor: d.color }} />
                          </div>
                          <span className="text-xs font-black text-slate-400 w-10 text-right">{pct.toFixed(0)}%</span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
