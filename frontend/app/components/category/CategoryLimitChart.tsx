// CategoryLimitChart.js
"use client";

import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

// Types
import { Category } from "@/types/Category";

interface CategoryLimitChartProps {
  categories: Category[];
  totalWeeklyLimit: number | null;
}

const CategoryLimitChart: React.FC<CategoryLimitChartProps> = ({
  categories,
  totalWeeklyLimit,
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (
      chartRef.current &&
      categories.length > 0 &&
      totalWeeklyLimit !== null
    ) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const categoryLabels = categories.map((cat) => cat.Name);
      const categoryLimits = categories.map((cat) => cat.WeeklyLimit);

      const newChartInstance = new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: [...categoryLabels, "Total"],
          datasets: [
            {
              label: "Weekly Limit",
              data: [...categoryLimits, totalWeeklyLimit],
              backgroundColor: [
                ...categories.map(
                  (_, index) => `rgba(75, 192, 192, 0.${(index + 3) * 10})`
                ), // Varying shades of teal
                "rgba(153, 102, 255, 0.7)", // Highlight total
              ],
              borderColor: [
                ...categories.map((_, index) => `rgba(75, 192, 192, 1)`),
                "rgba(153, 102, 255, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Weekly Limit ($)",
                color: "#777",
              },
              grid: {
                color: "#eee",
              },
              ticks: {
                color: "#555",
                font: {
                  size: 12,
                },
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: "#555",
                font: {
                  size: 12,
                },
              },
            },
          },
          plugins: {
            legend: {
              display: false, // Hide the legend as there's only one dataset
            },
            title: {
              display: true,
              text: "Category Weekly Limits vs. Total Weekly Limit",
              font: {
                size: 16,
              },
              color: "#333",
              padding: {
                bottom: 10,
              },
            },
            tooltip: {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              titleColor: "#fff",
              bodyColor: "#fff",
              borderColor: "#ddd",
              borderWidth: 1,
              callbacks: {
                label: (context) => {
                  let label = context.dataset.label || "";
                  if (context.parsed.y !== null) {
                    label += `: $${context.parsed.y.toFixed(2)}`;
                  }
                  return label;
                },
              },
            },
          },
        },
      });
      chartInstance.current = newChartInstance;
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [categories, totalWeeklyLimit]);

  return (
    <div className="mb-6 bg-white rounded-lg shadow-md p-4 border border-gray-100">
      <canvas ref={chartRef} style={{ maxHeight: "300px" }} />
    </div>
  );
};

export default CategoryLimitChart;
