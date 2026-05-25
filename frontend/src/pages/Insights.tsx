/**
 * AI Insights Page - Modern AI-Powered Spending Analysis
 * Production-ready with beautiful UI/UX
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Info,
  Calendar,
  Loader2,
  Brain,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import { getInsights, getDashboard } from '../api/expenses';
import type { InsightsResponse, Insight, DashboardData } from '../types';

const InsightsPage = () => {
  const [insights, setInsights] = useState<InsightsResponse | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<number>(30);

  useEffect(() => {
    loadData();
  }, [selectedDays]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [insightsData, dashboardData] = await Promise.all([
        getInsights(selectedDays),
        getDashboard(),
      ]);
      
      setInsights(insightsData);
      setDashboard(dashboardData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load insights';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Get insight icon and color
  const getInsightStyle = (type: string) => {
    switch (type) {
      case 'warning':
        return {
          icon: AlertTriangle,
          color: '#F87171',
          bg: 'rgba(248, 113, 113, 0.15)',
          border: 'rgba(248, 113, 113, 0.3)',
        };
      case 'success':
        return {
          icon: TrendingUp,
          color: '#34D399',
          bg: 'rgba(52, 211, 153, 0.15)',
          border: 'rgba(52, 211, 153, 0.3)',
        };
      case 'tip':
        return {
          icon: Lightbulb,
          color: '#FBBF24',
          bg: 'rgba(251, 191, 36, 0.15)',
          border: 'rgba(251, 191, 36, 0.3)',
        };
      default:
        return {
          icon: Info,
          color: '#60A5FA',
          bg: 'rgba(96, 165, 250, 0.15)',
          border: 'rgba(96, 165, 250, 0.3)',
        };
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get spending personality
  const getSpendingPersonality = () => {
    if (!dashboard?.categories || dashboard.categories.length === 0) {
      return {
        emoji: '⚡',
        type: 'Getting Started',
        desc: 'Add more expenses to unlock insights',
        color: '#6B7280',
      };
    }

    const topCategory = dashboard.categories[0].category;

    const personalities: Record<string, { emoji: string; type: string; desc: string; color: string }> = {
      Food: {
        emoji: '🍕',
        type: 'The Foodie',
        desc: 'You love culinary experiences',
        color: '#F59E0B',
      },
      Transport: {
        emoji: '🚗',
        type: 'The Commuter',
        desc: 'Always on the move',
        color: '#3B82F6',
      },
      Housing: {
        emoji: '🏠',
        type: 'The Homebody',
        desc: 'Home is where the heart is',
        color: '#8B5CF6',
      },
      Shopping: {
        emoji: '🛍️',
        type: 'The Shopaholic',
        desc: 'Retail therapy enthusiast',
        color: '#EC4899',
      },
      Health: {
        emoji: '💪',
        type: 'The Wellness Seeker',
        desc: 'Investing in health',
        color: '#10B981',
      },
      Entertainment: {
        emoji: '🎬',
        type: 'The Fun Lover',
        desc: 'Life is meant to be enjoyed',
        color: '#F59E0B',
      },
      Education: {
        emoji: '📚',
        type: 'The Learner',
        desc: 'Knowledge is power',
        color: '#6366F1',
      },
      Other: {
        emoji: '⚡',
        type: 'The Balanced Spender',
        desc: 'Diverse spending habits',
        color: '#6B7280',
      },
    };

    return personalities[topCategory] || personalities.Other;
  };

  const personality = getSpendingPersonality();

  // Count insights by type
  const insightCounts = insights?.insights.reduce(
    (acc, insight) => {
      acc[insight.type] = (acc[insight.type] || 0) + 1;
      return acc;
    },
    { warning: 0, success: 0, tip: 0, info: 0 } as Record<string, number>
  ) || { warning: 0, success: 0, tip: 0, info: 0 };

  return (
    <div style={{ padding: '16px', maxWidth: '100%', margin: '0 auto' }}>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="flex flex-col gap-3 mb-5"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="font-medium flex items-center gap-2"
              style={{
                fontSize: '20px',
                color: '#FFFFFF',
                letterSpacing: '-0.4px',
              }}
            >
              <Brain size={24} style={{ color: '#A78BFA' }} />
              AI Insights
            </h1>
            <p
              style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.45)',
                marginTop: '2px',
              }}
            >
              Smart spending analysis
            </p>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2">
            {[7, 30, 90].map((days) => (
              <button
                key={days}
                onClick={() => setSelectedDays(days)}
                className="px-3 py-2 rounded-lg font-medium transition-all"
                style={{
                  fontSize: '12px',
                  background: selectedDays === days ? 'rgba(167, 139, 250, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  color: selectedDays === days ? '#A78BFA' : 'rgba(255, 255, 255, 0.7)',
                  border: selectedDays === days ? '1px solid rgba(167, 139, 250, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {days}d
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          <Card padding="md">
            <div className="flex items-center gap-3">
              <Loader2 size={24} className="animate-spin" style={{ color: '#A78BFA' }} />
              <div>
                <p style={{ fontSize: '14px', color: '#FFFFFF' }}>Analyzing your spending...</p>
                <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.45)' }}>This will take a moment</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Card padding="md">
          <div className="flex items-start gap-3">
            <AlertTriangle size={24} style={{ color: '#F87171' }} />
            <div className="flex-1">
              <h3 style={{ fontSize: '14px', color: '#FFFFFF', marginBottom: '4px' }}>
                Failed to load insights
              </h3>
              <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '12px' }}>
                {error}
              </p>
              <button
                onClick={loadData}
                className="px-4 py-2 rounded-lg font-medium transition-all"
                style={{
                  fontSize: '12px',
                  background: '#F87171',
                  color: '#FFFFFF',
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Success State */}
      {!isLoading && !error && insights && (
        <>
          {/* AI Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.08 }}
            className="mb-5"
          >
            <Card padding="md" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Sparkles size={24} style={{ color: '#FFFFFF' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', color: '#FFFFFF', fontWeight: 600 }}>
                      AI Analysis Complete
                    </p>
                    <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}>
                      {insights.insights.length} insights for last {selectedDays} days
                    </p>
                  </div>
                </div>

                {/* Insight Counts */}
                <div className="hidden sm:flex gap-4">
                  {insightCounts.warning > 0 && (
                    <div className="text-center">
                      <p style={{ fontSize: '18px', color: '#FFFFFF', fontWeight: 700 }}>
                        {insightCounts.warning}
                      </p>
                      <p style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.8)' }}>Warnings</p>
                    </div>
                  )}
                  {insightCounts.success > 0 && (
                    <div className="text-center">
                      <p style={{ fontSize: '18px', color: '#FFFFFF', fontWeight: 700 }}>
                        {insightCounts.success}
                      </p>
                      <p style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.8)' }}>Wins</p>
                    </div>
                  )}
                  {insightCounts.tip > 0 && (
                    <div className="text-center">
                      <p style={{ fontSize: '18px', color: '#FFFFFF', fontWeight: 700 }}>
                        {insightCounts.tip}
                      </p>
                      <p style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.8)' }}>Tips</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Insights Grid */}
          {insights.insights.length === 0 ? (
            <Card padding="lg">
              <EmptyState
                icon={Brain}
                title="No insights yet"
                message="Add more expenses to unlock AI-powered insights"
              />
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.16 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5"
            >
              {insights.insights.map((insight, index) => {
                const style = getInsightStyle(insight.type);
                const Icon = style.icon;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.08 }}
                  >
                    <Card hover padding="md">
                      {/* Colored Top Bar */}
                      <div
                        style={{
                          height: '4px',
                          background: style.color,
                          borderRadius: '2px',
                          marginBottom: '16px',
                          marginLeft: '-20px',
                          marginRight: '-20px',
                          marginTop: '-20px',
                        }}
                      />

                      <div className="flex items-start gap-3">
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: style.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={20} style={{ color: style.color }} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-medium"
                            style={{
                              fontSize: '14px',
                              color: '#FFFFFF',
                              marginBottom: '4px',
                            }}
                          >
                            {insight.title}
                          </h3>
                          <p
                            style={{
                              fontSize: '12px',
                              color: 'rgba(255, 255, 255, 0.7)',
                              lineHeight: '1.5',
                            }}
                          >
                            {insight.message}
                          </p>

                          {insight.value !== null && insight.value !== undefined && (
                            <div
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg mt-3"
                              style={{
                                background: style.bg,
                              }}
                            >
                              <Zap size={12} style={{ color: style.color }} />
                              <span
                                className="font-medium"
                                style={{
                                  fontSize: '11px',
                                  color: style.color,
                                }}
                              >
                                {typeof insight.value === 'number' && insight.value > 100
                                  ? formatCurrency(insight.value)
                                  : `${insight.value}${insight.type === 'warning' || insight.type === 'success' ? '%' : ''}`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Spending Personality Card */}
          {dashboard && dashboard.categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.24 }}
            >
              <Card padding="md">
                <div className="text-center">
                  <p
                    style={{
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.35)',
                      marginBottom: '12px',
                    }}
                  >
                    Your Spending Personality
                  </p>

                  {/* Emoji Circle */}
                  <div
                    className="mx-auto mb-3"
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '20px',
                      background: `${personality.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ fontSize: '48px' }}>{personality.emoji}</span>
                  </div>

                  {/* Type */}
                  <h3
                    className="font-medium"
                    style={{
                      fontSize: '18px',
                      color: '#FFFFFF',
                      marginBottom: '4px',
                    }}
                  >
                    {personality.type}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '16px',
                    }}
                  >
                    {personality.desc}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <p style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.35)', marginBottom: '4px' }}>
                        Top Category
                      </p>
                      <p style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: 600 }}>
                        {dashboard.categories[0].category}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.35)', marginBottom: '4px' }}>
                        Transactions
                      </p>
                      <p style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: 600 }}>
                        {dashboard.total_count}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.35)', marginBottom: '4px' }}>
                        This Month
                      </p>
                      <p style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: 600 }}>
                        {formatCurrency(dashboard.current_month_total)}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Timestamp */}
          <div className="flex items-center justify-center gap-2 mt-5">
            <Calendar size={14} style={{ color: 'rgba(255, 255, 255, 0.35)' }} />
            <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.35)' }}>
              Last analyzed: {new Date(insights.generated_at).toLocaleString()}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default InsightsPage;
