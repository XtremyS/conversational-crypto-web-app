import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PriceData {
  prices: [number, number][];
}

interface PriceChartProps {
  data: PriceData;
}

const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  const chartData = {
    labels: data.prices.map(([time]) => new Date(time).toLocaleDateString()),
    datasets: [
      {
        label: "Price (USD)",
        data: data.prices.map(([, price]) => price),
        borderColor: "#5B21B6",
        backgroundColor: "rgba(91, 33, 182, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="p-4 bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-700/50 animate-fadeIn">
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: "#E5E7EB",
              },
            },
            tooltip: {
              backgroundColor: "#1F2937",
              titleColor: "#E5E7EB",
              bodyColor: "#E5E7EB",
            },
          },
          scales: {
            x: {
              ticks: {
                color: "#9CA3AF",
              },
              grid: {
                color: "#374151",
              },
            },
            y: {
              ticks: {
                color: "#9CA3AF",
              },
              grid: {
                color: "#374151",
              },
            },
          },
        }}
        height={300}
      />
    </div>
  );
};

export default PriceChart;
