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
  Income,
  IncomeCreate,
  IncomeUpdate,
  IncomeListResponse,
  IncomeFilterParams,
  BudgetSimplified,
  BudgetCreateSimplified,
  SavingsGoalSimplified,
  SavingsCreateSimplified,
  SavingsContribution,
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
export const register = async (email: string, password: string, name?: string): Promise<User> => {
  const response = await apiClient.post<User>('/auth/register', {
    email,
    password,
    ...(name && { name }),
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

// ============================================
// INCOME
// ============================================

/**
 * Get list of income records with optional filters
 */
export const getIncomes = async (params?: IncomeFilterParams): Promise<IncomeListResponse> => {
  const response = await apiClient.get<IncomeListResponse>('/income', {
    params,
  });

  return response.data;
};

/**
 * Get single income record by ID
 */
export const getIncome = async (id: number): Promise<Income> => {
  const response = await apiClient.get<Income>(`/income/${id}`);
  return response.data;
};

/**
 * Create new income record
 */
export const createIncome = async (data: IncomeCreate): Promise<Income> => {
  const response = await apiClient.post<Income>('/income', data);
  return response.data;
};

/**
 * Update existing income record
 */
export const updateIncome = async (id: number, data: IncomeUpdate): Promise<Income> => {
  const response = await apiClient.put<Income>(`/income/${id}`, data);
  return response.data;
};

/**
 * Delete income record by ID
 */
export const deleteIncome = async (id: number): Promise<void> => {
  await apiClient.delete(`/income/${id}`);
};

// ============================================
// BUDGETS
// ============================================

/**
 * Get list of budgets
 */
export const getBudgets = async (): Promise<BudgetSimplified[]> => {
  const response = await apiClient.get<BudgetSimplified[]>('/budgets');
  return response.data;
};

/**
 * Create new budget
 */
export const createBudget = async (data: BudgetCreateSimplified): Promise<BudgetSimplified> => {
  const response = await apiClient.post<BudgetSimplified>('/budgets', data);
  return response.data;
};

/**
 * Update existing budget
 */
export const updateBudget = async (id: number, data: Partial<BudgetCreateSimplified>): Promise<BudgetSimplified> => {
  const response = await apiClient.put<BudgetSimplified>(`/budgets/${id}`, data);
  return response.data;
};

/**
 * Delete budget by ID
 */
export const deleteBudget = async (id: number): Promise<void> => {
  await apiClient.delete(`/budgets/${id}`);
};

// ============================================
// SAVINGS GOALS
// ============================================

/**
 * Get list of savings goals
 */
export const getSavingsGoals = async (): Promise<SavingsGoalSimplified[]> => {
  const response = await apiClient.get<SavingsGoalSimplified[]>('/savings-goals');
  return response.data;
};

/**
 * Create new savings goal
 */
export const createSavingsGoal = async (data: SavingsCreateSimplified): Promise<SavingsGoalSimplified> => {
  const response = await apiClient.post<SavingsGoalSimplified>('/savings-goals', data);
  return response.data;
};

/**
 * Update existing savings goal
 */
export const updateSavingsGoal = async (id: number, data: Partial<SavingsCreateSimplified>): Promise<SavingsGoalSimplified> => {
  const response = await apiClient.put<SavingsGoalSimplified>(`/savings-goals/${id}`, data);
  return response.data;
};

/**
 * Delete savings goal by ID
 */
export const deleteSavingsGoal = async (id: number): Promise<void> => {
  await apiClient.delete(`/savings-goals/${id}`);
};

/**
 * Add contribution to savings goal
 */
export const contributeSavings = async (id: number, data: SavingsContribution): Promise<SavingsGoalSimplified> => {
  const response = await apiClient.post<SavingsGoalSimplified>(`/savings-goals/${id}/contribute`, data);
  return response.data;
};
