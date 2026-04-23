/**
 * TypeScript types matching FastAPI backend exactly
 */

// Expense category enum - matches backend validation
export const enum ExpenseCategory {
  Food = 'Food',
  Transport = 'Transport',
  Housing = 'Housing',
  Entertainment = 'Entertainment',
  Health = 'Health',
  Shopping = 'Shopping',
  Education = 'Education',
  Other = 'Other',
}

// User model from backend
export interface User {
  id: number;
  email: string;
  is_active: boolean;
  created_at: string;
}

// Expense model from backend
export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // ISO date string (YYYY-MM-DD)
  description?: string;
  user_id: number;
}

// Create expense request payload
export interface ExpenseCreate {
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // ISO date string (YYYY-MM-DD)
  description?: string;
}

// Update expense request payload (all fields optional)
export type ExpenseUpdate = Partial<ExpenseCreate>;

// Paginated expense list response
export interface ExpenseListResponse {
  items: Expense[];
  total: number;
  skip: number;
  limit: number;
}

// Filter parameters for GET /expenses
export interface FilterParams {
  category?: ExpenseCategory;
  search?: string;
  start_date?: string; // ISO date string
  end_date?: string; // ISO date string
  min_amount?: number;
  max_amount?: number;
  sort_by?: 'date' | 'amount';
  order?: 'asc' | 'desc';
  skip?: number;
  limit?: number;
}

// Category summary from dashboard
export interface CategorySummary {
  category: string;
  total: number;
  count: number;
  percentage: number;
}

// Monthly trend data from dashboard
export interface MonthlyTrend {
  month: string; // Format: "YYYY-MM"
  total: number;
  count: number;
}

// Dashboard analytics response
export interface DashboardData {
  total_expenses: number;
  total_count: number;
  average_expense: number;
  highest_expense: number;
  lowest_expense: number;
  current_month_total: number;
  current_month_count: number;
  categories: CategorySummary[];
  monthly_trends: MonthlyTrend[];
  recent_expenses: Expense[];
}

// Insight type from AI insights
export type InsightType = 'warning' | 'success' | 'tip' | 'info';

// Individual insight from AI analysis
export interface Insight {
  type: InsightType;
  title: string;
  message: string;
  value?: number;
}

// AI insights response
export interface InsightsResponse {
  insights: Insight[];
  generated_at: string; // ISO datetime string
  period_days: number;
}

// JWT authentication tokens
export interface AuthTokens {
  access_token: string;
  token_type: string;
}

// API error response format
export interface ApiError {
  error: boolean;
  status_code: number;
  message: string;
  details?: string | string[];
}
