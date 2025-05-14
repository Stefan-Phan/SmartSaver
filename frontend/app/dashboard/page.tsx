"use client";

import React, { useState, useEffect } from "react";
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
  ChartData,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// import from api
import {
  getCategories,
  getTransactions,
  getTotalIncome,
  getTotalExpenses,
  getBalance,
  getWeeklyReport,
} from "@/lib/api/transactionAPI";

// import component
import BenefitCards from "../components/dashboard/BenefitCards";

// import types
import { Transaction } from "@/types/Transaction";
import { Category } from "@/types/Category";
import Sidebar from "../components/dashboard/Sidebar";
import { useRouter } from "next/navigation";

interface WeeklyReport {
  weekPeriod: string;
  year: number;
  weekNumber: number;
  totalIncome: number;
  totalExpense: number;
  weeklyBalance: number;
}

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [token, setToken] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [incomeTotal, setIncomeTotal] = useState<number>(0);
  const [expenseTotal, setExpenseTotal] = useState<number>(0);
  const [weeklyReports, setWeeklyReports] = useState<WeeklyReport[]>([]);
  const [chartData, setChartData] = useState<ChartData<"line">>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (token) {
      fetchTransactions();
      fetchCategories();
      fetchFinancialData();
      fetchWeeklyReport();
    }
  }, [token]);

  useEffect(() => {
    if (weeklyReports.length > 0) {
      prepareChartData();
    }
  }, [weeklyReports]);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions(token);
      setTransactions(data);
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories(token);
      setCategories(data);
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchFinancialData = async () => {
    try {
      const [incomeData, expenseData, balanceData] = await Promise.all([
        getTotalIncome(token),
        getTotalExpenses(token),
        getBalance(token),
      ]);

      setIncomeTotal(incomeData || 0);
      setExpenseTotal(expenseData || 0);
      setTotalBalance(balanceData || 0);
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchWeeklyReport = async () => {
    try {
      const data = await getWeeklyReport(token);
      setWeeklyReports(data);
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const prepareChartData = () => {
    // Sort weekly reports by year and week number
    const sortedReports = [...weeklyReports].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.weekNumber - b.weekNumber;
    });

    // Extract labels and data points
    const labels = sortedReports.map((report) => report.weekPeriod);

    const chartDataConfig: ChartData<"line"> = {
      labels,
      datasets: [
        {
          label: "Income",
          data: sortedReports.map((report) => report.totalIncome),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          tension: 0.1,
        },
        {
          label: "Expense",
          data: sortedReports.map((report) => report.totalExpense),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          tension: 0.1,
        },
        {
          label: "Balance",
          data: sortedReports.map((report) => report.weeklyBalance),
          borderColor: "rgb(54, 162, 235)",
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          tension: 0.1,
        },
      ],
    };

    setChartData(chartDataConfig);
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((cat) => cat.ID === categoryId);
    return category ? category.Name : "Unknown";
  };

  return (
    <div className="flex">
      <div className="p-6 w-3/4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <BenefitCards />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Balance Card */}
          <div className="bg-white shadow rounded-lg p-4">
            <h4 className="text-lg font-semibold mb-2">Your Balance</h4>
            <h1
              id="balance"
              className={`text-3xl font-bold ${
                totalBalance >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              ${totalBalance}
            </h1>
          </div>

          {/* Income Card */}
          <div className="bg-white shadow rounded-lg p-4">
            <h4 className="text-md font-semibold uppercase text-gray-600">
              Total Income
            </h4>
            <p className="text-3xl font-bold text-green-500">+${incomeTotal}</p>
          </div>

          {/* Expense Card */}
          <div className="bg-white shadow rounded-lg p-4">
            <h4 className="text-md font-semibold uppercase text-gray-600">
              Total Expense
            </h4>
            <p className="text-3xl font-bold text-red-500">-${expenseTotal}</p>
          </div>
        </div>

        {/* Weekly Report Chart */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            Weekly Financial Report
          </h3>
          {weeklyReports.length > 0 ? (
            <div className="h-64">
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          ) : (
            <p className="text-gray-500">No weekly report data available</p>
          )}
        </div>

        {/* Recent Transactions could go here */}
      </div>
      <Sidebar transactions={transactions} categories={categories} />
    </div>
  );
};

export default DashboardPage;
