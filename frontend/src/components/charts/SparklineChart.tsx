/**
 * Sparkline Chart - Mosaic-inspired mini chart
 * Tiny inline chart for use inside stat cards
 */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler);

interface SparklineChartProps {
  data: number[];
  color: string;
  height?: number;
  isPositive?: boolean;
}

const SparklineChart = ({ data, color, height = 40, isPositive }: SparklineChartProps) => {
  // Prepare chart data
  const chartData = {
    labels: data.map((_, index) => index.toString()),
    datasets: [
      {
        data: data,
        borderColor: color,
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: true,
        tension: 0.4,
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return `${color}40`; // 25% opacity fallback
          }

          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, `${color}40`); // 25% opacity at top
          gradient.addColorStop(1, `${color}00`); // 0% opacity at bottom

          return gradient;
        },
      },
    ],
  };

  // Minimal chart options - no interactions, no plugins
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    events: [], // Disable all interactions
    animation: false, // Instant render
  };

  return (
    <div style={{ width: '80px', height: `${height}px` }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default SparklineChart;
