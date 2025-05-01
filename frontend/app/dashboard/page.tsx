"use client";

import React, { useState, useEffect } from "react";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { getCategories, getIncomes, getTransactions } from "@/lib/api/getInfo";

Chart.register(ArcElement, Tooltip, Legend);

interface Transaction {
  ID: number;
  CategoryID: number;
  Name: string;
  Amount: string;
  Date: string;
}

interface Category {
  ID: number;
  Name: string;
}

interface Income {
  ID: number;
  Amount: string;
  Date: string;
  Description: string;
}

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
  }[];
}

const DashboardPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [token, setToken] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [selectedCategoryTransactions, setSelectedCategoryTransactions] =
    useState<Transaction[]>([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState<
    string | null
  >(null);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [incomeTotal, setIncomeTotal] = useState<number>(0);
  const [expenseTotal, setExpenseTotal] = useState<number>(0);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchTransactions();
      fetchCategories();
      fetchIncomes();
    }
  }, [token]);

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

  const fetchIncomes = async () => {
    try {
      const data = await getIncomes(token);
      setIncomes(data);
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (transactions.length > 0 && categories.length > 0) {
      const categoryTotals: { [key: string]: number } = {};
      transactions.forEach((transaction) => {
        const category = categories.find(
          (cat) => cat.ID === transaction.CategoryID
        );
        if (category) {
          if (!categoryTotals[category.Name]) {
            categoryTotals[category.Name] = 0;
          }
          categoryTotals[category.Name] += parseFloat(transaction.Amount);
        }
      });

      const labels = Object.keys(categoryTotals);
      const data = Object.values(categoryTotals);
      const backgroundColors = labels.map(
        () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
      );

      setChartData({
        labels,
        datasets: [
          {
            data,
            backgroundColor: backgroundColors,
          },
        ],
      });
    }
  }, [transactions, categories]);

  useEffect(() => {
    const incomeSum = incomes.reduce(
      (acc, income) => acc + parseFloat(income.Amount),
      0
    );
    const expenseSum = transactions.reduce(
      (acc, transaction) => acc + parseFloat(transaction.Amount),
      0
    );

    setIncomeTotal(incomeSum);
    setExpenseTotal(expenseSum);
    setTotalBalance(incomeSum - expenseSum);
  }, [incomes, transactions]);

  const handleSliceClick = (event: any, elements: any[]) => {
    if (elements.length > 0) {
      const clickedIndex = elements[0].index;
      const categoryName = chartData?.labels[clickedIndex];
      setSelectedCategoryName(categoryName || null);
      const selectedCategory = categories.find(
        (cat) => cat.Name === categoryName
      );
      if (selectedCategory) {
        const filteredTransactions = transactions.filter(
          (trans) => trans.CategoryID === selectedCategory.ID
        );
        setSelectedCategoryTransactions(filteredTransactions);
      } else {
        setSelectedCategoryTransactions([]);
      }
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="container mx-auto p-4">
        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}
          <div className="bg-white shadow-sm rounded-md p-4 mb-4">
            <h4 className="text-lg font-semibold mb-2">Your Balance</h4>
            <h1
              id="balance"
              className={`text-3xl font-bold ${
                totalBalance >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              ${totalBalance.toFixed(2)}
            </h1>
          </div>
          <div className="bg-white shadow-sm rounded-md p-4 mb-4 flex justify-around">
            <div className="text-center">
              <h4 className="text-md font-semibold uppercase text-gray-600">
                Income
              </h4>
              <p className="text-xl font-bold text-green-500">
                +${incomeTotal.toFixed(2)}
              </p>
            </div>
            <div className="text-center border-l border-gray-300 pl-4">
              <h4 className="text-md font-semibold uppercase text-gray-600">
                Expense
              </h4>
              <p className="text-xl font-bold text-red-500">
                -${expenseTotal.toFixed(2)}
              </p>
            </div>
          </div>
          {chartData && (
            <div className="rounded-md shadow-sm p-4 mb-4">
              <Pie data={chartData} options={{ onClick: handleSliceClick }} />
            </div>
          )}
          {selectedCategoryTransactions.length > 0 && (
            <div className="bg-white shadow-md rounded-md p-6 mt-6">
              <h3 className="text-xl font-semibold mb-4">
                Transactions for {selectedCategoryName}
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full leading-normal">
                  <tbody>
                    {selectedCategoryTransactions.map((t) => (
                      <tr
                        key={t.ID}
                        className={`border-b border-gray-200 ${"text-green-500"}`}
                      >
                        <td className="px-5 py-3 text-sm">{t.Name}</td>
                        <td className="px-5 py-3 text-sm">
                          ${parseFloat(t.Amount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
