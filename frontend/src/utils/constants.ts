/**
 * Application constants and configuration
 */
import { ExpenseCategory } from '../types';

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

// API configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Pagination defaults
export const PAGE_SIZE = 10;

// Date format for API requests
export const DATE_FORMAT = 'yyyy-MM-dd';

// Local storage keys
export const TOKEN_KEY = 'expense_token';
export const THEME_KEY = 'expense_theme';
