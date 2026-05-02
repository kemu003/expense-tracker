import { useMemo } from 'react';
import { Expense, Income, CATEGORY_COLORS, Category } from '../lib/supabase';
import { last6Months, monthLabel, startOfMonth } from '../utils/dates';

interface AnalyticsPageProps {
  expenses: Expense[];
  income: Income[];
}

function fmt(n: number) {
  return 'KSh ' + n.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function AnalyticsPage({ expenses, income }: AnalyticsPageProps) {
  const months = last6Months();
  const monthStart = startOfMonth();

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.filter(e => e.date >= monthStart).forEach(e => {
      map[e.category] = (map[e.category] ?? 0) + e.amount;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({
        label,
        value,
        color: CATEGORY_COLORS[label as Category] ?? '#94a3b8',
      }));
  }, [expenses, monthStart]);

  const { expenseData, incomeData } = useMemo(() => {
    const expenseData = months.map(m =>
      expenses.filter(e => e.date.startsWith(m)).reduce((s, e) => s + e.amount, 0)
    );
    const incomeData = months.map(m =>
      income.filter(e => e.date.startsWith(m)).reduce((s, e) => s + e.amount, 0)
    );
    return { expenseData, incomeData };
  }, [expenses, income, months]);

  const totalExp = expenseData.reduce((a, b) => a + b, 0);
  const totalInc = incomeData.reduce((a, b) => a + b, 0);
  const avgExp = totalExp / 6;

  const savingsRate = totalInc ? ((totalInc - totalExp) / totalInc) * 100 : 0;

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
              const total = categoryData.reduce((s, x) => s + x.value, 0);
              const pct = (d.value / total) * 100;
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
  );
}
