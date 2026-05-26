/**
 * AreaChart Component - Cash flow visualization
 * Shows income vs expenses over time with smooth gradients
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
  const chartRef = useRef<ChartJS<'line'>>(null);

  // Filter data based on period
  const filteredData = data.slice(
    period === '3M' ? -3 : period === '6M' ? -6 : -12
  );

  // Calculate summary stats
  const total = filteredData.reduce((sum, item) => sum + item.total, 0);
  const peak = Math.max(...filteredData.map((item) => item.total));
  const avg = total / filteredData.length || 0;

  // Create gradient for expenses
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const ctx = chart.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(248, 113, 113, 0.25)');
    gradient.addColorStop(1, 'rgba(248, 113, 113, 0)');

    chart.data.datasets[0].backgroundColor = gradient;
    chart.update('none');
  }, [height]);

  // Chart data
  const chartData = {
    labels: filteredData.map((item) => {
      const date = new Date(item.month + '-01');
      return date.toLocaleDateString('en-US', { month: 'short' });
    }),
    datasets: [
      {
        label: 'Expenses',
        data: filteredData.map((item) => item.total),
        borderColor: '#F87171',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        backgroundColor: 'rgba(248, 113, 113, 0.25)', // Will be replaced by gradient
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: '#F87171',
        pointBorderColor: '#0B0D14',
        pointBorderWidth: 2,
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
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        borderColor: 'rgba(156, 163, 175, 0.2)',
        borderWidth: 1,
        titleColor: '#9CA3AF',
        bodyColor: '#FFFFFF',
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${formatCurrency(value)}`;
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
          color: '#374151',
          font: {
            size: 11,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.04)',
        },
        ticks: {
          color: '#374151',
          font: {
            size: 11,
          },
          callback: (value) => formatCurrency(Number(value)),
        },
        border: {
          display: false,
        },
      },
    },
    animation: {
      duration: 800,
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
              fontSize: '14px',
            }}
          >
            Cash Flow
          </h3>
          <p
            className="text-gray-400 dark:text-white/35"
            style={{
              fontSize: '11px',
              marginTop: '2px',
            }}
          >
            Income vs expenses
          </p>
        </div>

        {/* Period Toggle */}
        <div
          className="flex items-center gap-1 bg-gray-100 dark:bg-white/3 rounded-lg p-0.5"
        >
          {(['3M', '6M', '1Y'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="px-3 py-1 rounded-md transition-all"
              style={{
                fontSize: '11px',
                fontWeight: 500,
                background: period === p ? 'rgba(91, 78, 232, 0.2)' : 'transparent',
                color: period === p ? '#A78BFA' : 'var(--text-muted)',
                border: period === p ? '1px solid rgba(91, 78, 232, 0.2)' : '1px solid transparent',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        :root {
          --text-muted: rgba(0, 0, 0, 0.4);
        }
        .dark {
          --text-muted: rgba(255, 255, 255, 0.4);
        }
      `}</style>

      {/* Summary Row */}
      <div
        className="flex items-center gap-4 mb-4 bg-gray-50 dark:bg-white/3 rounded-xl p-3"
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
            {formatCurrency(total)}
          </p>
        </div>

        <div
          className="bg-gray-200 dark:bg-white/6"
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
            {formatCurrency(peak)}
          </p>
        </div>

        <div
          className="bg-gray-200 dark:bg-white/6"
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
            {formatCurrency(avg)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: `${height}px` }}>
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
    </Card>
  );
};

export default AreaChart;
