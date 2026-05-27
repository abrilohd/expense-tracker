/**
 * Expense Line Chart - Exonad-inspired design (PRODUCTION READY)
 * Line chart showing expense trends over last 7 months
 * Gradient fill under line, smooth curves
 * Right pill: "— Actual expenses" in emerald color
 * Demo data support for first-time users
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
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, MoreHorizontal } from 'lucide-react';
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

interface ExpenseLineChartProps {
  data: MonthlyTrend[];
  isLoading?: boolean;
  isDemoMode?: boolean;
}

const ExpenseLineChart = ({ 
  data, 
  isLoading = false,
  isDemoMode = false 
}: ExpenseLineChartProps) => {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );
  const chartRef = useRef<ChartJS<'line'>>(null);
  const [chartData, setChartData] = useState<ChartData<'line'>>({ labels: [], datasets: [] });

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

  // Build chart data with gradient (updates on theme change)
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const ctx = chart.ctx;
    const chartArea = chart.chartArea;

    if (!chartArea) return;

    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    
    if (isDark) {
      gradient.addColorStop(0, 'rgba(167,139,250,0.15)');
      gradient.addColorStop(1, 'rgba(167,139,250,0)');
    } else {
      gradient.addColorStop(0, 'rgba(91,78,232,0.08)');
      gradient.addColorStop(1, 'rgba(91,78,232,0)');
    }

    setChartData({
      labels,
      datasets: [
        {
          label: 'Expenses',
          data: expenseValues,
          borderColor: isDark ? '#A78BFA' : '#5B4EE8',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          backgroundColor: gradient,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: isDark ? '#A78BFA' : '#5B4EE8',
          pointBorderColor: isDark ? '#0F1117' : '#FFFFFF',
          pointBorderWidth: 2,
          pointHoverBackgroundColor: isDark ? '#A78BFA' : '#5B4EE8',
          pointHoverBorderColor: isDark ? '#0F1117' : '#FFFFFF',
        },
      ],
    });
  }, [isDark, data, labels.join(','), expenseValues.join(',')]);

  // Chart options
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    animation: {
      duration: 900,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1E293B',
        titleColor: '#94A3B8',
        bodyColor: '#F8FAFC',
        padding: 12,
        cornerRadius: 10,
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: (item) => '  ' + formatCurrency(item.raw as number),
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
          color: isDark ? '#4B5563' : '#94A3B8',
          font: {
            size: 11,
            family: 'Inter',
          },
        },
      },
      y: {
        position: 'left',
        grid: {
          color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: isDark ? '#4B5563' : '#94A3B8',
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
        className={`rounded-2xl p-6 ${
          isDark
            ? 'bg-[#0F1117] border border-white/[0.07]'
            : 'bg-white border border-[#E8ECF0] shadow-sm'
        }`}
        style={{ boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <div
              className={`h-4 w-36 rounded animate-pulse ${
                isDark ? 'bg-white/5' : 'bg-gray-100'
              }`}
            />
            <div
              className={`h-3 w-48 rounded animate-pulse mt-2 ${
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
        <div className="h-[220px] flex items-end gap-2 px-4">
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

  // Empty state (should never show with demo data)
  if (data.length === 0 && !isDemoMode) {
    return (
      <div
        className={`rounded-2xl p-6 ${
          isDark
            ? 'bg-[#0F1117] border border-white/[0.07]'
            : 'bg-white border border-[#E8ECF0] shadow-sm'
        }`}
        style={{ boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3
              className={`text-[15px] font-semibold ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}
            >
              Expense Activity
            </h3>
            <p
              className={`text-xs mt-0.5 ${
                isDark ? 'text-white/35' : 'text-gray-400'
              }`}
            >
              Monthly spending trends over time
            </p>
          </div>
          <button
            className={`p-1.5 rounded-lg transition-colors ${
              isDark
                ? 'text-white/20 hover:text-white/50'
                : 'text-gray-300 hover:text-gray-500'
            }`}
          >
            <MoreHorizontal size={16} />
          </button>
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
      className={`rounded-2xl p-6 ${
        isDark
          ? 'bg-[#0F1117] border border-white/[0.07]'
          : 'bg-white border border-[#E8ECF0] shadow-sm'
      }`}
      style={{ boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3
            className={`text-[15px] font-semibold ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}
          >
            Expense Activity
          </h3>
          <p
            className={`text-xs mt-0.5 ${
              isDark ? 'text-white/35' : 'text-gray-400'
            }`}
          >
            Monthly spending trends over time
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`text-xs flex items-center gap-1 ${
              isDark ? 'text-emerald-400' : 'text-emerald-500'
            }`}
          >
            <span className="inline-block w-5 h-0.5 bg-current" />
            <span>Actual expenses</span>
          </div>
          <button
            className={`p-1.5 rounded-lg transition-colors ${
              isDark
                ? 'text-white/20 hover:text-white/50'
                : 'text-gray-300 hover:text-gray-500'
            }`}
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
      <div className="relative h-[220px]">
        <Line 
          key={isDark ? 'dark' : 'light'} 
          ref={chartRef} 
          data={chartData} 
          options={options} 
        />
      </div>
    </div>
  );
};

export default ExpenseLineChart;
