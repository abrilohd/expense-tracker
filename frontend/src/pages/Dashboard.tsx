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
import DonutChart from '../components/charts/DonutChart';
import FinancialCards from '../components/dashboard/FinancialCards';
import { getBalance } from '../api/balance';
import { getBudgetAlerts } from '../api/budgets';
import { useState, useEffect } from 'react';
import type { BudgetAlert } from '../types';

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
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

  // Extract data
  const totalExpenses = data?.total_expenses ?? 0;
  const currentMonthTotal = data?.current_month_total ?? 0;
  const currentMonthCount = data?.current_month_count ?? 0;
  const averageExpense = data?.average_expense ?? 0;
  const highestExpense = data?.highest_expense ?? 0;
  const totalCount = data?.total_count ?? 0;
  const categories = data?.categories ?? [];
  const monthlyTrends = data?.monthly_trends ?? [];
  const recentExpenses = data?.recent_expenses ?? [];

  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'User';
  
  // Use balance data if available, otherwise use defaults
  const totalIncome = balanceData?.totalIncome ?? 0;
  const currentMonthIncome = balanceData?.currentMonthIncome ?? 0;
  const lastMonthIncome = balanceData?.lastMonthIncome ?? 0;
  
  const lastMonthExpenses = monthlyTrends[monthlyTrends.length - 2]?.total ?? 0;

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
          className="rounded-2xl p-6"
          style={{
            background: 'rgba(248, 113, 113, 0.07)',
            border: '1px solid rgba(248, 113, 113, 0.2)',
          }}
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="flex-shrink-0" size={24} style={{ color: '#F87171' }} />
            <div className="flex-1">
              <h3 className="font-medium mb-1" style={{ fontSize: '16px', color: '#F87171' }}>
                Failed to load dashboard
              </h3>
              <p className="mb-4" style={{ fontSize: '13px', color: 'rgba(248, 113, 113, 0.8)' }}>
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
              className="font-semibold flex items-center gap-3"
              style={{
                fontSize: '32px',
                color: '#FFFFFF',
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
              className="flex items-center gap-2 mt-2"
              style={{
                fontSize: '15px',
                color: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              <Zap size={15} style={{ color: '#FBBF24' }} />
              {formatMonthYear()} • {totalCount} transactions tracked
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => navigate('/income')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all"
              style={{
                fontSize: '14px',
                background: 'rgba(52, 211, 153, 0.12)',
                color: '#34D399',
                border: '1px solid rgba(52, 211, 153, 0.25)',
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
              onClick={() => navigate('/expenses/add')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all"
              style={{
                fontSize: '14px',
                background: 'linear-gradient(135deg, #5B4EE8 0%, #7C3AED 100%)',
                color: '#FFFFFF',
                border: 'none',
                boxShadow: '0 4px 16px rgba(91, 78, 232, 0.35)',
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
                onClick={() => navigate('/budgets')}
                className="cursor-pointer rounded-xl p-4 transition-all hover:scale-[1.01]"
                style={{
                  background: alert.severity === 'critical' 
                    ? 'rgba(248, 113, 113, 0.1)' 
                    : 'rgba(251, 146, 60, 0.1)',
                  border: alert.severity === 'critical'
                    ? '1px solid rgba(248, 113, 113, 0.3)'
                    : '1px solid rgba(251, 146, 60, 0.3)',
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: alert.severity === 'critical'
                        ? 'rgba(248, 113, 113, 0.2)'
                        : 'rgba(251, 146, 60, 0.2)',
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
                      className="font-medium mb-1"
                      style={{
                        fontSize: '14px',
                        color: alert.severity === 'critical' ? '#F87171' : '#FB923C',
                      }}
                    >
                      {alert.budget_name} Budget {alert.severity === 'critical' ? 'Exceeded' : 'Warning'}
                    </h4>
                    <p
                      style={{
                        fontSize: '13px',
                        color: 'rgba(255, 255, 255, 0.6)',
                      }}
                    >
                      {alert.utilization_percentage.toFixed(0)}% used • ${alert.spent_amount.toFixed(0)} of ${alert.amount.toFixed(0)}
                    </p>
                  </div>
                  <ArrowRight
                    size={18}
                    style={{
                      color: 'rgba(255, 255, 255, 0.3)',
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BENTO GRID LAYOUT - Modern 2024 Design
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN - Main Content (8 cols) */}
        <div className="lg:col-span-8 space-y-6">

          {/* Stat Cards Grid - 2x2 */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
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

          {/* Cash Flow Chart */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.005 }} transition={{ duration: 0.2 }}>
            <AreaChart data={monthlyTrends} height={260} />
          </motion.div>

          {/* Recent Transactions */}
          <motion.div variants={itemVariants}>
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold flex items-center gap-2" style={{ fontSize: '17px', color: '#FFFFFF' }}>
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#5B4EE8',
                      }}
                    />
                    Recent Activity
                  </h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.45)', marginTop: '4px' }}>
                    Latest {recentExpenses.length} transactions
                  </p>
                </div>
                <motion.button
                  onClick={() => navigate('/expenses')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all"
                  style={{
                    fontSize: '13px',
                    color: '#A78BFA',
                    background: 'rgba(91, 78, 232, 0.1)',
                    border: '1px solid rgba(91, 78, 232, 0.2)',
                    fontWeight: 500,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(91, 78, 232, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(91, 78, 232, 0.1)';
                  }}
                >
                  View all
                  <ArrowRight size={14} />
                </motion.button>
              </div>

              {recentExpenses.length === 0 ? (
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
          {/* Category Breakdown Donut */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
            <DonutChart data={categories} />
          </motion.div>

          {/* AI Insights */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
            <Card padding="lg">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(91, 78, 232, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%)',
                  }}
                >
                  <Sparkles size={20} style={{ color: '#A78BFA' }} />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ fontSize: '15px', color: '#FFFFFF' }}>
                    AI Insights
                  </h3>
                  <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)' }}>
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
            <Card padding="lg">
              <h3 className="font-semibold mb-5 flex items-center gap-2" style={{ fontSize: '15px', color: '#FFFFFF' }}>
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#FBBF24',
                  }}
                />
                Quick Stats
              </h3>

              <div className="space-y-3">
                <motion.div
                  className="flex items-center justify-between p-4 rounded-xl transition-all cursor-pointer"
                  style={{ background: 'rgba(91, 78, 232, 0.08)' }}
                  whileHover={{ scale: 1.02, background: 'rgba(91, 78, 232, 0.12)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: 'rgba(91, 78, 232, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <DollarSign size={20} style={{ color: '#A78BFA' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.45)' }}>
                        Total Spent
                      </p>
                      <p className="font-semibold" style={{ fontSize: '18px', color: '#FFFFFF', letterSpacing: '-0.3px' }}>
                        {formatCurrency(totalExpenses)}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center justify-between p-4 rounded-xl transition-all cursor-pointer"
                  style={{ background: 'rgba(52, 211, 153, 0.08)' }}
                  whileHover={{ scale: 1.02, background: 'rgba(52, 211, 153, 0.12)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: 'rgba(52, 211, 153, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <TrendingUp size={20} style={{ color: '#34D399' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.45)' }}>
                        Categories
                      </p>
                      <p className="font-semibold" style={{ fontSize: '18px', color: '#FFFFFF', letterSpacing: '-0.3px' }}>
                        {categories.length} active
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center justify-between p-4 rounded-xl transition-all cursor-pointer"
                  style={{ background: 'rgba(251, 191, 36, 0.08)' }}
                  whileHover={{ scale: 1.02, background: 'rgba(251, 191, 36, 0.12)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: 'rgba(251, 191, 36, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Target size={20} style={{ color: '#FBBF24' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.45)' }}>
                        This Month
                      </p>
                      <p className="font-semibold" style={{ fontSize: '18px', color: '#FFFFFF', letterSpacing: '-0.3px' }}>
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
