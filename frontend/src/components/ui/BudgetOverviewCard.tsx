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
      <div className="rounded-2xl md:rounded-[20px] bg-white dark:bg-[#141720] border border-gray-200 dark:border-white/[0.06]" style={{ padding: '24px' }}>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-2 md:gap-3 items-center py-2 md:py-3">
              <div className="rounded-xl animate-pulse w-9 h-9 md:w-10 md:h-10 bg-gray-200 dark:bg-white/[0.05]" />
              <div className="flex-1 min-w-0">
                <div className="rounded animate-pulse mb-2 h-2.5 md:h-3 w-24 md:w-32 bg-gray-200 dark:bg-white/[0.05]" />
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
      <div className="rounded-2xl md:rounded-[20px] bg-white dark:bg-[#141720] border border-gray-200 dark:border-white/[0.06]" style={{ padding: '24px' }}>
        <h3 className="text-white" style={{ fontSize: '16px', fontWeight: '600' }}>Budget Overview</h3>
        <p className="mt-0.5 mb-5 md:mb-6" style={{ fontSize: '12px', color: '#A0AEC0' }}>Spending by category</p>

        <div className="flex flex-col items-center justify-center py-6 md:py-8">
          <PieChart size={24} className="md:w-7 md:h-7 text-gray-400 dark:text-gray-700 mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-600 mb-1">No spending data</p>
          <p className="text-xs text-gray-400 dark:text-gray-700">Add expenses to see breakdown</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl md:rounded-[20px] bg-white dark:bg-[#141720] border border-gray-200 dark:border-white/[0.06]" style={{ padding: '24px' }}>
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3 md:mb-4">
        {/* Left: Title + subtitle */}
        <div>
          <h3 className="text-white" style={{ fontSize: '16px', fontWeight: '600' }}>Budget Overview</h3>
          <p className="mt-0.5" style={{ fontSize: '12px', color: '#A0AEC0' }}>Spending by category</p>
        </div>

        {/* Right: Total amount pill */}
        <div className="rounded-full px-2.5 md:px-3 py-1 bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08] self-start">
          <span className="text-xs text-gray-700 dark:text-gray-300">
            Total: {formatCurrency(totalSpent)}
          </span>
        </div>
      </div>

      {/* Sort toggle */}
      <div className="w-full grid grid-cols-2 sm:inline-flex gap-1 mb-3 md:mb-4">
        <button
          onClick={() => setSortBy('amount')}
          className={`flex-1 sm:flex-none text-xs px-3 py-1.5 sm:py-1 rounded-lg text-center transition-all duration-200 ${
            sortBy === 'amount' ? 'border border-purple-500/20 bg-purple-100 dark:bg-purple-900/15 text-purple-700 dark:text-purple-400' : 'text-gray-600 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-400'
          }`}
        >
          By Amount
        </button>

        <button
          onClick={() => setSortBy('count')}
          className={`flex-1 sm:flex-none text-xs px-3 py-1.5 sm:py-1 rounded-lg text-center transition-all duration-200 ${
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
          .rounded-2xl > div > div:last-child {
            border-bottom: none !important;
          }
        `}</style>
      </div>

      {/* View more button */}
      {sortedCategories.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors mt-3 py-2 md:py-1 w-full text-center cursor-pointer"
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
