"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Category } from "@/types/Category";

interface NewTransaction {
  Name: string;
  Amount: string;
  CategoryName: string;
  Type: "income" | "expense";
  CreatedAt?: string;
}

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: NewTransaction) => void;
  categories: Category[];
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  categories,
}) => {
  const [newTransaction, setNewTransaction] = useState<NewTransaction>({
    Name: "",
    Amount: "",
    CategoryName: "",
    Type: "expense",
  });
  const [transactionDate, setTransactionDate] = useState<string>("");

  useEffect(() => {
    // Set the initial value of transactionDate to today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];
    setTransactionDate(today);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const transactionData = {
      ...newTransaction,
      CreatedAt: transactionDate || undefined,
    };

    onAdd(transactionData);

    // Reset form
    setNewTransaction({
      Name: "",
      Amount: "",
      CategoryName: "",
      Type: "expense",
    });
    setTransactionDate("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-100/75 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <h3 className="text-xl font-medium mb-6 text-indigo-600">
          Add a new tsransaction
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                name="Amount"
                placeholder="0.00"
                value={newTransaction.Amount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                required
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                required
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  required={newTransaction.Type === "expense"}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                !newTransaction.Name ||
                !newTransaction.Amount ||
                (newTransaction.Type === "expense" &&
                  !newTransaction.CategoryName)
              }
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
