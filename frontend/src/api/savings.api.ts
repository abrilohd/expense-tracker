/**
 * Savings Goals API client
 * All endpoints require authentication
 */
import apiClient from './client';
import type {
  SavingsGoal,
  SavingsGoalCreate,
  SavingsGoalUpdate,
  SavingsGoalListResponse,
  SavingsGoalStatus,
} from '../types';

/**
 * Create a new savings goal
 */
export const createSavingsGoal = async (goal: SavingsGoalCreate): Promise<SavingsGoal> => {
  const response = await apiClient.post<SavingsGoal>('/savings-goals', goal);
  return response.data;
};

/**
 * Get all savings goals with optional status filter
 */
export const getSavingsGoals = async (
  statusFilter?: SavingsGoalStatus
): Promise<SavingsGoalListResponse> => {
  const params = statusFilter ? { status_filter: statusFilter } : {};
  const response = await apiClient.get<SavingsGoalListResponse>('/savings-goals', { params });
  return response.data;
};

/**
 * Get a single savings goal by ID
 */
export const getSavingsGoalById = async (goalId: number): Promise<SavingsGoal> => {
  const response = await apiClient.get<SavingsGoal>(`/savings-goals/${goalId}`);
  return response.data;
};

/**
 * Update a savings goal
 */
export const updateSavingsGoal = async (
  goalId: number,
  goal: SavingsGoalUpdate
): Promise<SavingsGoal> => {
  const response = await apiClient.put<SavingsGoal>(`/savings-goals/${goalId}`, goal);
  return response.data;
};

/**
 * Delete a savings goal
 */
export const deleteSavingsGoal = async (goalId: number): Promise<void> => {
  await apiClient.delete(`/savings-goals/${goalId}`);
};
