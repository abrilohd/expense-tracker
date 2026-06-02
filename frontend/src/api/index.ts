/**
 * Centralized API exports
 * Import all API functions from a single location
 */

// Core client
export { default as apiClient } from './client';

// API modules
export * as authApi from './auth.api';
export * as adminApi from './admin.api';
export * as dashboardApi from './dashboard.api';
export * as expenseApi from './expenses.api';
export * as incomeApi from './income.api';
export * as budgetApi from './budgets.api';
export * as recurringApi from './recurring.api';
export * as reportApi from './reports.api';
export * as savingsApi from './savings.api';
export * as balanceApi from './balance.api';
