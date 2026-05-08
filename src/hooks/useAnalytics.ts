import { useState, useEffect, useCallback } from 'react';
import { CategoryBreakdown, MonthlyTrends } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../lib/api';

export function useAnalytics() {
  const { user } = useAuth();
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrends | null>(null);
  const [insights, setInsights] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [monthlySummary, setMonthlySummary] = useState<any | null>(null);
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

  const fetchInsights = useCallback(async () => {
    if (!user) return;
    try {
      const data = await apiClient.getInsights();
      setInsights(data);
    } catch (error) {
      console.error('Failed to fetch insights:', error);
      setInsights([]);
    }
  }, [user]);

  const fetchRecommendations = useCallback(async () => {
    if (!user) return;
    try {
      const data = await apiClient.getRecommendations();
      setRecommendations(data);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      setRecommendations([]);
    }
  }, [user]);

  const fetchMonthlySummary = useCallback(async () => {
    if (!user) return;
    try {
      const data = await apiClient.getMonthlySummary();
      setMonthlySummary(data);
    } catch (error) {
      console.error('Failed to fetch monthly summary:', error);
      setMonthlySummary(null);
    }
  }, [user]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchCategoryBreakdown(),
      fetchMonthlyTrends(),
      fetchInsights(),
      fetchRecommendations(),
      fetchMonthlySummary()
    ]);
    setLoading(false);
  }, [fetchCategoryBreakdown, fetchMonthlyTrends, fetchInsights, fetchRecommendations, fetchMonthlySummary]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    categoryBreakdown,
    monthlyTrends,
    insights,
    recommendations,
    monthlySummary,
    loading,
    refetch: fetchAll,
    refetchCategoryBreakdown: fetchCategoryBreakdown,
    refetchMonthlyTrends: fetchMonthlyTrends,
    refetchInsights: fetchInsights,
    refetchRecommendations: fetchRecommendations,
    refetchMonthlySummary: fetchMonthlySummary
  };
}