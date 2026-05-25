/**
 * Sidebar Navigation - World-class fintech design
 * ALWAYS dark (#0F1117), never changes with theme
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
      className={`fixed left-0 top-0 h-screen w-60 flex flex-col z-40 lg:z-20 overflow-y-auto overflow-x-hidden transition-transform duration-[280ms] ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
      style={{
        background: '#0F1117',
        borderRight: '1px solid rgba(255, 255, 255, 0.06)',
        transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      }}
    >
      {/* Logo Section */}
      <div
        className="px-5 py-5"
        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}
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
              className="font-semibold"
              style={{
                fontSize: '15px',
                color: '#FFFFFF',
                letterSpacing: '-0.3px',
              }}
            >
              Expense
            </span>
            <span
              className="font-bold"
              style={{
                fontSize: '15px',
                color: '#A78BFA',
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
            className="tracking-widest font-medium"
            style={{
              fontSize: '10px',
              color: 'rgba(255, 255, 255, 0.25)',
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
                  isActive ? 'font-medium' : ''
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      background: 'rgba(91, 78, 232, 0.15)',
                      color: '#A78BFA',
                      boxShadow: 'inset 2px 0 0 #5B4EE8',
                    }
                  : {
                      color: 'rgba(255, 255, 255, 0.4)',
                    }
              }
              onMouseEnter={(e) => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)';
                }
              }}
            >
              <item.icon size={16} className="flex-shrink-0" style={{ width: '18px' }} />
              <span style={{ fontSize: '13px' }}>{item.label}</span>
              {/* Active dot */}
              <NavLink to={item.path} end={item.path === '/'}>
                {({ isActive }) =>
                  isActive ? (
                    <div
                      className="ml-auto rounded-full"
                      style={{
                        width: '5px',
                        height: '5px',
                        background: '#A78BFA',
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
            className="tracking-widest font-medium"
            style={{
              fontSize: '10px',
              color: 'rgba(255, 255, 255, 0.25)',
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
                  isActive ? 'font-medium' : ''
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      background: 'rgba(91, 78, 232, 0.15)',
                      color: '#A78BFA',
                      boxShadow: 'inset 2px 0 0 #5B4EE8',
                    }
                  : {
                      color: 'rgba(255, 255, 255, 0.4)',
                    }
              }
              onMouseEnter={(e) => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)';
                }
              }}
            >
              <item.icon size={16} className="flex-shrink-0" style={{ width: '18px' }} />
              <span style={{ fontSize: '13px' }}>{item.label}</span>
              {/* AI Badge or Active dot */}
              {item.badge ? (
                <span
                  className="ml-auto px-1.5 py-0.5 rounded-full font-medium"
                  style={{
                    fontSize: '10px',
                    background: 'rgba(91, 78, 232, 0.2)',
                    color: '#A78BFA',
                  }}
                >
                  {item.badge}
                </span>
              ) : (
                <NavLink to={item.path}>
                  {({ isActive }) =>
                    isActive ? (
                      <div
                        className="ml-auto rounded-full"
                        style={{
                          width: '5px',
                          height: '5px',
                          background: '#A78BFA',
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
            className="tracking-widest font-medium"
            style={{
              fontSize: '10px',
              color: 'rgba(255, 255, 255, 0.25)',
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
                  isActive ? 'font-medium' : ''
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      background: 'rgba(91, 78, 232, 0.15)',
                      color: '#A78BFA',
                      boxShadow: 'inset 2px 0 0 #5B4EE8',
                    }
                  : {
                      color: 'rgba(255, 255, 255, 0.4)',
                    }
              }
              onMouseEnter={(e) => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)';
                }
              }}
            >
              <item.icon size={16} className="flex-shrink-0" style={{ width: '18px' }} />
              <span style={{ fontSize: '13px' }}>{item.label}</span>
              {/* Active dot */}
              <NavLink to={item.path}>
                {({ isActive }) =>
                  isActive ? (
                    <div
                      className="ml-auto rounded-full"
                      style={{
                        width: '5px',
                        height: '5px',
                        background: '#A78BFA',
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
                    isActive ? 'font-medium' : ''
                  }`
                }
                style={({ isActive }) =>
                  isActive
                    ? {
                        background: 'rgba(168, 85, 247, 0.15)',
                        color: '#C084FC',
                        boxShadow: 'inset 2px 0 0 #A855F7',
                      }
                    : {
                        color: 'rgba(255, 255, 255, 0.4)',
                      }
                }
                onMouseEnter={(e) => {
                  if (!e.currentTarget.classList.contains('active')) {
                    e.currentTarget.style.background = 'rgba(168, 85, 247, 0.1)';
                    e.currentTarget.style.color = 'rgba(192, 132, 252, 0.8)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.classList.contains('active')) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)';
                  }
                }}
              >
                <item.icon size={16} className="flex-shrink-0" style={{ width: '18px' }} />
                <span style={{ fontSize: '13px' }}>{item.label}</span>
                <span 
                  className="ml-auto text-xs px-1.5 py-0.5 rounded"
                  style={{ 
                    background: 'rgba(168, 85, 247, 0.2)',
                    color: '#C084FC',
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
        className="mt-auto px-3 pb-4"
        style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '16px' }}
      >
        {/* User Info */}
        {user && (
          <div
            className="flex items-center gap-2.5 px-3 py-2 rounded-[10px] cursor-pointer transition-all duration-150 mb-0.5"
            style={{ background: 'transparent' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
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
                className="font-medium truncate"
                style={{
                  fontSize: '13px',
                  color: '#FFFFFF',
                }}
              >
                {user.name || user.email.split('@')[0]}
              </p>
              <p
                style={{
                  fontSize: '10px',
                  color: 'rgba(255, 255, 255, 0.25)',
                }}
              >
                {user.is_admin ? 'Admin' : 'Free Plan'}
              </p>
            </div>

            {/* Chevron */}
            <ChevronDown
              size={13}
              className="flex-shrink-0"
              style={{ color: 'rgba(255, 255, 255, 0.2)' }}
            />
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-150 my-0.5"
          style={{
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.35)',
            background: 'transparent',
            border: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#F87171';
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.35)';
            e.currentTarget.style.background = 'transparent';
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
