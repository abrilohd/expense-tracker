/**
 * Top Expenses Bar Chart - Exonad-inspired design (PRODUCTION READY)
 * Shows top 5 expense categories with beautiful gradients
 * Dual theme: green gradient (light) / purple gradient (dark)
 * Demo data support for first-time users
 */
import { useEffect, useState, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { BarChart2, MoreHorizontal } from 'lucide-react';
import type { CategorySummary } from '../../types';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TopExpensesBarChartProps {
  data: CategorySummary[];
  isLoading?: boolean;
  isDemoMode?: boolean;
  compact?: boolean;
}

const TopExpensesBarChart = ({ 
  data, 
  isLoading = false, 
  isDemoMode = false,
  compact = false 
}: TopExpensesBarChartProps) => {
  const [isDark, setIsDark] = useState(() => 
    document.documentElement.classList.contains('dark')
  );
  const chartRef = useRef<ChartJS<'bar'>>(null);
  const [chartData, setChartData] = useState<ChartData<'bar'>>({ labels: [], datasets: [] });

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

  // Build chart data with gradient (updates on theme change and data)
  useEffect(() => {
    // Get ALL 8 categories, sorted by total amount (largest first)
    // Create a map of all categories with their data
    const allCategories = ['Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Shopping', 'Education', 'Other'];
    
    // Create a map from the data
    const categoryMap = new Map(data.map(cat => [cat.category, cat.total]));
    
    // Build complete dataset with all 8 categories
    const completeData = allCategories.map(category => ({
      category,
      total: categoryMap.get(category) || 0,
    }));
    
    // Sort by total amount (largest first)
    const sortedCategories = completeData.sort((a, b) => b.total - a.total);

    const labels = sortedCategories.map((cat) => cat.category);
    const values = sortedCategories.map((cat) => cat.total);
    
    const chart = chartRef.current;
    if (!chart || !chart.ctx) {
      // Set basic data without gradient if chart not ready
      setChartData({
        labels,
        datasets: [
          {
            label: 'Spent',
            data: values,
            backgroundColor: isDark ? 'rgba(91,78,232,0.8)' : 'rgba(16,185,129,0.8)',
            borderRadius: 6,
            borderSkipped: false,
            hoverBackgroundColor: isDark ? '#C4B5FD' : '#059669',
            maxBarThickness: 48,
            minBarLength: 0, // Allow bars to be at baseline when 0
          },
        ],
      });
      return;
    }

    const ctx = chart.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, 280);
    
    if (isDark) {
      gradient.addColorStop(0, 'rgba(91,78,232,0.95)');
      gradient.addColorStop(1, 'rgba(91,78,232,0.25)');
    } else {
      gradient.addColorStop(0, 'rgba(16,185,129,0.95)');
      gradient.addColorStop(1, 'rgba(16,185,129,0.25)');
    }

    setChartData({
      labels,
      datasets: [
        {
          label: 'Spent',
          data: values,
          backgroundColor: gradient,
          borderRadius: 6,
          borderSkipped: false,
          hoverBackgroundColor: isDark ? '#C4B5FD' : '#059669',
          maxBarThickness: 48,
          minBarLength: 0, // Allow bars to be at baseline when 0
        },
      ],
    });
  }, [isDark, data]);

  // Chart options
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
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
          title: (items) => items[0]?.label || '',
          label: (item) => {
            const value = item.raw as number;
            return value === 0 ? '  No expenses' : '  ' + formatCurrency(value);
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
          color: isDark ? '#6B7280' : '#9CA3AF',
          font: {
            size: 10,
            family: 'Inter',
          },
          maxRotation: 0,
          minRotation: 0,
          autoSkip: false,
          padding: 8,
        },
      },
      y: {
        min: 0,
        beginAtZero: true,
        grid: {
          color: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)',
          lineWidth: 1,
        },
        border: {
          display: false,
          dash: [4, 4],
        },
        ticks: {
          color: isDark ? '#6B7280' : '#9CA3AF',
          font: {
            size: 11,
            family: 'Inter',
          },
          padding: 10,
          callback: function(value) {
            const val = Number(value);
            if (val === 0) return '$0';
            
            if (val >= 10000) {
              return '$' + (val / 1000).toFixed(0) + 'k';
            } else if (val >= 1000) {
              return '$' + (val / 1000).toFixed(val % 1000 === 0 ? 0 : 1) + 'k';
            } else {
              return '$' + val.toFixed(0);
            }
          },
          stepSize: undefined,
          maxTicksLimit: 6,
          precision: 0,
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
              className={`h-4 w-40 rounded animate-pulse ${
                isDark ? 'bg-white/5' : 'bg-gray-100'
              }`}
            />
            {!compact && (
              <div
                className={`h-3 w-48 rounded animate-pulse mt-2 ${
                  isDark ? 'bg-white/5' : 'bg-gray-100'
                }`}
              />
            )}
          </div>
        </div>
        <div className="flex items-end gap-2 px-2" style={{ height: compact ? '220px' : '280px' }}>
          {[60, 90, 50, 75, 40, 65, 55, 45].map((height, i) => (
            <div
              key={i}
              className={`flex-1 animate-pulse ${
                isDark ? 'bg-white/5' : 'bg-gray-100'
              }`}
              style={{ 
                height: `${height}%`,
                borderRadius: '6px 6px 0 0',
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
              Top Expense Sources
            </h3>
            {!compact && (
              <p
                className={`text-xs mt-0.5 ${
                  isDark ? 'text-white/35' : 'text-gray-400'
                }`}
              >
                Your highest spending categories
              </p>
            )}
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
          <BarChart2
            size={36}
            className={isDark ? 'text-white/10' : 'text-gray-200'}
          />
          <p
            className={`text-sm mt-3 ${
              isDark ? 'text-white/30' : 'text-gray-400'
            }`}
          >
            No expense data yet
          </p>
          <p
            className={`text-xs mt-1 ${
              isDark ? 'text-white/20' : 'text-gray-300'
            }`}
          >
            Add expenses to see category breakdown
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
            Top Expense Sources
          </h3>
          {!compact && (
            <p
              className={`text-xs mt-0.5 ${
                isDark ? 'text-white/35' : 'text-gray-400'
              }`}
            >
              Your highest spending categories
            </p>
          )}
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
      <div
        className="relative"
        style={{ height: compact ? '220px' : '280px' }}
      >
        <Bar 
          key={isDark ? 'dark' : 'light'} 
          ref={chartRef} 
          data={chartData} 
          options={options} 
        />
      </div>
    </div>
  );
};

export default TopExpensesBarChart;
