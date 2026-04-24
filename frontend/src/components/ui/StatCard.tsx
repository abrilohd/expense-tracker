/**
 * Stat card component - Fundex-inspired dark design
 * Vertical layout with icon, value, trend, and optional sparkline
 */
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';
import SparklineChart from '../charts/SparklineChart';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorScheme: 'blue' | 'green' | 'red' | 'purple';
  isLoading?: boolean;
  sparklineData?: number[];
  sparklineColor?: string;
}

// Color scheme mapping for dark theme
const colorSchemes = {
  blue: {
    iconBg: '#1E3A5F',
    iconColor: '#60A5FA',
    accentGradient: 'radial-gradient(circle, rgba(96, 165, 250, 0.08) 0%, transparent 70%)',
    sparklineColor: '#60A5FA',
  },
  green: {
    iconBg: '#14302A',
    iconColor: '#34D399',
    accentGradient: 'radial-gradient(circle, rgba(52, 211, 153, 0.08) 0%, transparent 70%)',
    sparklineColor: '#34D399',
  },
  red: {
    iconBg: '#3B1219',
    iconColor: '#F87171',
    accentGradient: 'radial-gradient(circle, rgba(248, 113, 113, 0.08) 0%, transparent 70%)',
    sparklineColor: '#F87171',
  },
  purple: {
    iconBg: '#2D1B69',
    iconColor: '#A78BFA',
    accentGradient: 'radial-gradient(circle, rgba(167, 139, 250, 0.08) 0%, transparent 70%)',
    sparklineColor: '#A78BFA',
  },
};

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme,
  isLoading = false,
  sparklineData,
  sparklineColor,
}: StatCardProps) => {
  const colors = colorSchemes[colorScheme];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-2xl p-5 transition-all duration-200 bg-white dark:bg-[#141720] border border-gray-200 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/[0.12]"
    >
      {/* Decorative accent circle */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: colors.accentGradient,
          bottom: '-20px',
          right: '-20px',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {isLoading ? (
          <>
            {/* Loading skeleton */}
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-white/5 rounded-xl animate-pulse" />
              <div className="w-16 h-5 bg-gray-200 dark:bg-white/5 rounded-full animate-pulse" />
            </div>
            <div className="h-8 w-28 bg-gray-200 dark:bg-white/5 rounded animate-pulse mb-2" />
            <div className="h-4 w-20 bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
            <div className="h-3 w-24 bg-gray-200 dark:bg-white/5 rounded animate-pulse mt-1" />
          </>
        ) : (
          <>
            {/* Top row: Icon + Trend badge */}
            <div className="flex items-center justify-between mb-3">
              {/* Icon circle */}
              <div
                className="flex items-center justify-center rounded-xl"
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: colors.iconBg,
                }}
              >
                <Icon size={20} style={{ color: colors.iconColor }} />
              </div>

              {/* Trend badge */}
              {trend && (
                <div
                  className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: trend.isPositive ? '#14302A' : '#3B1219',
                    color: trend.isPositive ? '#34D399' : '#F87171',
                  }}
                >
                  {trend.isPositive ? (
                    <ArrowUpRight size={12} />
                  ) : (
                    <ArrowDownRight size={12} />
                  )}
                  <span>
                    {trend.isPositive ? '+' : ''}
                    {trend.value}%
                  </span>
                </div>
              )}
            </div>

            {/* Value number */}
            <div
              className="font-bold text-gray-900 dark:text-white mb-1"
              style={{
                fontSize: '1.75rem',
                letterSpacing: '-0.02em',
              }}
            >
              {value}
            </div>

            {/* Title */}
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>

            {/* Subtitle */}
            {subtitle && <p className="text-xs text-gray-500 dark:text-gray-600 mt-1">{subtitle}</p>}

            {/* Sparkline chart */}
            {sparklineData && sparklineData.length > 0 && (
              <div className="mt-3">
                <SparklineChart
                  data={sparklineData}
                  color={sparklineColor || colors.sparklineColor}
                  height={40}
                />
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
