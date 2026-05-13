import { useState, useMemo } from 'react';
import { Plus, Trash2, Pencil, Wallet, Calendar, Globe, Loader2 } from 'lucide-react';
import { Income } from '../lib/supabase';
import IncomeModal from '../components/IncomeModal';
import { format } from '../utils/dates';
import { formatCurrency } from '../utils/currency';

interface IncomePageProps {
  income: Income[];
  loading: boolean;
  onAdd: (data: Omit<Income, 'id' | 'user_id' | 'created_at'>) => Promise<{ error: string | null }>;
  onUpdate: (id: number, data: Partial<Omit<Income, 'id' | 'user_id' | 'created_at'>>) => Promise<{ error: string | null }>;
  onDelete: (id: number) => Promise<{ error: string | null }>;
}

export default function IncomePage({ income, loading, onAdd, onUpdate, onDelete }: IncomePageProps) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Income | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const totalByCurrency = useMemo(() => {
    const map: Record<string, number> = {};
    income.forEach(i => {
      map[i.currency] = (map[i.currency] ?? 0) + parseFloat(i.amount);
    });
    return map;
  }, [income]);

  const fmt = (n: number | string, currency: string = 'KES') => formatCurrency(n, currency);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{income.length} {income.length === 1 ? 'entry' : 'entries'}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {Object.entries(totalByCurrency).map(([curr, amt]) => (
              <p key={curr} className="text-lg font-bold text-slate-900 dark:text-white">
                {curr}: <span className="text-green-600 dark:text-green-400">{fmt(amt, curr)}</span>
              </p>
            ))}
          </div>
        </div>
        <button
          onClick={() => { setEditing(null); setShowModal(true); }}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-green-600/30"
        >
          <Plus size={16} />
          Add Income
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg">
        {loading ? (
          <div className="flex justify-center py-24"><div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : income.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
            <Wallet size={40} className="mb-3 opacity-20" />
            <p className="text-sm font-medium">No income recorded yet</p>
          </div>
        ) : (
          <>
            <div className="hidden sm:grid grid-cols-[1fr_120px_120px_96px] gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50">
              <span>Source</span>
              <span>Date</span>
              <span className="text-right">Amount</span>
              <span className="text-right">Actions</span>
            </div>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {income.map((e, idx) => (
                <li key={e.id} className="flex sm:grid sm:grid-cols-[1fr_120px_120px_120px_96px] gap-4 items-center px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200 group animate-in fade-in duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-950 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Wallet size={14} className="text-green-600 dark:text-green-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{e.source}</p>
                      {e.notes && <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{e.notes}</p>}
                    </div>
                  </div>
                  <span className="hidden sm:block text-xs text-slate-600 dark:text-slate-400">{format(e.date)}</span>
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-bold text-green-600 dark:text-green-400 text-right">{fmt(e.amount, e.currency)}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{e.currency}</span>
                  </div>
                  <div className="hidden sm:flex items-center justify-end gap-1">
                    <button onClick={() => { setEditing(e); setShowModal(true); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 transition-colors duration-200 opacity-0 group-hover:opacity-100">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(e.id)} disabled={deletingId === e.id} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-500 transition-colors duration-200 disabled:opacity-50 opacity-0 group-hover:opacity-100">
                      {deletingId === e.id ? <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                  <div className="sm:hidden ml-auto flex items-center gap-2">
                    <span className="text-sm font-bold text-green-600">{fmt(e.amount, e.currency)}</span>
                    <button onClick={() => { setEditing(e); setShowModal(true); }} className="text-slate-400 hover:text-blue-500"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(e.id)} disabled={deletingId === e.id} className="text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {showModal && (
        <IncomeModal
          income={editing}
          onClose={() => { setShowModal(false); setEditing(null); }}
          onSave={editing ? (data) => onUpdate(editing.id, data) : onAdd}
        />
      )}
    </div>
  );
}
