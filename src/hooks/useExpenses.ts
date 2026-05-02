import { useState, useEffect, useCallback } from 'react';
import { Expense } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../lib/api';

export function useExpenses() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = useCallback(async (params?: { category?: string; date_from?: string; date_to?: string; search?: string }) => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await apiClient.getExpenses(params);
      setExpenses(data || []);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
      setExpenses([]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = async (expense: Omit<Expense, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return { error: 'Not authenticated' };
    try {
      await apiClient.createExpense({
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        notes: expense.notes,
      });
      await fetchExpenses();
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  };

  const updateExpense = async (id: number, updates: Partial<Omit<Expense, 'id' | 'user_id' | 'created_at'>>) => {
    try {
      const updateData: any = {};
      if (updates.title) updateData.title = updates.title;
      if (updates.amount) updateData.amount = updates.amount;
      if (updates.category) updateData.category = updates.category;
      if (updates.date) updateData.date = updates.date;
      if (updates.notes) updateData.notes = updates.notes;

      await apiClient.updateExpense(id, updateData);
      await fetchExpenses();
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  };

  const deleteExpense = async (id: number) => {
    try {
      await apiClient.deleteExpense(id);
      setExpenses(prev => prev.filter(e => e.id !== id));
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  };

  return { expenses, loading, refetch: fetchExpenses, addExpense, updateExpense, deleteExpense };
}
