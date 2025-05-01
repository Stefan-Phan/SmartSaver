"use client";

import React, { useRef, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  Chart,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CategoryBarChartProps {
  categoryTotals: Record<string, number>;
}

const getGradient = (ctx: CanvasRenderingContext2D, chartArea: any) => {
  const gradient = ctx.createLinearGradient(
    0,
    chartArea.bottom,
    0,
    chartArea.top
  );
  gradient.addColorStop(0, "rgba(54, 162, 235, 0.2)");
  gradient.addColorStop(1, "rgba(54, 162, 235, 0.8)");
  return gradient;
};

const CategoryBarChart: React.FC<CategoryBarChartProps> = ({
  categoryTotals,
}) => {
  const chartRef = useRef<Chart<"bar"> | null>(null);

  const labels = Object.keys(categoryTotals);
  const values = Object.values(categoryTotals);

  const chartData: ChartData<"bar"> = {
    labels,
    datasets: [
      {
        label: "Total Amount per Category",
        data: values,
        backgroundColor: (context) => {
          const chart = chartRef.current;
          if (!chart) return "rgba(54, 162, 235, 0.6)";
          const { ctx, chartArea } = chart;
          if (!chartArea) return;
          return getGradient(ctx, chartArea);
        },
        borderRadius: 6,
        hoverBackgroundColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Total Spending by Category",
        color: "#1f2937",
        font: {
          size: 18,
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount ($)",
          color: "#6b7280",
        },
        ticks: {
          color: "#6b7280",
        },
      },
      x: {
        ticks: {
          color: "#6b7280",
        },
      },
    },
  };

  return <Bar ref={chartRef} data={chartData} options={chartOptions} />;
};

export default CategoryBarChart;
