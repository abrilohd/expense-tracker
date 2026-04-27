/**
 * Main layout wrapper for all protected pages
 * FIXED: Sidebar now always visible on desktop with proper margin
 */
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0D0F16] overflow-x-hidden">
      {/* Sidebar - always rendered, visibility controlled by CSS */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Mobile overlay */}
      <MobileOverlay isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main content area - CRITICAL FIX: lg:ml-[240px] matches sidebar width */}
      <div className="flex flex-col flex-1 min-w-0 lg:ml-[240px]">
        {/* Header */}
        <Header onMenuClick={toggleSidebar} title={pageTitle} />

        {/* Page content with enhanced animation and spacing */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto overflow-x-hidden bg-gray-50 dark:bg-[#0D0F16]">
          <div className="max-w-[1600px] mx-auto min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ flex: 1 }}
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
