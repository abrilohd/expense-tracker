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
      className={`fixed left-0 top-0 h-screen w-60 flex flex-col z-40 lg:z-20 overflow-y-auto overflow-x-hidden transition-transform duration-[280ms] bg-white dark:bg-[#0F1117] border-r border-gray-200 dark:border-white/6 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
      style={{
        transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      }}
    >
      {/* Logo Section */}
      <div
        className="px-5 py-5 border-b border-gray-200 dark:border-white/6"
      >
        <div className="flex items-center gap-2.5">
          {/* Logo Icon */}
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '9px',
              background: '#5B4EE8',
            }}
          >
            <Coins size={16} className="text-white" />
          </div>

          {/* Logo Text */}
          <div className="flex items-baseline gap-0.5">
            <span
              className="font-semibold text-gray-900 dark:text-white"
              style={{
                fontSize: '15px',
                letterSpacing: '-0.3px',
              }}
            >
              Expense
            </span>
            <span
              className="font-bold text-purple-600 dark:text-[#A78BFA]"
              style={{
                fontSize: '15px',
                letterSpacing: '-0.3px',
              }}
            >
              AI
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
                `flex items-center gap-2.5 mx-3 px-3 py-2.5 rounded-[10px] cursor-pointer transition-all duration-150 ${
                  isActive ? 'font-medium bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-[#A78BFA]' : 'text-gray-600 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white/80'
                }`
              }
            >
              <item.icon size={16} className="flex-shrink-0" style={{ width: '18px' }} />
              <span style={{ fontSize: '13px' }}>{item.label}</span>
              {/* Active dot */}
              <NavLink to={item.path} end={item.path === '/'}>
                {({ isActive }) =>
                  isActive ? (
                    <div
                      className="ml-auto rounded-full bg-purple-600 dark:bg-[#A78BFA]"
                      style={{
                        width: '5px',
                        height: '5px',
                      }}
                    />
                  ) : null
                }
              </NavLink>
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
                `flex items-center gap-2.5 mx-3 px-3 py-2.5 rounded-[10px] cursor-pointer transition-all duration-150 ${
                  isActive ? 'font-medium bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-[#A78BFA]' : 'text-gray-600 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white/80'
                }`
              }
            >
              <item.icon size={16} className="flex-shrink-0" style={{ width: '18px' }} />
              <span style={{ fontSize: '13px' }}>{item.label}</span>
              {/* AI Badge or Active dot */}
              {item.badge ? (
                <span
                  className="ml-auto px-1.5 py-0.5 rounded-full font-medium bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-[#A78BFA]"
                  style={{
                    fontSize: '10px',
                  }}
                >
                  {item.badge}
                </span>
              ) : (
                <NavLink to={item.path}>
                  {({ isActive }) =>
                    isActive ? (
                      <div
                        className="ml-auto rounded-full bg-purple-600 dark:bg-[#A78BFA]"
                        style={{
                          width: '5px',
                          height: '5px',
                        }}
                      />
                    ) : null
                  }
                </NavLink>
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
                `flex items-center gap-2.5 mx-3 px-3 py-2.5 rounded-[10px] cursor-pointer transition-all duration-150 ${
                  isActive ? 'font-medium bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-[#A78BFA]' : 'text-gray-600 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white/80'
                }`
              }
            >
              <item.icon size={16} className="flex-shrink-0" style={{ width: '18px' }} />
              <span style={{ fontSize: '13px' }}>{item.label}</span>
              {/* Active dot */}
              <NavLink to={item.path}>
                {({ isActive }) =>
                  isActive ? (
                    <div
                      className="ml-auto rounded-full bg-purple-600 dark:bg-[#A78BFA]"
                      style={{
                        width: '5px',
                        height: '5px',
                      }}
                    />
                  ) : null
                }
              </NavLink>
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
                  `flex items-center gap-2.5 mx-3 px-3 py-2.5 rounded-[10px] cursor-pointer transition-all duration-150 ${
                    isActive ? 'font-medium bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-300' : 'text-gray-600 dark:text-white/40 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-300'
                  }`
                }
              >
                <item.icon size={16} className="flex-shrink-0" style={{ width: '18px' }} />
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
        className="mt-auto px-3 pb-4 pt-4 border-t border-gray-200 dark:border-white/6"
      >
        {/* User Info */}
        {user && (
          <div
            className="flex items-center gap-2.5 px-3 py-2 rounded-[10px] cursor-pointer transition-all duration-150 mb-0.5 hover:bg-gray-100 dark:hover:bg-white/4"
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
                  color: '#FFFFFF',
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
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-150 my-0.5 text-gray-500 dark:text-white/35 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/6"
          style={{
            fontSize: '13px',
            background: 'transparent',
            border: 'none',
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
