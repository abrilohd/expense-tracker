/**
 * Sidebar Navigation - World-class fintech design
 * Adapts to light/dark theme
 */
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  TrendingUp,
  BarChart2,
  Target,
  PiggyBank,
  Repeat,
  Sparkles,
  User,
  Settings,
  Coins,
  ChevronDown,
  LogOut,
  Shield,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Navigation structure
const mainMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: CreditCard, label: 'Expenses', path: '/expenses' },
  { icon: TrendingUp, label: 'Income', path: '/income' },
  { icon: BarChart2, label: 'Reports', path: '/reports' },
];

const toolsItems = [
  { icon: Target, label: 'Budgets', path: '/budgets' },
  { icon: PiggyBank, label: 'Savings', path: '/savings-goals' },
  { icon: Repeat, label: 'Recurring', path: '/recurring' },
  { icon: Sparkles, label: 'AI Insights', path: '/insights', badge: 'AI' },
];

const accountItems = [
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

// Admin items (shown only for admin users)
const adminItems = [
  { icon: Shield, label: 'Admin', path: '/admin' },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user, logout } = useAuthStore();

  // Get first letter of email for avatar
  const getInitial = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen w-60 flex flex-col overflow-y-auto overflow-x-hidden transition-transform duration-[280ms] bg-white dark:bg-[#0F1117] ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
      style={{
        transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        borderRight: '1px solid transparent',
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.03)',
        zIndex: 40,
      }}
    >
      {/* Logo Section */}
      <div
        className="px-5 py-5 border-b border-gray-200/50 dark:border-white/[0.03]"
      >
        <div className="flex items-center gap-2.5">
          {/* Logo Icon */}
          <div
            className="flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #5B4EE8 0%, #7C3AED 100%)',
            }}
          >
            <Coins size={18} className="text-white" />
          </div>

          {/* Logo Text */}
          <div className="flex items-baseline gap-0.5">
            <span
              className="font-bold text-gray-900 dark:text-white"
              style={{
                fontSize: '16px',
                letterSpacing: '-0.4px',
              }}
            >
              Expense
            </span>
            <span
              className="font-bold bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-400 dark:to-purple-500 bg-clip-text text-transparent"
              style={{
                fontSize: '16px',
                letterSpacing: '-0.4px',
              }}
            >
              Tracker
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-5">
        {/* MAIN MENU Section */}
        <div className="px-2 mb-1.5">
          <span
            className="tracking-widest font-medium text-gray-400 dark:text-white/25"
            style={{
              fontSize: '10px',
            }}
          >
            MAIN MENU
          </span>
        </div>

        <div className="mb-5">
          {mainMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2.5 mx-3 px-3 py-2.5 rounded-[10px] transition-all duration-150 ${
                  isActive ? 'font-medium bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-[#A78BFA]' : 'text-gray-600 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white/80'
                }`
              }
            >
              <item.icon size={18} className="flex-shrink-0" />
              <span style={{ fontSize: '13px' }}>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* TOOLS Section */}
        <div className="px-2 mb-1.5">
          <span
            className="tracking-widest font-medium text-gray-400 dark:text-white/25"
            style={{
              fontSize: '10px',
            }}
          >
            TOOLS
          </span>
        </div>

        <div className="mb-5">
          {toolsItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2.5 mx-3 px-3 py-2.5 rounded-[10px] transition-all duration-150 ${
                  isActive ? 'font-medium bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-[#A78BFA]' : 'text-gray-600 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white/80'
                }`
              }
            >
              <item.icon size={18} className="flex-shrink-0" />
              <span style={{ fontSize: '13px' }}>{item.label}</span>
              {item.badge && (
                <span
                  className="ml-auto px-1.5 py-0.5 rounded-full font-medium bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-[#A78BFA]"
                  style={{
                    fontSize: '10px',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* ACCOUNT Section */}
        <div className="px-2 mb-1.5">
          <span
            className="tracking-widest font-medium text-gray-400 dark:text-white/25"
            style={{
              fontSize: '10px',
            }}
          >
            ACCOUNT
          </span>
        </div>

        <div>
          {accountItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2.5 mx-3 px-3 py-2.5 rounded-[10px] transition-all duration-150 ${
                  isActive ? 'font-medium bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-[#A78BFA]' : 'text-gray-600 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white/80'
                }`
              }
            >
              <item.icon size={18} className="flex-shrink-0" />
              <span style={{ fontSize: '13px' }}>{item.label}</span>
            </NavLink>
          ))}
        </div>
        
        {/* Admin Items - Only for admin users */}
        {user?.is_admin && (
          <div className="mt-2">
            {adminItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 mx-3 px-3 py-2.5 rounded-[10px] transition-all duration-150 ${
                    isActive ? 'font-medium bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-300' : 'text-gray-600 dark:text-white/40 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-300'
                  }`
                }
              >
                <item.icon size={18} className="flex-shrink-0" />
                <span style={{ fontSize: '13px' }}>{item.label}</span>
                <span 
                  className="ml-auto text-xs px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300"
                  style={{ 
                    fontSize: '10px',
                    fontWeight: '600'
                  }}
                >
                  ADMIN
                </span>
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* Bottom Section */}
      <div
        className="mt-auto px-3 pb-4 pt-4 border-t border-gray-200 dark:border-white/[0.03]"
      >
        {/* User Info */}
        {user && (
          <div
            className="flex items-center gap-2.5 px-3 py-2 rounded-[10px] transition-all duration-150 mb-0.5 hover:bg-gray-100 dark:hover:bg-white/4"
          >
            {/* Avatar */}
            <div
              className="flex items-center justify-center flex-shrink-0 rounded-full"
              style={{
                width: '30px',
                height: '30px',
                background: 'linear-gradient(135deg, #5B4EE8, #9333EA)',
              }}
            >
              <span
                className="font-medium"
                style={{
                  fontSize: '12px',
                }}
              >
                {getInitial()}
              </span>
            </div>

            {/* User Details */}
            <div className="flex-1 min-w-0">
              <p
                className="font-medium truncate text-gray-900 dark:text-white"
                style={{
                  fontSize: '13px',
                }}
              >
                {user.name || user.email.split('@')[0]}
              </p>
              <p
                className="text-gray-400 dark:text-white/25"
                style={{
                  fontSize: '10px',
                }}
              >
                {user.is_admin ? 'Admin' : 'Free Plan'}
              </p>
            </div>

            {/* Chevron */}
            <ChevronDown
              size={13}
              className="flex-shrink-0 text-gray-300 dark:text-white/20"
            />
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all duration-150 my-0.5 text-gray-500 dark:text-white/35 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/6"
          style={{
            fontSize: '13px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <LogOut size={14} className="flex-shrink-0" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
