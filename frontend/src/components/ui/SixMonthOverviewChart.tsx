/**
 * 6-Month Spending Overview Chart - Line chart with toggle for Expense/Income/Both
 * Premium component showing spending trends over 6 months
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
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
import { format, subMonths } from 'date-fns';
import type { MonthlyTrend } from '../../types';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface SixMonthOverviewChartProps {
  monthlyTrends: MonthlyTrend[];
}

type ViewMode = 'expense' | 'income' | 'both';

const SixMonthOverviewChart = ({ monthlyTrends }: SixMonthOverviewChartProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('both');

  // Generate last 6 months labels
  const getLast6Months = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      months.push({
        label: format(date, 'MMM'),
        key: format(date, 'yyyy-MM'),
      });
    }
    return months;
  };

  const last6Months = getLast6Months();

  // Map monthly trends to last 6 months
  const expenseData = last6Months.map((month) => {
    const trend = monthlyTrends.find((t) => t.month === month.key);
    return trend?.total || 0;
  });

  // Since we don't have income data yet, use zeros
  const incomeData = last6Months.map(() => 0);

  // Chart data
  const chartData = {
    labels: last6Months.map((m) => m.label),
    datasets: [
      {
        label: 'Expenses',
        data: expenseData,
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#0A0F1E',
        pointBorderWidth: 2,
        pointBorderColor: '#EF4444',
        hidden: viewMode === 'income',
      },
      {
        label: 'Income',
        data: incomeData,
        borderColor: '#22C55E',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#0A0F1E',
        pointBorderWidth: 2,
        pointBorderColor: '#22C55E',
        hidden: viewMode === 'expense',
      },
    ],
  };

  // Chart options
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0D1326',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        titleColor: '#A0AEC0',
        bodyColor: '#FFFFFF',
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return ` ${label}: $${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
          callback: (value) => {
            return '$' + Number(value).toLocaleString();
          },
        },
        border: {
          display: false,
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
      className="rounded-2xl"
      style={{
        background: '#0D1326',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '24px',
      }}
    >
      {/* Header with title and toggle buttons */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white" style={{ fontSize: '16px', fontWeight: '600' }}>6-Month Overview</h3>

        {/* Toggle buttons */}
        <div className="flex gap-1 rounded-lg p-1" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
          <button
            onClick={() => setViewMode('expense')}
            className="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200"
            style={{
              background: viewMode === 'expense' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: viewMode === 'expense' ? '#FFFFFF' : '#6B7280',
            }}
          >
            Expense
          </button>
          <button
            onClick={() => setViewMode('income')}
            className="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200"
            style={{
              background: viewMode === 'income' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: viewMode === 'income' ? '#FFFFFF' : '#6B7280',
            }}
          >
            Income
          </button>
          <button
            onClick={() => setViewMode('both')}
            className="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200"
            style={{
              background: viewMode === 'both' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: viewMode === 'both' ? '#FFFFFF' : '#6B7280',
            }}
          >
            Both
          </button>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: '240px', width: '100%' }}>
        <Line data={chartData} options={options} />
      </div>
    </motion.div>
  );
};

export default SixMonthOverviewChart;
