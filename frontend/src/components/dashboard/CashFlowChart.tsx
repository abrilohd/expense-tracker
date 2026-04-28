/**
 * CashFlowChart - 12-month expense trend line chart
 * Shows monthly spending over the last 12 months
 */
import { Line } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';

interface CashFlowChartProps {
  monthlyTrends: Array<{ month: string; total: number; count: number }>;
}

const CashFlowChart = ({ monthlyTrends }: CashFlowChartProps) => {
  // Compute chart data for last 12 months
  const now = new Date();
  const labels: string[] = [];
  const expenseData: number[] = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    labels.push(d.toLocaleString('default', { month: 'short' }));

    // Find matching month in trends data
    // monthlyTrends format is "YYYY-MM" (e.g., "2026-04")
    const found = monthlyTrends.find(
      (t) => t.month === monthKey || t.month?.startsWith(monthKey)
    );
    expenseData.push(found ? found.total : 0);
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Expenses',
        data: expenseData,
        borderColor: '#7C3AED',
        backgroundColor: 'rgba(124,58,237,0.08)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#7C3AED',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a1040',
        borderColor: 'rgba(124,58,237,0.3)',
        borderWidth: 1,
        titleColor: '#A0AEC0',
        titleFont: { size: 11 },
        bodyColor: '#FFFFFF',
        bodyFont: { size: 13, weight: 'bold' },
        padding: 12,
        callbacks: {
          label: (ctx) =>
            ' $' +
            ctx.parsed.y.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
        ticks: { color: '#6B7280', font: { size: 11 } },
        border: { display: false },
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
        ticks: {
          color: '#6B7280',
          font: { size: 11 },
          callback: (v) => {
            const value = v as number;
            return '$' + (value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value);
          },
        },
        border: { display: false },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white dark:bg-[#0D1326] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-white">Cash Flow</h3>
          <p className="text-xs text-[#6B7280] mt-1">Income vs Expenses</p>
        </div>
        <div className="bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-[#A0AEC0]">
          Monthly ▾
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: '260px' }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default CashFlowChart;
