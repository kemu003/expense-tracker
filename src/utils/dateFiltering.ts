import { Expense, Income } from '../lib/supabase';

export type DatePeriod = 'today' | 'week' | 'month' | 'year' | 'custom';

export interface DateRange {
  start: string;
  end: string;
}

/**
 * Get the start date for a given period
 */
export function getPeriodStart(period: DatePeriod, customStart?: string): string {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  switch (period) {
    case 'today':
      return today;
    case 'week': {
      const date = new Date(now);
      const dayOfWeek = date.getDay();
      const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when day is Sunday
      date.setDate(diff);
      return date.toISOString().split('T')[0];
    }
    case 'month': {
      const date = new Date(now);
      date.setDate(1);
      return date.toISOString().split('T')[0];
    }
    case 'year': {
      const date = new Date(now);
      date.setMonth(0);
      date.setDate(1);
      return date.toISOString().split('T')[0];
    }
    case 'custom':
      return customStart || today;
    default:
      return today;
  }
}

/**
 * Get the end date for a given period (usually today)
 */
export function getPeriodEnd(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get the date range for a given period
 */
export function getDateRange(period: DatePeriod, customStart?: string): DateRange {
  return {
    start: getPeriodStart(period, customStart),
    end: getPeriodEnd()
  };
}

/**
 * Filter expenses by date range
 */
export function filterExpensesByPeriod(
  expenses: Expense[],
  period: DatePeriod,
  customStart?: string
): Expense[] {
  const range = getDateRange(period, customStart);
  return expenses.filter(e => e.date >= range.start && e.date <= range.end);
}

/**
 * Filter income by date range
 */
export function filterIncomeByPeriod(
  income: Income[],
  period: DatePeriod,
  customStart?: string
): Income[] {
  const range = getDateRange(period, customStart);
  return income.filter(i => i.date >= range.start && i.date <= range.end);
}

/**
 * Get period display label
 */
export function getPeriodLabel(period: DatePeriod, customStart?: string): string {
  switch (period) {
    case 'today':
      return 'Today';
    case 'week':
      return 'This Week';
    case 'month':
      return 'This Month';
    case 'year':
      return 'This Year';
    case 'custom':
      return customStart ? `From ${customStart}` : 'Custom Range';
    default:
      return 'Unknown Period';
  }
}

/**
 * Calculate total expenses for a period
 */
export function calculateTotalExpenses(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
}

/**
 * Calculate total income for a period
 */
export function calculateTotalIncome(income: Income[]): number {
  return income.reduce((sum, i) => sum + parseFloat(i.amount), 0);
}

/**
 * Get category breakdown for a period
 */
export function getCategoryBreakdown(expenses: Expense[]): Record<string, number> {
  const breakdown: Record<string, number> = {};
  expenses.forEach(e => {
    breakdown[e.category] = (breakdown[e.category] ?? 0) + parseFloat(e.amount);
  });
  return breakdown;
}
