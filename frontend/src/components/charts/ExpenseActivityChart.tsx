/**
 * Expense Activity Chart - Exonad-inspired design
 * Line chart showing expense trends over last 7 months
 * Dual theme: purple line with gradient fill
 */
import { useEffect, useState, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp } from 'lucide-react';
import type { MonthlyTrend } from '../../types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface ExpenseActivityChartProps {
  data: MonthlyTrend[];
  isLoading?: boolean;
}

const ExpenseActivityChart = ({ data, isLoading = false }: ExpenseActivityChartProps) => {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  );
  const chartRef = useRef<ChartJS<'line'>>(null);

  // Theme detection with MutationObserver
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Compact currency for Y-axis
  const formatCompactCurrency = (value: number): string => {
    if (value >= 1000) {
      return '$' + (value / 1000).toFixed(1) + 'k';
    }
    return '$' + value.toFixed(0);
  };

  // Format month label
  const formatMonth = (monthStr: string): string => {
    const date = new Date(monthStr + '-01');
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  // Get last 7 months of data
  const last7Months = data.slice(-7);
  const labels = last7Months.map((t) => formatMonth(t.month));
  const expenseValues = last7Months.map((t) => t.total);

  // Chart data with gradient
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Expenses',
        data: expenseValues,
        borderColor: isDark ? '#A78BFA' : '#5B4EE8',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return isDark ? 'rgba(91,78,232,0.15)' : 'rgba(91,78,232,0.08)';
          }

          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          if (isDark) {
            gradient.addColorStop(0, 'rgba(91,78,232,0.15)');
            gradient.addColorStop(1, 'rgba(91,78,232,0)');
          } else {
            gradient.addColorStop(0, 'rgba(91,78,232,0.08)');
            gradient.addColorStop(1, 'rgba(91,78,232,0)');
          }
          return gradient;
        },
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: isDark ? '#A78BFA' : '#5B4EE8',
        pointBorderColor: isDark ? '#0F1117' : '#FFFFFF',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: isDark ? '#A78BFA' : '#5B4EE8',
        pointHoverBorderColor: isDark ? '#0F1117' : '#FFFFFF',
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
    animation: {
      duration: 800,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          color: isDark ? '#6B7280' : '#94A3B8',
          font: {
            size: 11,
            family: 'Inter',
          },
          usePointStyle: true,
          pointStyle: 'line',
          boxWidth: 20,
          boxHeight: 2,
          padding: 10,
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#1A1D28' : '#1E293B',
        titleColor: '#94A3B8',
        bodyColor: '#FFFFFF',
        padding: 12,
        cornerRadius: 8,
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          label: (item) => ' ' + item.dataset.label + ': ' + formatCurrency(item.raw as number),
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
          color: isDark ? '#6B7280' : '#94A3B8',
          font: {
            size: 11,
            family: 'Inter',
          },
        },
      },
      y: {
        position: 'left',
        grid: {
          color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)',
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: isDark ? '#6B7280' : '#94A3B8',
          font: {
            size: 11,
            family: 'Inter',
          },
          callback: (value) => formatCompactCurrency(value as number),
        },
      },
    },
  };

  // Loading state
  if (isLoading) {
    return (
      <div
        className={`rounded-2xl p-5 ${
          isDark
            ? 'bg-[#0F1117] border border-white/[0.07]'
            : 'bg-white border border-gray-200'
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div
              className={`h-4 w-36 rounded animate-pulse ${
                isDark ? 'bg-white/5' : 'bg-gray-100'
              }`}
            />
          </div>
          <div
            className={`h-3 w-24 rounded animate-pulse ${
              isDark ? 'bg-white/5' : 'bg-gray-100'
            }`}
          />
        </div>
        <div className="h-[200px] flex items-end gap-2 px-4">
          {/* Wave skeleton */}
          {[40, 60, 45, 70, 55, 65, 50].map((height, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t-lg animate-pulse ${
                isDark ? 'bg-white/5' : 'bg-gray-100'
              }`}
              style={{
                height: `${height}%`,
                animationDelay: `${i * 100}ms`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div
        className={`rounded-2xl p-5 ${
          isDark
            ? 'bg-[#0F1117] border border-white/[0.07]'
            : 'bg-white border border-gray-200'
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3
              className={`text-[15px] font-semibold ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}
            >
              Expense Activity
            </h3>
          </div>
          <div
            className={`text-xs ${
              isDark ? 'text-emerald-400' : 'text-emerald-500'
            }`}
          >
            — Actual expenses
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <TrendingUp
            size={36}
            className={isDark ? 'text-white/10' : 'text-gray-200'}
          />
          <p
            className={`text-sm mt-3 ${
              isDark ? 'text-white/30' : 'text-gray-400'
            }`}
          >
            No activity data yet
          </p>
          <p
            className={`text-xs mt-1 ${
              isDark ? 'text-white/20' : 'text-gray-300'
            }`}
          >
            Track expenses to see activity trends
          </p>
        </div>
      </div>
    );
  }

  // Chart view
  return (
    <div
      className={`rounded-2xl p-5 ${
        isDark
          ? 'bg-[#0F1117] border border-white/[0.07]'
          : 'bg-white border border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3
            className={`text-[15px] font-semibold ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}
          >
            Expense Activity
          </h3>
        </div>
        <div
          className={`text-xs ${
            isDark ? 'text-emerald-400' : 'text-emerald-500'
          }`}
        >
          — Actual expenses
        </div>
      </div>
      <div className="relative h-[200px]">
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ExpenseActivityChart;
