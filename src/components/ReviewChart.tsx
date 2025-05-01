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
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ReviewData {
  month: string;
  average_rating: number;
  review_count: number;
}

interface ReviewChartProps {
  data: ReviewData[];
}

export default function ReviewChart({ data }: ReviewChartProps) {
  const chartData = {
    labels: data.map((d) =>
      new Date(d.month).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    ),
    datasets: [
      {
        label: "Average Rating",
        data: data.map((d) => d.average_rating),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Review Trends",
      },
    },
    scales: {
      y: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <Line data={chartData} options={options} />
    </div>
  );
}
