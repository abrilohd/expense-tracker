/**
 * Reports Page - Financial analytics and export
 * Fixed: Total Income, graphs, and export functionality
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Copy, TrendingUp, TrendingDown, DollarSign, Receipt, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardHeader, StatCard } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import AreaChart from '../components/charts/AreaChart';
import DonutChart from '../components/charts/DonutChart';
import { generateQuickReport, exportQuickReportCSV, downloadBlob } from '../api/reports.api';
import { CATEGORIES } from '../utils/constants';
import type { ReportResponse } from '../types';

type Period = 'this_month' | 'last_month' | 'last_30_days';
type SortBy = 'amount' | 'count';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('this_month');
  const [sortBy, setSortBy] = useState<SortBy>('amount');
  const [reportData, setReportData] = useState<ReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch report data
  useEffect(() => {
    const fetchReport = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await generateQuickReport(selectedPeriod);
        setReportData(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load report');
        console.error('Report fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [selectedPeriod]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get data from report
  const totalExpenses = reportData?.summary.total_expenses || 0;
  const totalIncome = reportData?.summary.total_income || 0;
  const netBalance = reportData?.summary.balance || 0;
  const transactionCount = (reportData?.summary.income_count || 0) + (reportData?.summary.expense_count || 0);

  // Convert category breakdown to array
  const categoryArray = reportData?.category_breakdown
    ? Object.entries(reportData.category_breakdown).map(([category, data]) => ({
        category,
        total: data.total,
        count: data.count,
        percentage: data.percentage,
      }))
    : [];

  // Sort categories
  const sortedCategories = [...categoryArray].sort((a, b) => {
    if (sortBy === 'amount') {
      return b.total - a.total;
    }
    return b.count - a.count;
  });

  // Calculate total for percentages
  const categoryTotal = sortedCategories.reduce((sum, cat) => sum + cat.total, 0);

  // Prepare chart data
  const chartData = reportData?.monthly_trends?.map((trend) => ({
    month: trend.month,
    income: trend.income,
    expenses: trend.expenses,
  })) || [];

  const donutData = sortedCategories.map((cat) => ({
    category: cat.category,
    total: cat.total,
    count: cat.count,
  }));

  // Export to CSV
  const exportToCSV = async () => {
    try {
      const blob = await exportQuickReportCSV(selectedPeriod);
      const filename = `financial-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`;
      downloadBlob(blob, filename);
      toast.success('CSV exported successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to export CSV');
    }
  };

  // Export to PDF (placeholder)
  const exportToPDF = () => {
    toast('PDF export coming soon!', { icon: '📄' });
  };

  // Copy summary to clipboard
  const copySummary = () => {
    if (!reportData) {
      toast.error('No data available');
      return;
    }

    const periodLabel = selectedPeriod === 'this_month' ? 'This Month' : 
                       selectedPeriod === 'last_month' ? 'Last Month' : 'Last 30 Days';

    const summary = `
Financial Summary Report
Generated: ${new Date().toLocaleDateString()}

Period: ${periodLabel}
Total Income: ${formatCurrency(totalIncome)}
Total Expenses: ${formatCurrency(totalExpenses)}
Net Balance: ${formatCurrency(netBalance)}
Transactions: ${transactionCount}

Top Categories:
${sortedCategories
  .slice(0, 5)
  .map((cat) => `- ${cat.category}: ${formatCurrency(cat.total)} (${cat.count} transactions)`)
  .join('\n')}
    `.trim();

    navigator.clipboard.writeText(summary);
    toast.success('Summary copied to clipboard!');
  };

  // Get category emoji
  const getCategoryEmoji = (category: string) => {
    const cat = CATEGORIES.find((c) => c.label === category);
    return cat?.emoji || '📦';
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Food: '#FB923C',
      Transport: '#3B82F6',
      Housing: '#A78BFA',
      Entertainment: '#EC4899',
      Health: '#34D399',
      Shopping: '#FBBF24',
      Education: '#6366F1',
      Other: '#9CA3AF',
    };
    return colors[category] || '#9CA3AF';
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
      >
        <div>
          <h1
            className="font-medium text-gray-900 dark:text-white"
            style={{
              fontSize: '22px',
              letterSpacing: '-0.4px',
            }}
          >
            Financial Reports
          </h1>
          <p
            className="text-gray-500 dark:text-white/45"
            style={{
              fontSize: '13px',
              marginTop: '2px',
            }}
          >
            Comprehensive analytics and insights
          </p>
        </div>

        {/* Period Tabs */}
        <div
          className="flex items-center gap-1 bg-gray-100 dark:bg-white/[0.03]"
          style={{
            borderRadius: '10px',
            padding: '3px',
          }}
        >
          <button
            onClick={() => setSelectedPeriod('this_month')}
            className={`px-4 py-2 rounded-lg transition-all font-medium ${
              selectedPeriod === 'this_month'
                ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                : 'bg-transparent text-gray-600 dark:text-white/50 border border-transparent'
            }`}
            style={{
              fontSize: '13px',
            }}
          >
            This Month
          </button>
          <button
            onClick={() => setSelectedPeriod('last_month')}
            className={`px-4 py-2 rounded-lg transition-all font-medium ${
              selectedPeriod === 'last_month'
                ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                : 'bg-transparent text-gray-600 dark:text-white/50 border border-transparent'
            }`}
            style={{ fontSize: '13px' }}
          >
            Last Month
          </button>
          <button
            onClick={() => setSelectedPeriod('last_30_days')}
            className={`px-4 py-2 rounded-lg transition-all font-medium ${
              selectedPeriod === 'last_30_days'
                ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                : 'bg-transparent text-gray-600 dark:text-white/50 border border-transparent'
            }`}
            style={{ fontSize: '13px' }}
          >
            Last 30 Days
          </button>
        </div>
      </motion.div>

      {/* Error State */}
      {error && (
        <Card padding="lg">
          <EmptyState
            icon={BarChart3}
            title="Failed to load report"
            message={error}
          />
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !error && !reportData && (
        <Card padding="lg">
          <EmptyState
            icon={BarChart3}
            title="No data available"
            message="Start tracking expenses to see your financial reports"
          />
        </Card>
      )}

      {/* Reports Content */}
      {reportData && (
        <>
          {/* SECTION 1 — Period Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.08 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          >
            <StatCard
              label="Total Expenses"
              value={formatCurrency(totalExpenses)}
              icon={TrendingDown}
              iconColor="#F87171"
              iconBg="rgba(248, 113, 113, 0.15)"
              isLoading={isLoading}
            />
            <StatCard
              label="Total Income"
              value={formatCurrency(totalIncome)}
              icon={TrendingUp}
              iconColor="#34D399"
              iconBg="rgba(52, 211, 153, 0.15)"
              isLoading={isLoading}
            />
            <StatCard
              label="Net Balance"
              value={formatCurrency(netBalance)}
              icon={DollarSign}
              iconColor={netBalance >= 0 ? '#34D399' : '#F87171'}
              iconBg={
                netBalance >= 0
                  ? 'rgba(52, 211, 153, 0.15)'
                  : 'rgba(248, 113, 113, 0.15)'
              }
              isLoading={isLoading}
            />
            <StatCard
              label="Transactions"
              value={transactionCount.toString()}
              icon={Receipt}
              iconColor="#A78BFA"
              iconBg="rgba(91, 78, 232, 0.15)"
              isLoading={isLoading}
            />
          </motion.div>

          {/* SECTION 2 — Main Charts */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.16 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6"
          >
            {/* Area Chart */}
            <AreaChart
              data={chartData}
              isLoading={isLoading}
              height={260}
            />

            {/* Donut Chart */}
            <DonutChart
              data={donutData}
              isLoading={isLoading}
            />
          </motion.div>

          {/* SECTION 3 — Category Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.24 }}
            className="mb-6"
          >
            <Card padding="lg">
              <div className="flex items-start justify-between mb-5">
              <div>
                  <h3
                    className="font-medium text-gray-900 dark:text-white"
                    style={{
                      fontSize: '14px',
                    }}
                  >
                    Spending by Category
                  </h3>
                  <p
                    className="text-gray-500 dark:text-white/35"
                    style={{
                      fontSize: '11px',
                      marginTop: '2px',
                    }}
                  >
                    Detailed breakdown for {selectedPeriod.toLowerCase()}
                  </p>
                </div>

                {/* Sort Toggle */}
                <div
                  className="flex items-center gap-1 bg-gray-100 dark:bg-white/[0.03]"
                  style={{
                    borderRadius: '8px',
                    padding: '2px',
                  }}
                >
                  <button
                    onClick={() => setSortBy('amount')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      sortBy === 'amount'
                        ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400'
                        : 'bg-transparent text-gray-500 dark:text-white/40'
                    }`}
                    style={{
                      fontSize: '11px',
                      fontWeight: 500,
                    }}
                  >
                    By Amount
                  </button>
                  <button
                    onClick={() => setSortBy('count')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      sortBy === 'count'
                        ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400'
                        : 'bg-transparent text-gray-500 dark:text-white/40'
                    }`}
                    style={{
                      fontSize: '11px',
                      fontWeight: 500,
                    }}
                  >
                    By Count
                  </button>
                </div>
              </div>

              {/* Category Bars */}
              <div className="space-y-4">
                {sortedCategories.map((category, index) => {
                  const percentage = categoryTotal > 0 ? (category.total / categoryTotal) * 100 : 0;
                  const color = getCategoryColor(category.category);

                  return (
                    <motion.div
                      key={category.category}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: '18px' }}>
                            {getCategoryEmoji(category.category)}
                          </span>
                          <span
                            className="font-medium text-gray-900 dark:text-white"
                            style={{
                              fontSize: '13px',
                            }}
                          >
                            {category.category}
                          </span>
                          <span
                            className="text-gray-400 dark:text-white/35"
                            style={{
                              fontSize: '11px',
                            }}
                          >
                            ({category.count} transactions)
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className="font-medium text-gray-900 dark:text-white"
                            style={{
                              fontSize: '13px',
                            }}
                          >
                            {formatCurrency(category.total)}
                          </span>
                          <span
                            className="text-gray-500 dark:text-white/45"
                            style={{
                              fontSize: '11px',
                              minWidth: '40px',
                              textAlign: 'right',
                            }}
                          >
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div
                        className="bg-gray-100 dark:bg-white/6"
                        style={{
                          height: '8px',
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.05 }}
                          style={{
                            height: '100%',
                            background: color,
                            borderRadius: '4px',
                          }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* SECTION 4 — Income vs Expense Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.32 }}
            className="mb-6"
          >
            <Card padding="lg">
              <CardHeader
                title="Income vs Expenses"
                subtitle="Financial comparison for the period"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Income Card */}
                <div
                  className="p-5 rounded-xl"
                  style={{
                    background: 'rgba(52, 211, 153, 0.08)',
                    border: '1px solid rgba(52, 211, 153, 0.15)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={18} style={{ color: '#34D399' }} />
                    <span
                      className="font-medium text-gray-600 dark:text-white/70"
                      style={{
                        fontSize: '13px',
                      }}
                    >
                      Total Income
                    </span>
                  </div>
                  <h3
                    className="font-medium"
                    style={{
                      fontSize: '28px',
                      color: '#34D399',
                      letterSpacing: '-0.6px',
                    }}
                  >
                    {formatCurrency(totalIncome)}
                  </h3>
                </div>

                {/* Expense Card */}
                <div
                  className="p-5 rounded-xl"
                  style={{
                    background: 'rgba(248, 113, 113, 0.08)',
                    border: '1px solid rgba(248, 113, 113, 0.15)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown size={18} style={{ color: '#F87171' }} />
                    <span
                      className="font-medium text-gray-600 dark:text-white/70"
                      style={{
                        fontSize: '13px',
                      }}
                    >
                      Total Expenses
                    </span>
                  </div>
                  <h3
                    className="font-medium"
                    style={{
                      fontSize: '28px',
                      color: '#F87171',
                      letterSpacing: '-0.6px',
                    }}
                  >
                    {formatCurrency(totalExpenses)}
                  </h3>
                </div>
              </div>

              {/* Balance Card */}
              <div
                className="p-5 rounded-xl"
                style={{
                  background:
                    netBalance >= 0
                      ? 'rgba(52, 211, 153, 0.08)'
                      : 'rgba(248, 113, 113, 0.08)',
                  border:
                    netBalance >= 0
                      ? '1px solid rgba(52, 211, 153, 0.15)'
                      : '1px solid rgba(248, 113, 113, 0.15)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                  <span
                    className="font-medium text-gray-600 dark:text-white/70"
                    style={{
                      fontSize: '13px',
                    }}
                  >
                    Net Balance
                  </span>
                    <h3
                      className="font-medium mt-1"
                      style={{
                        fontSize: '32px',
                        color: netBalance >= 0 ? '#34D399' : '#F87171',
                        letterSpacing: '-0.8px',
                      }}
                    >
                      {formatCurrency(Math.abs(netBalance))}
                    </h3>
                  </div>
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '14px',
                      background:
                        netBalance >= 0
                          ? 'rgba(52, 211, 153, 0.15)'
                          : 'rgba(248, 113, 113, 0.15)',
                    }}
                  >
                    {netBalance >= 0 ? (
                      <TrendingUp size={28} style={{ color: '#34D399' }} />
                    ) : (
                      <TrendingDown size={28} style={{ color: '#F87171' }} />
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* SECTION 5 — Export Options */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card padding="lg">
              <CardHeader
                title="Export Report"
                subtitle="Download your financial data"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* CSV Export */}
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-3 p-4 rounded-xl transition-all"
                  style={{
                    background: 'rgba(52, 211, 153, 0.08)',
                    border: '1px solid rgba(52, 211, 153, 0.15)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(52, 211, 153, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(52, 211, 153, 0.08)';
                  }}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(52, 211, 153, 0.15)',
                    }}
                  >
                    <Download size={20} style={{ color: '#34D399' }} />
                  </div>
                  <div className="text-left">
                    <p
                      className="font-medium text-gray-900 dark:text-white"
                      style={{
                        fontSize: '13px',
                      }}
                    >
                      Download CSV
                    </p>
                    <p
                      className="text-gray-500 dark:text-white/45"
                      style={{
                        fontSize: '11px',
                      }}
                    >
                      Export to spreadsheet
                    </p>
                  </div>
                </button>

                {/* PDF Export */}
                <button
                  onClick={exportToPDF}
                  className="flex items-center gap-3 p-4 rounded-xl transition-all"
                  style={{
                    background: 'rgba(91, 78, 232, 0.08)',
                    border: '1px solid rgba(91, 78, 232, 0.15)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(91, 78, 232, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(91, 78, 232, 0.08)';
                  }}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(91, 78, 232, 0.15)',
                    }}
                  >
                    <FileText size={20} style={{ color: '#A78BFA' }} />
                  </div>
                  <div className="text-left">
                    <p
                      className="font-medium text-gray-900 dark:text-white"
                      style={{
                        fontSize: '13px',
                      }}
                    >
                      Download PDF
                    </p>
                    <p
                      className="text-gray-500 dark:text-white/45"
                      style={{
                        fontSize: '11px',
                      }}
                    >
                      Formatted report
                    </p>
                  </div>
                </button>

                {/* Copy Summary */}
                <button
                  onClick={copySummary}
                  className="flex items-center gap-3 p-4 rounded-xl transition-all"
                  style={{
                    background: 'rgba(251, 191, 36, 0.08)',
                    border: '1px solid rgba(251, 191, 36, 0.15)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(251, 191, 36, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(251, 191, 36, 0.08)';
                  }}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(251, 191, 36, 0.15)',
                    }}
                  >
                    <Copy size={20} style={{ color: '#FBBF24' }} />
                  </div>
                  <div className="text-left">
                    <p
                      className="font-medium text-gray-900 dark:text-white"
                      style={{
                        fontSize: '13px',
                      }}
                    >
                      Copy Summary
                    </p>
                    <p
                      className="text-gray-500 dark:text-white/45"
                      style={{
                        fontSize: '11px',
                      }}
                    >
                      Text to clipboard
                    </p>
                  </div>
                </button>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Reports;
