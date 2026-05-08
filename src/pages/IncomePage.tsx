import { useState, useMemo } from 'react';
import { Plus, Trash2, Pencil, Wallet, Calendar, Globe, Loader2 } from 'lucide-react';
import { Income, CURRENCIES } from '../lib/supabase';
import IncomeModal from '../components/IncomeModal';
import { format } from '../utils/dates';

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

  const fmt = (n: number | string, currency: string = 'KES') => {
    const symbol = CURRENCIES.find(c => c.code === currency)?.symbol ?? 'KSh';
    const num = typeof n === 'string' ? parseFloat(n) : n;
    return `${symbol} ${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Earnings History</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Monitor your incoming wealth and revenue sources</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowModal(true); }}
          className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black tracking-widest transition-all duration-300 shadow-xl shadow-emerald-600/20"
        >
          <Plus size={18} />
          ADD INCOME
        </button>
      </div>

      {/* Summary Chips */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-black tracking-wider uppercase">
            {income.length} {income.length === 1 ? 'Entry' : 'Entries'}
          </span>
        </div>
        <div className="flex flex-wrap gap-3 justify-end">
          {Object.entries(totalByCurrency).map(([curr, amt]) => (
            <div key={curr} className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
              <span className="text-[10px] font-black text-emerald-400 uppercase">{curr} Total</span>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{fmt(amt, curr)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold text-slate-400 animate-pulse">Updating income records...</p>
          </div>
        ) : income.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-300">
            <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-6">
              <Wallet size={40} className="opacity-20" />
            </div>
            <p className="font-black text-xl text-slate-400">No income recorded</p>
            <p className="text-sm font-medium mt-2">Start by adding your first revenue source</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Source</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {income.map((e, idx) => (
                  <tr key={e.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300 animate-in fade-in slide-in-from-left-4" style={{ animationDelay: `${idx * 30}ms` }}>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-600/10 transition-transform group-hover:scale-110 group-hover:rotate-6">
                          <Wallet size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-base font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 transition-colors">{e.source}</p>
                          {e.notes && <p className="text-xs text-slate-400 font-medium truncate mt-0.5">{e.notes}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-bold">
                        <Calendar size={14} className="opacity-50" />
                        {format(e.date)}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex flex-col items-end">
                        <p className="text-base font-black text-emerald-600">{fmt(e.amount, e.currency)}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Globe size={10} className="text-slate-300" />
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{e.currency}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setEditing(e); setShowModal(true); }}
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
        <IncomeModal
          income={editing}
          onClose={() => { setShowModal(false); setEditing(null); }}
          onSave={editing ? (data) => onUpdate(editing.id, data) : onAdd}
        />
      )}
    </div>
  );
}
