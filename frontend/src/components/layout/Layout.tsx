/**
 * Main layout wrapper for all protected pages
 */
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import MobileOverlay from './MobileOverlay';
import Header from './Header';

// Map routes to page titles
const getPageTitle = (pathname: string): string => {
  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/expenses': 'Expenses',
    '/expenses/add': 'Add Expense',
    '/insights': 'AI Insights',
  };

  return titles[pathname] || 'ExpenseAI';
};

const Layout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get current page title based on route
  const pageTitle = getPageTitle(location.pathname);

  // Toggle mobile sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Mobile overlay */}
      <MobileOverlay isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:ml-64 min-h-screen">
        {/* Header */}
        <Header onMenuClick={toggleSidebar} title={pageTitle} />

        {/* Page content with animation */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
