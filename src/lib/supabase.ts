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
  id: string;
  user_id: string;
  title: string;
  amount: number;
  category: Category;
  date: string;
  notes: string;
  created_at: string;
}

export interface Income {
  id: string;
  user_id: string;
  amount: number;
  source: string;
  date: string;
  notes: string;
  created_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category: Category;
  month: string;
  amount: number;
  created_at: string;
}
