export type Category = 'Food' | 'Transport' | 'Bills' | 'Shopping' | 'Entertainment' | 'Health' | 'Other';

export const CATEGORIES: Category[] = ['Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Other'];

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: '#f97316',
  Transport: '#3b82f6',
  Bills: '#ef4444',
  Shopping: '#ec4899',
  Entertainment: '#8b5cf6',
  Health: '#22c55e',
  Other: '#94a3b8',
};

export interface Expense {
  id: number;
  user_id: number;
  title: string;
  amount: string;
  category: Category;
  date: string;
  notes: string;
  created_at: string;
}

export interface Income {
  id: number;
  user_id: number;
  amount: string;
  source: string;
  date: string;
  notes: string;
  created_at: string;
}

export interface Budget {
  id: number;
  user_id: number;
  category: Category;
  month: string;
  amount: string;
  created_at: string;
}

export interface DashboardStats {
  today_expenses: string;
  week_expenses: string;
  month_expenses: string;
  month_income: string;
  balance: string;
}

export interface CategoryBreakdown {
  label: string;
  value: string;
  percentage: number;
}

export interface MonthlyTrends {
  months: string[];
  expenses: number[];
  income: number[];
}
