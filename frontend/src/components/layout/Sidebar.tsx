/**
 * Sidebar navigation component - Fundex-inspired design
 * Supports both light and dark themes
 */
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CreditCard, PlusCircle, Sparkles, LogOut, UserCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useDarkMode } from '../../hooks/useDarkMode';
import { getLayoutStyles } from '../../utils/themeStyles';
import { LANDING_URL } from '../../config/constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Navigation items configuration
const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Expenses', path: '/expenses', icon: CreditCard },
  { label: 'Add Expense', path: '/expenses/add', icon: PlusCircle },
  { label: 'AI Insights', path: '/insights', icon: Sparkles, badge: 'AI' },
  { label: 'Profile', path: '/profile', icon: UserCircle },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user, logout } = useAuthStore();
  const { isDark } = useDarkMode();

  // Get first letter of email for avatar
  const getInitial = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  const layoutStyles = getLayoutStyles(isDark);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen w-60 flex flex-col transition-transform duration-300 z-40 lg:translate-x-0 bg-white dark:bg-[#0F1117] border-r border-gray-200 dark:border-white/[0.06] ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Logo Section */}
      <div className="px-5 pt-6 pb-8">
        <button
          onClick={() => {
            // Use environment variable for landing page URL
            window.location.href = LANDING_URL;
          }}
          className="flex items-center gap-3 mb-6 group cursor-pointer bg-transparent border-0 p-0 w-full text-left hover:opacity-100"
          title="Go to Landing Page"
        >
          {/* Logo Circle */}
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-purple-600 group-hover:bg-purple-700 transition-colors">
            <span className="text-white font-bold text-lg">💰</span>
          </div>

          {/* App Name */}
          <div className="flex items-baseline">
            <span className="text-gray-900 dark:text-white font-semibold text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">ExpenseTracker</span>
          </div>
        </button>

        {/* Divider */}
        <div className="h-px bg-gray-200 dark:bg-white/[0.06]" />
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 overflow-y-auto">
        {/* Menu Label */}
        <div className="px-5 mb-2">
          <span className="text-xs tracking-widest font-medium text-gray-500 dark:text-gray-600">
            MENU
          </span>
        </div>

        {/* Nav Items */}
        <div className="space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 mx-3 px-4 py-2.5 rounded-[10px] transition-all duration-150 ${
                  isActive
                    ? 'bg-purple-100 dark:bg-purple-900/15 text-purple-700 dark:text-purple-400 shadow-[inset_2px_0_0_0] shadow-purple-600 dark:shadow-purple-500'
                    : 'text-gray-600 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/[0.04]'
                }`
              }
            >
              <item.icon size={18} />
              <span className="font-medium text-sm">{item.label}</span>

              {/* AI Badge */}
              {item.badge && (
                <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-medium bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto">
        {/* Divider */}
        <div className="h-px bg-gray-200 dark:bg-white/[0.06]" />

        {/* User Info */}
        {user && (
          <div className="p-5 flex items-center gap-3">
            {/* Avatar with gradient */}
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-purple-600 to-indigo-600">
              <span className="text-white text-sm font-medium">{getInitial()}</span>
            </div>

            {/* User Details */}
            <div className="flex-1 min-w-0">
              <p className="text-xs truncate text-gray-600 dark:text-gray-400">
                {user.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-600">
                Free Plan
              </p>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 mx-3 mb-4 px-4 py-2.5 rounded-lg transition-all duration-150 text-gray-600 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/5"
        >
          <LogOut size={16} />
          <span className="text-sm font-medium">Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
