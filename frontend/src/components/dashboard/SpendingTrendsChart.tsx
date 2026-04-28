/**
 * SpendingTrendsChart - Bar chart showing spending by category
 * Displays spending breakdown with category icons and color-coded bars
 */
import { Bar } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import { CATEGORY_COLORS, DEFAULT_COLOR, CATEGORY_EMOJI } from '../../lib/categoryColors';

interface CategorySummary {
  category: string;
  total: number;
  count: number;
  percentage: number;
}

interface SpendingTrendsChartProps {
  categories: CategorySummary[];
  totalExpenses: number;
}

const SpendingTrendsChart = ({
  categories,
  totalExpenses,
}: SpendingTrendsChartProps) => {
  // Sort categories by total spending (highest first)
  const sortedCategories = [...categories].sort((a, b) => b.total - a.total);

  // Prepare chart data
  const labels = sortedCategories.map((c) => c.category);
  const data = sortedCategories.map((c) => c.total);
  const backgroundColors = sortedCategories.map(
    (c) => (CATEGORY_COLORS[c.category] || DEFAULT_COLOR).chart
  );

  // Compute summary stats
  const topCategory = sortedCategories[0];
  const avgSpending = categories.length > 0 ? totalExpenses / categories.length : 0;

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Spending',
        data,
        backgroundColor: backgroundColors,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: backgroundColors.map((color) => color),
        barThickness: 40,
      },
    ],
  };

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a1040',
        borderColor: 'rgba(124,58,237,0.3)',
        borderWidth: 1,
        titleColor: '#A0AEC0',
        bodyColor: '#FFFFFF',
        padding: 12,
        callbacks: {
          title: (ctx) => {
            const category = ctx[0].label;
            const emoji = CATEGORY_EMOJI[category] || '📦';
            return `${emoji} ${category}`;
          },
          label: (ctx) =>
            ' $' +
            ctx.parsed.y.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
          afterLabel: (ctx) => {
            const index = ctx.dataIndex;
            const category = sortedCategories[index];
            return `${category.count} transactions`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#6B7280',
          font: { size: 12 },
          callback: function (value, index) {
            const category = labels[index];
            const emoji = CATEGORY_EMOJI[category] || '📦';
            return emoji;
          },
        },
        border: { display: false },
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: {
          color: '#6B7280',
          font: { size: 11 },
          callback: (v) => {
            const value = v as number;
            return '$' + (value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value);
          },
        },
        border: { display: false },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white dark:bg-[#0D1326] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-6 mb-5">
      {/* Header row */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Spending by Category
          </h3>
          <p className="text-xs text-gray-500 dark:text-[#6B7280] mt-1">
            Your expense breakdown
          </p>
        </div>
      </div>

      {/* Summary stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {/* BOX 1: Total */}
        <div className="bg-gray-50 dark:bg-white/[0.03] rounded-xl p-3 border border-gray-100 dark:border-white/[0.04]">
          <div className="text-xs text-gray-400 dark:text-[#6B7280] mb-1">Total Spent</div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">
            ${totalExpenses.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>

        {/* BOX 2: Top category */}
        <div className="bg-gray-50 dark:bg-white/[0.03] rounded-xl p-3 border border-gray-100 dark:border-white/[0.04]">
          <div className="text-xs text-gray-400 dark:text-[#6B7280] mb-1">Top Category</div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1">
            {topCategory ? (
              <>
                <span>{CATEGORY_EMOJI[topCategory.category] || '📦'}</span>
                <span className="truncate">{topCategory.category}</span>
              </>
            ) : (
              'N/A'
            )}
          </div>
        </div>

        {/* BOX 3: Average per category */}
        <div className="bg-gray-50 dark:bg-white/[0.03] rounded-xl p-3 border border-gray-100 dark:border-white/[0.04]">
          <div className="text-xs text-gray-400 dark:text-[#6B7280] mb-1">Avg/Category</div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">
            ${avgSpending.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      </div>

      {/* Chart */}
      {categories.length > 0 ? (
        <div style={{ height: '240px' }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      ) : (
        <div className="h-60 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-sm text-gray-500 dark:text-[#6B7280]">
              No spending data yet
            </p>
            <p className="text-xs text-gray-400 dark:text-[#6B7280] mt-1">
              Add expenses to see your category breakdown
            </p>
          </div>
        </div>
      )}

      {/* Category legend below chart */}
      {categories.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/[0.06]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {sortedCategories.map((c) => {
              const colors = CATEGORY_COLORS[c.category] || DEFAULT_COLOR;
              const emoji = CATEGORY_EMOJI[c.category] || '📦';
              return (
                <div key={c.category} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded flex-shrink-0"
                    style={{ background: colors.chart }}
                  />
                  <span className="text-xs text-gray-600 dark:text-[#A0AEC0] truncate">
                    {emoji} {c.category}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpendingTrendsChart;
