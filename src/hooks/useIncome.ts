import { useState, useEffect, useCallback } from 'react';
import { Income } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../lib/api';

export function useIncome() {
  const { user } = useAuth();
  const [income, setIncome] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIncome = useCallback(async (params?: { date_from?: string; date_to?: string; search?: string }) => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await apiClient.getIncome(params);
      setIncome(data || []);
    } catch (error) {
      console.error('Failed to fetch income:', error);
      setIncome([]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchIncome();
  }, [fetchIncome]);

  const addIncome = async (entry: Omit<Income, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return { error: 'Not authenticated' };
    try {
      await apiClient.createIncome({
        amount: entry.amount,
        source: entry.source,
        date: entry.date,
        notes: entry.notes,
      });
      await fetchIncome();
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  };

  const updateIncome = async (id: number, updates: Partial<Omit<Income, 'id' | 'user_id' | 'created_at'>>) => {
    try {
      const updateData: any = {};
      if (updates.amount) updateData.amount = updates.amount;
      if (updates.source) updateData.source = updates.source;
      if (updates.date) updateData.date = updates.date;
      if (updates.notes) updateData.notes = updates.notes;

      await apiClient.updateIncome(id, updateData);
      await fetchIncome();
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  };

  const deleteIncome = async (id: number) => {
    try {
      await apiClient.deleteIncome(id);
      setIncome(prev => prev.filter(e => e.id !== id));
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  };

  return { income, loading, refetch: fetchIncome, addIncome, updateIncome, deleteIncome };
}
