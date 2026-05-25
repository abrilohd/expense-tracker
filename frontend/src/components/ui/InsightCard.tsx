/**
 * InsightCard Component - AI-powered insight display
 * Shows warnings, tips, success messages with color-coded styling
 */
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingDown, Lightbulb, Info, LucideIcon } from 'lucide-react';

// Insight interface
export interface Insight {
  type: 'warning' | 'success' | 'tip' | 'info';
  title: string;
  message: string;
  value?: number;
}

// Type to style mapping
interface InsightStyle {
  borderColor: string;
  bgColor: string;
  icon: LucideIcon;
  iconColor: string;
  pillBg: string;
  pillColor: string;
}

const INSIGHT_STYLES: Record<Insight['type'], InsightStyle> = {
  warning: {
    borderColor: '#FBBF24',
    bgColor: 'rgba(251, 191, 36, 0.07)',
    icon: AlertTriangle,
    iconColor: '#FBBF24',
    pillBg: 'rgba(251, 191, 36, 0.15)',
    pillColor: '#FBBF24',
  },
  success: {
    borderColor: '#34D399',
    bgColor: 'rgba(52, 211, 153, 0.07)',
    icon: TrendingDown,
    iconColor: '#34D399',
    pillBg: 'rgba(52, 211, 153, 0.15)',
    pillColor: '#34D399',
  },
  tip: {
    borderColor: '#A78BFA',
    bgColor: 'rgba(91, 78, 232, 0.10)',
    icon: Lightbulb,
    iconColor: '#A78BFA',
    pillBg: 'rgba(91, 78, 232, 0.15)',
    pillColor: '#A78BFA',
  },
  info: {
    borderColor: 'rgba(255, 255, 255, 0.2)',
    bgColor: 'rgba(255, 255, 255, 0.03)',
    icon: Info,
    iconColor: 'rgba(255, 255, 255, 0.4)',
    pillBg: 'rgba(255, 255, 255, 0.08)',
    pillColor: 'rgba(255, 255, 255, 0.6)',
  },
};

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INSIGHT CARD COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface InsightCardProps {
  insight: Insight;
  index: number;
}

const InsightCard = ({ insight, index }: InsightCardProps) => {
  const style = INSIGHT_STYLES[insight.type];
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.09,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="flex gap-2.5"
      style={{
        background: style.bgColor,
        borderLeft: `3px solid ${style.borderColor}`,
        borderRadius: '10px',
        padding: '12px 14px',
      }}
    >
      {/* ICON */}
      <div className="flex-shrink-0" style={{ marginTop: '1px' }}>
        <Icon size={14} style={{ color: style.iconColor }} />
      </div>

      {/* CONTENT */}
      <div className="flex-1 min-w-0">
        {/* Type Pill */}
        <span
          className="inline-block px-2 py-0.5 rounded-full font-medium"
          style={{
            fontSize: '10px',
            background: style.pillBg,
            color: style.pillColor,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {insight.type}
        </span>

        {/* Title */}
        <h4
          className="font-medium"
          style={{
            fontSize: '13px',
            color: '#FFFFFF',
            marginTop: '4px',
          }}
        >
          {insight.title}
        </h4>

        {/* Message */}
        <p
          style={{
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.4)',
            marginTop: '4px',
            lineHeight: '1.6',
          }}
        >
          {insight.message}
        </p>

        {/* Value Badge (if exists) */}
        {insight.value !== undefined && (
          <span
            className="inline-block px-2 py-1 rounded-md font-bold"
            style={{
              fontSize: '10px',
              background: style.pillBg,
              color: style.pillColor,
              marginTop: '8px',
            }}
          >
            {formatCurrency(insight.value)}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default InsightCard;
