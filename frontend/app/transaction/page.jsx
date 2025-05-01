"use client";

import React, { useState, useEffect } from "react";
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getCategories,
} from "../../lib/api/transactionAPI";

function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    Name: "",
    Amount: "",
    CategoryName: "",
    Date: new Date().toISOString().split("T")[0],
  });
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);

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
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories(token);
      setCategories(data);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e) => {
    setEditingTransaction({
      ...editingTransaction,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddTransaction = async () => {
    try {
      await addTransaction(token, newTransaction);
      fetchTransactions();
      setNewTransaction({
        Name: "",
        Amount: "",
        CategoryName: "",
        Date: new Date().toISOString().split("T")[0],
      });
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction(token, id);
      fetchTransactions();
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const startEditing = (transaction) => {
    setEditingTransaction({
      ...transaction,
      CategoryName: getCategoryName(transaction.CategoryID),
    });
  };

  const cancelEditing = () => {
    setEditingTransaction(null);
  };

  const saveEdit = async () => {
    try {
      const { ID, CategoryID, ...restOfData } = editingTransaction;

      const category = categories.find(
        (cat) => cat.ID === parseInt(CategoryID)
      );
      if (!category) {
        throw new Error("Selected category not found");
      }

      const updatedTransactionData = {
        ...restOfData,
        CategoryName: category.Name,
        Date: new Date(editingTransaction.Date).toISOString().split("T")[0],
      };

      console.log("Sending to API:", updatedTransactionData);

      await updateTransaction(token, ID, updatedTransactionData);
      fetchTransactions();
      setEditingTransaction(null);
      setError("");
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.ID === categoryId);
    return category ? category.Name : "Unknown";
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="Date"
                value={newTransaction.Date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
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
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.ID} className="hover:bg-gray-50">
                    {editingTransaction &&
                    editingTransaction.ID === transaction.ID ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            name="Name"
                            value={editingTransaction.Name}
                            onChange={handleEditInputChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            name="Amount"
                            value={editingTransaction.Amount}
                            onChange={handleEditInputChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            name="CategoryID"
                            value={editingTransaction.CategoryID}
                            onChange={handleEditInputChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md"
                          >
                            {categories.map((category) => (
                              <option key={category.ID} value={category.ID}>
                                {category.Name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="date"
                            name="Date"
                            value={editingTransaction.Date.split("T")[0]}
                            onChange={handleEditInputChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                          <button
                            onClick={saveEdit}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {transaction.Name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ${parseFloat(transaction.Amount).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getCategoryName(transaction.CategoryID)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatDate(transaction.Date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                          <button
                            onClick={() => startEditing(transaction)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteTransaction(transaction.ID)
                            }
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TransactionPage;
