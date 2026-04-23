/**
 * Utility functions for formatting data
 */
import { format, parseISO, formatDistanceToNow } from 'date-fns';

/**
 * Format number as currency with locale support
 * @example formatCurrency(1234.56) → "$1,234.56"
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format ISO date string to readable format
 * @example formatDate("2026-04-23") → "Apr 23, 2026"
 */
export const formatDate = (dateStr: string): string => {
  return format(parseISO(dateStr), 'MMM dd, yyyy');
};

/**
 * Format date as relative time
 * @example formatRelativeDate("2026-04-21") → "2 days ago"
 */
export const formatRelativeDate = (dateStr: string): string => {
  return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
};

/**
 * Format month string to readable format
 * @example formatMonth("2026-04") → "Apr 2026"
 */
export const formatMonth = (monthStr: string): string => {
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return format(date, 'MMM yyyy');
};

/**
 * Get Tailwind CSS classes for category colors
 * @returns Object with bg and text color classes
 */
export const getCategoryColor = (category: string): { bg: string; text: string } => {
  const colors: Record<string, { bg: string; text: string }> = {
    Food: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400' },
    Transport: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
    Housing: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' },
    Entertainment: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-400' },
    Health: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
    Shopping: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400' },
    Education: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-400' },
    Other: { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-700 dark:text-gray-400' },
  };

  return colors[category] || colors.Other;
};

/**
 * Get emoji for expense category
 */
export const getCategoryEmoji = (category: string): string => {
  const emojis: Record<string, string> = {
    Food: '🍔',
    Transport: '🚗',
    Housing: '🏠',
    Entertainment: '🎬',
    Health: '💊',
    Shopping: '🛍️',
    Education: '📚',
    Other: '📦',
  };

  return emojis[category] || emojis.Other;
};

/**
 * Truncate text to specified length with ellipsis
 * @example truncateText("Long text here", 10) → "Long text..."
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
