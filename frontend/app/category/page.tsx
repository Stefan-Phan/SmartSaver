"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  getCategories as fetchCategoriesApi,
  addCategory as addCategoryApi,
  deleteCategory as deleteCategoryApi,
} from "@/lib/api/categoryAPI";
import { getTransactions as fetchTransactionsApi } from "@/lib/api/transactionAPI";
import { Category } from "@/types/Category";
import { Transaction } from "@/types/Transaction";

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<{ Name: string }>({
    Name: "",
  });
  const [token, setToken] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categoryUsage, setCategoryUsage] = useState<{
    [categoryId: number]: { count: number; total: number };
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchCategories();
      fetchTransactions();
    }
  }, [token]);

  useEffect(() => {
    if (transactions.length > 0 && categories.length > 0) {
      calculateCategoryUsage();
    }
    setIsLoading(false);
  }, [transactions, categories]);

  const fetchCategories = async () => {
    try {
      const data = await fetchCategoriesApi(token);
      setCategories(data);
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchTransactions = async () => {
    try {
      const data = await fetchTransactionsApi(token);
      setTransactions(data);
    } catch (err: any) {
      console.error("Error fetching transactions:", err);
    }
  };

  const calculateCategoryUsage = () => {
    const usage: { [categoryId: number]: { count: number; total: number } } =
      {};

    transactions.forEach((transaction) => {
      if (usage[transaction.CategoryID]) {
        usage[transaction.CategoryID].count += 1;
        usage[transaction.CategoryID].total += parseFloat(transaction.Amount);
      } else {
        usage[transaction.CategoryID] = {
          count: 1,
          total: parseFloat(transaction.Amount),
        };
      }
    });

    setCategoryUsage(usage);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newCategory.Name.trim()) {
        setError("Category name is required");
        return;
      }

      await addCategoryApi(token, newCategory);
      fetchCategories();
      setNewCategory({ Name: "" });
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      if (categoryUsage[id]?.count > 0) {
        setError(
          `Cannot delete category: it's being used by ${categoryUsage[id].count} transaction(s)`
        );
        return;
      }

      await deleteCategoryApi(token, id);
      fetchCategories();
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium mb-3">Add New Category</h3>
          <form
            onSubmit={handleAddCategory}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name
              </label>
              <input
                type="text"
                name="Name"
                placeholder="Enter category name"
                value={newCategory.Name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Category
              </button>
            </div>
          </form>
        </div>

        {isLoading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading categories...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage Count
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td className="px-6 py-4 text-center text-gray-500">
                      No categories found. Add your first category above.
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.ID} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {category.Name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {categoryUsage[category.ID]?.count || 0} transaction(s)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        $
                        {categoryUsage[category.ID]?.total?.toFixed(2) ||
                          "0.00"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteCategory(category.ID)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
                          disabled={categoryUsage[category.ID]?.count > 0}
                          title={
                            categoryUsage[category.ID]?.count > 0
                              ? "Cannot delete category in use"
                              : "Delete category"
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
