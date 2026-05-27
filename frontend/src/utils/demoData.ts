/**
 * Demo Data for Dashboard
 * Shows beautiful sample data on first login when user has no transactions
 * Makes the dashboard look alive and attractive immediately
 */
import type { CategorySummary, MonthlyTrend, Expense, DashboardData } from '../types';

// Demo categories for bar chart and donut chart
export const DEMO_CATEGORIES: CategorySummary[] = [
  { category: 'Housing', total: 1200, count: 1, percentage: 35 },
  { category: 'Food', total: 680, count: 12, percentage: 20 },
  { category: 'Transport', total: 420, count: 8, percentage: 12 },
  { category: 'Entertainment', total: 350, count: 5, percentage: 10 },
  { category: 'Health', total: 280, count: 3, percentage: 8 },
  { category: 'Shopping', total: 240, count: 6, percentage: 7 },
  { category: 'Education', total: 180, count: 2, percentage: 5 },
  { category: 'Other', total: 100, count: 4, percentage: 3 },
];

// Demo monthly trends for line chart and area chart
export const DEMO_MONTHLY_TRENDS: MonthlyTrend[] = [
  { month: '2025-12', total: 1800, count: 18 },
  { month: '2026-01', total: 2200, count: 22 },
  { month: '2026-02', total: 1650, count: 16 },
  { month: '2026-03', total: 2800, count: 28 },
  { month: '2026-04', total: 2100, count: 21 },
  { month: '2026-05', total: 2450, count: 24 },
];

// Demo report data for donut chart
export const DEMO_REPORT = {
  totalIncome: 6800,
  totalExpenses: 3450,
  totalSavings: 3350,
};

// Demo recent transactions
export const DEMO_RECENT: Expense[] = [
  {
    id: -1,
    title: 'House Rent',
    amount: 1200,
    category: 'Housing',
    date: '2026-05-01',
    description: 'Monthly rent payment',
    user_id: 0,
  },
  {
    id: -2,
    title: 'Groceries',
    amount: 180,
    category: 'Food',
    date: '2026-05-03',
    description: 'Weekly grocery shopping',
    user_id: 0,
  },
  {
    id: -3,
    title: 'Netflix Subscription',
    amount: 15,
    category: 'Entertainment',
    date: '2026-05-05',
    description: 'Monthly streaming service',
    user_id: 0,
  },
  {
    id: -4,
    title: 'Uber Ride',
    amount: 24,
    category: 'Transport',
    date: '2026-05-06',
    description: 'Ride to downtown',
    user_id: 0,
  },
  {
    id: -5,
    title: 'Gym Membership',
    amount: 50,
    category: 'Health',
    date: '2026-05-07',
    description: 'Monthly fitness membership',
    user_id: 0,
  },
];

/**
 * Check if dashboard should show demo data
 * Returns true when user has no real transactions yet
 */
export const checkIsDemoMode = (
  data: DashboardData | null | undefined,
  isLoading: boolean
): boolean => {
  // Don't show demo during loading
  if (isLoading) return false;
  
  // Show demo if no data
  if (!data) return true;
  
  // Show demo if user has zero transactions
  return data.total_count === 0;
};

/**
 * Get demo dashboard summary stats
 */
export const getDemoStats = () => {
  const totalExpenses = DEMO_CATEGORIES.reduce((sum, cat) => sum + cat.total, 0);
  const totalCount = DEMO_CATEGORIES.reduce((sum, cat) => sum + cat.count, 0);
  const averageExpense = totalExpenses / totalCount;
  const highestExpense = Math.max(...DEMO_CATEGORIES.map(cat => cat.total));
  const currentMonthTotal = DEMO_MONTHLY_TRENDS[DEMO_MONTHLY_TRENDS.length - 1].total;
  const currentMonthCount = DEMO_MONTHLY_TRENDS[DEMO_MONTHLY_TRENDS.length - 1].count;

  return {
    totalExpenses,
    totalCount,
    averageExpense,
    highestExpense,
    currentMonthTotal,
    currentMonthCount,
  };
};
