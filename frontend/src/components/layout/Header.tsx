/**
 * Header component with menu toggle, dark mode, and user dropdown
 */
import { useState, useEffect, useRef } from 'react';
import { Menu, Sun, Moon, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useDarkMode } from '../../hooks/useDarkMode';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

const Header = ({ onMenuClick, title }: HeaderProps) => {
  const { user, logout } = useAuthStore();
  const { isDark, toggleDark } = useDarkMode();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Get user initials for avatar
  const getUserInitial = () => {
    return user?.email.charAt(0).toUpperCase() || 'U';
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 h-16">
      <div className="h-full px-4 py-3 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <Menu size={24} />
          </button>

          {/* Page title */}
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            {title}
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* User avatar with dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 bg-blue-600 text-white font-semibold rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              {getUserInitial()}
            </button>

            {/* Dropdown menu */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2"
                >
                  {/* User email */}
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Signed in as
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 truncate font-medium">
                      {user?.email}
                    </p>
                  </div>

                  {/* Logout button */}
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors"
                  >
                    <LogOut size={18} />
                    <span className="font-medium">Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
