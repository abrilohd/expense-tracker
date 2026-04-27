/**
 * Custom hook for dark mode management
 * - Reads initial state from localStorage
 * - Respects system preference as default
 * - Toggles "dark" class on document.documentElement
 * - Persists preference to localStorage
 */
import { useState, useEffect } from 'react';
import { THEME_KEY } from '../utils/constants';

type Theme = 'light' | 'dark';

interface UseDarkModeReturn {
  isDark: boolean;
  toggle: () => void;
  setDark: (dark: boolean) => void;
  toggleDark: () => void; // Deprecated: use toggle instead
  setTheme: (theme: Theme) => void; // Deprecated: use setDark instead
}

/**
 * Get system color scheme preference
 */
const getSystemPreference = (): Theme => {
  if (typeof window === 'undefined') return 'dark';
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/**
 * Get initial theme from localStorage or system preference
 */
const getInitialTheme = (): Theme => {
  // Check localStorage first
  const savedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
  
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }
  
  // Fall back to system preference (default to dark for Fundex design)
  return getSystemPreference();
};

/**
 * Apply theme to document
 */
const applyTheme = (theme: Theme): void => {
  const root = document.documentElement;
  
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  // Persist to localStorage
  localStorage.setItem(THEME_KEY, theme);
};

/**
 * Custom hook for dark mode management
 */
export const useDarkMode = (): UseDarkModeReturn => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Apply theme on mount and when it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't set a preference
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (!savedTheme) {
        const newTheme = e.matches ? 'dark' : 'light';
        setThemeState(newTheme);
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  // Toggle between light and dark
  const toggleDark = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Set specific theme
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // Set dark mode directly
  const setDark = (dark: boolean) => {
    setThemeState(dark ? 'dark' : 'light');
  };

  return {
    isDark: theme === 'dark',
    toggle: toggleDark, // Primary API
    setDark, // Primary API
    toggleDark, // Backward compatibility
    setTheme, // Backward compatibility
  };
};

export default useDarkMode;
