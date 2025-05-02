"use client";

import React, { useState, useEffect } from "react";
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getCategories,
} from "../../lib/api/transactionAPI";

import { Transaction } from "@/types/Transaction";
import { Category } from "@/types/Category";

interface NewTransaction {
  Name: string;
  Amount: string;
  CategoryName: string;
  Type: "income" | "expense";
  CreatedAt?: string;
}

function TransactionPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState<NewTransaction>({
    Name: "",
    Amount: "",
    CategoryName: "",
    Type: "expense",
  });
  const [token, setToken] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactionDate, setTransactionDate] = useState<string>("");

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

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions(token);
      setTransactions(data);
      setError("");
    } catch (error: any) {
      setError(error.message || "Failed to fetch transactions");
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories(token);
      setCategories(data);
      setError("");
    } catch (error: any) {
      setError(error.message || "Failed to fetch categories");
      console.log(error);
    }
  };

  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return "Uncategorized";
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
      // Prepare transaction data with date if provided
      const transactionData = {
        ...newTransaction,
        CreatedAt: transactionDate || undefined,
      };

      await addTransaction(token, transactionData);
      fetchTransactions();
      setNewTransaction({
        Name: "",
        Amount: "",
        CategoryName: "",
        Type: "expense",
      });
      setTransactionDate("");
      setError("");
    } catch (error: any) {
      setError(error.message || "Failed to add transaction");
      console.log(error);
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    try {
      await deleteTransaction(token, id);
      fetchTransactions();
      setError("");
    } catch (error: any) {
      setError(error.message || "Failed to delete transaction");
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h2 className="text-2xl font-bold text-center mb-6">Transactions</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium mb-3">Add New Transaction</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              Type
            </label>
            <select
              name="Type"
              value={newTransaction.Type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {newTransaction.Type === "expense" && (
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
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date (Optional)
            </label>
            <input
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={handleAddTransaction}
            disabled={
              !newTransaction.Name ||
              !newTransaction.Amount ||
              (newTransaction.Type === "expense" &&
                !newTransaction.CategoryName)
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Add Transaction
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-medium mb-4">Transaction History</h3>
        <div className="overflow-x-auto">
          {transactions.length === 0 ? (
            <div className="px-6 py-4 text-center text-gray-500">
              No transactions found
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.ID}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.Name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.Type.toLocaleLowerCase() === "income"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.Type.toLocaleLowerCase() === "income"
                          ? "Income"
                          : "Expense"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.Type.toLocaleLowerCase() === "income"
                        ? "Income"
                        : getCategoryName(transaction.CategoryID)}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap font-medium ${
                        transaction.Type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.Type === "income" ? "+" : "-"}$
                      {parseFloat(transaction.Amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.CreatedAt
                        ? new Date(transaction.CreatedAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDeleteTransaction(transaction.ID)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionPage;
