import { useState, useEffect, FormEvent } from 'react';
import { X, Loader2, AlertCircle, Globe } from 'lucide-react';
import { Income, CURRENCIES, Currency } from '../lib/supabase';

interface IncomeModalProps {
  income?: Income | null;
  onClose: () => void;
  onSave: (data: Omit<Income, 'id' | 'user_id' | 'created_at'>) => Promise<{ error: string | null }>;
}

export default function IncomeModal({ income, onClose, onSave }: IncomeModalProps) {
  const today = new Date().toISOString().split('T')[0];
  const [source, setSource] = useState(income?.source ?? '');
  const [amount, setAmount] = useState(income?.amount?.toString() ?? '');
  const [currency, setCurrency] = useState<Currency>(income?.currency ?? 'KES');
  const [date, setDate] = useState(income?.date ?? today);
  const [notes, setNotes] = useState(income?.notes ?? '');
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
    if (!source.trim()) { setError('Please enter a source.'); return; }
    if (isNaN(amt) || amt <= 0) { setError('Please enter a valid amount.'); return; }
    setLoading(true);
    const { error } = await onSave({ source: source.trim(), amount: amt.toFixed(2), currency, date, notes: notes.trim() });
    setLoading(false);
    if (error) { setError(error); return; }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto custom-scrollbar">
      <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300 min-h-0 flex-shrink-1 my-auto flex flex-col">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 flex-shrink-0">
          <h2 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">{income ? 'Edit Income' : 'Add Income'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
        <div className="overflow-y-auto overflow-x-hidden flex-1 min-h-0 custom-scrollbar">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 pb-[120px]">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Income Source</label>
            <input
              value={source}
              onChange={e => setSource(e.target.value)}
              required
              placeholder="e.g. Salary, Freelance..."
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Amount</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
                placeholder="0.00"
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Currency</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value as Currency)}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-xs sm:text-sm"
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.code}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="Add details..."
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none text-sm sm:text-base"
            />
          </div>
          {error && (
            <div className="p-2.5 sm:p-3 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 flex items-center gap-2">
              <AlertCircle size={14} className="text-red-600 dark:text-red-400 flex-shrink-0 sm:w-4 sm:h-4" />
              <p className="text-[11px] sm:text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex gap-2 sm:gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 sm:py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-60 text-white text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-green-600/30">
              {loading && <Loader2 size={14} className="animate-spin" />}
              {income ? 'Update Income' : 'Add Income'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
