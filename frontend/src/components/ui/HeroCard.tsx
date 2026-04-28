/**
 * Hero Balance Card - Three-column layout with Total Balance, Income, and Expenses
 * Replaces the single purple card with a comprehensive financial overview
 */
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, ArrowRight, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface HeroCardProps {
  totalSpent: number;
  currentMonthTotal: number;
  lastMonthTotal: number;
  currentMonthCount: number;
  isLoading?: boolean;
}

const HeroCard = ({ totalSpent, currentMonthTotal, lastMonthTotal, currentMonthCount, isLoading }: HeroCardProps) => {
  const navigate = useNavigate();

  // Calculate month-over-month change percentage
  const calculateMonthlyChange = () => {
    if (lastMonthTotal === 0) {
      return {
        text: 'First month',
        color: '#A78BFA',
        bgColor: 'rgba(139, 92, 246, 0.15)',
        icon: null,
        isPositive: null,
      };
    }

    const diff = currentMonthTotal - lastMonthTotal;
    const pct = Math.abs((diff / lastMonthTotal) * 100).toFixed(1);
    const isPositive = diff < 0; // Spending less is positive

    if (isPositive) {
      return {
        text: `-${pct}%`,
        color: '#34D399',
        bgColor: 'rgba(34, 197, 94, 0.15)',
        icon: ArrowDownRight,
        isPositive: true,
      };
    } else {
      return {
        text: `+${pct}%`,
        color: '#F87171',
        bgColor: 'rgba(239, 68, 68, 0.15)',
        icon: ArrowUpRight,
        isPositive: false,
      };
    }
  };

  const monthlyChange = calculateMonthlyChange();
  const ChangeIcon = monthlyChange.icon;

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-4">
        {/* Loading skeleton for all three cards */}
        <div className="rounded-[20px] p-7 animate-pulse" style={{ background: 'linear-gradient(135deg, #1a1040 0%, #2d1b69 100%)', minHeight: '200px' }}>
          <div className="h-4 w-24 bg-white/20 rounded mb-4" />
          <div className="h-12 w-48 bg-white/20 rounded mb-3" />
          <div className="h-6 w-32 bg-white/20 rounded mb-6" />
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-white/20 rounded-xl" />
            <div className="h-10 w-32 bg-white/20 rounded-xl" />
          </div>
        </div>
        <div className="rounded-2xl p-6 bg-[#0D1326] border border-white/10 animate-pulse" style={{ minHeight: '200px' }}>
          <div className="h-10 w-10 bg-white/10 rounded-full mb-4" />
          <div className="h-4 w-24 bg-white/10 rounded mb-3" />
          <div className="h-10 w-32 bg-white/10 rounded mb-4" />
          <div className="h-3 w-28 bg-white/10 rounded" />
        </div>
        <div className="rounded-2xl p-6 bg-[#0D1326] border border-white/10 animate-pulse" style={{ minHeight: '200px' }}>
          <div className="h-10 w-10 bg-white/10 rounded-full mb-4" />
          <div className="h-4 w-24 bg-white/10 rounded mb-3" />
          <div className="h-10 w-32 bg-white/10 rounded mb-4" />
          <div className="h-3 w-28 bg-white/10 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-4">
      {/* COLUMN 1: Total Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-[20px] p-7"
        style={{
          background: 'linear-gradient(135deg, #1a1040 0%, #2d1b69 100%)',
          minHeight: '200px',
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute rounded-full opacity-30"
          style={{
            width: '180px',
            height: '180px',
            background: 'rgba(139, 92, 246, 0.3)',
            top: '-60px',
            right: '-40px',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute rounded-full opacity-20"
          style={{
            width: '120px',
            height: '120px',
            background: 'rgba(167, 139, 250, 0.2)',
            bottom: '-30px',
            right: '80px',
            filter: 'blur(30px)',
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Top row: label + indicator */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium" style={{ color: '#A0AEC0' }}>
              Total Tracked
            </span>
            <div className="w-2 h-2 rounded-full bg-purple-400" style={{ boxShadow: '0 0 8px rgba(167, 139, 250, 0.6)' }} />
          </div>

          {/* Large number */}
          <div className="text-white font-bold mb-3" style={{ fontSize: '2.75rem', letterSpacing: '-0.02em' }}>
            {formatCurrency(totalSpent)}
          </div>

          {/* Change badge */}
          <div className="mb-6">
            <span
              className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full"
              style={{
                color: monthlyChange.color,
                backgroundColor: monthlyChange.bgColor,
              }}
            >
              {ChangeIcon && <ChangeIcon size={14} />}
              {monthlyChange.text}
              {monthlyChange.isPositive !== null && <span className="text-xs opacity-80">vs last month</span>}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/expenses/add')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-150"
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
              <PlusCircle size={16} />
              Add Expense
            </button>

            <button
              onClick={() => navigate('/expenses')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              style={{
                backgroundColor: 'white',
                color: '#2d1b69',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              View All
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* COLUMN 2: Monthly Income Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        className="rounded-2xl p-6"
        style={{
          background: '#0D1326',
          border: '1px solid rgba(34, 197, 94, 0.2)',
          minHeight: '200px',
        }}
      >
        {/* Icon */}
        <div
          className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
          style={{
            background: 'rgba(34, 197, 94, 0.15)',
          }}
        >
          <TrendingUp size={20} style={{ color: '#22C55E' }} />
        </div>

        {/* Label */}
        <div className="text-xs font-medium mb-2" style={{ color: '#A0AEC0' }}>
          Monthly Income
        </div>

        {/* Amount */}
        <div className="text-3xl font-bold text-white mb-2">
          $0.00
        </div>

        {/* Info text */}
        <div className="text-xs mb-3" style={{ color: '#718096' }}>
          No income recorded
        </div>

        {/* Link */}
        <button
          onClick={() => navigate('/expenses/add')}
          className="text-xs font-medium transition-colors"
          style={{ color: '#22C55E' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#16A34A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#22C55E';
          }}
        >
          Set up income tracking →
        </button>
      </motion.div>

      {/* COLUMN 3: Monthly Expense Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        className="rounded-2xl p-6"
        style={{
          background: '#0D1326',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          minHeight: '200px',
        }}
      >
        {/* Icon */}
        <div
          className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
          }}
        >
          <TrendingDown size={20} style={{ color: '#EF4444' }} />
        </div>

        {/* Label */}
        <div className="text-xs font-medium mb-2" style={{ color: '#A0AEC0' }}>
          Monthly Expenses
        </div>

        {/* Amount */}
        <div className="text-3xl font-bold text-white mb-2">
          {formatCurrency(currentMonthTotal)}
        </div>

        {/* Transaction count */}
        <div className="text-xs mb-3" style={{ color: '#718096' }}>
          {currentMonthCount} expense {currentMonthCount === 1 ? 'entry' : 'entries'}
        </div>

        {/* Trend */}
        {monthlyChange.isPositive !== null && (
          <div
            className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
            style={{
              color: monthlyChange.isPositive ? '#22C55E' : '#EF4444',
              backgroundColor: monthlyChange.isPositive ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            }}
          >
            {ChangeIcon && <ChangeIcon size={12} />}
            {monthlyChange.text} vs last month
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default HeroCard;
