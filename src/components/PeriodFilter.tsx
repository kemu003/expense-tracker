import { Calendar } from 'lucide-react';
import { DatePeriod, getPeriodLabel } from '../utils/dateFiltering';

interface PeriodFilterProps {
  activePeriod: DatePeriod;
  onPeriodChange: (period: DatePeriod) => void;
  customStart?: string;
}

export default function PeriodFilter({ activePeriod, onPeriodChange, customStart }: PeriodFilterProps) {
  const periods: { value: DatePeriod; label: string }[] = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Calendar size={18} className="text-slate-600 dark:text-slate-400" />
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Viewing Period</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {periods.map(period => (
          <button
            key={period.value}
            onClick={() => onPeriodChange(period.value)}
            className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 border ${
              activePeriod === period.value
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>
      {customStart && (
        <p className="text-xs text-slate-500 dark:text-slate-400 italic">
          Custom range: From {customStart}
        </p>
      )}
    </div>
  );
}
