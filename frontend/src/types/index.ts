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

// Income source enum - matches backend validation
export const enum IncomeSource {
  Salary = 'Salary',
  Business = 'Business',
  Freelancing = 'Freelancing',
  Investment = 'Investment',
  Gift = 'Gift',
  Rental = 'Rental',
  Other = 'Other',
}

// User model from backend
export interface User {
  id: number;
  email: string;
  name?: string;
  phone_number?: string;
  picture?: string;
  provider: string;
  is_active: boolean;
  is_admin?: boolean;
  created_at: string;
}

// Profile update request payload
export interface ProfileUpdate {
  name?: string;
  phone_number?: string;
}

// Password update request payload
export interface PasswordUpdate {
  current_password: string;
  new_password: string;
}

// Forgot password request payload
export interface ForgotPasswordRequest {
  email: string;
}

// Reset password request payload
export interface ResetPasswordRequest {
  token: string;
  new_password: string;
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

// Income model from backend
export interface Income {
  id: number;
  user_id: number;
  title: string;
  amount: number;
  source: IncomeSource;
  date: string; // ISO date string (YYYY-MM-DD)
  description?: string;
  created_at: string;
}

// Create income request payload
export interface IncomeCreate {
  title: string;
  amount: number;
  source: IncomeSource;
  date: string; // ISO date string (YYYY-MM-DD)
  description?: string;
}

// Update income request payload (all fields optional)
export type IncomeUpdate = Partial<IncomeCreate>;

// Paginated income list response
export interface IncomeListResponse {
  items: Income[];
  total: number;
  skip: number;
  limit: number;
}

// Filter parameters for GET /income
export interface IncomeFilterParams {
  source?: IncomeSource;
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

// Balance data from backend
export interface BalanceData {
  balance: number;
  total_income: number;
  total_expenses: number;
  current_month_balance: number;
  current_month_income: number;
  current_month_expenses: number;
  period: 'all' | 'month' | 'year';
  period_label: string;
  period_balance: number;
  period_income: number;
  period_expenses: number;
  prev_month_balance: number;
  balance_change_percent: number;
  trend: 'up' | 'down' | 'stable';
  income_count: number;
  expense_count: number;
}

// Budget type enum - matches backend validation
export type BudgetType = 'overall' | 'category';

// Budget status enum - matches backend validation
export type BudgetStatus = 'safe' | 'warning' | 'exceeded';

// Budget model from backend
export interface Budget {
  id: number;
  user_id: number;
  budget_type: BudgetType;
  category: string | null;
  amount: number;
  period_start: string; // ISO date string (YYYY-MM-DD)
  period_end: string; // ISO date string (YYYY-MM-DD)
  created_at: string;
}

// Create budget request payload
export interface BudgetCreate {
  budget_type: BudgetType;
  category?: string | null;
  amount: number;
  period_start: string; // ISO date string (YYYY-MM-DD)
  period_end: string; // ISO date string (YYYY-MM-DD)
}

// Update budget request payload (all fields optional)
export interface BudgetUpdate {
  budget_type?: BudgetType;
  category?: string | null;
  amount?: number;
  period_start?: string;
  period_end?: string;
}

// Budget status with utilization from backend
export interface BudgetStatusResponse {
  budget: Budget;
  spent_amount: number;
  remaining_amount: number;
  utilization_percentage: number;
  status: BudgetStatus;
  is_active: boolean;
}

// Budget list response
export interface BudgetListResponse {
  items: Budget[];
  total: number;
}

// Budget status list response
export interface BudgetStatusListResponse {
  budgets: BudgetStatusResponse[];
  total_budgets: number;
  active_budgets: number;
  warning_count: number;
  exceeded_count: number;
}

// Budget alert from backend
export interface BudgetAlert {
  budget_id: number;
  budget_name: string;
  budget_type: BudgetType;
  category: string | null;
  amount: number;
  spent_amount: number;
  utilization_percentage: number;
  status: BudgetStatus;
  severity: 'warning' | 'critical';
}

// Savings goal status enum - matches backend validation
export type SavingsGoalStatus = 'active' | 'completed' | 'cancelled';

// Savings goal model from backend
export interface SavingsGoal {
  id: number;
  user_id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string; // ISO date string (YYYY-MM-DD)
  status: SavingsGoalStatus;
  created_at: string;
  completed_at: string | null;
  // Computed fields
  progress_percentage: number;
  days_remaining: number;
  is_overdue: boolean;
}

// Create savings goal request payload
export interface SavingsGoalCreate {
  name: string;
  target_amount: number;
  deadline: string; // ISO date string (YYYY-MM-DD)
}

// Update savings goal request payload (all fields optional)
export interface SavingsGoalUpdate {
  name?: string;
  target_amount?: number;
  current_amount?: number;
  deadline?: string;
  status?: SavingsGoalStatus;
}

// Savings goal list response
export interface SavingsGoalListResponse {
  items: SavingsGoal[];
  total: number;
  active_count: number;
  completed_count: number;
  total_target: number;
  total_saved: number;
}

// Recurring Transaction types

// Transaction type and frequency
export type RecurringTransactionType = 'expense' | 'income';
export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

// Recurring transaction model
export interface RecurringTransaction {
  id: number;
  user_id: number;
  transaction_type: RecurringTransactionType;
  title: string;
  amount: number;
  category_or_source: string;
  description: string | null;
  payment_method: string | null;
  frequency: RecurringFrequency;
  start_date: string; // ISO date string
  end_date: string | null; // ISO date string
  next_occurrence: string; // ISO date string
  is_active: boolean;
  created_at: string;
  last_generated_at: string | null;
}

// Create recurring transaction request
export interface RecurringTransactionCreate {
  transaction_type: RecurringTransactionType;
  title: string;
  amount: number;
  category_or_source: string;
  description?: string;
  payment_method?: string;
  frequency: RecurringFrequency;
  start_date: string; // ISO date string
  end_date?: string; // ISO date string
}

// Update recurring transaction request
export interface RecurringTransactionUpdate {
  title?: string;
  amount?: number;
  category_or_source?: string;
  description?: string;
  payment_method?: string;
  frequency?: RecurringFrequency;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

// Recurring transaction list response
export interface RecurringTransactionListResponse {
  items: RecurringTransaction[];
  total: number;
  active_count: number;
  inactive_count: number;
}

// Report types - matches backend schemas

// Report request for custom date range
export interface ReportRequest {
  start_date: string; // ISO date string (YYYY-MM-DD)
  end_date: string; // ISO date string (YYYY-MM-DD)
}

// Quick report period options
export type QuickReportPeriod = 'this_month' | 'last_month' | 'this_year' | 'last_year' | 'last_30_days' | 'last_90_days';

// Report period information
export interface ReportPeriod {
  start_date: string;
  end_date: string;
  days: number;
}

// Report summary statistics
export interface ReportSummary {
  total_income: number;
  total_expenses: number;
  balance: number;
  income_count: number;
  expense_count: number;
  avg_daily_expense: number;
  avg_daily_income: number;
  highest_category: string | null;
  highest_source: string | null;
}

// Category/Source breakdown data
export interface CategoryData {
  total: number;
  count: number;
  percentage: number;
}

// Monthly trend data for charts
export interface ReportMonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

// Top expense item
export interface TopExpense {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
  description: string | null;
}

// Complete report response
export interface ReportResponse {
  period: ReportPeriod;
  summary: ReportSummary;
  category_breakdown: Record<string, CategoryData>;
  source_breakdown: Record<string, CategoryData>;
  top_expenses: TopExpense[];
  monthly_trends: ReportMonthlyTrend[];
  generated_at: string;
}

// ============================================
// PHASE 7 - BUDGETS & SAVINGS (SIMPLIFIED)
// ============================================

// Simplified Budget for Phase 7
export interface BudgetSimplified {
  id: number;
  category: ExpenseCategory;
  limit_amount: number;
  spent_amount: number;
  remaining: number;
  percentage: number;
  month: string;
  user_id: number;
}

// Simplified Budget Create
export interface BudgetCreateSimplified {
  category: ExpenseCategory;
  limit_amount: number;
  month?: string;
}

// Simplified Savings Goal
export interface SavingsGoalSimplified {
  id: number;
  name: string;
  target_amount: number;
  saved_amount: number;
  percentage: number;
  deadline?: string;
  emoji?: string;
  color?: string;
  user_id: number;
  created_at: string;
}

// Simplified Savings Create
export interface SavingsCreateSimplified {
  name: string;
  target_amount: number;
  deadline?: string;
  emoji?: string;
}

// Savings Contribution
export interface SavingsContribution {
  amount: number;
}
