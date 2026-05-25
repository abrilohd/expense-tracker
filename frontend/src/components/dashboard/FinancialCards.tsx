/**
 * FinancialCards - Three realistic credit/debit card components
 * Total Balance, Income, and Expense cards in a row
 * 2026 UI/UX Design - Realistic card aesthetics with glassmorphism
 * Features: Show/Hide balance toggle with localStorage persistence
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, CreditCard, Sparkles, Eye, EyeOff } from 'lucide-react';

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Card animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 30, rotateX: -15 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

interface FinancialCardsProps {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  currentMonthIncome: number;
  currentMonthExpenses: number;
  lastMonthIncome?: number;
  lastMonthExpenses?: number;
}

const FinancialCards = ({
  totalBalance,
  totalIncome,
  totalExpenses,
  currentMonthIncome,
  currentMonthExpenses,
  lastMonthIncome = 0,
  lastMonthExpenses = 0,
}: FinancialCardsProps) => {
  // State for showing/hiding balance - persisted in localStorage
  const [showBalance, setShowBalance] = useState(() => {
    const saved = localStorage.getItem('showBalance');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Persist showBalance state to localStorage
  useEffect(() => {
    localStorage.setItem('showBalance', JSON.stringify(showBalance));
  }, [showBalance]);

  // Toggle balance visibility
  const toggleBalanceVisibility = () => {
    setShowBalance((prev: boolean) => !prev);
  };

  // Calculate trends with proper logic
  const incomeTrend =
    lastMonthIncome > 0
      ? (((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100).toFixed(1)
      : currentMonthIncome > 0 ? '100' : '0';
  
  const expenseTrend =
    lastMonthExpenses > 0
      ? (((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100).toFixed(1)
      : currentMonthExpenses > 0 ? '100' : '0';

  const isIncomeUp = currentMonthIncome >= lastMonthIncome;
  const isExpenseUp = currentMonthExpenses >= lastMonthExpenses;

  // Calculate balance trend (positive = good, negative = bad)
  const lastMonthBalance = lastMonthIncome - lastMonthExpenses;
  const currentMonthBalance = currentMonthIncome - currentMonthExpenses;
  const balanceTrend = lastMonthBalance !== 0
    ? (((currentMonthBalance - lastMonthBalance) / Math.abs(lastMonthBalance)) * 100).toFixed(1)
    : '0';
  const isBalanceImproving = currentMonthBalance > lastMonthBalance;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          CARD 1: TOTAL BALANCE (Purple Gradient)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.03, y: -8 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-2xl p-6 cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 20px 60px rgba(102, 126, 234, 0.4)',
          minHeight: '220px',
        }}
      >
        {/* Card Decorations */}
        <div
          className="absolute w-40 h-40 rounded-full -top-10 -right-10 opacity-20"
          style={{ background: 'rgba(255, 255, 255, 0.3)' }}
        />
        <div
          className="absolute w-24 h-24 rounded-full -bottom-6 -left-6 opacity-20"
          style={{ background: 'rgba(255, 255, 255, 0.3)' }}
        />

        {/* Card Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255, 255, 255, 0.2)' }}
              >
                <Wallet size={20} style={{ color: '#FFFFFF' }} />
              </div>
              <span
                className="font-medium"
                style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)' }}
              >
                Total Balance
              </span>
            </div>
            {/* Show/Hide Toggle Button */}
            <motion.button
              onClick={toggleBalanceVisibility}
              className="flex items-center justify-center rounded-lg transition-all"
              style={{
                width: '32px',
                height: '32px',
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                cursor: 'pointer',
              }}
              whileHover={{ scale: 1.1, background: 'rgba(255, 255, 255, 0.25)' }}
              whileTap={{ scale: 0.95 }}
              title={showBalance ? 'Hide balance' : 'Show balance'}
            >
              <AnimatePresence mode="wait">
                {showBalance ? (
                  <motion.div
                    key="eye"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Eye size={16} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="eye-off"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <EyeOff size={16} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Balance Amount */}
          <div className="mb-4">
            <AnimatePresence mode="wait">
              {showBalance ? (
                <motion.h2
                  key="balance-visible"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="font-bold"
                  style={{
                    fontSize: '36px',
                    color: totalBalance >= 0 ? '#FFFFFF' : '#FCA5A5',
                    letterSpacing: '-1px',
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {formatCurrency(totalBalance)}
                </motion.h2>
              ) : (
                <motion.div
                  key="balance-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                  style={{
                    fontSize: '36px',
                    color: '#FFFFFF',
                    letterSpacing: '-1px',
                  }}
                >
                  <span>••••••</span>
                </motion.div>
              )}
            </AnimatePresence>
            <p
              style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.7)',
                marginTop: '4px',
              }}
            >
              {totalBalance >= 0 ? 'Available Balance' : 'Negative Balance'}
            </p>
          </div>

          {/* Card Number (Masked) */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ background: 'rgba(255, 255, 255, 0.5)' }}
                />
              ))}
            </div>
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ background: 'rgba(255, 255, 255, 0.5)' }}
                />
              ))}
            </div>
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ background: 'rgba(255, 255, 255, 0.5)' }}
                />
              ))}
            </div>
            <span
              className="font-semibold tracking-wider"
              style={{ fontSize: '13px', color: '#FFFFFF' }}
            >
              {showBalance 
                ? String(Math.abs(totalBalance)).slice(-4).padStart(4, '0')
                : '••••'
              }
            </span>
          </div>

          {/* Card Footer */}
          <div className="flex items-center justify-between">
            <div>
              <p
                style={{
                  fontSize: '9px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {totalBalance >= 0 ? 'Net Worth' : 'Deficit'}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {isBalanceImproving ? (
                  <TrendingUp size={12} style={{ color: '#FFFFFF' }} />
                ) : (
                  <TrendingDown size={12} style={{ color: '#FFFFFF' }} />
                )}
                <span
                  className="font-medium"
                  style={{ fontSize: '12px', color: '#FFFFFF' }}
                >
                  {isBalanceImproving ? '+' : ''}{balanceTrend}% vs last month
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
              <span
                className="font-bold"
                style={{ fontSize: '14px', color: '#FFFFFF', letterSpacing: '1px' }}
              >
                VISA
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          CARD 2: INCOME (Green Gradient)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.03, y: -8 }}
        className="relative overflow-hidden rounded-2xl p-6 cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
          boxShadow: '0 20px 60px rgba(17, 153, 142, 0.4)',
          minHeight: '220px',
        }}
      >
        {/* Card Decorations */}
        <div
          className="absolute w-40 h-40 rounded-full -top-10 -right-10 opacity-20"
          style={{ background: 'rgba(255, 255, 255, 0.3)' }}
        />
        <div
          className="absolute w-24 h-24 rounded-full -bottom-6 -left-6 opacity-20"
          style={{ background: 'rgba(255, 255, 255, 0.3)' }}
        />

        {/* Card Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255, 255, 255, 0.2)' }}
              >
                <TrendingUp size={20} style={{ color: '#FFFFFF' }} />
              </div>
              <span
                className="font-medium"
                style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)' }}
              >
                Total Income
              </span>
            </div>
            <CreditCard size={24} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
          </div>

          {/* Income Amount */}
          <div className="mb-4">
            <h2
              className="font-bold"
              style={{
                fontSize: '36px',
                color: '#FFFFFF',
                letterSpacing: '-1px',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
              }}
            >
              {formatCurrency(totalIncome)}
            </h2>
            <p
              style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.7)',
                marginTop: '4px',
              }}
            >
              This Month: {formatCurrency(currentMonthIncome)}
            </p>
          </div>

          {/* Card Number (Masked) */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ background: 'rgba(255, 255, 255, 0.5)' }}
                />
              ))}
            </div>
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ background: 'rgba(255, 255, 255, 0.5)' }}
                />
              ))}
            </div>
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ background: 'rgba(255, 255, 255, 0.5)' }}
                />
              ))}
            </div>
            <span
              className="font-semibold tracking-wider"
              style={{ fontSize: '13px', color: '#FFFFFF' }}
            >
              {String(Math.abs(totalIncome)).slice(-4).padStart(4, '0')}
            </span>
          </div>

          {/* Card Footer */}
          <div className="flex items-center justify-between">
            <div>
              <p
                style={{
                  fontSize: '9px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Trend
              </p>
              <div className="flex items-center gap-1 mt-1">
                {isIncomeUp ? (
                  <TrendingUp size={12} style={{ color: '#FFFFFF' }} />
                ) : (
                  <TrendingDown size={12} style={{ color: '#FFFFFF' }} />
                )}
                <span
                  className="font-medium"
                  style={{ fontSize: '12px', color: '#FFFFFF' }}
                >
                  {isIncomeUp ? '+' : ''}{incomeTrend}% vs last month
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="font-bold"
                style={{ fontSize: '14px', color: '#FFFFFF', letterSpacing: '1px' }}
              >
                MASTERCARD
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          CARD 3: EXPENSES (Red/Orange Gradient)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.03, y: -8 }}
        className="relative overflow-hidden rounded-2xl p-6 cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)',
          boxShadow: '0 20px 60px rgba(238, 9, 121, 0.4)',
          minHeight: '220px',
        }}
      >
        {/* Card Decorations */}
        <div
          className="absolute w-40 h-40 rounded-full -top-10 -right-10 opacity-20"
          style={{ background: 'rgba(255, 255, 255, 0.3)' }}
        />
        <div
          className="absolute w-24 h-24 rounded-full -bottom-6 -left-6 opacity-20"
          style={{ background: 'rgba(255, 255, 255, 0.3)' }}
        />

        {/* Card Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255, 255, 255, 0.2)' }}
              >
                <TrendingDown size={20} style={{ color: '#FFFFFF' }} />
              </div>
              <span
                className="font-medium"
                style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)' }}
              >
                Total Expenses
              </span>
            </div>
            <CreditCard size={24} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
          </div>

          {/* Expense Amount */}
          <div className="mb-4">
            <h2
              className="font-bold"
              style={{
                fontSize: '36px',
                color: '#FFFFFF',
                letterSpacing: '-1px',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
              }}
            >
              {formatCurrency(totalExpenses)}
            </h2>
            <p
              style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.7)',
                marginTop: '4px',
              }}
            >
              This Month: {formatCurrency(currentMonthExpenses)}
            </p>
          </div>

          {/* Card Number (Masked) */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ background: 'rgba(255, 255, 255, 0.5)' }}
                />
              ))}
            </div>
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ background: 'rgba(255, 255, 255, 0.5)' }}
                />
              ))}
            </div>
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ background: 'rgba(255, 255, 255, 0.5)' }}
                />
              ))}
            </div>
            <span
              className="font-semibold tracking-wider"
              style={{ fontSize: '13px', color: '#FFFFFF' }}
            >
              {String(Math.abs(totalExpenses)).slice(-4).padStart(4, '0')}
            </span>
          </div>

          {/* Card Footer */}
          <div className="flex items-center justify-between">
            <div>
              <p
                style={{
                  fontSize: '9px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Trend
              </p>
              <div className="flex items-center gap-1 mt-1">
                {isExpenseUp ? (
                  <TrendingUp size={12} style={{ color: '#FFFFFF' }} />
                ) : (
                  <TrendingDown size={12} style={{ color: '#FFFFFF' }} />
                )}
                <span
                  className="font-medium"
                  style={{ fontSize: '12px', color: '#FFFFFF' }}
                >
                  {isExpenseUp ? '+' : ''}{expenseTrend}% vs last month
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="font-bold"
                style={{ fontSize: '14px', color: '#FFFFFF', letterSpacing: '1px' }}
              >
                AMEX
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FinancialCards;
