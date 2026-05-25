/**
 * Balance Card - Shows income vs expenses balance
 * Premium design with trend indicators
 */
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getBalance } from '../../api/balance';
import { formatCurrency } from '../../utils/formatters';
import type { BalanceData } from '../../types';

const BalanceCard = () => {
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchBalance();
  }, [selectedPeriod]);

  const fetchBalance = async () => {
    setIsLoading(true);
    try {
      const data = await getBalance(selectedPeriod);
      setBalanceData(data);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#0D1326] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-6" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  if (!balanceData) return null;

  const isPositive = balanceData.period_balance >= 0;
  const isNegative = balanceData.period_balance < 0;
  const trendUp = balanceData.trend === 'up';
  const trendDown = balanceData.trend === 'down';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#0D1326] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Financial Balance
          </h3>
          
          {/* Period Selector */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {[
              { value: 'month' as const, label: 'Month' },
              { value: 'year' as const, label: 'Year' },
              { value: 'all' as const, label: 'All' },
            ].map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  selectedPeriod === period.value
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Balance */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {balanceData.period_label} Balance
          </p>
          <div className="flex items-baseline gap-3">
            <h2
              className={`text-4xl font-bold ${
                isPositive
                  ? 'text-green-600 dark:text-green-400'
                  : isNegative
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {formatCurrency(balanceData.period_balance)}
            </h2>
            
            {/* Trend Indicator */}
            {selectedPeriod === 'month' && balanceData.balance_change_percent !== 0 && (
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium ${
                  trendUp
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : trendDown
                    ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                {trendUp ? (
                  <ArrowUpRight size={16} />
                ) : trendDown ? (
                  <ArrowDownRight size={16} />
                ) : (
                  <Minus size={16} />
                )}
                <span>{Math.abs(balanceData.balance_change_percent).toFixed(1)}%</span>
              </div>
            )}
          </div>
          
          {selectedPeriod === 'month' && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              vs last month: {formatCurrency(balanceData.prev_month_balance)}
            </p>
          )}
        </div>
      </div>

      {/* Income vs Expenses */}
      <div className="grid grid-cols-2 gap-px bg-gray-200 dark:bg-white/[0.06]">
        {/* Income */}
        <div className="bg-white dark:bg-[#0D1326] p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <TrendingUp className="text-green-600 dark:text-green-400" size={16} />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Income
            </span>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(balanceData.period_income)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {balanceData.income_count} {balanceData.income_count === 1 ? 'record' : 'records'}
          </p>
        </div>

        {/* Expenses */}
        <div className="bg-white dark:bg-[#0D1326] p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <TrendingDown className="text-red-600 dark:text-red-400" size={16} />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Expenses
            </span>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(balanceData.period_expenses)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {balanceData.expense_count} {balanceData.expense_count === 1 ? 'record' : 'records'}
          </p>
        </div>
      </div>

      {/* Visual Balance Bar */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-white/[0.02]">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign size={14} className="text-gray-400" />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Balance Breakdown
          </span>
        </div>
        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          {balanceData.period_income > 0 && (
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(
                  (balanceData.period_income / (balanceData.period_income + balanceData.period_expenses)) * 100,
                  100
                )}%`,
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-emerald-400"
            />
          )}
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>
            {balanceData.period_income > 0
              ? `${((balanceData.period_income / (balanceData.period_income + balanceData.period_expenses)) * 100).toFixed(1)}% Income`
              : 'No income'}
          </span>
          <span>
            {balanceData.period_expenses > 0
              ? `${((balanceData.period_expenses / (balanceData.period_income + balanceData.period_expenses)) * 100).toFixed(1)}% Expenses`
              : 'No expenses'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default BalanceCard;
