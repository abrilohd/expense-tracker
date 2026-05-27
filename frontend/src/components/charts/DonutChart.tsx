/**
 * DonutChart Component - Category spending breakdown
 * Shows spending distribution with center total label
 */
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Plugin } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Card } from '../ui/Card';
import { SkeletonCard } from '../ui/SkeletonLoader';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Category summary interface
interface CategorySummary {
  category: string;
  total: number;
  count: number;
  percentage: number;
}

// Category colors (8 colors for 8 categories)
const CATEGORY_COLORS = [
  '#5B4EE8', // Purple
  '#34D399', // Green
  '#F59E0B', // Amber
  '#F87171', // Red
  '#A78BFA', // Light Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#6B7280', // Gray
];

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Center label plugin
const centerLabelPlugin: Plugin<'doughnut'> = {
  id: 'centerLabel',
  beforeDraw: (chart) => {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;

    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;

    // Calculate total
    const total = chart.data.datasets[0].data.reduce(
      (sum: number, val) => sum + (val as number),
      0
    );

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw "Total" label
    ctx.font = 'bold 11px Inter';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillText('Total', centerX, centerY - 12);

    // Draw total value
    ctx.font = 'bold 18px Inter';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(formatCurrency(total), centerX, centerY + 8);

    ctx.restore();
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DONUT CHART COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface DonutChartProps {
  data: CategorySummary[];
  isLoading?: boolean;
}

const DonutChart = ({ data, isLoading = false }: DonutChartProps) => {
  // Chart data
  const chartData = {
    labels: data.map((item) => item.category),
    datasets: [
      {
        data: data.map((item) => item.total),
        backgroundColor: CATEGORY_COLORS.slice(0, data.length),
        borderColor: '#0B0D14',
        borderWidth: 3,
        hoverBorderWidth: 4,
        hoverOffset: 8,
      },
    ],
  };

  // Chart options
  const options = {
    cutout: '68%',
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      duration: 800,
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#9CA3AF',
          font: {
            size: 11,
            family: 'Inter',
          },
          boxWidth: 8,
          boxHeight: 8,
          borderRadius: 2,
          padding: 12,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        borderColor: 'rgba(156, 163, 175, 0.2)',
        borderWidth: 1,
        titleColor: '#9CA3AF',
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed;
            const dataset = context.dataset.data;
            const total = dataset.reduce((sum: number, val: number) => sum + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Loading state
  if (isLoading) {
    return <SkeletonCard height="400px" />;
  }

  // Empty state
  if (data.length === 0) {
    return (
      <Card padding="lg">
        <h3
          className="font-medium mb-2 text-gray-900 dark:text-white"
          style={{
            fontSize: '14px',
          }}
        >
          Category Breakdown
        </h3>
        <div
          className="flex items-center justify-center text-gray-400 dark:text-white/30"
          style={{
            height: '300px',
            fontSize: '13px',
          }}
        >
          No data available
        </div>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      {/* Title */}
      <h3
        className="font-medium mb-4 text-gray-900 dark:text-white"
        style={{
          fontSize: '14px',
        }}
      >
        Category Breakdown
      </h3>

      {/* Chart */}
      <div style={{ height: '300px', position: 'relative' }}>
        <Doughnut data={chartData} options={options} plugins={[centerLabelPlugin]} />
      </div>
    </Card>
  );
};

export default DonutChart;
