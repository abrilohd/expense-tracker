/**
 * Recurring Transactions API client
 */
import apiClient from './client';
import type {
  RecurringTransaction,
  RecurringTransactionCreate,
  RecurringTransactionUpdate,
  RecurringTransactionListResponse,
} from '../types';

/**
 * Create a new recurring transaction
 */
export const createRecurringTransaction = async (
  data: RecurringTransactionCreate
): Promise<RecurringTransaction> => {
  const response = await apiClient.post<RecurringTransaction>('/recurring', data);
  return response.data;
};

/**
 * Get list of recurring transactions with optional filters
 */
export const getRecurringTransactions = async (params?: {
  transaction_type?: 'expense' | 'income';
  is_active?: boolean;
  skip?: number;
  limit?: number;
}): Promise<RecurringTransactionListResponse> => {
  const response = await apiClient.get<RecurringTransactionListResponse>('/recurring', { params });
  return response.data;
};

/**
 * Get a single recurring transaction by ID
 */
export const getRecurringTransaction = async (id: number): Promise<RecurringTransaction> => {
  const response = await apiClient.get<RecurringTransaction>(`/recurring/${id}`);
  return response.data;
};

/**
 * Update a recurring transaction
 */
export const updateRecurringTransaction = async (
  id: number,
  data: RecurringTransactionUpdate
): Promise<RecurringTransaction> => {
  const response = await apiClient.put<RecurringTransaction>(`/recurring/${id}`, data);
  return response.data;
};

/**
 * Delete a recurring transaction
 */
export const deleteRecurringTransaction = async (id: number): Promise<void> => {
  await apiClient.delete(`/recurring/${id}`);
};

/**
 * Toggle active status of a recurring transaction
 */
export const toggleRecurringTransaction = async (id: number): Promise<RecurringTransaction> => {
  const response = await apiClient.post<RecurringTransaction>(`/recurring/${id}/toggle`);
  return response.data;
};

/**
 * Manually generate transaction from recurring now
 */
export const generateTransactionNow = async (id: number): Promise<{ message: string; next_occurrence: string }> => {
  const response = await apiClient.post<{ message: string; next_occurrence: string }>(
    `/recurring/${id}/generate-now`
  );
  return response.data;
};

/**
 * Get upcoming occurrence dates
 */
export const getUpcomingOccurrences = async (
  id: number,
  count?: number
): Promise<{ recurring_id: number; title: string; upcoming_dates: string[] }> => {
  const response = await apiClient.get<{ recurring_id: number; title: string; upcoming_dates: string[] }>(
    `/recurring/${id}/upcoming`,
    { params: { count } }
  );
  return response.data;
};

/**
 * Process all due recurring transactions
 */
export const processDueTransactions = async (): Promise<{
  message: string;
  results: {
    total_processed: number;
    successful: number;
    failed: number;
    deactivated: number;
  };
}> => {
  const response = await apiClient.post<{
    message: string;
    results: {
      total_processed: number;
      successful: number;
      failed: number;
      deactivated: number;
    };
  }>('/recurring/process-due');
  return response.data;
};
