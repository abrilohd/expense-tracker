/**
 * CategoryBreakdown - Grid of category cards with detailed spending information
 */
import { CATEGORY_COLORS, DEFAULT_COLOR, CATEGORY_EMOJI } from '../../lib/categoryColors';

interface CategorySummary {
  category: string;
  total: number;
  count: number;
  percentage: number;
}

interface CategoryBreakdownProps {
  categories: CategorySummary[];
}

const CategoryBreakdown = ({ categories }: CategoryBreakdownProps) => {
  return (
    <div className="mb-5">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Category Breakdown
        </h2>
        <p className="text-sm text-gray-500 dark:text-[#6B7280] mt-1">
          Detailed spending by category
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => {
          const colors = CATEGORY_COLORS[c.category] || DEFAULT_COLOR;
          const emoji = CATEGORY_EMOJI[c.category] || '📦';

          return (
            <div
              key={c.category}
              className="relative overflow-hidden bg-white dark:bg-[#0D1326] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-5"
            >
              {/* Blob decoration */}
              <div
                className="absolute w-20 h-20 rounded-full -top-6 -right-6 opacity-30 blur-xl pointer-events-none"
                style={{ background: colors.chart }}
              />

              {/* Icon row */}
              <div className="relative flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${colors.bg}`}
                >
                  {emoji}
                </div>
                <span className="text-base font-semibold text-gray-900 dark:text-white">
                  {c.category}
                </span>
              </div>

              {/* Amount */}
              <div className="relative font-['Syne'] text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ${c.total.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>

              {/* Progress bar */}
              <div className="relative mt-3 w-full h-1.5 rounded-full bg-gray-100 dark:bg-white/[0.06]">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: c.percentage + '%',
                    background: colors.chart,
                  }}
                />
              </div>

              {/* Footer row */}
              <div className="relative mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-400 dark:text-[#6B7280]">
                  {c.count} transactions
                </span>
                <span className={`text-xs font-semibold ${colors.text}`}>
                  {c.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryBreakdown;
