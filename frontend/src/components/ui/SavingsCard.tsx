/**
 * SavingsCard Component - Savings goal progress card
 * Shows goal progress with deadline tracking and action buttons
 */
import { motion } from 'framer-motion';
import { Clock, Pencil, Trash2, Plus } from 'lucide-react';

// Savings goal interface
export interface SavingsGoal {
  id: number;
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline?: string;
  color?: string;
  emoji?: string;
}

// Goal color palette (cycle through)
const GOAL_COLORS = ['#5B4EE8', '#34D399', '#FBBF24', '#F87171', '#A78BFA', '#3B82F6'];

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Calculate days remaining
const getDaysRemaining = (deadline: string): number => {
  const now = new Date();
  const end = new Date(deadline);
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SAVINGS CARD COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SavingsCardProps {
  goal: SavingsGoal;
  index: number;
  onContribute?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const SavingsCard = ({ goal, index, onContribute, onEdit, onDelete }: SavingsCardProps) => {
  // Get color (cycle through palette)
  const color = goal.color || GOAL_COLORS[index % GOAL_COLORS.length];

  // Calculate percentage
  const percentage = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);

  // Days remaining
  const daysRemaining = goal.deadline ? getDaysRemaining(goal.deadline) : null;
  const isUrgent = daysRemaining !== null && daysRemaining < 7 && daysRemaining >= 0;
  const isOverdue = daysRemaining !== null && daysRemaining < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.08,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="group transition-all"
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        padding: '14px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.10)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
      }}
    >
      {/* HEADER - Name & Percentage */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Emoji/Icon */}
          {goal.emoji && <span style={{ fontSize: '16px' }}>{goal.emoji}</span>}

          {/* Name */}
          <h4
            className="font-medium"
            style={{
              fontSize: '13px',
              color: '#FFFFFF',
            }}
          >
            {goal.name}
          </h4>
        </div>

        {/* Percentage */}
        <span
          className="font-medium"
          style={{
            fontSize: '12px',
            color: color,
          }}
        >
          {percentage.toFixed(0)}%
        </span>
      </div>

      {/* PROGRESS BAR */}
      <div
        className="relative overflow-hidden mb-3"
        style={{
          height: '4px',
          background: 'rgba(255, 255, 255, 0.06)',
          borderRadius: '999px',
        }}
      >
        {/* Progress Fill - Animated */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 0.8,
            delay: index * 0.1,
            ease: 'easeOut',
          }}
          style={{
            height: '100%',
            background: color,
            borderRadius: '999px',
          }}
        />
      </div>

      {/* META ROW - Saved & Target */}
      <div className="flex items-center justify-between mb-2">
        <span
          style={{
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.3)',
          }}
        >
          {formatCurrency(goal.savedAmount)} saved
        </span>

        <span
          style={{
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.3)',
          }}
        >
          Goal: {formatCurrency(goal.targetAmount)}
        </span>
      </div>

      {/* DEADLINE (if exists) */}
      {goal.deadline && daysRemaining !== null && (
        <div
          className="flex items-center gap-1.5 mb-3"
          style={{
            fontSize: '10px',
            color: isOverdue ? '#F87171' : isUrgent ? '#FBBF24' : 'rgba(255, 255, 255, 0.35)',
          }}
        >
          <Clock size={11} />
          <span>
            {isOverdue
              ? `${Math.abs(daysRemaining)} days overdue`
              : daysRemaining === 0
              ? 'Due today'
              : daysRemaining === 1
              ? '1 day left'
              : `${daysRemaining} days left`}
          </span>
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex items-center gap-2">
        {/* Add Funds Button */}
        {onContribute && (
          <button
            onClick={() => onContribute(goal.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-medium transition-all"
            style={{
              fontSize: '11px',
              background: 'rgba(255, 255, 255, 0.06)',
              color: 'rgba(255, 255, 255, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
            }}
          >
            <Plus size={12} />
            Add funds
          </button>
        )}

        {/* Edit & Delete - Show on hover */}
        <div
          className="flex items-center gap-1 transition-opacity"
          style={{
            opacity: 0,
          }}
        >
          {onEdit && (
            <button
              onClick={() => onEdit(goal.id)}
              className="p-1.5 rounded-md transition-all"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'rgba(255, 255, 255, 0.4)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                e.currentTarget.style.color = '#3B82F6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)';
              }}
            >
              <Pencil size={12} />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(goal.id)}
              className="p-1.5 rounded-md transition-all"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'rgba(255, 255, 255, 0.4)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                e.currentTarget.style.color = '#EF4444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)';
              }}
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>

      {/* CSS to show actions on group hover */}
      <style>{`
        .group:hover .flex.items-center.gap-1 {
          opacity: 1 !important;
        }
      `}</style>
    </motion.div>
  );
};

export default SavingsCard;
