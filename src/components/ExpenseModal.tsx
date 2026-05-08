import { useState, useEffect, FormEvent } from 'react';
import { X, Loader2, AlertCircle, Globe } from 'lucide-react';
import { Expense, CATEGORIES, Category, CURRENCIES, Currency } from '../lib/supabase';

interface ExpenseModalProps {
  expense?: Expense | null;
  onClose: () => void;
  onSave: (data: Omit<Expense, 'id' | 'user_id' | 'created_at'>) => Promise<{ error: string | null }>;
}

export default function ExpenseModal({ expense, onClose, onSave }: ExpenseModalProps) {
  const today = new Date().toISOString().split('T')[0];
  const [title, setTitle] = useState(expense?.title ?? '');
  const [amount, setAmount] = useState(expense?.amount?.toString() ?? '');
  const [currency, setCurrency] = useState<Currency>(expense?.currency ?? 'KES');
  const [category, setCategory] = useState<Category>(expense?.category ?? 'Food');
  const [date, setDate] = useState(expense?.date ?? today);
  const [notes, setNotes] = useState(expense?.notes ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const amt = parseFloat(amount);
    if (!title.trim()) { setError('Please enter a title.'); return; }
    if (isNaN(amt) || amt <= 0) { setError('Please enter a valid amount.'); return; }
    setLoading(true);
    const { error } = await onSave({ title: title.trim(), amount: amt.toFixed(2), currency, category, date, notes: notes.trim() });
    setLoading(false);
    if (error) { setError(error); return; }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50">
          <div>
            <h2 className="font-black text-slate-900 dark:text-white text-xl tracking-tight">
              {expense ? 'Edit Expense' : 'New Expense'}
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Transaction Details</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Description</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="What did you spend on?"
              className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Amount</label>
              <div className="relative">
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  required
                  placeholder="0.00"
                  className="w-full pl-4 pr-12 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-black"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                  {CURRENCIES.find(c => c.code === currency)?.symbol}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Currency</label>
              <div className="relative">
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value as Currency)}
                  className="w-full appearance-none pl-10 pr-4 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-bold text-sm"
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                  ))}
                </select>
                <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-bold"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-black border-2 transition-all duration-300 ${
                    category === cat
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/30'
                      : 'border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-blue-400 hover:text-blue-600 dark:hover:bg-blue-900/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="Add details about this expense..."
              className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium resize-none"
            />
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 flex items-center gap-3 animate-shake">
              <AlertCircle size={18} className="text-rose-600 dark:text-rose-400 flex-shrink-0" />
              <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{error}</p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 text-sm font-black text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300">
              CANCEL
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-4 rounded-2xl bg-slate-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-black tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 dark:shadow-blue-600/20">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {expense ? 'UPDATE' : 'CREATE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
