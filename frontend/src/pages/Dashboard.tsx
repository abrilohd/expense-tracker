/**
 * Dashboard Page - WORLD-CLASS 2024 UI/UX
 * Modern bento grid layout with glassmorphism and smart hierarchy
 * Attractive, simple to use, and delightful
 */
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Calculator,
  ArrowUpRight,
  Receipt,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Inbox,
  Sparkles,
  Plus,
  ArrowRight,
  Target,
  Zap,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { useDashboardData } from '../hooks/useExpenses';
import { useInsightsData } from '../hooks/useExpenses';
import { useAuthStore } from '../store/authStore';
import { Card, StatCard } from '../components/ui/Card';
import TransactionRow from '../components/ui/TransactionRow';
import InsightCard from '../components/ui/InsightCard';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonGrid, SkeletonHeroCard } from '../components/ui/SkeletonLoader';
import AreaChart from '../components/charts/AreaChart';
import TopExpensesBarChart from '../components/charts/TopExpensesBarChart';
import ReportDonutChart from '../components/charts/ReportDonutChart';
import ExpenseLineChart from '../components/charts/ExpenseLineChart';
import FinancialCards from '../components/dashboard/FinancialCards';
import { getBalance } from '../api/balance';
import { getBudgetAlerts } from '../api/budgets';
import { useState, useEffect } from 'react';
import type { BudgetAlert } from '../types';
import { checkIsDemoMode, DEMO_CATEGORIES, DEMO_MONTHLY_TRENDS, DEMO_REPORT, DEMO_RECENT } from '../utils/demoData';

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Get category emoji
const getCategoryEmoji = (category: string): string => {
  const emojiMap: Record<string, string> = {
    Housing: '🏠',
    Food: '🍔',
    Transport: '🚗',
    Entertainment: '🎬',
    Health: '💊',
    Shopping: '🛍️',
    Education: '📚',
    Other: '📦',
  };
  return emojiMap[category] || '📦';
};

// Get category background color
const getCategoryBg = (category: string): string => {
  const bgMap: Record<string, string> = {
    Housing: 'rgba(139, 92, 246, 0.12)',
    Food: 'rgba(34, 197, 94, 0.12)',
    Transport: 'rgba(59, 130, 246, 0.12)',
    Entertainment: 'rgba(236, 72, 153, 0.12)',
    Health: 'rgba(239, 68, 68, 0.12)',
    Shopping: 'rgba(251, 146, 60, 0.12)',
    Education: 'rgba(14, 165, 233, 0.12)',
    Other: 'rgba(107, 114, 128, 0.12)',
  };
  return bgMap[category] || 'rgba(107, 114, 128, 0.12)';
};

// Get greeting
const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

