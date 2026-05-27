/**
 * Layout Component - Main app shell orchestrator
 * Combines Sidebar, Header, and page content with smooth transitions
 */
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
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
      className="flex min-h-screen bg-[#F8FAFC] dark:bg-[#0B0D14] overflow-x-hidden"
    >
      {/* Sidebar - Always rendered, visibility controlled by transform */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile Overlay - Only visible on mobile when sidebar open */}
      <MobileOverlay isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 w-full lg:ml-[240px] transition-all duration-300">
        {/* Header */}
        <Header
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
          title={pageTitle}
        />

        {/* Main Content with Page Transitions */}
        <main
          className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 lg:p-8 bg-[#F8FAFC] dark:bg-[#0B0D14]"
        >
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
