/**
 * Budget API client - handles all budget-related API calls
 */
import apiClient from './client';
import type {
  Budget,
  BudgetListResponse,
  BudgetStatusListResponse,
  BudgetAlert,
} from '../types';

// Backend expects this format
interface BudgetCreatePayload {
  budget_type: 'category' | 'overall';
  category?: string;
  amount: number;
  period_start: string; // YYYY-MM-DD
  period_end: string; // YYYY-MM-DD
}

interface BudgetUpdatePayload {
  budget_type?: 'category' | 'overall';
  category?: string;
  amount?: number;
  period_start?: string;
  period_end?: string;
}

/**
 * Create a new budget
 */
export const createBudget = async (budget: BudgetCreatePayload): Promise<Budget> => {
  const response = await apiClient.post<Budget>('/budgets', budget);
  return response.data;
};

/**
 * Get all budgets for the current user
 */
export const getBudgets = async (activeOnly: boolean = false, budgetType?: string): Promise<BudgetListResponse> => {
  const params: Record<string, any> = { active_only: activeOnly };
  if (budgetType) {
    params.budget_type = budgetType;
  }
  const response = await apiClient.get<BudgetListResponse>('/budgets', { params });
  return response.data;
};

/**
 * Get budget status with utilization for all budgets
 */
export const getBudgetStatus = async (activeOnly: boolean = true): Promise<BudgetStatusListResponse> => {
  const response = await apiClient.get<BudgetStatusListResponse>('/budgets/status', {
    params: { active_only: activeOnly },
  });
  return response.data;
};

/**
 * Get budget alerts (budgets in warning or exceeded status)
 */
export const getBudgetAlerts = async (): Promise<BudgetAlert[]> => {
  const response = await apiClient.get<BudgetAlert[]>('/budgets/alerts');
  return response.data;
};

/**
 * Get a single budget by ID
 */
export const getBudget = async (budgetId: number): Promise<Budget> => {
  const response = await apiClient.get<Budget>(`/budgets/${budgetId}`);
  return response.data;
};

/**
 * Update an existing budget
 */
export const updateBudget = async (budgetId: number, budget: BudgetUpdatePayload): Promise<Budget> => {
  const response = await apiClient.put<Budget>(`/budgets/${budgetId}`, budget);
  return response.data;
};

/**
 * Delete a budget
 */
export const deleteBudget = async (budgetId: number): Promise<void> => {
  await apiClient.delete(`/budgets/${budgetId}`);
};