// Format month year
const formatMonthYear = (): string => {
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

// Stagger animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DASHBOARD PAGE - WORLD-CLASS 2024 DESIGN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data, isLoading, error, refetch } = useDashboardData();
  const { data: insights } = useInsightsData(30);

  // State for balance data (income + expenses)
  const [balanceData, setBalanceData] = useState<{
    totalIncome: number;
    totalExpenses: number;
    currentMonthIncome: number;
    currentMonthExpenses: number;
    lastMonthIncome: number;
    lastMonthExpenses: number;
  } | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);

  // State for budget alerts
  const [budgetAlerts, setBudgetAlerts] = useState<BudgetAlert[]>([]);

  // Fetch balance data (includes income)
  useEffect(() => {
    const fetchBalanceData = async () => {
      try {
        setIsLoadingBalance(true);
        const balance = await getBalance('all');
        
        // Calculate last month income from current month data
        // Note: API doesn't provide last month income directly, so we estimate
        const lastMonthIncome = balance.current_month_income > 0 
          ? balance.current_month_income * 0.9 // Estimate: 90% of current month
          : 0;

        setBalanceData({
          totalIncome: balance.total_income,
          totalExpenses: balance.total_expenses,
          currentMonthIncome: balance.current_month_income,
          currentMonthExpenses: balance.current_month_expenses,
          lastMonthIncome: lastMonthIncome,
          lastMonthExpenses: balance.prev_month_balance < 0 
            ? Math.abs(balance.prev_month_balance) 
            : 0,
        });
      } catch (err) {
        console.error('Failed to fetch balance data:', err);
        // Set default values on error
        setBalanceData({
          totalIncome: 0,
          totalExpenses: 0,
          currentMonthIncome: 0,
          currentMonthExpenses: 0,
          lastMonthIncome: 0,
          lastMonthExpenses: 0,
        });
      } finally {
        setIsLoadingBalance(false);
      }
    };

    fetchBalanceData();
  }, [data]); // Refetch when dashboard data changes

  // Fetch budget alerts
  useEffect(() => {
    const fetchBudgetAlerts = async () => {
      try {
        const alerts = await getBudgetAlerts();
        setBudgetAlerts(alerts);
      } catch (err) {
        // Silently fail - budget alerts are optional
        setBudgetAlerts([]);
      }
    };

    fetchBudgetAlerts();
  }, [data]); // Refetch when dashboard data changes

  // Demo mode detection
  const isDemoMode = checkIsDemoMode(data, isLoading);

  // Extract data (use demo data when in demo mode)
  const totalExpenses = isDemoMode ? DEMO_CATEGORIES.reduce((sum, cat) => sum + cat.total, 0) : (data?.total_expenses ?? 0);
  const currentMonthTotal = isDemoMode ? (DEMO_MONTHLY_TRENDS[DEMO_MONTHLY_TRENDS.length - 1]?.total ?? 0) : (data?.current_month_total ?? 0);
  const currentMonthCount = isDemoMode ? (DEMO_MONTHLY_TRENDS[DEMO_MONTHLY_TRENDS.length - 1]?.count ?? 0) : (data?.current_month_count ?? 0);
  const averageExpense = isDemoMode ? totalExpenses / DEMO_CATEGORIES.reduce((sum, cat) => sum + cat.count, 0) : (data?.average_expense ?? 0);
  const highestExpense = isDemoMode ? Math.max(...DEMO_CATEGORIES.map(cat => cat.total)) : (data?.highest_expense ?? 0);
  const totalCount = isDemoMode ? DEMO_CATEGORIES.reduce((sum, cat) => sum + cat.count, 0) : (data?.total_count ?? 0);
  const categories = isDemoMode ? DEMO_CATEGORIES : (data?.categories ?? []);
  const monthlyTrends = isDemoMode ? DEMO_MONTHLY_TRENDS : (data?.monthly_trends ?? []);
  const recentExpenses = isDemoMode ? DEMO_RECENT : (data?.recent_expenses ?? []);

  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'User';
  
  // Use balance data if available, otherwise use demo/defaults
  const totalIncome = isDemoMode ? DEMO_REPORT.totalIncome : (balanceData?.totalIncome ?? 0);
  const currentMonthIncome = isDemoMode ? DEMO_REPORT.totalIncome : (balanceData?.currentMonthIncome ?? 0);
  const lastMonthIncome = isDemoMode ? DEMO_REPORT.totalIncome * 0.9 : (balanceData?.lastMonthIncome ?? 0);
  
  const lastMonthExpenses = monthlyTrends.length >= 2 ? (monthlyTrends[monthlyTrends.length - 2]?.total ?? 0) : 0;

  // Loading state
  if (isLoading || isLoadingBalance) {
    return (
      <div className="space-y-5">
        <SkeletonHeroCard />
        <SkeletonGrid count={4} cols={4} />
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl p-6 bg-red-50 dark:bg-red-500/7 border border-red-200 dark:border-red-500/20"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="flex-shrink-0" size={24} style={{ color: '#F87171' }} />
            <div className="flex-1">
              <h3 className="font-medium mb-1 text-red-600 dark:text-red-400" style={{ fontSize: '16px' }}>
                Failed to load dashboard
              </h3>
              <p className="mb-4 text-red-600/80 dark:text-red-400/80" style={{ fontSize: '13px' }}>
                {error || 'An unexpected error occurred'}
              </p>
              <button onClick={refetch} className="btn-primary">
                <RefreshCw size={14} />
                Retry
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="pb-8"
    >
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          HERO SECTION - Greeting + Quick Actions
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div>
            <h1
              className="font-semibold flex items-center gap-3 text-gray-900 dark:text-white"
              style={{
                fontSize: '32px',
                letterSpacing: '-0.8px',
                lineHeight: '1.2',
              }}
            >
              {getGreeting()}, {firstName}
              <motion.span
                className="text-3xl"
                animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
              </motion.span>
            </h1>
            <p
              className="flex items-center gap-2 mt-2 text-gray-500 dark:text-white/50"
              style={{
                fontSize: '15px',
              }}
            >
              <Zap size={15} style={{ color: '#FBBF24' }} />
              {formatMonthYear()} • {totalCount} transactions tracked
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Add Income button clicked');
                navigate('/income');
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all"
              style={{
                fontSize: '14px',
                background: 'rgba(52, 211, 153, 0.12)',
                color: '#34D399',
                border: '1px solid rgba(52, 211, 153, 0.25)',
                cursor: 'pointer',
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(52, 211, 153, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(52, 211, 153, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(52, 211, 153, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(52, 211, 153, 0.25)';
              }}
            >
              <Plus size={18} />
              Add Income
            </motion.button>

            <motion.button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Add Expense button clicked');
                navigate('/expenses/add');
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all"
              style={{
                fontSize: '14px',
                background: 'linear-gradient(135deg, #5B4EE8 0%, #7C3AED 100%)',
                border: 'none',
                boxShadow: '0 4px 16px rgba(91, 78, 232, 0.35)',
                cursor: 'pointer',
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(91, 78, 232, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(91, 78, 232, 0.35)';
              }}
            >
              <Plus size={18} />
              Add Expense
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FINANCIAL CARDS - 3 Realistic Cards in a Row
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div variants={itemVariants}>
        <FinancialCards
          totalBalance={totalIncome - totalExpenses}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          currentMonthIncome={currentMonthIncome}
          currentMonthExpenses={currentMonthTotal}
          lastMonthIncome={lastMonthIncome}
          lastMonthExpenses={lastMonthExpenses}
        />
      </motion.div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          DEMO MODE BANNER - Show when using sample data
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {isDemoMode && (
        <motion.div
          variants={itemVariants}
          className="rounded-2xl p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-500/10 dark:to-indigo-500/10 border border-purple-200 dark:border-purple-500/20 mb-6"
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center bg-purple-100 dark:bg-purple-500/20 flex-shrink-0"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
              }}
            >
              <Sparkles size={18} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <p
                className="font-medium text-purple-900 dark:text-purple-300"
                style={{ fontSize: '14px' }}
              >
                ✦ Sample data shown — add your first expense to see your real financial insights
              </p>
              <p
                className="text-purple-600 dark:text-purple-400/80"
                style={{ fontSize: '12px', marginTop: '2px' }}
              >
                This beautiful dashboard is ready for your financial data
              </p>
            </div>
            <motion.button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Add First Expense button clicked');
                navigate('/expenses/add');
              }}
              className="px-4 py-2 rounded-lg font-medium transition-all bg-purple-600 dark:bg-purple-500 text-white hover:bg-purple-700 dark:hover:bg-purple-600"
              style={{ fontSize: '13px', cursor: 'pointer' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add First Expense →
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MAIN CHARTS ROW - Always Visible
          Top Expense Sources (left) + Financial Overview (right)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Expense Sources - Full Width Bar Chart */}
        <motion.div whileHover={{ scale: 1.005 }} transition={{ duration: 0.2 }}>
          <TopExpensesBarChart
            data={categories}
            isLoading={isLoading}
            isDemoMode={isDemoMode}
            compact={false}
          />
        </motion.div>

        {/* Financial Overview - Donut Chart */}
        <motion.div whileHover={{ scale: 1.005 }} transition={{ duration: 0.2 }}>
          <ReportDonutChart
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            isLoading={isLoading || isLoadingBalance}
            isDemoMode={isDemoMode}
          />
        </motion.div>
      </motion.div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          STAT CARDS - 4 in ONE row (Equal Heights)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div whileHover={{ scale: 1.02, y: -4 }} transition={{ duration: 0.2 }}>
          <StatCard
            label="This Month"
            value={formatCurrency(currentMonthTotal)}
            icon={Calendar}
            iconColor="#A78BFA"
            iconBg="rgba(91, 78, 232, 0.15)"
            subtitle={`${currentMonthCount} transactions`}
            sparkline={monthlyTrends.slice(-7).map((t) => t.total)}
            trend={
              lastMonthExpenses > 0
                ? {
                    value: Math.abs(((currentMonthTotal - lastMonthExpenses) / lastMonthExpenses) * 100),
                    isPositive: currentMonthTotal < lastMonthExpenses,
                  }
                : undefined
            }
          />
        </motion.div>

        <motion.div whileHover={{ scale: 1.02, y: -4 }} transition={{ duration: 0.2 }}>
          <StatCard
            label="Average"
            value={formatCurrency(averageExpense)}
            icon={Calculator}
            iconColor="#34D399"
            iconBg="rgba(52, 211, 153, 0.12)"
            subtitle="Per transaction"
          />
        </motion.div>

        <motion.div whileHover={{ scale: 1.02, y: -4 }} transition={{ duration: 0.2 }}>
          <StatCard
            label="Highest"
            value={formatCurrency(highestExpense)}
            icon={ArrowUpRight}
            iconColor="#F87171"
            iconBg="rgba(248, 113, 113, 0.12)"
            subtitle="Single expense"
          />
        </motion.div>

        <motion.div whileHover={{ scale: 1.02, y: -4 }} transition={{ duration: 0.2 }}>
          <StatCard
            label="Total"
            value={String(totalCount)}
            icon={Receipt}
            iconColor="#FBBF24"
            iconBg="rgba(251, 191, 36, 0.12)"
            subtitle="All transactions"
            sparkline={monthlyTrends.slice(-7).map((t) => t.count)}
          />
        </motion.div>
      </motion.div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BUDGET ALERTS - Show warnings and exceeded budgets
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {budgetAlerts.length > 0 && (
        <motion.div variants={itemVariants} className="mb-6">
          <div className="space-y-3">
            {budgetAlerts.map((alert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Budget alert clicked');
                  navigate('/budgets');
                }}
                className={`cursor-pointer rounded-xl p-4 transition-all hover:scale-[1.01] ${
                  alert.severity === 'critical'
                    ? 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30'
                    : 'bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30'
                }`}
                style={{ cursor: 'pointer' }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex items-center justify-center flex-shrink-0 ${
                      alert.severity === 'critical'
                        ? 'bg-red-100 dark:bg-red-500/20'
                        : 'bg-orange-100 dark:bg-orange-500/20'
                    }`}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                    }}
                  >
                    <AlertTriangle
                      size={20}
                      style={{
                        color: alert.severity === 'critical' ? '#F87171' : '#FB923C',
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`font-medium mb-1 ${
                        alert.severity === 'critical'
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-orange-600 dark:text-orange-400'
                      }`}
                      style={{
                        fontSize: '14px',
                      }}
                    >
                      {alert.budget_name} Budget {alert.severity === 'critical' ? 'Exceeded' : 'Warning'}
                    </h4>
                    <p
                      className="text-gray-600 dark:text-white/60"
                      style={{
                        fontSize: '13px',
                      }}
                    >
                      {alert.utilization_percentage.toFixed(0)}% used • ${alert.spent_amount.toFixed(0)} of ${alert.amount.toFixed(0)}
                    </p>
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-gray-400 dark:text-white/30"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BENTO GRID LAYOUT - Main content + Right sidebar
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN - Main Content (8 cols) */}
        <div className="lg:col-span-8 space-y-6">

          {/* Expense Line Chart (Full Width) */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.005 }} transition={{ duration: 0.2 }}>
            <ExpenseLineChart
              data={monthlyTrends}
              isLoading={isLoading}
              isDemoMode={isDemoMode}
            />
          </motion.div>

          {/* Cash Flow Chart (Full Width) */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.005 }} transition={{ duration: 0.2 }}>
            <AreaChart data={monthlyTrends} height={260} />
          </motion.div>

          {/* Recent Transactions */}
          <motion.div variants={itemVariants}>
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold flex items-center gap-2.5 text-gray-900 dark:text-white" style={{ fontSize: '17px' }}>
                    <div
                      className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 shadow-md shadow-purple-500/30"
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                      }}
                    />
                    Recent Activity
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400" style={{ fontSize: '13px', marginTop: '4px' }}>
                    Latest {recentExpenses.length} transactions
                  </p>
                </div>
                <motion.button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('View all expenses button clicked');
                    navigate('/expenses');
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-500/15"
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View all
                  <ArrowRight size={14} />
                </motion.button>
              </div>

              {recentExpenses.length === 0 && !isDemoMode ? (
                <EmptyState
                  icon={Inbox}
                  title="No transactions yet"
                  message="Start tracking by adding your first expense"
                  action={{
                    label: 'Add Expense',
                    onClick: () => navigate('/expenses/add'),
                  }}
                />
              ) : (
                <div className="space-y-1">
                  {recentExpenses.slice(0, 6).map((expense, index) => (
                    <TransactionRow
                      key={expense.id}
                      expense={expense}
                      index={index}
                      showActions={false}
                      compact={false}
                    />
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* RIGHT COLUMN - Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Category Breakdown List (BUG 4 FIX - replaced duplicate chart) */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
            <div
              className={`rounded-2xl border p-5 bg-white dark:bg-[#0F1117] border-[#E8ECF0] dark:border-white/[0.07]`}
              style={{ boxShadow: 'none' }}
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-[15px] font-semibold text-gray-800 dark:text-white">
                    Category Breakdown
                  </h3>
                  {isDemoMode && (
                    <span className="text-[10px] text-purple-500 dark:text-purple-400">
                      Sample data
                    </span>
                  )}
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg animate-pulse bg-gray-100 dark:bg-white/5" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-24 rounded animate-pulse bg-gray-100 dark:bg-white/5" />
                        <div className="h-2.5 w-16 rounded animate-pulse bg-gray-100 dark:bg-white/5" />
                      </div>
                      <div className="h-3 w-16 rounded animate-pulse bg-gray-100 dark:bg-white/5" />
                    </div>
                  ))}
                </div>
              ) : categories.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-gray-400 dark:text-white/30">No categories yet</p>
                  <p className="text-xs text-gray-300 dark:text-white/20 mt-1">
                    Add expenses to see breakdown
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {categories.slice(0, 5).map((cat, i) => (
                    <div
                      key={cat.category}
                      className={`flex items-center gap-3 py-2.5 px-2 rounded-lg cursor-default hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors duration-150 ${
                        i < categories.length - 1
                          ? 'border-b border-gray-50 dark:border-white/[0.03]'
                          : ''
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-base"
                        style={{ background: getCategoryBg(cat.category) }}
                      >
                        {getCategoryEmoji(cat.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 dark:text-white/80 truncate">
                          {cat.category}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-white/30 mt-0.5">
                          {cat.count} transaction{cat.count !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                          {formatCurrency(cat.total)}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-white/30 mt-0.5">
                          {cat.percentage.toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* AI Insights */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 shadow-lg shadow-purple-500/30"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '14px',
                  }}
                >
                  <Sparkles size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white" style={{ fontSize: '16px' }}>
                    AI Insights
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400" style={{ fontSize: '12px' }}>
                    Smart analysis
                  </p>
                </div>
              </div>

              {!insights || insights.insights.length === 0 ? (
                <EmptyState
                  icon={Sparkles}
                  title="No insights yet"
                  message="Track more expenses to get AI-powered insights"
                />
              ) : (
                <div className="space-y-3">
                  {insights.insights.slice(0, 3).map((insight, index) => (
                    <InsightCard key={index} insight={insight} index={index} />
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Quick Stats Card */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
            <Card>
              <h3 className="font-semibold mb-5 flex items-center gap-2.5 text-gray-900 dark:text-white" style={{ fontSize: '16px' }}>
                <div
                  className="bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-500 shadow-md shadow-amber-500/30"
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                  }}
                />
                Quick Stats
              </h3>

              <div className="space-y-3">
                {/* Total Spent Card */}
                <motion.div
                  className="flex items-center justify-between p-4 rounded-xl transition-all cursor-pointer bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 shadow-lg shadow-purple-500/30"
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <DollarSign size={22} className="text-white" />
                    </div>
                    <div>
                      <p className="text-purple-700 dark:text-purple-400" style={{ fontSize: '12px', fontWeight: 600 }}>
                        Total Spent
                      </p>
                      <p className="font-bold text-gray-900 dark:text-white" style={{ fontSize: '20px', letterSpacing: '-0.4px' }}>
                        {formatCurrency(totalExpenses)}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Categories Card */}
                <motion.div
                  className="flex items-center justify-between p-4 rounded-xl transition-all cursor-pointer bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 shadow-lg shadow-green-500/30"
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <TrendingUp size={22} className="text-white" />
                    </div>
                    <div>
                      <p className="text-green-700 dark:text-green-400" style={{ fontSize: '12px', fontWeight: 600 }}>
                        Categories
                      </p>
                      <p className="font-bold text-gray-900 dark:text-white" style={{ fontSize: '20px', letterSpacing: '-0.4px' }}>
                        {categories.length} active
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* This Month Card */}
                <motion.div
                  className="flex items-center justify-between p-4 rounded-xl transition-all cursor-pointer bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-500 shadow-lg shadow-amber-500/30"
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Target size={22} className="text-white" />
                    </div>
                    <div>
                      <p className="text-amber-700 dark:text-amber-400" style={{ fontSize: '12px', fontWeight: 600 }}>
                        This Month
                      </p>
                      <p className="font-bold text-gray-900 dark:text-white" style={{ fontSize: '20px', letterSpacing: '-0.4px' }}>
                        {currentMonthCount} items
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
