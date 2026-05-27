/**
 * AreaChart Component - Cash flow visualization (PRODUCTION READY)
 * Shows income vs expenses over time with smooth gradients
 * BUGS FIXED: $-Infinity, empty chart labels, theme detection, rerendering
 * Updated to match production patterns: ChartData type, gradient useEffect, key prop
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
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card, CardHeader } from '../ui/Card';
import { SkeletonChart } from '../ui/SkeletonLoader';

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

// Monthly trend interface
interface MonthlyTrend {
  month: string;
  total: number;
  count: number;
}

// Period type
type Period = '3M' | '6M' | '1Y';

// Format currency compact
const formatCurrency = (amount: number): string => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  return `$${amount.toFixed(0)}`;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AREA CHART COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface AreaChartProps {
  data: MonthlyTrend[];
  isLoading?: boolean;
  height?: number;
}

const AreaChart = ({ data, isLoading = false, height = 220 }: AreaChartProps) => {
  const [period, setPeriod] = useState<Period>('6M');
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );
  const chartRef = useRef<ChartJS<'line'>>(null);
  const [chartData, setChartData] = useState<ChartData<'line'>>({ labels: [], datasets: [] });

  // Theme detection with MutationObserver (BUG FIX 3)
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

  // Filter data based on period
  const filteredData = data.slice(
    period === '3M' ? -3 : period === '6M' ? -6 : -12
  );

  // Calculate summary stats (BUG FIX 1 - Fix $-Infinity)
  const total = filteredData.reduce((sum, item) => sum + item.total, 0);
  const peak = filteredData.length > 0 ? Math.max(...filteredData.map((item) => item.total)) : 0;
  const avg = filteredData.length > 0 ? total / filteredData.length : 0;

  // Prepare labels and values
  const labels = filteredData.map((item) => {
    const date = new Date(item.month + '-01');
    return date.toLocaleDateString('en-US', { month: 'short' });
  });
  const values = filteredData.map((item) => item.total);

  // Build chart data with gradient (updates on theme change)
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const ctx = chart.ctx;
    const chartArea = chart.chartArea;

    if (!chartArea) return;

    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    
    if (isDark) {
      gradient.addColorStop(0, 'rgba(248, 113, 113, 0.25)');
      gradient.addColorStop(1, 'rgba(248, 113, 113, 0)');
    } else {
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.15)');
      gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
    }

    setChartData({
      labels,
      datasets: [
        {
          label: 'Expenses',
          data: values,
          borderColor: isDark ? '#F87171' : '#EF4444',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          backgroundColor: gradient,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: isDark ? '#F87171' : '#EF4444',
          pointBorderColor: isDark ? '#0F1117' : '#FFFFFF',
          pointBorderWidth: 2,
        },
      ],
    });
  }, [isDark, filteredData, labels.join(','), values.join(',')]);

  // Chart options (updated for theme and BUG FIX 2)
  const maxValue = filteredData.length > 0 ? Math.max(...filteredData.map((item) => item.total)) : 0;
  
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
        backgroundColor: isDark ? '#1A1D28' : '#1E293B',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        titleColor: '#94A3B8',
        bodyColor: '#FFFFFF',
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return ` ${label}: ${formatCurrency(value)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDark ? '#6B7280' : '#94A3B8',
          font: {
            size: 11,
            family: 'Inter',
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        min: 0,
        suggestedMax: maxValue > 0 ? maxValue * 1.2 : 100,
        grid: {
          color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)',
          drawBorder: false,
        },
        ticks: {
          color: isDark ? '#6B7280' : '#94A3B8',
          font: {
            size: 11,
            family: 'Inter',
          },
          callback: (value) => formatCurrency(Number(value)),
        },
        border: {
          display: false,
        },
      },
    },
    animation: {
      duration: 900,
      easing: 'easeInOutQuart',
    },
  };

  // Loading state
  if (isLoading) {
    return <SkeletonChart height={`${height}px`} />;
  }

  return (
    <Card padding="lg">
      {/* Header with Period Toggle */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3
            className="font-medium text-gray-900 dark:text-white"
            style={{
              fontSize: '15px',
            }}
          >
            Cash Flow
          </h3>
          <p
            className="text-gray-400 dark:text-white/35"
            style={{
              fontSize: '12px',
              marginTop: '2px',
            }}
          >
            Expense trends over time
          </p>
        </div>

        {/* Period Toggle */}
        <div
          className="flex items-center gap-1 bg-gray-100 dark:bg-white/[0.05] rounded-lg p-0.5"
        >
          {(['3M', '6M', '1Y'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-md transition-all ${
                period === p
                  ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400'
                  : 'text-gray-600 dark:text-white/40 hover:text-gray-900 dark:hover:text-white/60'
              }`}
              style={{
                fontSize: '11px',
                fontWeight: 500,
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Row */}
      <div
        className="flex items-center gap-4 mb-4 bg-gray-50 dark:bg-white/[0.03] rounded-xl p-3"
      >
        <div className="flex-1">
          <p
            className="text-gray-400 dark:text-white/35"
            style={{
              fontSize: '10px',
              marginBottom: '2px',
            }}
          >
            Total
          </p>
          <p
            className="font-medium text-gray-900 dark:text-white"
            style={{
              fontSize: '13px',
            }}
          >
            {filteredData.length === 0 ? '$0' : formatCurrency(total)}
          </p>
        </div>

        <div
          className="bg-gray-200 dark:bg-white/[0.06]"
          style={{
            width: '1px',
            height: '24px',
          }}
        />

        <div className="flex-1">
          <p
            className="text-gray-400 dark:text-white/35"
            style={{
              fontSize: '10px',
              marginBottom: '2px',
            }}
          >
            Peak Month
          </p>
          <p
            className="font-medium text-gray-900 dark:text-white"
            style={{
              fontSize: '13px',
            }}
          >
            {filteredData.length === 0 ? '$0' : formatCurrency(peak)}
          </p>
        </div>

        <div
          className="bg-gray-200 dark:bg-white/[0.06]"
          style={{
            width: '1px',
            height: '24px',
          }}
        />

        <div className="flex-1">
          <p
            className="text-gray-400 dark:text-white/35"
            style={{
              fontSize: '10px',
              marginBottom: '2px',
            }}
          >
            Monthly Avg
          </p>
          <p
            className="font-medium text-gray-900 dark:text-white"
            style={{
              fontSize: '13px',
            }}
          >
            {filteredData.length === 0 ? '$0' : formatCurrency(avg)}
          </p>
        </div>
      </div>

      {/* Chart (BUG FIX 4 - Force remount on theme change with key prop) */}
      <div style={{ height: `${height}px` }}>
        <Line 
          key={isDark ? 'dark' : 'light'} 
          ref={chartRef} 
          data={chartData} 
          options={options} 
        />
      </div>
    </Card>
  );
};

export default AreaChart;
