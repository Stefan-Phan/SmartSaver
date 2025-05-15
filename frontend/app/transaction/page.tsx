"use client";

import React, { useState, useEffect } from "react";

// import from api
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
  getCategories,
} from "../../lib/api/transactionAPI";

// import socket
import { initSocket, getSocket } from "@/lib/socket/socket";

// import types
import { Transaction } from "@/types/Transaction";
import { Category } from "@/types/Category";

// import icons
import { Plus } from "lucide-react";

// import components
import AddTransactionModal from "../components/transaction/AddTransactionModal";
import Pagination from "../components/transaction/Pagination";
import TransactionItem from "../components/transaction/TransactionItem";

function TransactionPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [token, setToken] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Edit transactions
  const [transactionToEdit, setTransactionToEdit] =
    useState<Transaction | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

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
    setTotalPages(Math.ceil(transactions.length / transactionsPerPage));
  }, [transactions, transactionsPerPage]);

  useEffect(() => {
    if (token) {
      fetchTransactions();
      fetchCategories();

      const socket = initSocket();
      socket.on("budgetAlert", (data) => {
        alert(data.message);
      });

      return () => {
        socket.off("budgetAlert");
      };
    }
  }, [token]);

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

  const handleDeleteTransaction = async (id: number) => {
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
            <div className="overflow-hidden rounded-t-2xl shadow-lg bg-white">
              <table className="min-w-full text-sm text-left text-gray-600">
                <thead className="bg-white border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-purple-600 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-purple-600 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-purple-600 uppercase">
                      Category
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-purple-600 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-purple-600 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-purple-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {getCurrentTransactions().map((t, i) => (
                    <TransactionItem
                      key={t.ID}
                      t={t}
                      handleDeleteTransaction={handleDeleteTransaction}
                      openUpdateModal={(transaction) => {
                        setTransactionToEdit(transaction);
                        setIsUpdateModalOpen(true);
                      }}
                    />
                  ))}
                </tbody>
              </table>
            </div>
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
