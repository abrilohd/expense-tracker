/**
 * Doughnut chart component for category spending breakdown
 */
import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  Plugin,
} from 'chart.js';
import { PieChart } from 'lucide-react';
import type { CategorySummary } from '../../types';
import { formatCurrency, getCategoryEmoji } from '../../utils/formatters';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryPieChartProps {
  data: CategorySummary[];
  isLoading?: boolean;
}

// Category colors (8 colors for 8 categories)
const CATEGORY_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#6B7280', // Gray
];

const CategoryPieChart = ({ data, isLoading = false }: CategoryPieChartProps) => {
  const [isDark, setIsDark] = useState(false);

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Spending by Category
        </h3>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Spending by Category
        </h3>
        <div className="h-64 flex flex-col items-center justify-center text-gray-400">
          <PieChart size={48} />
          <p className="mt-2">No categories yet</p>
        </div>
      </div>
    );
  }

  // Calculate total for center label
  const totalAmount = data.reduce((sum, category) => sum + category.total, 0);

  // Custom plugin to draw center label
  const centerLabelPlugin: Plugin<'doughnut'> = {
    id: 'centerLabel',
    afterDraw: (chart) => {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;

      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Draw "Total" label
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillStyle = isDark ? '#9CA3AF' : '#6B7280';
      ctx.fillText('Total', centerX, centerY - 12);

      // Draw total amount
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.fillStyle = isDark ? '#FFFFFF' : '#111827';
      ctx.fillText(formatCurrency(totalAmount), centerX, centerY + 12);

      ctx.restore();
    },
  };

  // Prepare chart data
  const chartData = {
    labels: data.map((cat) => `${getCategoryEmoji(cat.category)} ${cat.category}`),
    datasets: [
      {
        data: data.map((cat) => cat.total),
        backgroundColor: CATEGORY_COLORS,
        borderColor: isDark ? '#1F2937' : '#FFFFFF',
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  // Chart options
  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDark ? '#9CA3AF' : '#6B7280',
          padding: 12,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const category = data[context.dataIndex];
            return `${category.category}: ${formatCurrency(category.total)} (${category.percentage.toFixed(1)}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Spending by Category
      </h3>
      <div className="h-64">
        <Doughnut data={chartData} options={options} plugins={[centerLabelPlugin]} />
      </div>
    </div>
  );
};

export default CategoryPieChart;
