/**
 * Dashboard page - main overview of expenses and analytics
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DollarSign, Calendar, TrendingUp, Receipt, PlusCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getDashboard } from '../api/expenses';
import type { DashboardData } from '../types';
import StatCard from '../components/ui/StatCard';
import RecentExpensesTable from '../components/ui/RecentExpensesTable';
import ExpenseBarChart from '../components/charts/ExpenseBarChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import { PageLoader } from '../components/ui/LoadingSpinner';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  const fetchDashboard = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const dashboardData = await getDashboard();
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Get user's first name from email
  const getUserName = () => {
    if (!user?.email) return 'there';
    return user.email.split('@')[0];
  };

  // Get current month name
  const getCurrentMonth = () => {
    return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Loading state
  if (isLoading) {
    return <PageLoader />;
  }

  // Error state
  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" size={24} />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-1">
                Failed to load dashboard
              </h3>
              <p className="text-red-700 dark:text-red-300 mb-4">
                {error || 'An unexpected error occurred'}
              </p>
              <button
                onClick={fetchDashboard}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {getGreeting()}, {getUserName()}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's your expense overview
          </p>
        </div>

        {/* Add Expense Button */}
        <Link
          to="/expenses/add"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <PlusCircle size={20} />
          Add Expense
        </Link>
      </div>

      {/* Stat Cards Grid */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <StatCard
            title="Total Spent"
            value={`$${data.total_expenses.toFixed(2)}`}
            subtitle="All time"
            icon={DollarSign}
            colorScheme="red"
          />
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <StatCard
            title="This Month"
            value={`$${data.current_month_total.toFixed(2)}`}
            subtitle={getCurrentMonth()}
            icon={Calendar}
            colorScheme="blue"
          />
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <StatCard
            title="Avg Expense"
            value={`$${data.average_expense.toFixed(2)}`}
            subtitle="Per transaction"
            icon={TrendingUp}
            colorScheme="purple"
          />
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <StatCard
            title="Transactions"
            value={data.total_count.toString()}
            subtitle={`${data.current_month_count} this month`}
            icon={Receipt}
            colorScheme="green"
          />
        </motion.div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
        {/* Bar Chart - Monthly Trends */}
        <div className="lg:col-span-3">
          <ExpenseBarChart data={data.monthly_trends} />
        </div>

        {/* Pie Chart - Categories */}
        <div className="lg:col-span-2">
          <CategoryPieChart data={data.categories} />
        </div>
      </div>

      {/* Recent Expenses Table */}
      <RecentExpensesTable expenses={data.recent_expenses} />
    </div>
  );
};

export default DashboardPage;
