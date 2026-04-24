/**
 * Budget Overview Card - Fundex-inspired category breakdown
 * Shows spending by category with sortable progress bars
 */
import { useState } from 'react';
import { PieChart } from 'lucide-react';
import type { CategorySummary } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import BudgetProgressBar from './BudgetProgressBar';

interface BudgetOverviewCardProps {
  categories: CategorySummary[];
  isLoading?: boolean;
  totalSpent: number;
}

type SortBy = 'amount' | 'count';

const BudgetOverviewCard = ({
  categories,
  isLoading = false,
  totalSpent,
}: BudgetOverviewCardProps) => {
  const [sortBy, setSortBy] = useState<SortBy>('amount');
  const [showAll, setShowAll] = useState(false);

  // Sort categories based on selected sort option
  const getSortedCategories = (): CategorySummary[] => {
    const sorted = [...categories];

    if (sortBy === 'amount') {
      return sorted.sort((a, b) => b.total - a.total);
    } else {
      return sorted.sort((a, b) => b.count - a.count);
    }
  };

  const sortedCategories = getSortedCategories();
  const displayCategories = showAll ? sortedCategories : sortedCategories.slice(0, 6);
  const maxPercentage = Math.max(...categories.map((c) => c.percentage));

  // Loading state
  if (isLoading) {
    return (
      <div className="rounded-[20px] p-6 bg-white dark:bg-[#141720] border border-gray-200 dark:border-white/[0.06]">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-3 items-center py-3">
              <div className="rounded-xl animate-pulse w-10 h-10 bg-gray-200 dark:bg-white/[0.05]" />
              <div className="flex-1">
                <div className="rounded animate-pulse mb-2 h-3 w-32 bg-gray-200 dark:bg-white/[0.05]" />
                <div className="rounded animate-pulse h-1.5 w-full bg-gray-200 dark:bg-white/[0.05]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!categories || categories.length === 0) {
    return (
      <div className="rounded-[20px] p-6 bg-white dark:bg-[#141720] border border-gray-200 dark:border-white/[0.06]">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Budget Overview</h3>
        <p className="text-xs text-gray-600 dark:text-gray-500 mb-6">Spending by category</p>

        <div className="flex flex-col items-center justify-center py-8">
          <PieChart size={28} className="text-gray-400 dark:text-gray-700 mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-600 mb-1">No spending data</p>
          <p className="text-xs text-gray-400 dark:text-gray-700">Add expenses to see breakdown</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[20px] p-6 bg-white dark:bg-[#141720] border border-gray-200 dark:border-white/[0.06]">
      {/* Header row */}
      <div className="flex items-start justify-between mb-4">
        {/* Left: Title + subtitle */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Budget Overview</h3>
          <p className="text-xs text-gray-600 dark:text-gray-500 mt-0.5">Spending by category</p>
        </div>

        {/* Right: Total amount pill */}
        <div className="rounded-full px-3 py-1 bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08]">
          <span className="text-xs text-gray-700 dark:text-gray-300">
            Total: {formatCurrency(totalSpent)}
          </span>
        </div>
      </div>

      {/* Sort toggle */}
      <div className="flex gap-1 mb-4">
        <button
          onClick={() => setSortBy('amount')}
          className={`text-xs px-3 py-1 rounded-lg transition-all duration-200 ${
            sortBy === 'amount' ? 'border border-purple-500/20 bg-purple-100 dark:bg-purple-900/15 text-purple-700 dark:text-purple-400' : 'text-gray-600 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-400'
          }`}
        >
          By Amount
        </button>

        <button
          onClick={() => setSortBy('count')}
          className={`text-xs px-3 py-1 rounded-lg transition-all duration-200 ${
            sortBy === 'count' ? 'border border-purple-500/20 bg-purple-100 dark:bg-purple-900/15 text-purple-700 dark:text-purple-400' : 'text-gray-600 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-400'
          }`}
        >
          By Count
        </button>
      </div>

      {/* Category list */}
      <div>
        {displayCategories.map((category, index) => (
          <BudgetProgressBar
            key={category.category}
            category={category.category}
            spent={category.total}
            total={totalSpent}
            percentage={category.percentage}
            count={category.count}
            index={index}
            maxPercentage={maxPercentage}
          />
        ))}

        {/* Remove border from last item */}
        <style>{`
          .rounded-\\[20px\\] > div > div:last-child {
            border-bottom: none !important;
          }
        `}</style>
      </div>

      {/* View more button */}
      {sortedCategories.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors mt-3 w-full text-center cursor-pointer"
        >
          {showAll
            ? 'Show less'
            : `View ${sortedCategories.length - 6} more`}
        </button>
      )}
    </div>
  );
};

export default BudgetOverviewCard;
