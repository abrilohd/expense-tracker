/**
 * Card Component Library - Composable card components
 * Base cards, headers, stat cards, and hero balance card
 */
import { ReactNode } from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. CARD (BASE)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface CardProps {
  className?: string;
  children: ReactNode;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export const Card = ({ className = '', children, hover = false, padding = 'md' }: CardProps) => {
  const paddingMap = {
    sm: '14px',
    md: '20px',
    lg: '24px',
  };

  return (
    <div
      className={`${className} ${hover ? 'transition-all duration-200' : ''} bg-white dark:bg-[#0F1117] border border-gray-200/80 dark:border-white/[0.07] shadow-sm hover:shadow-md`}
      style={{
        borderRadius: '16px',
        padding: paddingMap[padding],
      }}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.borderColor = '';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {children}
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. CARD HEADER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export const CardHeader = ({ title, subtitle, action }: CardHeaderProps) => {
  return (
    <div
      className="flex justify-between items-start border-b border-gray-200 dark:border-white/[0.07]"
      style={{
        paddingBottom: '16px',
        marginBottom: '16px',
      }}
    >
      <div>
        <h3
          className="font-medium text-gray-900 dark:text-white"
          style={{
            fontSize: '14px',
          }}
        >
          {title}
        </h3>
        {subtitle && (
          <p
            className="text-gray-500 dark:text-white/35"
            style={{
              fontSize: '11px',
              marginTop: '2px',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. STAT CARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
  sparkline?: number[];
}

export const StatCard = ({
  label,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  iconBg,
  trend,
  isLoading = false,
  sparkline,
}: StatCardProps) => {
  if (isLoading) {
    return (
      <Card hover padding="md">
        <div className="shimmer" style={{ width: '36px', height: '36px', borderRadius: '10px' }} />
        <div className="shimmer mt-3" style={{ width: '60%', height: '12px', borderRadius: '6px' }} />
        <div className="shimmer mt-2" style={{ width: '80%', height: '24px', borderRadius: '6px' }} />
        <div className="shimmer mt-2" style={{ width: '40%', height: '10px', borderRadius: '6px' }} />
      </Card>
    );
  }

  return (
    <Card hover padding="md">
      <div style={{ minHeight: '140px', display: 'flex', flexDirection: 'column' }}>
        {/* Icon */}
        <div
          className="flex items-center justify-center shadow-lg"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: iconBg,
            color: iconColor,
          }}
        >
          <Icon size={20} />
        </div>

        {/* Label */}
        <p
          className="text-gray-600 dark:text-white/35"
          style={{
            fontSize: '11px',
            marginTop: '14px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {label}
        </p>

        {/* Value */}
        <div className="flex items-baseline gap-2 mt-1.5">
          <h3
            className="font-bold text-gray-900 dark:text-white"
            style={{
              fontSize: '30px',
              letterSpacing: '-0.8px',
            }}
          >
            {value}
          </h3>

          {/* Trend Pill */}
          {trend && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium"
              style={{
                fontSize: '11px',
                background: trend.isPositive
                  ? 'rgba(52, 211, 153, 0.15)'
                  : 'rgba(248, 113, 113, 0.15)',
                color: trend.isPositive ? '#34D399' : '#F87171',
              }}
            >
              {trend.isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {Math.abs(trend.value).toFixed(1)}%
            </span>
          )}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p
            className="text-gray-500 dark:text-white/30"
            style={{
              fontSize: '11px',
              marginTop: '4px',
            }}
          >
            {subtitle}
          </p>
        )}

        {/* Sparkline (simple visualization) */}
        {sparkline && sparkline.length > 0 && (
          <div className="mt-auto pt-3" style={{ height: '40px' }}>
            <svg width="100%" height="40" style={{ overflow: 'visible' }}>
              <polyline
                fill="none"
                stroke={iconColor}
                strokeWidth="2"
                points={sparkline
                  .map((val, i) => {
                    const x = (i / (sparkline.length - 1)) * 100;
                    const max = Math.max(...sparkline);
                    const min = Math.min(...sparkline);
                    const y = 40 - ((val - min) / (max - min)) * 35;
                    return `${x}%,${y}`;
                  })
                  .join(' ')}
              />
            </svg>
          </div>
        )}
      </div>
    </Card>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. HERO BALANCE CARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface HeroBalanceCardProps {
  netBalance: number;
  income: number;
  expenses: number;
  currentMonthIncome: number;
  currentMonthExpenses: number;
  lastMonthExpenses: number;
  isLoading?: boolean;
}

export const HeroBalanceCard = ({
  netBalance,
  income,
  expenses,
  currentMonthIncome,
  currentMonthExpenses,
  lastMonthExpenses,
  isLoading = false,
}: HeroBalanceCardProps) => {
  const navigate = useNavigate();

  // Calculate trend
  const expenseTrend =
    lastMonthExpenses > 0
      ? (((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100).toFixed(1)
      : '0';
  const isExpenseUp = currentMonthExpenses > lastMonthExpenses;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div
        style={{
          background: 'linear-gradient(135deg, #4338CA 0%, #5B4EE8 40%, #7C3AED 100%)',
          borderRadius: '20px',
          padding: '24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="shimmer" style={{ width: '80px', height: '12px', borderRadius: '6px', background: 'rgba(255,255,255,0.2)' }} />
        <div className="shimmer mt-2" style={{ width: '180px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.2)' }} />
        <div className="shimmer mt-4" style={{ width: '120px', height: '24px', borderRadius: '6px', background: 'rgba(255,255,255,0.2)' }} />
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #4338CA 0%, #5B4EE8 40%, #7C3AED 100%)',
        borderRadius: '20px',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Circles */}
      <div
        style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.06)',
          top: '-80px',
          right: '-60px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.06)',
          bottom: '-40px',
          left: '-30px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.06)',
          top: '50%',
          right: '20%',
        }}
      />

      {/* Content (relative to float above decorations) */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Label */}
        <p
          style={{
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: 500,
          }}
        >
          Net Balance
        </p>

        {/* Balance Value */}
        <h2
          className="font-medium"
          style={{
            fontSize: '32px',
            color: '#FFFFFF',
            letterSpacing: '-1px',
            marginTop: '4px',
          }}
        >
          {formatCurrency(netBalance)}
        </h2>

        {/* Trend */}
        <div className="flex items-center gap-2 mt-2">
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium"
            style={{
              fontSize: '11px',
              background: isExpenseUp
                ? 'rgba(248, 113, 113, 0.2)'
                : 'rgba(52, 211, 153, 0.2)',
              color: isExpenseUp ? '#FCA5A5' : '#6EE7B7',
            }}
          >
            {isExpenseUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {expenseTrend}% vs last month
          </span>
        </div>

        {/* Income & Expense Pills */}
        <div className="flex items-center gap-3 mt-4">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
            style={{
              background: 'rgba(52, 211, 153, 0.15)',
            }}
          >
            <TrendingUp size={14} style={{ color: '#34D399' }} />
            <span style={{ fontSize: '12px', color: '#34D399', fontWeight: 500 }}>
              {formatCurrency(currentMonthIncome)}
            </span>
          </div>

          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
            style={{
              background: 'rgba(248, 113, 113, 0.15)',
            }}
          >
            <TrendingDown size={14} style={{ color: '#F87171' }} />
            <span style={{ fontSize: '12px', color: '#F87171', fontWeight: 500 }}>
              {formatCurrency(currentMonthExpenses)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-5">
          <button
            onClick={() => navigate('/income')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all"
            style={{
              fontSize: '12px',
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
          >
            <Plus size={14} />
            Add Income
          </button>

          <button
            onClick={() => navigate('/expenses/add')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all"
            style={{
              fontSize: '12px',
              background: '#FFFFFF',
              color: '#5B4EE8',
              border: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F9FAFB';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#FFFFFF';
            }}
          >
            <Plus size={14} />
            Add Expense
          </button>
        </div>
      </div>
    </div>
  );
};
