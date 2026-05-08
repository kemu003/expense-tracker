import { useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  Zap, 
  Sparkles, 
  Lightbulb, 
  AlertCircle, 
  PieChart, 
  Wallet,
  Target
} from 'lucide-react';
import { Expense, Income, CATEGORY_COLORS, Category } from '../lib/supabase';
import { format, startOfWeek, startOfMonth } from '../utils/dates';
import { useDashboardStats } from '../hooks/useDashboard';
import { useAnalytics } from '../hooks/useAnalytics';

interface DashboardProps {
  expenses: Expense[];
  income: Income[];
  onNavigate: (page: string) => void;
}

function StatCard({ label, value, sub, icon: Icon, color, trend, trendValue }: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
}) {
  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col gap-4 hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative flex items-center justify-between">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} shadow-lg shadow-current/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
          <Icon size={24} className="text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
            trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
            trend === 'down' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
          }`}>
            {trend === 'up' ? <ArrowUpRight size={14} /> : trend === 'down' ? <ArrowDownRight size={14} /> : null}
            {trendValue ? `${Math.abs(trendValue).toFixed(1)}%` : ''}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</p>
        {sub && <p className="text-xs mt-2 text-slate-400 dark:text-slate-500 font-medium">{sub}</p>}
      </div>
    </div>
  );
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
    <div className={`flex items-start gap-4 p-4 rounded-2xl border ${colors[insight.type as keyof typeof colors]} transition-all duration-300 hover:scale-[1.02] cursor-default`}>
      <div className="mt-0.5">
        <Icon size={20} />
      </div>
      <p className="text-sm font-medium leading-relaxed">{insight.text}</p>
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
    <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{rec.title}</h4>
        <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${impactColors[rec.impact as keyof typeof impactColors]}`}>
          {rec.impact} impact
        </span>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{rec.text}</p>
    </div>
  );
}

function fmt(n: number) {
  return 'KSh ' + n.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function Dashboard({ expenses, income, onNavigate }: DashboardProps) {
  const { insights, recommendations, monthlySummary, categoryBreakdown, loading } = useAnalytics();

  const recentExpenses = expenses.slice(0, 8);
  const topCategories = categoryBreakdown.slice(0, 5);
  const maxCategory = topCategories[0]?.value ? parseFloat(topCategories[0].value) : 1;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-20 -mt-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl -ml-20 -mb-20" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} />
              SpendWise Premium
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Financial Intelligence</h2>
            <p className="text-slate-400 text-lg max-w-md font-medium">Your personalized wealth dashboard and AI-driven insights.</p>
          </div>
          
          {monthlySummary && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center min-w-[200px] hover:scale-105 transition-transform duration-500">
              <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">Savings Rate</p>
              <div className="relative">
                <svg className="w-24 h-24">
                  <circle className="text-white/10" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48" />
                  <circle
                    className="text-blue-500 transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * Math.min(Math.max(monthlySummary.savings_rate, 0), 100)) / 100}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="48"
                    cy="48"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-black">{Math.round(monthlySummary.savings_rate)}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Monthly Income" 
          value={fmt(monthlySummary?.total_income ?? 0)} 
          icon={TrendingUp} 
          color="bg-emerald-500" 
          trend={monthlySummary?.income_trend > 0 ? 'up' : monthlySummary?.income_trend < 0 ? 'down' : undefined}
          trendValue={monthlySummary?.income_trend}
        />
        <StatCard 
          label="Monthly Expenses" 
          value={fmt(monthlySummary?.total_expenses ?? 0)} 
          icon={TrendingDown} 
          color="bg-rose-500" 
          trend={monthlySummary?.expense_trend > 0 ? 'up' : monthlySummary?.expense_trend < 0 ? 'down' : undefined}
          trendValue={monthlySummary?.expense_trend}
        />
        <StatCard 
          label="Total Savings" 
          value={fmt(monthlySummary?.total_savings ?? 0)} 
          icon={Wallet} 
          color="bg-blue-500" 
        />
        <StatCard 
          label="Predicted Spend" 
          value={fmt(monthlySummary?.predicted_monthly_spending ?? 0)} 
          icon={Target} 
          color="bg-amber-500" 
          sub="Based on current rate"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: AI Insights & Recommendations */}
        <div className="lg:col-span-1 space-y-8">
          {/* AI Insights */}
          <section className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Sparkles size={20} />
              </div>
              <h3 className="font-black text-slate-900 dark:text-white text-xl tracking-tight">AI Insights</h3>
            </div>
            <div className="space-y-4">
              {insights.length > 0 ? (
                insights.map((insight, i) => <InsightCard key={i} insight={insight} />)
              ) : (
                <p className="text-sm text-slate-400 text-center py-8 font-medium">Add more transactions to unlock AI insights.</p>
              )}
            </div>
          </section>

          {/* Recommendations */}
          <section className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Lightbulb size={20} />
              </div>
              <h3 className="font-black text-slate-900 dark:text-white text-xl tracking-tight">Smart Tips</h3>
            </div>
            <div className="space-y-4">
              {recommendations.length > 0 ? (
                recommendations.map((rec, i) => <RecommendationCard key={i} rec={rec} />)
              ) : (
                <p className="text-sm text-slate-400 text-center py-8 font-medium">Gathering data for recommendations...</p>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Transactions & Categories */}
        <div className="lg:col-span-2 space-y-8">
          {/* Transactions */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-8 py-7 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="font-black text-slate-900 dark:text-white text-2xl tracking-tight">Recent Activity</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Latest transactions</p>
              </div>
              <button onClick={() => onNavigate('expenses')} className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-black hover:bg-blue-600 hover:text-white transition-all duration-300">
                VIEW ALL
              </button>
            </div>
            <div className="p-2">
              {recentExpenses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                  <DollarSign size={48} className="mb-4 opacity-20" />
                  <p className="font-bold">No transactions found</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {recentExpenses.map((e, i) => (
                    <div key={e.id} className="group flex items-center gap-4 px-6 py-4 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300 cursor-pointer">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6"
                        style={{ backgroundColor: CATEGORY_COLORS[e.category as Category] }}
                      >
                        {e.category[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">{e.title}</p>
                        <p className="text-xs text-slate-400 font-semibold">{e.category} · {format(e.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-black text-rose-500">-{fmt(parseFloat(e.amount))}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">DEBIT</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <PieChart size={20} />
              </div>
              <h3 className="font-black text-slate-900 dark:text-white text-xl tracking-tight">Spending by Category</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-6">
                {topCategories.map((item, idx) => (
                  <div key={item.label} className="space-y-2 group">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: CATEGORY_COLORS[item.label as Category] ?? '#94a3b8' }} />
                        <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">{item.label}</span>
                      </div>
                      <span className="text-slate-900 dark:text-white text-sm font-black">{fmt(parseFloat(item.value))}</span>
                    </div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                        style={{
                          width: `${(parseFloat(item.value) / maxCategory) * 100}%`,
                          backgroundColor: CATEGORY_COLORS[item.label as Category] ?? '#94a3b8'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Category Legend/Stats */}
              <div className="bg-slate-50 dark:bg-slate-800/30 rounded-3xl p-6 flex flex-col justify-center border border-slate-100 dark:border-slate-800">
                <div className="text-center space-y-2">
                  <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Main Expense</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{monthlySummary?.highest_spending_category}</p>
                  <div className="pt-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-600 text-white text-xs font-black shadow-lg shadow-blue-600/20">
                      ANALYZED DATA
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
