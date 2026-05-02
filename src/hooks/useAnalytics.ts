import { useState, useEffect, useCallback } from 'react';
import { CategoryBreakdown, MonthlyTrends } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../lib/api';

export function useAnalytics() {
  const { user } = useAuth();
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrends | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCategoryBreakdown = useCallback(async () => {
    if (!user) return;
    try {
      const data = await apiClient.getCategoryBreakdown();
      setCategoryBreakdown(data);
    } catch (error) {
      console.error('Failed to fetch category breakdown:', error);
      setCategoryBreakdown([]);
    }
  }, [user]);

  const fetchMonthlyTrends = useCallback(async () => {
    if (!user) return;
    try {
      const data = await apiClient.getMonthlyTrends();
      setMonthlyTrends(data);
    } catch (error) {
      console.error('Failed to fetch monthly trends:', error);
      setMonthlyTrends(null);
    }
  }, [user]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchCategoryBreakdown(), fetchMonthlyTrends()]);
    setLoading(false);
  }, [fetchCategoryBreakdown, fetchMonthlyTrends]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    categoryBreakdown,
    monthlyTrends,
    loading,
    refetch: fetchAll,
    refetchCategoryBreakdown: fetchCategoryBreakdown,
    refetchMonthlyTrends: fetchMonthlyTrends
  };
}