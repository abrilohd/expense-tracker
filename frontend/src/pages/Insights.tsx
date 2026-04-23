/**
 * AI Insights page - displays AI-generated spending insights
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, AlertCircle, TrendingUp } from 'lucide-react';
import { getInsights } from '../api/expenses';
import type { InsightsResponse } from '../types';
import InsightCard from '../components/ui/InsightCard';
import { InsightCardSkeleton } from '../components/ui/Skeleton';
import { PageLoader } from '../components/ui/LoadingSpinner';

const InsightsPage = () => {
  const [data, setData] = useState<InsightsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<number>(30);

  // Fetch insights data
  const fetchInsights = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const insightsData = await getInsights(selectedPeriod);
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
  }, [selectedPeriod]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>

        {/* Summary Skeleton */}
        <div className="h-16 bg-white dark:bg-gray-800 rounded-xl shadow-card animate-pulse" />

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <InsightCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
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
                Retry
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
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              AI Insights
              <Sparkles className="text-blue-500" size={28} />
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              AI-powered spending pattern analysis
            </p>
          </div>

          {/* Period Selector */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(Number(e.target.value))}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <TrendingUp className="text-gray-400 dark:text-gray-600" size={40} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No insights yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
            Add more expenses to get AI-powered insights about your spending patterns
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            AI Insights
            <Sparkles className="text-blue-500" size={28} />
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            AI-powered spending pattern analysis
          </p>
        </div>

        {/* Period Selector */}
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(Number(e.target.value))}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Summary Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
            <Sparkles className="text-blue-600 dark:text-blue-400" size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {data.insights.length} insight{data.insights.length !== 1 ? 's' : ''} generated for
              last {selectedPeriod} days
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
              Generated on {new Date(data.generated_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Insights Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
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
        {data.insights.map((insight, index) => (
          <InsightCard key={index} insight={insight} index={index} />
        ))}
      </motion.div>
    </div>
  );
};

export default InsightsPage;
