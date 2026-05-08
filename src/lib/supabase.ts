export type Category = 'Food' | 'Transport' | 'Bills' | 'Shopping' | 'Entertainment' | 'Health' | 'Other';
export type Currency = 'KES' | 'USD' | 'EUR' | 'GBP' | 'NGN' | 'ZAR';

export const CATEGORIES: Category[] = ['Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Other'];
export const CURRENCIES: { code: Currency; name: string; symbol: string }[] = [
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
];

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
  currency: Currency;
  category: Category;
  date: string;
  notes: string;
  created_at: string;
}

export interface Income {
  id: number;
  user_id: number;
  amount: string;
  currency: Currency;
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
  currency: Currency;
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
