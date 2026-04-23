/**
 * Bar chart component for monthly expense trends
 */
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { BarChart2 } from 'lucide-react';
import type { MonthlyTrend } from '../../types';
import { formatCurrency, formatMonth } from '../../utils/formatters';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ExpenseBarChartProps {
  data: MonthlyTrend[];
  isLoading?: boolean;
}

const ExpenseBarChart = ({ data, isLoading = false }: ExpenseBarChartProps) => {
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
          Monthly Spending
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
          Monthly Spending
        </h3>
        <div className="h-64 flex flex-col items-center justify-center text-gray-400">
          <BarChart2 size={48} />
          <p className="mt-2">No expense data yet</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const chartData = {
    labels: data.map((trend) => formatMonth(trend.month)),
    datasets: [
      {
        label: 'Expenses',
        data: data.map((trend) => trend.total),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  // Chart options
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return formatCurrency(context.parsed.y);
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDark ? '#9CA3AF' : '#6B7280',
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: isDark ? '#9CA3AF' : '#6B7280',
          callback: (value) => formatCurrency(Number(value)),
        },
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(156, 163, 175, 0.2)',
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Monthly Spending
      </h3>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ExpenseBarChart;
