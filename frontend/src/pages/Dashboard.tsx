/**
 * Dashboard page - Fundex-inspired redesign
 * Updated to use Zustand store with new visual layout
 */
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  Calendar,
  TrendingUp,
  Receipt,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useDashboardData } from '../hooks/useExpenses';
import HeroCard from '../components/ui/HeroCard';
import StatCard from '../components/ui/StatCard';
import BudgetOverviewCard from '../components/ui/BudgetOverviewCard';
import CategoryCard from '../components/ui/CategoryCard';
import TransactionList from '../components/ui/TransactionList';
import ExpenseAreaChart from '../components/charts/ExpenseAreaChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import { formatCurrency, formatDate, getCategoryEmoji } from '../utils/formatters';
import { PageLoader } from '../components/ui/LoadingSpinner';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const { data, isLoading, error, refetch } = useDashboardData();

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

  // Calculate last month total from monthly trends
  const getLastMonthTotal = (): number => {
    if (!data?.monthly_trends || data.monthly_trends.length < 2) return 0;

    const currentMonth = format(new Date(), 'yyyy-MM');
    const lastMonth = data.monthly_trends.find((trend) => trend.month !== currentMonth);

    return lastMonth?.total || 0;
  };

  // Calculate trend percentage for stat cards
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(Math.round(change)),
      isPositive: change < 0, // Spending less is positive
    };
  };

  // Get category color for progress bars
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      Food: '#F59E0B',
      Transport: '#3B82F6',
      Housing: '#8B5CF6',
      Entertainment: '#EC4899',
      Health: '#10B981',
      Shopping: '#EAB308',
      Education: '#6366F1',
      Other: '#6B7280',
    };
    return colors[category] || colors.Other;
  };

  // Loading state
  if (isLoading) {
    return <PageLoader />;
  }

  // Error state
  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" size={24} />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-1">
                Failed to load dashboard
              </h3>
              <p className="text-red-600 dark:text-red-300/80 mb-4">{error || 'An unexpected error occurred'}</p>
              <button
                onClick={refetch}
                className="px-4 py-2 rounded-lg font-medium transition-colors border border-red-300 dark:border-red-800/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/10"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const lastMonthTotal = getLastMonthTotal();
  const thisMonthTrend = calculateTrend(data.current_month_total, lastMonthTotal);

  // Generate sparkline data from monthly trends (last 7 months)
  const sparklineData = data.monthly_trends.slice(-7).map((t) => t.total);
  const countSparklineData = data.monthly_trends.slice(-7).map((t) => t.count);

  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      {/* Quick Stats Pills */}
      {!isLoading && data && (
        <motion.div
          className="flex gap-2 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          {/* Pill 1: Total */}
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2 bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06]">
            <div className="rounded-full w-2 h-2 bg-purple-600" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Total: {formatCurrency(data.total_expenses)}
            </span>
          </div>

          {/* Pill 2: Transactions */}
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2 bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06]">
            <div className="rounded-full w-2 h-2 bg-blue-600" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {data.total_count} transactions
            </span>
          </div>

          {/* Pill 3: Average */}
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2 bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06]">
            <div className="rounded-full w-2 h-2 bg-green-600" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Avg: {formatCurrency(data.average_expense)}
            </span>
          </div>
        </motion.div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          {getGreeting()}, {getUserName()}! 👋
        </h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-500 mt-1 md:mt-2">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 md:gap-6 lg:gap-8">
        {/* Left Column */}
        <div className="space-y-4 md:space-y-6 lg:space-y-8">
          {/* Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <HeroCard
              totalSpent={data.total_expenses}
              currentMonthTotal={data.current_month_total}
              lastMonthTotal={lastMonthTotal}
            />
          </motion.div>

          {/* Stats Row */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.1,
                },
              },
            }}
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <StatCard
                title="This Month"
                value={formatCurrency(data.current_month_total)}
                subtitle={`${data.current_month_count} transactions`}
                icon={Calendar}
                colorScheme="blue"
                trend={thisMonthTrend || undefined}
                sparklineData={sparklineData}
                sparklineColor="#60A5FA"
              />
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <StatCard
                title="Avg Expense"
                value={formatCurrency(data.average_expense)}
                subtitle="Per transaction"
                icon={TrendingUp}
                colorScheme="purple"
              />
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <StatCard
                title="Highest"
                value={formatCurrency(data.highest_expense)}
                subtitle="Single expense"
                icon={ArrowUpRight}
                colorScheme="red"
              />
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <StatCard
                title="Total Count"
                value={data.total_count.toString()}
                subtitle={`${data.current_month_count} this month`}
                icon={Receipt}
                colorScheme="green"
                sparklineData={countSparklineData}
                sparklineColor="#34D399"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Right Column */}
        <motion.div
          className="space-y-4 md:space-y-6 lg:space-y-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {/* Budget Overview Card */}
          <BudgetOverviewCard
            categories={data.categories}
            isLoading={isLoading}
            totalSpent={data.total_expenses}
          />

          {/* Recent Transactions */}
          <TransactionList
            expenses={data.recent_expenses ?? []}
            isLoading={isLoading}
            title="Recent Transactions"
            showViewAll={true}
            showActions={false}
            compact={false}
            maxItems={5}
            emptyMessage="No transactions yet"
          />
        </motion.div>
      </div>

      {/* Income vs Expense Summary Row */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-5 lg:gap-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
      >
        {/* This Month Spending Card */}
        <div className="rounded-2xl p-4 md:p-5 flex items-center gap-3 md:gap-4 bg-white dark:bg-[#141720] border border-gray-200 dark:border-white/[0.06]">
          <div className="flex items-center justify-center rounded-xl flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-red-100 dark:bg-[#3B1219]">
            <TrendingUp size={20} className="md:w-6 md:h-6 text-red-500 dark:text-red-400" style={{ transform: 'rotate(180deg)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-600 dark:text-gray-500 mb-1">This Month Spending</p>
            <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate">
              {formatCurrency(data.current_month_total)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-600 mt-0.5">
              {data.current_month_count} transactions
            </p>
          </div>
        </div>

        {/* Avg per Transaction Card */}
        <div className="rounded-2xl p-4 md:p-5 flex items-center gap-3 md:gap-4 bg-white dark:bg-[#141720] border border-gray-200 dark:border-white/[0.06]">
          <div className="flex items-center justify-center rounded-xl flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-purple-100 dark:bg-[#2D1B69]">
            <ArrowUpRight size={20} className="md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-600 dark:text-gray-500 mb-1">Avg per Transaction</p>
            <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate">{formatCurrency(data.average_expense)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-600 mt-0.5">
              Based on {data.total_count} expenses
            </p>
          </div>
        </div>
      </motion.div>

      {/* Charts Row */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {/* Area Chart - Monthly Trends (spans 2 columns) */}
        <div className="lg:col-span-2">
          <ExpenseAreaChart data={data.monthly_trends} />
        </div>

        {/* Pie Chart - Categories */}
        <CategoryPieChart data={data.categories} />
      </motion.div>

      {/* Category Spending Cards Section */}
      {data.categories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          {/* Section header */}
          <div className="mb-4 md:mb-5">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">Category Breakdown</h2>
            <p className="text-sm text-gray-600 dark:text-gray-500 mt-1">
              Detailed spending by category
            </p>
          </div>

          {/* Category cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
            {data.categories.slice(0, 8).map((category, index) => (
              <CategoryCard
                key={category.category}
                category={category.category}
                amount={category.total}
                count={category.count}
                percentage={category.percentage}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardPage;
