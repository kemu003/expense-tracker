import { useState, useMemo } from 'react';
import { Plus, Search, Trash2, Pencil, Filter, Download, ChevronDown, Globe } from 'lucide-react';
import { Expense, CATEGORIES, Category, CATEGORY_COLORS, CURRENCIES } from '../lib/supabase';
import ExpenseModal from '../components/ExpenseModal';
import { format } from '../utils/dates';

interface ExpensesPageProps {
  expenses: Expense[];
  loading: boolean;
  onAdd: (data: Omit<Expense, 'id' | 'user_id' | 'created_at'>) => Promise<{ error: string | null }>;
  onUpdate: (id: number, data: Partial<Omit<Expense, 'id' | 'user_id' | 'created_at'>>) => Promise<{ error: string | null }>;
  onDelete: (id: number) => Promise<{ error: string | null }>;
}

export default function ExpensesPage({ expenses, loading, onAdd, onUpdate, onDelete }: ExpensesPageProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return expenses.filter(e => {
      if (filterCategory !== 'All' && e.category !== filterCategory) return false;
      if (filterFrom && e.date < filterFrom) return false;
      if (filterTo && e.date > filterTo) return false;
      if (search && !e.title.toLowerCase().includes(search.toLowerCase()) &&
          !(e.notes || '').toLowerCase().includes(search.toLowerCase()) &&
          !e.category.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [expenses, filterCategory, filterFrom, filterTo, search]);

  const totalByCurrency = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach(e => {
      map[e.currency] = (map[e.currency] ?? 0) + parseFloat(e.amount);
    });
    return map;
  }, [filtered]);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  const exportCSV = () => {
    const rows = [
      ['Date', 'Title', 'Category', 'Amount', 'Currency', 'Notes'],
      ...filtered.map(e => [e.date, e.title, e.category, e.amount, e.currency, e.notes]),
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const fmt = (n: number | string, currency: string = 'KES') => {
    const symbol = CURRENCIES.find(c => c.code === currency)?.symbol ?? 'KSh';
    const num = typeof n === 'string' ? parseFloat(n) : n;
    return `${symbol} ${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Expense History</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Track and manage your daily spending</p>
        </div>
        <button
          onClick={() => { setEditingExpense(null); setShowModal(true); }}
          className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-slate-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 text-white text-sm font-black tracking-widest transition-all duration-300 shadow-xl shadow-slate-900/20 dark:shadow-blue-600/20"
        >
          <Plus size={18} />
          NEW EXPENSE
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[280px] relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title, notes, or category..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(f => !f)}
            className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl border-2 text-sm font-black transition-all duration-300 ${
              showFilters || filterCategory !== 'All' || filterFrom || filterTo
                ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30'
                : 'border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 hover:border-blue-200'
            }`}
          >
            <Filter size={18} />
            FILTERS
            <ChevronDown size={16} className={`transition-transform duration-500 ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-5 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-sm font-black hover:border-blue-200 transition-all duration-300"
          >
            <Download size={18} />
            EXPORT
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-top-4 duration-500">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value as Category | 'All')}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">From Date</label>
              <input
                type="date"
                value={filterFrom}
                onChange={e => setFilterFrom(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">To Date</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filterTo}
                  onChange={e => setFilterTo(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button
                  onClick={() => { setFilterCategory('All'); setFilterFrom(''); setFilterTo(''); }}
                  className="px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 text-xs font-black hover:bg-rose-100 transition-all"
                >
                  CLEAR
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Chips */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-black tracking-wider uppercase">
            {filtered.length} {filtered.length === 1 ? 'Entry' : 'Entries'}
          </span>
        </div>
        <div className="flex flex-wrap gap-3 justify-end">
          {Object.entries(totalByCurrency).map(([curr, amt]) => (
            <div key={curr} className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800">
              <span className="text-[10px] font-black text-rose-400 uppercase">{curr} Total</span>
              <span className="text-sm font-black text-rose-600 dark:text-rose-400">{fmt(amt, curr)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold text-slate-400 animate-pulse">Synchronizing transactions...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-300">
            <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-6">
              <Search size={40} className="opacity-20" />
            </div>
            <p className="font-black text-xl text-slate-400">No transactions found</p>
            <p className="text-sm font-medium mt-2">Try adjusting your filters or add a new expense</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((e, idx) => (
                  <tr key={e.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300 animate-in fade-in slide-in-from-left-4" style={{ animationDelay: `${idx * 30}ms` }}>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-lg shadow-current/20 transition-transform group-hover:scale-110 group-hover:rotate-6"
                          style={{ backgroundColor: CATEGORY_COLORS[e.category as Category] }}
                        >
                          {e.category[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-base font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">{e.title}</p>
                          {e.notes && <p className="text-xs text-slate-400 font-medium truncate mt-0.5">{e.notes}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-wider">
                        {e.category}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-bold">
                        <Calendar size={14} className="opacity-50" />
                        {format(e.date)}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex flex-col items-end">
                        <p className="text-base font-black text-rose-500">{fmt(e.amount, e.currency)}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Globe size={10} className="text-slate-300" />
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{e.currency}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setEditingExpense(e); setShowModal(true); }}
                          className="p-2.5 rounded-xl text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(e.id)}
                          disabled={deletingId === e.id}
                          className="p-2.5 rounded-xl text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-500 transition-all"
                        >
                          {deletingId === e.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <ExpenseModal
          expense={editingExpense}
          onClose={() => { setShowModal(false); setEditingExpense(null); }}
          onSave={editingExpense
            ? (data) => onUpdate(editingExpense.id, data)
            : onAdd
          }
        />
      )}
    </div>
  );
}
