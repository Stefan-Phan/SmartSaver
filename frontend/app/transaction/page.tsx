"use client";

import React, { useState, useEffect } from "react";

// import from api
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
  getCategories,
} from "../../lib/api/transactionAPI";

// import types
import { Transaction } from "@/types/Transaction";
import { Category } from "@/types/Category";

// import icons
import { Plus, Trash2 } from "lucide-react";

// import components
import AddTransactionModal from "../components/transaction/AddTransactionModal";
import Pagination from "../components/transaction/Pagination";

function TransactionPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [token, setToken] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

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
    // Calculate total pages whenever transactions change
    setTotalPages(Math.ceil(transactions.length / transactionsPerPage));
    // Reset to first page when transactions change
    setCurrentPage(1);
  }, [transactions, transactionsPerPage]);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions(token);
      setTransactions(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories(token);
      setCategories(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return "Uncategorized";
    const category = categories.find((cat) => cat.ID === categoryId);
    return category ? category.Name : "Unknown";
  };

  const handleDeleteTransaction = async (id: number) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      await deleteTransaction(token, id);
      fetchTransactions();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddTransaction = async (transactionData: any) => {
    try {
      await addTransaction(token, transactionData);
      fetchTransactions();
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Get current transactions for pagination
  const getCurrentTransactions = () => {
    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction =
      indexOfLastTransaction - transactionsPerPage;
    return transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  };

  // Format amount for display
  const formatAmount = (amount: string) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(amount));
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTransaction}
        categories={categories}
      />

      {/* Transaction List */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-center text-indigo-600">
            TRANSACTIONS
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500  transition-colors cursor-pointer"
          >
            <Plus size={18} className="mr-2" />
            Add Transaction
          </button>
        </div>

        <div className="overflow-x-auto">
          {transactions.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
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
                {getCurrentTransactions().map((transaction) => (
                  <tr
                    key={transaction.ID}
                    className="hover:bg-gray-50 transition-colors"
                  >
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
                        transaction.Type.toLocaleLowerCase() === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.Type.toLocaleLowerCase() === "income"
                        ? "+"
                        : "-"}
                      ${formatAmount(transaction.Amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.CreatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDeleteTransaction(transaction.ID)}
                        className="text-red-600 hover:text-red-900 flex items-center justify-center mx-auto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Controls */}
        {transactions.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={transactions.length}
            itemsPerPage={transactionsPerPage}
          />
        )}
      </div>
    </div>
  );
}

export default TransactionPage;
