/**
 * Sidebar navigation component with mobile drawer support
 */
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, CreditCard, PlusCircle, Sparkles, LogOut, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Navigation items configuration
const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Expenses', path: '/expenses', icon: CreditCard },
  { label: 'Add Expense', path: '/expenses/add', icon: PlusCircle },
  { label: 'Insights', path: '/insights', icon: Sparkles },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user, logout } = useAuthStore();

  return (
    <motion.aside
      initial={false}
      animate={{ x: isOpen ? 0 : -256 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-40 lg:translate-x-0 flex flex-col"
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo icon */}
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-2xl">
            💰
          </div>
          
          {/* App name with gradient */}
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ExpenseAI
          </h1>
        </div>

        {/* Close button (mobile only) */}
        <button
          onClick={onClose}
          className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600 rounded-l-lg dark:bg-blue-950 dark:text-blue-400 dark:border-blue-400'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
                
                {/* AI badge for Insights */}
                {item.label === 'Insights' && (
                  <span className="ml-auto px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-600 rounded-full dark:bg-blue-900 dark:text-blue-400">
                    AI
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section - User & Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
        {/* User email */}
        {user && (
          <div className="px-4 py-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Signed in as</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 truncate font-medium">
              {user.email}
            </p>
          </div>
        )}

        {/* Logout button */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-950"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
