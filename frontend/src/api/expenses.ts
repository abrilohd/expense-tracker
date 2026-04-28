/**
 * Type-safe API functions for all backend endpoints
 */
import apiClient from './client';
import type {
  User,
  AuthTokens,
  Expense,
  ExpenseCreate,
  ExpenseUpdate,
  ExpenseListResponse,
  FilterParams,
  DashboardData,
  InsightsResponse,
} from '../types';

// ============================================
// AUTHENTICATION
// ============================================

/**
 * Login with email and password
 * Note: FastAPI OAuth2 requires form data, not JSON
 */
export const login = async (email: string, password: string): Promise<AuthTokens> => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const response = await apiClient.post<AuthTokens>('/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
};

/**
 * Register new user account
 */
export const register = async (email: string, password: string): Promise<User> => {
  const response = await apiClient.post<User>('/auth/register', {
    email,
    password,
  });

  return response.data;
};

/**
 * Get current authenticated user profile
 */
export const getMe = async (): Promise<User> => {
  const response = await apiClient.get<User>('/auth/me');
  return response.data;
};

/**
 * Update user password
 */
export const updatePassword = async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
  const response = await apiClient.put<{ message: string }>('/auth/update-password', {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return response.data;
};

// ============================================
// EXPENSES
// ============================================

/**
 * Get list of expenses with optional filters
 */
export const getExpenses = async (params?: FilterParams): Promise<ExpenseListResponse> => {
  const response = await apiClient.get<ExpenseListResponse>('/expenses', {
    params,
  });

  return response.data;
};

/**
 * Get single expense by ID
 */
export const getExpense = async (id: number): Promise<Expense> => {
  const response = await apiClient.get<Expense>(`/expenses/${id}`);
  return response.data;
};

/**
 * Create new expense
 */
export const createExpense = async (data: ExpenseCreate): Promise<Expense> => {
  const response = await apiClient.post<Expense>('/expenses', data);
  return response.data;
};

/**
 * Update existing expense
 */
export const updateExpense = async (id: number, data: ExpenseUpdate): Promise<Expense> => {
  const response = await apiClient.put<Expense>(`/expenses/${id}`, data);
  return response.data;
};

/**
 * Delete expense by ID
 */
export const deleteExpense = async (id: number): Promise<void> => {
  await apiClient.delete(`/expenses/${id}`);
};

// ============================================
// DASHBOARD & INSIGHTS
// ============================================

/**
 * Get dashboard analytics and summary
 */
export const getDashboard = async (): Promise<DashboardData> => {
  const response = await apiClient.get<DashboardData>('/dashboard');
  return response.data;
};

/**
 * Get AI-powered spending insights
 */
export const getInsights = async (days: number = 30): Promise<InsightsResponse> => {
  const response = await apiClient.get<InsightsResponse>('/insights', {
    params: { days },
  });

  return response.data;
};
