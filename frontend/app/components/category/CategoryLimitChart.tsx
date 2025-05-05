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

  // Function to generate a vibrant color
  const generateColor = (index: number, total: number) => {
    // Use HSL for better color variation and control
    const hue = Math.round((index / total) * 360);
    const saturation = "70%";
    const lightness = "60%";
    return `hsl(${hue}, ${saturation}, ${lightness}, 0.7)`;
  };

  const generateBorderColor = (index: number, total: number) => {
    const hue = Math.round((index / total) * 360);
    const saturation = "80%";
    const lightness = "40%";
    return `hsl(${hue}, ${saturation}, ${lightness}, 1)`;
  };

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
      const allLimits = [...categoryLimits, totalWeeklyLimit];

      const backgroundColors = categories.map((_, index) =>
        generateColor(index, categories.length)
      );
      backgroundColors.push("rgba(153, 102, 255, 0.7)");

      const borderColors = categories.map((_, index) =>
        generateBorderColor(index, categories.length)
      );
      borderColors.push("rgba(153, 102, 255, 1)");

      const newChartInstance = new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: [...categoryLabels, "Total"],
          datasets: [
            {
              label: "Weekly Limit",
              data: allLimits,
              backgroundColor: backgroundColors,
              borderColor: borderColors,
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
              display: false,
            },
            title: {
              display: true,
              text: "Category Weekly Limits vs. Total Weekly Limit",
              font: {
                size: 30,
              },
              color: "#4f39f6",
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
      <canvas ref={chartRef} style={{ minHeight: "400px" }} />
    </div>
  );
};

export default CategoryLimitChart;
