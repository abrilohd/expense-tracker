/**
 * Expense Area Chart - Fundex-inspired with gradient fill
 * Shows monthly spending trends with period toggles
 */
import { useState, useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp } from 'lucide-react';
import type { MonthlyTrend } from '../../types';
import { formatCurrency, formatMonth } from '../../utils/formatters';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ExpenseAreaChartProps {
  data: MonthlyTrend[];
  isLoading?: boolean;
}

type Period = '3M' | '6M' | '1Y';

const ExpenseAreaChart = ({ data, isLoading = false }: ExpenseAreaChartProps) => {
  const [activePeriod, setActivePeriod] = useState<Period>('6M');
  const chartRef = useRef<ChartJS<'line'>>(null);

  // Filter data based on selected period
  const getFilteredData = (): MonthlyTrend[] => {
    if (!data || data.length === 0) return [];

    switch (activePeriod) {
      case '3M':
        return data.slice(-3);
      case '6M':
        return data.slice(-6);
      case '1Y':
        return data;
      default:
        return data;
    }
  };

  const filteredData = getFilteredData();

  // Calculate summary stats
  const getSummaryStats = () => {
    if (filteredData.length === 0) {
      return { total: 0, peak: 0, average: 0 };
    }

    const total = filteredData.reduce((sum, item) => sum + item.total, 0);
    const peak = Math.max(...filteredData.map((item) => item.total));
    const average = total / filteredData.length;

    return { total, peak, average };
  };

  const stats = getSummaryStats();

  // Prepare chart data
  const chartData = {
    labels: filteredData.map((item) => item.month),
    datasets: [
      {
        label: 'Monthly Spending',
        data: filteredData.map((item) => item.total),
        borderColor: '#8B5CF6',
        borderWidth: 2.5,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#8B5CF6',
        pointBorderColor: '#141720',
        pointBorderWidth: 2,
        fill: true,
        tension: 0.4,
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return 'rgba(139, 92, 246, 0.1)';
          }

          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
          gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.1)');
          gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

          return gradient;
        },
      },
    ],
  };

  // Chart options
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1A1D26',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        titleColor: '#9CA3AF',
        bodyColor: '#FFFFFF',
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (items) => {
            if (items.length > 0) {
              return formatMonth(items[0].label);
            }
            return '';
          },
          label: (item) => {
            return ' ' + formatCurrency(item.raw as number);
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#4B5563',
          font: {
            size: 12,
          },
          callback: function (value, index) {
            const label = this.getLabelForValue(index);
            // Show short month name (e.g., "Apr" instead of "Apr 2026")
            const [year, month] = label.split('-');
            const date = new Date(parseInt(year), parseInt(month) - 1);
            return date.toLocaleDateString('en-US', { month: 'short' });
          },
        },
      },
      y: {
        position: 'left',
        grid: {
          color: 'rgba(255, 255, 255, 0.04)',
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#4B5563',
          font: {
            size: 12,
          },
          callback: function (value) {
            const numValue = value as number;
            if (numValue >= 1000) {
              return '$' + (numValue / 1000).toFixed(1) + 'k';
            }
            return '$' + numValue;
          },
        },
      },
    },
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="rounded-[20px] p-6 bg-white dark:bg-[#141720] border border-gray-200 dark:border-white/[0.06]">
        <div className="h-60 rounded-xl animate-pulse bg-gray-200 dark:bg-white/[0.04]" />
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="rounded-[20px] p-6 bg-white dark:bg-[#141720] border border-gray-200 dark:border-white/[0.06]">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Spending Trends</h3>
        <div className="flex flex-col items-center justify-center py-16">
          <TrendingUp size={32} className="text-gray-400 dark:text-gray-700 mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-600 mb-1">No spending data yet</p>
          <p className="text-xs text-gray-400 dark:text-gray-700">Add expenses to see trends</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[20px] p-6 bg-white dark:bg-[#141720] border border-gray-200 dark:border-white/[0.06]">
      {/* Title row with period toggles */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Spending Trends</h3>

        {/* Period toggle buttons */}
        <div className="flex gap-1">
          {(['3M', '6M', '1Y'] as Period[]).map((period) => (
            <button
              key={period}
              onClick={() => setActivePeriod(period)}
              className={`text-xs px-2.5 py-1 rounded-lg transition-all duration-200 ${
                activePeriod === period
                  ? 'border border-purple-500/30 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-400'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stats row */}
      <div className="flex items-center gap-4 rounded-xl px-4 py-3 mb-4 bg-gray-100 dark:bg-white/[0.03]">
        {/* Total */}
        <div className="flex-1">
          <p className="text-xs text-gray-600 dark:text-gray-500 mb-0.5">Total</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(stats.total)}</p>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-300 dark:bg-white/[0.06]" />

        {/* Peak month */}
        <div className="flex-1">
          <p className="text-xs text-gray-600 dark:text-gray-500 mb-0.5">Peak month</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(stats.peak)}</p>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-300 dark:bg-white/[0.06]" />

        {/* Monthly avg */}
        <div className="flex-1">
          <p className="text-xs text-gray-600 dark:text-gray-500 mb-0.5">Monthly avg</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(stats.average)}</p>
        </div>
      </div>

      {/* Chart container */}
      <div style={{ height: '240px' }}>
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ExpenseAreaChart;
