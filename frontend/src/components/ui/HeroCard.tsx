/**
 * Hero Balance Card - Fundex-inspired visual centerpiece
 * Purple gradient card with total spending and trend analysis
 */
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, PlusCircle, ArrowRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format } from 'date-fns';
import { formatCurrency } from '../../utils/formatters';

interface HeroCardProps {
  totalSpent: number;
  currentMonthTotal: number;
  lastMonthTotal: number;
  isLoading?: boolean;
}

const HeroCard = ({ totalSpent, currentMonthTotal, lastMonthTotal, isLoading }: HeroCardProps) => {
  const navigate = useNavigate();

  // Calculate trend
  const getTrend = () => {
    if (lastMonthTotal === 0) {
      return {
        text: 'First month tracking',
        color: '#D1D5DB',
        bgColor: 'rgba(209, 213, 219, 0.15)',
        icon: null,
      };
    }

    const diff = currentMonthTotal - lastMonthTotal;
    const pct = ((diff / lastMonthTotal) * 100).toFixed(1);

    if (diff > 0) {
      // Spending increased (red)
      return {
        text: `+${pct}% vs last month`,
        color: '#FCA5A5',
        bgColor: 'rgba(239, 68, 68, 0.15)',
        icon: ArrowUpRight,
      };
    } else {
      // Spending decreased (green)
      return {
        text: `${pct}% vs last month`,
        color: '#86EFAC',
        bgColor: 'rgba(34, 197, 94, 0.15)',
        icon: ArrowDownRight,
      };
    }
  };

  const trend = getTrend();
  const TrendIcon = trend.icon;

  // Loading state
  if (isLoading) {
    return (
      <div
        className="relative overflow-hidden rounded-2xl md:rounded-[20px] p-5 md:p-7"
        style={{
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #9333EA 100%)',
          minHeight: '180px',
        }}
      >
        {/* Decorative circles - hide largest on mobile */}
        <div
          className="hidden sm:block absolute rounded-full"
          style={{
            width: '200px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.05)',
            top: '-60px',
            right: '-40px',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '130px',
            height: '130px',
            background: 'rgba(255, 255, 255, 0.05)',
            bottom: '-30px',
            right: '60px',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '80px',
            height: '80px',
            background: 'rgba(255, 255, 255, 0.08)',
            top: '20px',
            right: '120px',
          }}
        />

        {/* Loading placeholders */}
        <div className="relative z-10 animate-pulse">
          <div className="h-3 md:h-4 w-20 md:w-24 bg-white/20 rounded mb-3 md:mb-4" />
          <div className="h-10 md:h-12 w-40 md:w-48 bg-white/20 rounded mb-2 md:mb-3" />
          <div className="h-3 md:h-4 w-24 md:w-32 bg-white/20 rounded mb-4 md:mb-6" />
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
            <div className="h-9 md:h-10 w-full sm:w-28 bg-white/20 rounded-xl" />
            <div className="h-9 md:h-10 w-full sm:w-28 bg-white/20 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-2xl md:rounded-[20px] p-5 md:p-7"
      style={{
        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #9333EA 100%)',
        minHeight: '180px',
      }}
    >
      {/* Decorative circles - hide largest on mobile */}
      <div
        className="hidden sm:block absolute rounded-full"
        style={{
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.05)',
          top: '-60px',
          right: '-40px',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: '130px',
          height: '130px',
          background: 'rgba(255, 255, 255, 0.05)',
          bottom: '-30px',
          right: '60px',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: '80px',
          height: '80px',
          background: 'rgba(255, 255, 255, 0.08)',
          top: '20px',
          right: '120px',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Top row */}
        <div className="flex items-center justify-between mb-3 md:mb-4">
          {/* Label with icon */}
          <div className="flex items-center gap-2">
            <Wallet size={14} className="md:w-4 md:h-4 text-purple-200" />
            <span className="text-xs md:text-sm font-medium text-purple-200">Total Spent</span>
          </div>

          {/* Month badge */}
          <div
            className="text-xs text-white px-2.5 md:px-3 py-0.5 md:py-1 rounded-full"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
          >
            {format(new Date(), 'MMM yyyy')}
          </div>
        </div>

        {/* Main number */}
        <div
          className="text-white font-bold my-3 md:my-4 text-[2rem] md:text-[2.75rem]"
          style={{
            letterSpacing: '-0.02em',
          }}
        >
          {formatCurrency(totalSpent)}
        </div>

        {/* Trend row */}
        <div className="mb-4 md:mb-6">
          <span
            className="inline-flex items-center gap-1 text-xs md:text-sm font-medium px-2 py-0.5 rounded-full"
            style={{
              color: trend.color,
              backgroundColor: trend.bgColor,
            }}
          >
            {TrendIcon && <TrendIcon size={12} className="md:w-3.5 md:h-3.5" />}
            {trend.text}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
          {/* Add Expense button */}
          <button
            onClick={() => navigate('/expenses/add')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-medium text-white transition-all duration-150"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            }}
          >
            <PlusCircle size={14} className="md:w-4 md:h-4" />
            Add Expense
          </button>

          {/* View All button */}
          <button
            onClick={() => navigate('/expenses')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all duration-150"
            style={{
              backgroundColor: 'white',
              color: '#7C3AED',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            View All
            <ArrowRight size={14} className="md:w-4 md:h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroCard;
