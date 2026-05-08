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
            const usage = (spent / budgetAmount);
            const pct = Math.min(usage * 100, 100);
            
            const over = usage >= 1;
            const critical = usage >= 0.9 && !over;
            const warning = usage >= 0.75 && !critical && !over;
            
            const color = CATEGORY_COLORS[budget.category as Category] ?? '#94a3b8';
            const isEditing = budget.id in editValues;

            return (
              <div key={budget.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-xl hover:shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-current/20" style={{ backgroundColor: color }}>
                      {budget.category[0]}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white text-base tracking-tight">{budget.category}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Monthly Budget</p>
                    </div>
                  </div>
                  {over
                    ? <div className="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-xl animate-pulse"><AlertTriangle size={20} /></div>
                    : critical
                    ? <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-xl"><AlertTriangle size={20} /></div>
                    : warning
                    ? <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-xl"><AlertTriangle size={20} /></div>
                    : <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-xl"><CheckCircle2 size={20} /></div>
                  }
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    <span>{Math.round(usage * 100)}% Used</span>
                    <span>{fmt(budgetAmount - spent)} {over ? 'Over' : 'Left'}</span>
                  </div>
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: over ? '#f43f5e' : critical ? '#f59e0b' : warning ? '#3b82f6' : color,
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mb-1">Spent</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{fmt(spent)}</p>
                  </div>
                  <div className="w-px bg-slate-200 dark:bg-slate-700 h-8 self-center" />
                  <div className="text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mb-1">Limit</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{fmt(budgetAmount)}</p>
                  </div>
                </div>

                {over && (
                  <div className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                    <p className="text-xs font-bold text-rose-600 dark:text-rose-400 text-center">
                      ⚠️ Budget exceeded by {fmt(spent - budgetAmount)}
                    </p>
                  </div>
                )}
                
                {critical && (
                  <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400 text-center">
                      ⚡ 90% of budget reached. Be careful!
                    </p>
                  </div>
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
