/**
 * Header component - Fundex-inspired design
 * Unified dark theme with sidebar, supports light/dark toggle
 */
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Sun, Moon, Bell, Search, User, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useDarkMode } from '../../hooks/useDarkMode';
import { getLayoutStyles } from '../../utils/themeStyles';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

// Subtitle mapping per route
const getSubtitle = (pathname: string): string => {
  const subtitles: Record<string, string> = {
    '/': 'Track your money, all in one place',
    '/expenses': 'Manage and review your transactions',
    '/expenses/add': 'Record a new transaction',
    '/insights': 'AI-powered spending analysis',
  };
  return subtitles[pathname] || '';
};

const Header = ({ onMenuClick, title }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { isDark, toggleDark } = useDarkMode();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const subtitle = getSubtitle(location.pathname);

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

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/expenses?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
    }
  };
  const layoutStyles = getLayoutStyles(isDark);

  return (
    <header className="sticky top-0 z-30 h-14 lg:h-16 px-4 md:px-6 flex items-center justify-between bg-white dark:bg-[#0F1117] border-b border-gray-200 dark:border-white/[0.06]">
      {/* Left Side */}
      <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg transition-colors text-gray-600 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 flex-shrink-0"
        >
          <Menu size={20} />
        </button>

        {/* Page title with subtitle */}
        <div className="min-w-0 flex-1">
          <h1 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white truncate">{title}</h1>
          {subtitle && (
            <p className="text-xs text-gray-600 dark:text-gray-500 hidden sm:block truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        {/* Search Bar - Desktop only */}
        <form onSubmit={handleSearch} className="hidden md:block">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-600"
              size={14}
            />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-48 xl:w-64 pl-9 pr-3 py-1.5 text-sm rounded-xl transition-all focus:outline-none bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-gray-300 placeholder:text-gray-500 dark:placeholder:text-gray-600 focus:border-purple-500 dark:focus:border-purple-500/50"
            />
          </div>
        </form>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDark}
          className="p-2 rounded-lg transition-all bg-gray-100 dark:bg-white/[0.05] text-gray-600 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-white/[0.08] hover:text-gray-900 dark:hover:text-gray-300"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun size={16} className="md:w-[18px] md:h-[18px]" /> : <Moon size={16} className="md:w-[18px] md:h-[18px]" />}
        </button>

        {/* Notification Bell - Hidden on small mobile */}
        <button
          className="hidden sm:block relative p-2 rounded-lg transition-all bg-gray-100 dark:bg-white/[0.05] text-gray-600 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-white/[0.08] hover:text-gray-900 dark:hover:text-gray-300"
          aria-label="Notifications"
        >
          <Bell size={16} className="md:w-[18px] md:h-[18px]" />
          {/* Red notification dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>

        {/* User Avatar Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-8 h-8 md:w-[34px] md:h-[34px] rounded-full flex items-center justify-center transition-opacity hover:opacity-90 bg-gradient-to-br from-purple-600 to-indigo-600"
          >
            <span className="text-white text-xs md:text-sm font-medium">{getUserInitial()}</span>
          </button>

          {/* Dropdown menu */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl p-1 bg-white dark:bg-[#1A1D26] border border-gray-200 dark:border-white/[0.08]"
              >
                {/* User email */}
                <div className="px-3 py-2">
                  <p className="text-xs truncate text-gray-600 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>

                {/* Divider */}
                <div className="my-1 h-px bg-gray-200 dark:bg-white/[0.06]" />

                {/* Profile */}
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.05]">
                  <User size={16} />
                  <span>Profile</span>
                </button>

                {/* Settings */}
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.05]">
                  <Settings size={16} />
                  <span>Settings</span>
                </button>

                {/* Divider */}
                <div className="my-1 h-px bg-gray-200 dark:bg-white/[0.06]" />

                {/* Logout */}
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
                >
                  <LogOut size={16} />
                  <span>Log out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
