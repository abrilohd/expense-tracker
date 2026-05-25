/**
 * Layout Component - Main app shell orchestrator
 * Combines Sidebar, Header, and page content with smooth transitions
 */
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import MobileOverlay from './MobileOverlay';
import Header from './Header';

// Page title mapping
const getPageTitle = (pathname: string): string => {
  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/expenses': 'Expenses',
    '/income': 'Income',
    '/reports': 'Reports',
    '/budgets': 'Budgets',
    '/savings-goals': 'Savings Goals',
    '/recurring': 'Recurring',
    '/insights': 'AI Insights',
    '/profile': 'Profile',
    '/settings': 'Settings',
  };
  return titles[pathname] || 'ExpenseT';
};

const Layout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get current page title
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#0B0D14',
      }}
    >
      {/* Sidebar - Always rendered, visibility controlled by transform */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile Overlay - Only visible on mobile when sidebar open */}
      <MobileOverlay isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 lg:ml-[240px]">
        {/* Header */}
        <Header
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
          title={pageTitle}
        />

        {/* Main Content with Page Transitions */}
        <main
          className="flex-1 overflow-auto"
          style={{ background: '#0B0D14' }}
        >
          <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{
                  duration: 0.2,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
