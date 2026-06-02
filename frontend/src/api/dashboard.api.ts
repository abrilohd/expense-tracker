/**
 * Dashboard API - Analytics and insights endpoints
 */
import apiClient from './client';
import type { DashboardData, InsightsResponse } from '../types';

/**
 * Get dashboard analytics and summary
 * Includes expense totals, category breakdown, monthly trends, and recent transactions
 */
export const getDashboard = async (): Promise<DashboardData> => {
  const response = await apiClient.get<DashboardData>('/dashboard');
  return response.data;
};

/**
 * Get AI-powered spending insights
 * @param days - Number of days to analyze (default: 30)
 */
export const getInsights = async (days: number = 30): Promise<InsightsResponse> => {
  const response = await apiClient.get<InsightsResponse>('/insights', {
    params: { days },
  });
  return response.data;
};
