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
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

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
      className="sticky top-0 z-30 flex items-center justify-between"
      style={{
        height: '56px',
        background: '#0B0D14',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '0 24px',
      }}
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden flex items-center justify-center flex-shrink-0 transition-colors"
          style={{
            width: '36px',
            height: '36px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '9px',
            color: 'rgba(255, 255, 255, 0.5)',
            border: 'none',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
          }}
        >
          <Menu size={18} />
        </button>

        {/* Page Info */}
        <div className="min-w-0 flex-1">
          <h1
            className="font-medium truncate"
            style={{
              fontSize: '14px',
              color: '#FFFFFF',
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="truncate hidden sm:block"
              style={{
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.3)',
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Search Bar - Desktop only */}
        <form onSubmit={handleSearch} className="hidden md:flex">
          <div
            className="flex items-center gap-1.5 transition-all"
            style={{
              width: '200px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '10px',
              padding: '7px 12px',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(91, 78, 232, 0.5)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
            }}
          >
            <Search size={14} style={{ color: 'rgba(255, 255, 255, 0.25)' }} />
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none"
              style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.7)',
              }}
            />
          </div>
        </form>

        {/* Notification Bell */}
        <div className="relative" ref={notifDropdownRef}>
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative flex items-center justify-center transition-all"
            style={{
              width: '34px',
              height: '34px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '9px',
              color: 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
            }}
          >
            <Bell size={16} />
            {/* Red notification dot */}
            <span
              className="absolute rounded-full"
              style={{
                width: '7px',
                height: '7px',
                background: '#EF4444',
                border: '2px solid #0B0D14',
                top: '6px',
                right: '6px',
              }}
            />
          </button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {notifDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 z-50"
                style={{
                  width: '288px',
                  marginTop: '8px',
                  background: '#1A1D28',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                }}
              >
                {/* Header */}
                <div
                  className="flex items-center justify-between"
                  style={{
                    padding: '12px 14px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <span
                    className="font-medium"
                    style={{
                      fontSize: '13px',
                      color: '#FFFFFF',
                    }}
                  >
                    Notifications
                  </span>
                  <button
                    style={{
                      fontSize: '11px',
                      color: '#A78BFA',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Mark all read
                  </button>
                </div>

                {/* Notification List */}
                <div>
                  {/* Sample Notification 1 */}
                  <div
                    className="flex gap-2.5 transition-colors cursor-pointer"
                    style={{
                      padding: '10px 14px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div
                      className="flex items-center justify-center flex-shrink-0 rounded-full"
                      style={{
                        width: '28px',
                        height: '28px',
                        background: 'rgba(91, 78, 232, 0.15)',
                      }}
                    >
                      <span style={{ fontSize: '12px' }}>💳</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        style={{
                          fontSize: '11px',
                          color: '#FFFFFF',
                        }}
                      >
                        Budget alert: Food category at 85%
                      </p>
                      <p
                        style={{
                          fontSize: '10px',
                          color: 'rgba(255, 255, 255, 0.3)',
                        }}
                      >
                        2 hours ago
                      </p>
                    </div>
                  </div>

                  {/* Sample Notification 2 */}
                  <div
                    className="flex gap-2.5 transition-colors cursor-pointer"
                    style={{
                      padding: '10px 14px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div
                      className="flex items-center justify-center flex-shrink-0 rounded-full"
                      style={{
                        width: '28px',
                        height: '28px',
                        background: 'rgba(52, 211, 153, 0.15)',
                      }}
                    >
                      <span style={{ fontSize: '12px' }}>✨</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        style={{
                          fontSize: '11px',
                          color: '#FFFFFF',
                        }}
                      >
                        New AI insight available
                      </p>
                      <p
                        style={{
                          fontSize: '10px',
                          color: 'rgba(255, 255, 255, 0.3)',
                        }}
                      >
                        5 hours ago
                      </p>
                    </div>
                  </div>

                  {/* Sample Notification 3 */}
                  <div
                    className="flex gap-2.5 transition-colors cursor-pointer"
                    style={{
                      padding: '10px 14px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div
                      className="flex items-center justify-center flex-shrink-0 rounded-full"
                      style={{
                        width: '28px',
                        height: '28px',
                        background: 'rgba(248, 113, 113, 0.15)',
                      }}
                    >
                      <span style={{ fontSize: '12px' }}>📊</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        style={{
                          fontSize: '11px',
                          color: '#FFFFFF',
                        }}
                      >
                        Monthly report ready
                      </p>
                      <p
                        style={{
                          fontSize: '10px',
                          color: 'rgba(255, 255, 255, 0.3)',
                        }}
                      >
                        1 day ago
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div
                  className="text-center"
                  style={{
                    padding: '10px 14px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <button
                    style={{
                      fontSize: '11px',
                      color: '#A78BFA',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                    }}
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
          className="flex items-center justify-center transition-all"
          style={{
            width: '34px',
            height: '34px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderRadius: '9px',
            color: 'rgba(255, 255, 255, 0.5)',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
          }}
          title="Toggle theme"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* User Avatar Dropdown */}
        <div className="relative" ref={userDropdownRef}>
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center justify-center rounded-full transition-opacity"
            style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #5B4EE8, #9333EA)',
              cursor: 'pointer',
              border: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <span
              className="font-medium"
              style={{
                fontSize: '13px',
                color: '#FFFFFF',
              }}
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
                className="absolute right-0 z-50"
                style={{
                  width: '208px',
                  marginTop: '8px',
                  background: '#1A1D28',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                  padding: '4px',
                }}
              >
                {/* User Email */}
                <div style={{ padding: '8px 12px' }}>
                  <p
                    className="truncate"
                    style={{
                      fontSize: '10px',
                      color: 'rgba(255, 255, 255, 0.4)',
                    }}
                  >
                    {user?.email}
                  </p>
                </div>

                {/* Divider */}
                <div
                  style={{
                    height: '1px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    margin: '4px 0',
                  }}
                />

                {/* Profile */}
                <button
                  onClick={() => {
                    navigate('/profile');
                    setUserDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 transition-colors"
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                  }}
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
                  className="w-full flex items-center gap-2 transition-colors"
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                  }}
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </button>

                {/* Divider */}
                <div
                  style={{
                    height: '1px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    margin: '4px 0',
                  }}
                />

                {/* Logout */}
                <button
                  onClick={() => {
                    logout();
                    setUserDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 transition-colors"
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#F87171',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
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
