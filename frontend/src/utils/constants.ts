/**
 * Application constants and configuration
 */
import { ExpenseCategory, IncomeSource } from '../types';

// Expense categories with metadata
export const CATEGORIES = [
  {
    label: 'Food',
    value: ExpenseCategory.Food,
    color: 'orange',
    emoji: '🍔',
  },
  {
    label: 'Transport',
    value: ExpenseCategory.Transport,
    color: 'blue',
    emoji: '🚗',
  },
  {
    label: 'Housing',
    value: ExpenseCategory.Housing,
    color: 'purple',
    emoji: '🏠',
  },
  {
    label: 'Entertainment',
    value: ExpenseCategory.Entertainment,
    color: 'pink',
    emoji: '🎬',
  },
  {
    label: 'Health',
    value: ExpenseCategory.Health,
    color: 'green',
    emoji: '💊',
  },
  {
    label: 'Shopping',
    value: ExpenseCategory.Shopping,
    color: 'yellow',
    emoji: '🛍️',
  },
  {
    label: 'Education',
    value: ExpenseCategory.Education,
    color: 'indigo',
    emoji: '📚',
  },
  {
    label: 'Other',
    value: ExpenseCategory.Other,
    color: 'gray',
    emoji: '📦',
  },
] as const;

// Income sources with metadata
export const INCOME_SOURCES = [
  {
    label: 'Salary',
    value: IncomeSource.Salary,
    color: 'green',
    emoji: '💼',
  },
  {
    label: 'Business',
    value: IncomeSource.Business,
    color: 'purple',
    emoji: '🏢',
  },
  {
    label: 'Freelancing',
    value: IncomeSource.Freelancing,
    color: 'blue',
    emoji: '💻',
  },
  {
    label: 'Investment',
    value: IncomeSource.Investment,
    color: 'yellow',
    emoji: '📈',
  },
  {
    label: 'Gifts',
    value: IncomeSource.Gifts,
    color: 'pink',
    emoji: '🎁',
  },
  {
    label: 'Rental',
    value: IncomeSource.Rental,
    color: 'orange',
    emoji: '🏠',
  },
  {
    label: 'Other',
    value: IncomeSource.Other,
    color: 'gray',
    emoji: '💳',
  },
] as const;

// Pagination defaults
export const PAGE_SIZE = 10;

// Date format for API requests
export const DATE_FORMAT = 'yyyy-MM-dd';

// Local storage keys
export const TOKEN_KEY = 'expense_token';
export const THEME_KEY = 'expense_theme';
