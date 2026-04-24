/**
 * Theme-aware style utilities
 * Returns appropriate styles based on current theme
 */

/**
 * Get card background and border styles for current theme
 * Use this instead of inline styles to support both light and dark modes
 */
export const getCardStyles = (isDark: boolean) => ({
  backgroundColor: isDark ? '#141720' : '#FFFFFF',
  border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)',
});

/**
 * Get sidebar/header background and border styles
 */
export const getLayoutStyles = (isDark: boolean) => ({
  backgroundColor: isDark ? '#0F1117' : '#FFFFFF',
  border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)',
});

/**
 * Get text color for primary text
 */
export const getTextColor = (isDark: boolean) => (isDark ? '#F9FAFB' : '#1E293B');

/**
 * Get text color for secondary text
 */
export const getSecondaryTextColor = (isDark: boolean) => (isDark ? '#9CA3AF' : '#64748B');

/**
 * Get text color for tertiary/muted text
 */
export const getTertiaryTextColor = (isDark: boolean) => (isDark ? '#6B7280' : '#94A3B8');
