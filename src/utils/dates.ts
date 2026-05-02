export function format(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function startOfWeek(): string {
  const d = new Date();
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d.toISOString().split('T')[0];
}

export function startOfMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

export function currentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function monthLabel(yyyyMM: string): string {
  const [y, m] = yyyyMM.split('-');
  return new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function parseISO(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00');
}

export function isToday(dateStr: string): boolean {
  return dateStr === new Date().toISOString().split('T')[0];
}

export function isAfter(dateStr: string, ref: string): boolean {
  return dateStr > ref;
}

export function isBefore(dateStr: string, ref: string): boolean {
  return dateStr < ref;
}

export function last6Months(): string[] {
  const months: string[] = [];
  const d = new Date();
  for (let i = 5; i >= 0; i--) {
    const m = new Date(d.getFullYear(), d.getMonth() - i, 1);
    months.push(`${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}`);
  }
  return months;
}
