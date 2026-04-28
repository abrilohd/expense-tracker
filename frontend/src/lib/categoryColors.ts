/**
 * Category color mapping - Shared across all dashboard components
 */

export const CATEGORY_COLORS: Record<
  string,
  { bg: string; border: string; text: string; bar: string; chart: string }
> = {
  Health: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    text: 'text-red-400',
    bar: '#EF4444',
    chart: '#EF4444',
  },
  Transport: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
    bar: '#3B82F6',
    chart: '#3B82F6',
  },
  Food: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    bar: '#F59E0B',
    chart: '#F59E0B',
  },
  Entertainment: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    text: 'text-purple-400',
    bar: '#8B5CF6',
    chart: '#8B5CF6',
  },
  Housing: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    text: 'text-cyan-400',
    bar: '#06B6D4',
    chart: '#06B6D4',
  },
  Shopping: {
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    text: 'text-pink-400',
    bar: '#EC4899',
    chart: '#EC4899',
  },
  Education: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    text: 'text-green-400',
    bar: '#22C55E',
    chart: '#22C55E',
  },
  Other: {
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/20',
    text: 'text-gray-400',
    bar: '#6B7280',
    chart: '#6B7280',
  },
};

export const DEFAULT_COLOR = CATEGORY_COLORS.Other;

export const CATEGORY_EMOJI: Record<string, string> = {
  Transport: '🚗',
  Health: '💊',
  Food: '🍔',
  Entertainment: '🎬',
  Housing: '🏠',
  Shopping: '🛍️',
  Education: '📚',
  Other: '📦',
};
