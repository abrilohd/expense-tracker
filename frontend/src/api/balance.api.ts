/**
 * Balance API functions
 */
import apiClient from './client';
import type { BalanceData } from '../types';

/**
 * Get balance data for the authenticated user
 * @param period - Time period: 'all', 'month', or 'year'
 */
export const getBalance = async (period: 'all' | 'month' | 'year' = 'all'): Promise<BalanceData> => {
  const response = await apiClient.get<BalanceData>('/balance', {
    params: { period },
  });
  return response.data;
};
