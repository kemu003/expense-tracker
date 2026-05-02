import { useState, useMemo } from 'react';
import { Plus, Search, Trash2, Pencil, Filter, Download, ChevronDown } from 'lucide-react';
import { Expense, CATEGORIES, Category, CATEGORY_COLORS } from '../lib/supabase';
import ExpenseModal from '../components/ExpenseModal';
import { format } from '../utils/dates';

interface ExpensesPageProps {
  expenses: Expense[];
  loading: boolean;
  onAdd: (data: Omit<Expense, 'id' | 'user_id' | 'created_at'>) => Promise<{ error: string | null }>;
  onUpdate: (id: string, data: Partial<Omit<Expense, 'id' | 'user_id' | 'created_at'>>) => Promise<{ error: string | null }>;
  onDelete: (id: string) => Promise<{ error: string | null }>;
}

export default function ExpensesPage({ expenses, loading, onAdd, onUpdate, onDelete }: ExpensesPageProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return expenses.filter(e => {
      if (filterCategory !== 'All' && e.category !== filterCategory) return false;
      if (filterFrom && e.date < filterFrom) return false;
      if (filterTo && e.date > filterTo) return false;
      if (search && !e.title.toLowerCase().includes(search.toLowerCase()) &&
          !e.notes.toLowerCase().includes(search.toLowerCase()) &&
          !e.category.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [expenses, filterCategory, filterFrom, filterTo, search]);

  const total = filtered.reduce((s, e) => s + e.amount, 0);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  const exportCSV = () => {
    const rows = [
      ['Date', 'Title', 'Category', 'Amount', 'Notes'],
      ...filtered.map(e => [e.date, e.title, e.category, e.amount.toFixed(2), e.notes]),
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

  const fmt = (n: number) => 'KSh ' + n.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-56 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search expenses..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
          />
        </div>
        <button
          onClick={() => setShowFilters(f => !f)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
            showFilters || filterCategory !== 'All' || filterFrom || filterTo
              ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950'
              : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 hover:border-slate-300'
          }`}
        >
          <Filter size={16} />
          Filters
          <ChevronDown size={14} className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
        </button>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-sm font-semibold hover:border-slate-300 transition-all duration-200"
        >
          <Download size={16} />
          Export
        </button>
        <button
          onClick={() => { setEditingExpense(null); setShowModal(true); }}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50"
        >
          <Plus size={16} />
          Add Expense
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-wrap gap-4 animate-in slide-in-from-top-2 duration-300">
          <div className="flex-1 min-w-40">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Category</label>
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value as Category | 'All')}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-36">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">From</label>
            <input
              type="date"
              value={filterFrom}
              onChange={e => setFilterFrom(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="flex-1 min-w-36">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">To</label>
            <input
              type="date"
              value={filterTo}
              onChange={e => setFilterTo(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => { setFilterCategory('All'); setFilterFrom(''); setFilterTo(''); }}
              className="px-4 py-2.5 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="flex items-center justify-between px-2">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {filtered.length} {filtered.length === 1 ? 'expense' : 'expenses'} found
        </p>
        <p className="text-sm font-bold text-slate-900 dark:text-white">
          Total: <span className="text-red-500 dark:text-red-400">{fmt(total)}</span>
        </p>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
            <Search size={40} className="mb-3 opacity-20" />
            <p className="text-sm font-medium">No expenses found</p>
            {search || filterCategory !== 'All' ? <p className="text-xs mt-1">Try adjusting your filters</p> : null}
          </div>
        ) : (
          <>
            <div className="hidden sm:grid grid-cols-[1fr_100px_120px_100px_96px] gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50">
              <span>Title</span>
              <span>Category</span>
              <span>Date</span>
              <span className="text-right">Amount</span>
              <span className="text-right">Actions</span>
            </div>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((e, idx) => (
                <li key={e.id} className="flex sm:grid sm:grid-cols-[1fr_100px_120px_100px_96px] gap-4 items-center px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200 group animate-in fade-in duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md"
                      style={{ backgroundColor: CATEGORY_COLORS[e.category as Category] }}
                    >
                      {e.category[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{e.title}</p>
                      {e.notes && <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{e.notes}</p>}
                    </div>
                  </div>
                  <span className="hidden sm:block text-xs text-slate-600 dark:text-slate-400 font-medium">{e.category}</span>
                  <span className="hidden sm:block text-xs text-slate-600 dark:text-slate-400">{format(e.date)}</span>
                  <span className="hidden sm:block text-sm font-bold text-red-500 dark:text-red-400 text-right">{fmt(e.amount)}</span>
                  <div className="hidden sm:flex items-center justify-end gap-1">
                    <button
                      onClick={() => { setEditingExpense(e); setShowModal(true); }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(e.id)}
                      disabled={deletingId === e.id}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-500 transition-colors duration-200 disabled:opacity-50 opacity-0 group-hover:opacity-100"
                    >
                      {deletingId === e.id ? <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                  <div className="sm:hidden ml-auto flex items-center gap-2">
                    <span className="text-sm font-bold text-red-500">{fmt(e.amount)}</span>
                    <button onClick={() => { setEditingExpense(e); setShowModal(true); }} className="text-slate-400 hover:text-blue-500"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(e.id)} disabled={deletingId === e.id} className="text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </li>
              ))}
            </ul>
          </>
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
