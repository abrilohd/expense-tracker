/**
 * SparklineChart Component - Minimal inline trend visualization
 * Tiny chart for showing trends in stat cards
 */
import { useRef, useEffect } from 'react';
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SPARKLINE CHART COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SparklineChartProps {
  data: number[];
  color: string;
  height?: number;
}

const SparklineChart = ({ data, color, height = 40 }: SparklineChartProps) => {
  const chartRef = useRef<ChartJS<'line'>>(null);

  // Create gradient
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const ctx = chart.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, `${color}33`); // 20% opacity
    gradient.addColorStop(1, `${color}00`); // 0% opacity

    chart.data.datasets[0].backgroundColor = gradient;
    chart.update('none');
  }, [color, height]);

  // Chart data
  const chartData = {
    labels: data.map((_, i) => i.toString()),
    datasets: [
      {
        data: data,
        borderColor: color,
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: true,
        tension: 0.4,
        backgroundColor: `${color}33`, // Will be replaced by gradient
      },
    ],
  };

  // Chart options - minimal, no interaction
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    events: [], // Disable all events
    animation: false, // No animation for sparklines
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
    elements: {
      point: {
        radius: 0,
      },
    },
  };

  return (
    <div style={{ width: '100%', height: `${height}px` }}>
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default SparklineChart;
