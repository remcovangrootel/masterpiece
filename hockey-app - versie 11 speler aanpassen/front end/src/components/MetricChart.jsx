import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function MetricChart({ data, metric }) {
  const labels = data.map(d => d.name);
  const values = data.map(d => Number(d.avg_metric ?? 0));

  const chartData = {
    labels,
    datasets: [
      {
        label: `Gemiddelde ${metric}`,
        data: values,
        backgroundColor: '#2b8a3e'
      }
    ]
  };

  const options = {
    scales: { y: { min: 0, max: 5, ticks: { stepSize: 1 } } },
    plugins: { legend: { display: true } }
  };

  return <Bar data={chartData} options={options} />;
}
