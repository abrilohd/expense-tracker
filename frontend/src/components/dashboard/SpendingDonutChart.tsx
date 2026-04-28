/**
 * SpendingDonutChart - Donut chart showing spending by category
 */
import { Doughnut } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import { CATEGORY_COLORS, DEFAULT_COLOR } from '../../lib/categoryColors';

interface CategorySummary {
  category: string;
  total: number;
  count: number;
  percentage: number;
}

interface SpendingDonutChartProps {
  categories: CategorySummary[];
  totalExpenses: number;
}

const SpendingDonutChart = ({
  categories,
  totalExpenses,
}: SpendingDonutChartProps) => {
  const chartData = {
    labels: categories.map((c) => c.category),
    datasets: [
      {
        data: categories.map((c) => c.total),
        backgroundColor: categories.map(
          (c) => (CATEGORY_COLORS[c.category] || DEFAULT_COLOR).chart
        ),
        borderColor: '#0A0F1E',
        borderWidth: 3,
        hoverBorderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a1040',
        borderColor: 'rgba(124,58,237,0.3)',
        borderWidth: 1,
        titleColor: '#A0AEC0',
        bodyColor: '#FFFFFF',
        padding: 10,
        callbacks: {
          label: (ctx) =>
            ' $' +
            ctx.parsed.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-[#0D1326] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
        Spending by Category
      </h3>

      {/* Donut wrapper */}
      <div className="relative mx-auto" style={{ width: '220px', height: '220px' }}>
        <Doughnut data={chartData} options={chartOptions} />

        {/* Center overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-xs text-gray-400 dark:text-[#6B7280]">Total</div>
          <div className="font-['Syne'] text-lg font-bold text-gray-900 dark:text-white mt-1">
            ${totalExpenses.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
        {categories.map((c) => {
          const colors = CATEGORY_COLORS[c.category] || DEFAULT_COLOR;
          return (
            <div key={c.category} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ background: colors.chart }}
              />
              <span className="text-xs text-gray-500 dark:text-[#A0AEC0] truncate">
                {c.category}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpendingDonutChart;
