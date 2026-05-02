import { useState, useEffect, useMemo } from 'react';
import { Plus, AlertTriangle, CheckCircle2, Loader2, DollarSign } from 'lucide-react';
import { Budget, CATEGORIES, Category, CATEGORY_COLORS } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Expense } from '../lib/supabase';
import { currentMonth, monthLabel } from '../utils/dates';
import { useBudgets } from '../hooks/useBudgets';

interface BudgetsPageProps {
  expenses: Expense[];
}

function fmt(n: number | string) {
  const num = typeof n === 'string' ? parseFloat(n) : n;
  return 'KSh ' + num.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function BudgetsPage({ expenses }: BudgetsPageProps) {
  const { user } = useAuth();
  const { budgets, loading, addBudget, updateBudget } = useBudgets();
  const [saving, setSaving] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState<Category>('Food');
  const [newAmount, setNewAmount] = useState('');

  const month = currentMonth();

  // Filter budgets by current month
  const currentMonthBudgets = useMemo(() =>
    budgets.filter(b => b.month === month),
    [budgets, month]
  );

  const monthExpenses = useMemo(() =>
    expenses.filter(e => e.date.startsWith(month)),
    [expenses, month]
  );

  const spentByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    monthExpenses.forEach(e => { map[e.category] = (map[e.category] ?? 0) + parseFloat(e.amount); });
    return map;
  }, [monthExpenses]);

  const handleSave = async (budget: Budget) => {
    const val = parseFloat(editValues[budget.id] ?? '');
    if (isNaN(val) || val <= 0) return;
    setSaving(budget.id);
    try {
      const result = await updateBudget(budget.id, { amount: val.toFixed(2) });
      if (!result.error) {
        setEditValues(prev => { const next = { ...prev }; delete next[budget.id]; return next; });
      }
    } catch (error) {
      console.error('Failed to save budget:', error);
    }
    setSaving(null);
  };

  const handleAdd = async () => {
    const val = parseFloat(newAmount);
    if (!user || isNaN(val) || val <= 0) return;
    setSaving('new');
    try {
      const result = await addBudget({
        category: newCategory,
        month,
        amount: val.toFixed(2),
      });
      if (!result.error) {
        setNewAmount('');
        setShowForm(false);
      }
    } catch (error) {
      console.error('Failed to create budget:', error);
    }
    setSaving(null);
  };

  const usedCategories = new Set(currentMonthBudgets.map(b => b.category));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900 dark:text-white text-2xl">Monthly Budgets</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{monthLabel(month)}</p>
        </div>
        <button
          onClick={() => setShowForm(f => !f)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-blue-600/30"
        >
          <Plus size={16} />
          Set Budget
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-wrap gap-4 items-end animate-in slide-in-from-top-2 duration-300">
          <div className="flex-1 min-w-40">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Category</label>
            <select
              value={newCategory}
              onChange={e => setNewCategory(e.target.value as Category)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-32">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Budget (KSh)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={newAmount}
              onChange={e => setNewAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={saving === 'new'}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all duration-200 disabled:opacity-60"
          >
            {saving === 'new' ? <Loader2 size={14} className="animate-spin" /> : null}
            {usedCategories.has(newCategory) ? 'Update' : 'Add'}
          </button>
          <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200">
            Cancel
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-24"><div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : currentMonthBudgets.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
          <DollarSign size={40} className="mb-3 opacity-20" />
          <p className="text-sm font-medium">No budgets set for this month</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentMonthBudgets.map((budget, idx) => {
            const spent = spentByCategory[budget.category] ?? 0;
            const budgetAmount = parseFloat(budget.amount);
            const pct = Math.min((spent / budgetAmount) * 100, 100);
            const over = spent > budgetAmount;
            const warn = spent / budgetAmount >= 0.8 && !over;
            const color = CATEGORY_COLORS[budget.category as Category] ?? '#94a3b8';
            const isEditing = budget.id in editValues;

            return (
              <div key={budget.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{budget.category}</span>
                  </div>
                  {over
                    ? <AlertTriangle size={18} className="text-red-500" />
                    : warn
                    ? <AlertTriangle size={18} className="text-amber-500" />
                    : <CheckCircle2 size={18} className="text-green-500" />
                  }
                </div>

                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      maxWidth: '100%',
                      backgroundColor: over ? '#ef4444' : warn ? '#f59e0b' : color,
                    }}
                  />
                </div>

                <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                  <span>{fmt(spent)} spent</span>
                  <span>{fmt(budget.amount)} limit</span>
                </div>

                {over && (
                  <p className="text-xs font-bold text-red-600 dark:text-red-400">
                    Over by {fmt(spent - budgetAmount)}
                  </p>
                )}

                <div className="flex gap-2 pt-1">
                  {isEditing ? (
                    <>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={editValues[budget.id]}
                        onChange={e => setEditValues(prev => ({ ...prev, [budget.id]: e.target.value }))}
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                      <button
                        onClick={() => handleSave(budget)}
                        disabled={saving === budget.id}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold disabled:opacity-60 transition-all duration-200"
                      >
                        {saving === budget.id ? <Loader2 size={12} className="animate-spin" /> : 'Save'}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditValues(prev => ({ ...prev, [budget.id]: budget.amount }))}
                      className="w-full py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
                    >
                      Edit Limit
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
