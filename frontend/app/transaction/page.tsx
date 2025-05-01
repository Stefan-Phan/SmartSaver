"use client";

import React, { useState, useEffect } from "react";
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getCategories,
} from "../../lib/api/transactionAPI";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import TransactionItem from "../components/transaction/TransactionItem";

import { Transaction } from "@/types/Transaction";
import { Category } from "@/types/Category";
import CategoryBarChart from "../components/transaction/CategoryBarChart";

interface NewTransaction {
  Name: string;
  Amount: string;
  CategoryName: string;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function TransactionPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState<NewTransaction>({
    Name: "",
    Amount: "",
    CategoryName: "",
  });
  const [token, setToken] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>(
    {}
  );
  const [totalAmount, setTotalAmount] = useState<number>(0);

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
    }
  }, [token]);

  useEffect(() => {
    const totals: Record<string, number> = {};
    let total = 0;
    transactions.forEach((transaction) => {
      const categoryName = getCategoryName(transaction.CategoryID);
      totals[categoryName] =
        (totals[categoryName] || 0) + parseFloat(transaction.Amount);
      total += parseFloat(transaction.Amount);
    });
    setCategoryTotals(totals);
    setTotalAmount(total);
  }, [transactions, categories]);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions(token);
      setTransactions(data);
      setError("");
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories(token);
      setCategories(data);
      setError("");
    } catch (error) {
      console.log(error);
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((cat) => cat.ID === categoryId);
    return category ? category.Name : "Unknown";
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
  };

  const handleAddTransaction = async () => {
    try {
      await addTransaction(token, newTransaction);
      fetchTransactions();
      setNewTransaction({
        Name: "",
        Amount: "",
        CategoryName: "",
      });
      setError("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    try {
      await deleteTransaction(token, id);
      fetchTransactions();
      setError("");
    } catch (error) {
      console.log(error);
    }
  };

  // Chart data
  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Total Amount per Category",
        data: Object.values(categoryTotals),
        backgroundColor: "rgba(54, 162, 235, 0.8)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Total Spending by Category",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount",
        },
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h2 className="text-2xl font-bold text-center mb-6">Transactions</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <CategoryBarChart categoryTotals={categoryTotals} />
        </div>
      </div>

      {/* Total Amount Card */}
      <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center">
        <h3 className="text-lg font-medium mb-2">Total Transactions Amount</h3>
        <p className="text-3xl font-bold text-blue-600">
          ${totalAmount.toFixed(2)}
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium mb-3">Add New Transaction</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="Name"
              placeholder="Transaction name"
              value={newTransaction.Name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              name="Amount"
              placeholder="0.00"
              value={newTransaction.Amount}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="CategoryName"
              value={newTransaction.CategoryName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.ID} value={category.Name}>
                  {category.Name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={handleAddTransaction}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Transaction
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {transactions.length === 0 ? (
          <div className="px-6 py-4 text-center text-gray-500">
            No transactions found
          </div>
        ) : (
          transactions.map((transaction) => (
            <TransactionItem
              key={transaction.ID}
              transaction={transaction}
              categoryName={getCategoryName(transaction.CategoryID)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TransactionPage;
