/**
 * AI Insights page - displays AI-generated spending insights
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, AlertCircle, Clock, Plus } from 'lucide-react';
import { getInsights } from '../api/expenses';
import type { InsightsResponse, InsightType, CategorySummary } from '../types';
import { useDashboardData } from '../hooks/useExpenses';
import InsightCard from '../components/ui/InsightCard';
import { InsightSkeletonGrid } from '../components/ui/InsightCardSkeleton';
import BudgetOverviewCard from '../components/ui/BudgetOverviewCard';
import { formatDate, formatCurrency, getCategoryEmoji } from '../utils/formatters';

const InsightsPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<InsightsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<number>(30);

  // Fetch dashboard data for category breakdown
  const { data: dashData } = useDashboardData();

  // Fetch insights data
  const fetchInsights = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const insightsData = await getInsights(selectedDays);
      setData(insightsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load insights');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch insights when period changes
  useEffect(() => {
    fetchInsights();
  }, [selectedDays]);

  // Count insights by type
  const getInsightCounts = () => {
    if (!data) return { warning: 0, success: 0, tip: 0, info: 0 };

    return data.insights.reduce(
      (acc, insight) => {
        acc[insight.type] = (acc[insight.type] || 0) + 1;
        return acc;
      },
      { warning: 0, success: 0, tip: 0, info: 0 } as Record<InsightType, number>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Summary Skeleton */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full animate-pulse" />
              <div className="space-y-2">
                <div className="h-5 w-48 bg-white/20 rounded animate-pulse" />
                <div className="h-4 w-40 bg-white/20 rounded animate-pulse" />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="h-12 w-24 bg-white/20 rounded-lg animate-pulse" />
              <div className="h-12 w-24 bg-white/20 rounded-lg animate-pulse" />
              <div className="h-12 w-24 bg-white/20 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>

        {/* Cards Skeleton */}
        <InsightSkeletonGrid />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        {/* Two-column header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              AI Insights ✨
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Smart analysis of your spending patterns
            </p>
          </div>

          {/* Period selector button group */}
          <div className="flex flex-col items-end gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Analysis Period:</span>
            <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {[7, 30, 90].map((days, index) => (
                <button
                  key={days}
                  onClick={() => setSelectedDays(days)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    selectedDays === days
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } ${index === 0 ? 'rounded-l-lg' : ''} ${index === 2 ? 'rounded-r-lg' : ''}`}
                >
                  {days} days
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error message */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" size={24} />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-1">
                Failed to load insights
              </h3>
              <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
              <button
                onClick={fetchInsights}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state - no insights
  if (!data || data.insights.length === 0) {
    return (
      <div className="space-y-6">
        {/* Two-column header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              AI Insights ✨
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Smart analysis of your spending patterns
            </p>
          </div>

          {/* Period selector button group */}
          <div className="flex flex-col items-end gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Analysis Period:</span>
            <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {[7, 30, 90].map((days, index) => (
                <button
                  key={days}
                  onClick={() => setSelectedDays(days)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    selectedDays === days
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } ${index === 0 ? 'rounded-l-lg' : ''} ${index === 2 ? 'rounded-r-lg' : ''}`}
                >
                  {days} days
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Empty state */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="text-blue-500 dark:text-blue-400" size={40} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Not enough data yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mx-auto mb-6">
            Add more expenses to unlock AI insights. We need at least a few transactions to analyze your spending patterns.
          </p>
          <button
            onClick={() => navigate('/expenses/add')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
          >
            <Plus size={20} />
            Add Expenses
          </button>
        </div>
      </div>
    );
  }

  const counts = getInsightCounts();

  // Category color mapping for personality tags
  const getCategoryBarColor = (category: string): string => {
    const colors: Record<string, string> = {
      Food: '#F59E0B',
      Transport: '#3B82F6',
      Housing: '#8B5CF6',
      Entertainment: '#EC4899',
      Health: '#10B981',
      Shopping: '#F97316',
      Education: '#6366F1',
      Other: '#6B7280',
    };
    return colors[category] || colors.Other;
  };

  // Derive spending personality from top category
  const getSpendingPersonality = () => {
    if (!dashData?.categories || dashData.categories.length === 0) {
      return {
        emoji: '⚡',
        type: 'The Balanced Spender',
        desc: 'Your spending is diverse and well-rounded',
        color: '#6B7280',
      };
    }

    const topCategory = dashData.categories[0].category;

    const personalities: Record<string, { emoji: string; type: string; desc: string; color: string }> = {
      Food: {
        emoji: '🍕',
        type: 'The Foodie',
        desc: 'You love spending on experiences and food',
        color: '#F59E0B',
      },
      Entertainment: {
        emoji: '🍕',
        type: 'The Foodie',
        desc: 'You love spending on experiences and food',
        color: '#F59E0B',
      },
      Transport: {
        emoji: '🚗',
        type: 'The Commuter',
        desc: 'Travel and transport dominate your budget',
        color: '#3B82F6',
      },
      Housing: {
        emoji: '🏠',
        type: 'The Homebody',
        desc: 'Home is where your money goes',
        color: '#8B5CF6',
      },
      Shopping: {
        emoji: '🛍️',
        type: 'The Shopaholic',
        desc: 'Retail therapy is your go-to',
        color: '#EC4899',
      },
      Health: {
        emoji: '💪',
        type: 'The Wellness Seeker',
        desc: 'You invest in your health and wellbeing',
        color: '#10B981',
      },
      Education: {
        emoji: '📚',
        type: 'The Learner',
        desc: 'Knowledge is your best investment',
        color: '#6366F1',
      },
      Other: {
        emoji: '⚡',
        type: 'The Balanced Spender',
        desc: 'Your spending is diverse and well-rounded',
        color: '#6B7280',
      },
    };

    return personalities[topCategory] || personalities.Other;
  };

  const personality = getSpendingPersonality();

  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      {/* Two-column header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            AI Insights ✨
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-1 md:mt-2">
            Smart analysis of your spending patterns
          </p>
        </div>

        {/* Period selector button group */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Analysis Period:</span>
          <div className="flex w-full sm:w-auto rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {[7, 30, 90].map((days) => (
              <button
                key={days}
                onClick={() => setSelectedDays(days)}
                className={`flex-1 sm:flex-none px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors ${
                  selectedDays === days
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {days} days
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gradient summary bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 md:p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
          {/* Left: AI analysis summary */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="text-white" size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-base md:text-lg font-semibold">AI Analysis Complete</p>
              <p className="text-xs md:text-sm text-blue-100 truncate">
                {data.insights.length} insights generated for the last {selectedDays} days
              </p>
            </div>
          </div>

          {/* Right: Count by type */}
          <div className="flex flex-row gap-4 sm:gap-3">
            {counts.warning > 0 && (
              <div className="text-center">
                <div className="text-base md:text-lg font-bold">⚠️ {counts.warning}</div>
                <div className="text-xs text-blue-100">Warning{counts.warning !== 1 ? 's' : ''}</div>
              </div>
            )}
            {counts.success > 0 && (
              <div className="text-center">
                <div className="text-base md:text-lg font-bold">✅ {counts.success}</div>
                <div className="text-xs text-blue-100">Win{counts.success !== 1 ? 's' : ''}</div>
              </div>
            )}
            {counts.tip > 0 && (
              <div className="text-center">
                <div className="text-base md:text-lg font-bold">💡 {counts.tip}</div>
                <div className="text-xs text-blue-100">Tip{counts.tip !== 1 ? 's' : ''}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Insights grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
        {data.insights.map((insight, index) => (
          <InsightCard key={index} insight={insight} index={index} />
        ))}
      </div>

      {/* Footer with timestamp */}
      <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-400 pt-3 md:pt-4 border-t border-gray-200 dark:border-gray-700">
        <Clock size={14} className="md:w-4 md:h-4" />
        <span>Last analyzed: {formatDate(data.generated_at)}</span>
      </div>

      {/* Spending Breakdown Section */}
      <motion.div
        className="mt-6 md:mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        {/* Section title */}
        <div className="mb-3 md:mb-4">
          <h2 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">Spending Breakdown</h2>
          <p className="text-xs text-gray-600 dark:text-gray-500 mt-0.5">Category analysis for selected period</p>
        </div>

        {/* Two column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
          {/* Left: Budget Overview Card */}
          <BudgetOverviewCard
            categories={dashData?.categories ?? []}
            isLoading={!dashData}
            totalSpent={dashData?.total_expenses ?? 0}
          />

          {/* Right: Spending Personality Card */}
          {!dashData ? (
            // Loading state
            <div className="rounded-2xl md:rounded-[20px] p-5 md:p-6 bg-white dark:bg-[#141720] border border-gray-200 dark:border-white/[0.06]">
              <div className="space-y-4">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 dark:bg-white/5 rounded-2xl animate-pulse mx-auto" />
                <div className="h-5 md:h-6 w-40 md:w-48 bg-gray-200 dark:bg-white/5 rounded animate-pulse mx-auto" />
                <div className="h-3 md:h-4 w-48 md:w-64 bg-gray-200 dark:bg-white/5 rounded animate-pulse mx-auto" />
              </div>
            </div>
          ) : dashData.categories.length === 0 ? (
            // Empty state
            <div className="rounded-2xl md:rounded-[20px] p-5 md:p-6 bg-white dark:bg-[#141720] border border-gray-200 dark:border-white/[0.06]">
              <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white mb-1">Spending Personality</h3>
              <p className="text-xs text-gray-600 dark:text-gray-500 mb-4 md:mb-5">Based on your habits</p>
              <p className="text-sm text-gray-500 dark:text-gray-600 text-center py-6 md:py-8">
                Add expenses to unlock spending insights
              </p>
            </div>
          ) : (
            // Personality card
            <div className="rounded-2xl md:rounded-[20px] p-5 md:p-6 bg-white dark:bg-[#141720] border border-gray-200 dark:border-white/[0.06]">
              <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white mb-1">Spending Personality</h3>
              <p className="text-xs text-gray-600 dark:text-gray-500 mb-4 md:mb-5">Based on your habits</p>

              {/* Big emoji circle */}
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4"
                style={{
                  backgroundColor: `${personality.color}1A`,
                }}
              >
                <span className="text-5xl md:text-6xl">{personality.emoji}</span>
              </div>

              {/* Type label */}
              <h4 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white text-center">{personality.type}</h4>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2 px-2 md:px-4 leading-relaxed">
                {personality.desc}
              </p>

              {/* Divider */}
              <div className="my-3 md:my-4 border-t border-gray-200 dark:border-white/[0.06]" />

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 md:gap-4 text-center">
                {/* Most spent */}
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-600 mb-1">Most Spent</p>
                  <p className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {dashData.categories[0].category}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-500 mt-0.5 truncate">
                    {formatCurrency(dashData.categories[0].total)}
                  </p>
                </div>

                {/* Transactions */}
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-600 mb-1">Transactions</p>
                  <p className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white">{dashData.total_count}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-500 mt-0.5">All time</p>
                </div>

                {/* This month */}
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-600 mb-1">This Month</p>
                  <p className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {formatCurrency(dashData.current_month_total)}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-500 mt-0.5">
                    {dashData.current_month_count} txns
                  </p>
                </div>
              </div>

              {/* Category tags */}
              <div className="mt-3 md:mt-4 flex flex-wrap gap-2 justify-center">
                {dashData.categories.slice(0, 3).map((cat) => (
                  <div
                    key={cat.category}
                    className="text-xs px-2.5 md:px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: `${getCategoryBarColor(cat.category)}1F`,
                      color: getCategoryBarColor(cat.category),
                    }}
                  >
                    {getCategoryEmoji(cat.category)} {cat.category}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default InsightsPage;
