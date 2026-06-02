/**
 * Income API functions
 */
import apiClient from './client';
import type {
  Income,
  IncomeCreate,
  IncomeUpdate,
  IncomeListResponse,
  IncomeFilterParams,
} from '../types';

/**
 * Create a new income record
 */
export const createIncome = async (data: IncomeCreate): Promise<Income> => {
  const response = await apiClient.post<Income>('/income', data);
  return response.data;
};

/**
 * Get all income with optional filters
 */
export const getIncome = async (params?: IncomeFilterParams): Promise<IncomeListResponse> => {
  const response = await apiClient.get<IncomeListResponse>('/income', { params });
  return response.data;
};

/**
 * Get a single income by ID
 */
export const getIncomeById = async (id: number): Promise<Income> => {
  const response = await apiClient.get<Income>(`/income/${id}`);
  return response.data;
};

/**
 * Update an existing income
 */
export const updateIncome = async (id: number, data: IncomeUpdate): Promise<Income> => {
  const response = await apiClient.put<Income>(`/income/${id}`, data);
  return response.data;
};

/**
 * Delete an income
 */
export const deleteIncome = async (id: number): Promise<void> => {
  await apiClient.delete(`/income/${id}`);
};
