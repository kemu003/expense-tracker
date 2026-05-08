import { useState, useEffect, useCallback } from 'react';
import { Budget } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../lib/api';

export function useBudgets() {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBudgets = useCallback(async (params?: { month?: string }) => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await apiClient.getBudgets(params);
      setBudgets(data || []);
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
      setBudgets([]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const addBudget = async (budget: Omit<Budget, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return { error: 'Not authenticated' };
    try {
      await apiClient.createBudget({
        category: budget.category,
        month: budget.month,
        amount: budget.amount,
        currency: budget.currency || 'KES',
      });
      await fetchBudgets();
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  };

  const updateBudget = async (id: number, updates: Partial<Omit<Budget, 'id' | 'user_id' | 'created_at'>>) => {
    try {
      const updateData: any = {};
      if (updates.category) updateData.category = updates.category;
      if (updates.month) updateData.month = updates.month;
      if (updates.amount) updateData.amount = updates.amount;
      if (updates.currency) updateData.currency = updates.currency;

      await apiClient.updateBudget(id, updateData);
      await fetchBudgets();
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  };

  const deleteBudget = async (id: number) => {
    try {
      await apiClient.deleteBudget(id);
      setBudgets(prev => prev.filter(b => b.id !== id));
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  };

  return { budgets, loading, refetch: fetchBudgets, addBudget, updateBudget, deleteBudget };
}