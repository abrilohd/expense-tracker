/**
 * Report Overview Chart - Exonad-inspired design
 * Donut chart with Income/Expense/Savings breakdown
 * Custom legend with trend indicators
 * Dual theme: green/red/dark (light) / green/red/purple (dark)
 */
import { useEffect, useState, useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Plugin,
  ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ArrowUpRight, ArrowDownRight, PieChart } from 'lucide-react';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface ReportOverviewChartProps {
  totalIncome: number;
  totalExpenses: number;
  isLoading?: boolean;
}

const ReportOverviewChart = ({
  totalIncome,
  totalExpenses,
  isLoading = false,
}: ReportOverviewChartProps) => {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  );
  const chartRef = useRef<ChartJS<'doughnut'>>(null);

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

  // Calculate savings
  const totalSavings = Math.max(0, totalIncome - totalExpenses);
  const totalAmount = totalIncome + totalExpenses;

  // Center label plugin
  const centerLabelPlugin: Plugin<'doughnut'> = {
    id: 'centerLabel',
    afterDatasetsDraw(chart) {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;

      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Line 1: "Total"
      ctx.font = '11px Inter';
      ctx.fillStyle = isDark ? '#6B7280' : '#94A3B8';
      ctx.fillText('Total', centerX, centerY - 12);

      // Line 2: Total amount
      ctx.font = 'bold 16px Inter';
      ctx.fillStyle = isDark ? '#FFFFFF' : '#1A1A2E';
      ctx.fillText(formatCurrency(totalAmount), centerX, centerY + 8);

      ctx.restore();
    },
  };

  // Chart data
  const chartData = {
    labels: ['Income', 'Expenses', 'Savings'],
    datasets: [
      {
        data: [totalIncome, totalExpenses, totalSavings],
        backgroundColor: isDark
          ? ['#34D399', '#F87171', '#A78BFA']
          : ['#10B981', '#EF4444', '#1A1A2E'],
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  // Chart options
  const options: ChartOptions<'doughnut'> = {
    cutout: '65%',
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      animateRotate: true,
    },
    plugins: {
      legend: {
        display: false,
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
          label: (item) => ' ' + item.label + ': ' + formatCurrency(item.raw as number),
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
        <div className="mb-4">
          <div
            className={`h-4 w-32 rounded animate-pulse ${
              isDark ? 'bg-white/5' : 'bg-gray-100'
            }`}
          />
        </div>
        <div className="flex items-center gap-6">
          {/* Left: Circle shimmer */}
          <div
            className={`w-40 h-40 rounded-full animate-pulse flex-shrink-0 ${
              isDark ? 'bg-white/5' : 'bg-gray-100'
            }`}
          />
          {/* Right: Legend shimmers */}
          <div className="flex-1 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    isDark ? 'bg-white/5' : 'bg-gray-100'
                  }`}
                />
                <div className="flex-1 space-y-2">
                  <div
                    className={`h-3 w-20 rounded animate-pulse ${
                      isDark ? 'bg-white/5' : 'bg-gray-100'
                    }`}
                  />
                  <div
                    className={`h-4 w-24 rounded animate-pulse ${
                      isDark ? 'bg-white/5' : 'bg-gray-100'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (totalAmount === 0) {
    return (
      <div
        className={`rounded-2xl p-5 ${
          isDark
            ? 'bg-[#0F1117] border border-white/[0.07]'
            : 'bg-white border border-gray-200'
        }`}
      >
        <div className="mb-4">
          <h3
            className={`text-[15px] font-semibold ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}
          >
            Report Overview
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <PieChart
            size={36}
            className={isDark ? 'text-white/10' : 'text-gray-200'}
          />
          <p
            className={`text-sm mt-3 ${
              isDark ? 'text-white/30' : 'text-gray-400'
            }`}
          >
            No financial data yet
          </p>
          <p
            className={`text-xs mt-1 ${
              isDark ? 'text-white/20' : 'text-gray-300'
            }`}
          >
            Add income and expenses to see overview
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
      <div className="mb-4">
        <h3
          className={`text-[15px] font-semibold ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}
        >
          Report Overview
        </h3>
      </div>

      <div className="flex items-center gap-6">
        {/* Left: Donut chart */}
        <div className="w-40 h-40 flex-shrink-0 relative">
          <Doughnut
            ref={chartRef}
            data={chartData}
            options={options}
            plugins={[centerLabelPlugin]}
          />
        </div>

        {/* Right: Custom legend */}
        <div className="flex-1">
          {/* Income */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                isDark ? 'bg-emerald-400' : 'bg-emerald-500'
              }`}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm ${
                    isDark ? 'text-white/60' : 'text-gray-600'
                  }`}
                >
                  Income
                </span>
                <ArrowUpRight
                  size={12}
                  className={isDark ? 'text-emerald-400' : 'text-emerald-500'}
                />
              </div>
              <p
                className={`text-sm font-semibold ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}
              >
                {formatCurrency(totalIncome)}
              </p>
            </div>
          </div>

          {/* Expenses */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                isDark ? 'bg-red-400' : 'bg-red-500'
              }`}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm ${
                    isDark ? 'text-white/60' : 'text-gray-600'
                  }`}
                >
                  Expenses
                </span>
                <ArrowDownRight
                  size={12}
                  className={isDark ? 'text-red-400' : 'text-red-500'}
                />
              </div>
              <p
                className={`text-sm font-semibold ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}
              >
                {formatCurrency(totalExpenses)}
              </p>
            </div>
          </div>

          {/* Savings */}
          <div className="flex items-center gap-3">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                isDark ? 'bg-purple-400' : 'bg-gray-800'
              }`}
            />
            <div className="flex-1">
              <span
                className={`text-sm ${
                  isDark ? 'text-white/60' : 'text-gray-600'
                }`}
              >
                Savings
              </span>
              <p
                className={`text-sm font-semibold ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}
              >
                {formatCurrency(totalSavings)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportOverviewChart;
