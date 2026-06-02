/**
 * Header Component - World-class fintech design
 * Search, notifications, dark mode toggle, user menu
 */
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Sun, Moon, Bell, Search, User, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useDarkMode } from '../../hooks/useDarkMode';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

// Subtitle mapping per route
const getSubtitle = (pathname: string): string => {
  const subtitles: Record<string, string> = {
    '/': 'Track your money, all in one place',
    '/expenses': 'Manage and review your transactions',
    '/income': 'Track your income sources',
    '/reports': 'Analytics and financial reports',
    '/budgets': 'Set and monitor spending limits',
    '/savings-goals': 'Track your savings goals',
    '/recurring': 'Manage recurring transactions',
    '/insights': 'AI-powered spending analysis',
    '/profile': 'Your account information',
    '/settings': 'App preferences',
  };
  return subtitles[pathname] || '';
};

const Header = ({ onMenuClick, title }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { isDark, toggleDark } = useDarkMode();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  // Mark all notifications as read
  const handleMarkAllRead = () => {
    setHasUnreadNotifications(false);
  };

  const subtitle = getSubtitle(location.pathname);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get user initial for avatar
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

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between h-14 px-6 bg-white dark:bg-[#0B0D14] border-b border-gray-200 dark:border-white/[0.03]"
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden flex items-center justify-center flex-shrink-0 transition-colors w-9 h-9 bg-gray-100 dark:bg-white/5 rounded-lg text-gray-600 dark:text-white/50 hover:text-gray-900 dark:hover:text-white border-none cursor-pointer"
        >
          <Menu size={18} />
        </button>

        {/* Page Info */}
        <div className="min-w-0 flex-1">
          <h1
            className="font-medium truncate text-sm text-gray-900 dark:text-white"
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="truncate hidden sm:block text-[11px] text-gray-500 dark:text-white/30"
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        {/* Search Bar - Desktop only */}
        <form onSubmit={handleSearch} className="hidden md:flex">
          <div
            className="flex items-center gap-1.5 transition-all w-[200px] bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/7 rounded-lg px-3 py-1.5 focus-within:border-purple-500 dark:focus-within:border-purple-500"
          >
            <Search size={14} className="text-gray-400 dark:text-white/25" />
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-xs text-gray-700 dark:text-white/70 placeholder-gray-400 dark:placeholder-white/30"
            />
          </div>
        </form>

        {/* Notification Bell */}
        <div className="relative" ref={notifDropdownRef}>
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative flex items-center justify-center transition-all w-[34px] h-[34px] bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/7 rounded-lg text-gray-600 dark:text-white/50 hover:bg-gray-200 dark:hover:bg-white/8 hover:text-gray-900 dark:hover:text-white cursor-pointer"
          >
            <Bell size={16} />
            {/* Red notification dot - only show if unread */}
            {hasUnreadNotifications && (
              <span
                className="absolute rounded-full w-[7px] h-[7px] bg-red-500 border-2 border-white dark:border-[#0B0D14] top-1.5 right-1.5"
              />
            )}
          </button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {notifDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 z-50 w-72 mt-2 bg-white dark:bg-[#1A1D28] border border-gray-200 dark:border-white/8 rounded-xl shadow-xl"
              >
                {/* Header */}
                <div
                  className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-white/6"
                >
                  <span
                    className="font-medium text-sm text-gray-900 dark:text-white"
                  >
                    Notifications
                  </span>
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-purple-600 dark:text-[#A78BFA] bg-transparent border-none cursor-pointer hover:text-purple-700 dark:hover:text-purple-400"
                  >
                    Mark all read
                  </button>
                </div>

                {/* Notification List */}
                <div>
                  {/* Sample Notification 1 */}
                  <div
                    className="flex gap-2.5 transition-colors cursor-pointer p-2.5 hover:bg-gray-50 dark:hover:bg-white/3"
                  >
                    <div
                      className="flex items-center justify-center flex-shrink-0 rounded-full w-7 h-7 bg-purple-100 dark:bg-purple-500/20 text-base"
                    >
                      <span>💳</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-medium text-gray-900 dark:text-white"
                      >
                        Budget alert: Food category at 85%
                      </p>
                      <p
                        className="text-[10px] text-gray-500 dark:text-white/40"
                      >
                        2 hours ago
                      </p>
                    </div>
                  </div>

                  {/* Sample Notification 2 */}
                  <div
                    className="flex gap-2.5 transition-colors cursor-pointer p-2.5 hover:bg-gray-50 dark:hover:bg-white/3"
                  >
                    <div
                      className="flex items-center justify-center flex-shrink-0 rounded-full w-7 h-7 bg-green-100 dark:bg-green-500/20 text-base"
                    >
                      <span>💡</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-medium text-gray-900 dark:text-white"
                      >
                        New AI insight available
                      </p>
                      <p
                        className="text-[10px] text-gray-500 dark:text-white/40"
                      >
                        5 hours ago
                      </p>
                    </div>
                  </div>

                  {/* Sample Notification 3 */}
                  <div
                    className="flex gap-2.5 transition-colors cursor-pointer p-2.5 hover:bg-gray-50 dark:hover:bg-white/3"
                  >
                    <div
                      className="flex items-center justify-center flex-shrink-0 rounded-full w-7 h-7 bg-blue-100 dark:bg-blue-500/20 text-base"
                    >
                      <span>📊</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-medium text-gray-900 dark:text-white"
                      >
                        Monthly report ready
                      </p>
                      <p
                        className="text-[10px] text-gray-500 dark:text-white/40"
                      >
                        1 day ago
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div
                  className="text-center p-2.5 border-t border-gray-200 dark:border-white/6"
                >
                  <button
                    className="text-xs text-purple-600 dark:text-[#A78BFA] bg-transparent border-none cursor-pointer"
                  >
                    View all
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDark}
          className="flex items-center justify-center transition-all w-[34px] h-[34px] bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/7 rounded-lg text-gray-600 dark:text-white/50 hover:bg-gray-200 dark:hover:bg-white/8 hover:text-gray-900 dark:hover:text-white cursor-pointer"
          title="Toggle theme"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* User Avatar Dropdown */}
        <div className="relative" ref={userDropdownRef}>
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center justify-center rounded-full transition-opacity w-8 h-8 cursor-pointer border-none hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #5B4EE8, #9333EA)',
            }}
          >
            <span
              className="font-medium text-sm text-white"
            >
              {getUserInitial()}
            </span>
          </button>

          {/* User Dropdown */}
          <AnimatePresence>
            {userDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 z-50 w-52 mt-2 bg-white dark:bg-[#1A1D28] border border-gray-200 dark:border-white/8 rounded-xl shadow-xl p-1"
              >
                {/* User Email */}
                <div className="px-3 py-2">
                  <p
                    className="truncate text-[10px] text-gray-500 dark:text-white/40"
                  >
                    {user?.email}
                  </p>
                </div>

                {/* Divider */}
                <div
                  className="h-px bg-gray-200 dark:bg-white/6 my-1"
                />

                {/* Profile */}
                <button
                  onClick={() => {
                    navigate('/profile');
                    setUserDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 transition-colors px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-white/70 bg-transparent border-none cursor-pointer text-left hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                >
                  <User size={16} />
                  <span>Profile</span>
                </button>

                {/* Settings */}
                <button
                  onClick={() => {
                    navigate('/settings');
                    setUserDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 transition-colors px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-white/70 bg-transparent border-none cursor-pointer text-left hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </button>

                {/* Divider */}
                <div
                  className="h-px bg-gray-200 dark:bg-white/6 my-1"
                />

                {/* Logout */}
                <button
                  onClick={() => {
                    logout();
                    setUserDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 transition-colors px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 bg-transparent border-none cursor-pointer text-left hover:bg-red-50 dark:hover:bg-red-500/10"
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
