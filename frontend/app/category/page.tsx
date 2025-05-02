"use client";

import React, { useState, useEffect } from "react";
import {
  getCategories as fetchCategoriesApi,
  addCategory as addCategoryApi,
  deleteCategory as deleteCategoryApi,
} from "@/lib/api/categoryAPI";
import { getTransactions as fetchTransactionsApi } from "@/lib/api/transactionAPI";
import { Category } from "@/types/Category";
import { Transaction } from "@/types/Transaction";
import { Plus } from "lucide-react";

// Import components (you'll need to create these)
import AddCategoryModal from "../components/category/AddCategoryModal";
import Pagination from "../components/transaction/Pagination";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

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

  useEffect(() => {
    // Calculate total pages whenever categories change
    setTotalPages(Math.ceil(categories.length / categoriesPerPage));
    // Reset to first page when categories change
    setCurrentPage(1);
  }, [categories, categoriesPerPage]);

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

  const handleAddCategory = async (categoryData: any) => {
    try {
      await addCategoryApi(token, categoryData);
      fetchCategories();
      setIsModalOpen(false);
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

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

  // Get current categories for pagination
  const getCurrentCategories = () => {
    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    return categories.slice(indexOfFirstCategory, indexOfLastCategory);
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddCategory}
      />

      {/* Category List */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-center text-indigo-600">
            CATEGORIES
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            <Plus size={18} className="mr-2" />
            Add Category
          </button>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              No categories found
            </div>
          ) : (
            <div className="overflow-hidden rounded-t-2xl shadow-lg bg-white">
              <table className="min-w-full text-sm text-left text-gray-600">
                <thead className="bg-white border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-purple-600 uppercase">
                      Category
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-purple-600 uppercase">
                      Usage Count
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-purple-600 uppercase">
                      Total Amount
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-purple-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {getCurrentCategories().map((category) => (
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
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
                          disabled={categoryUsage[category.ID]?.count > 0}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={categories.length}
          itemsPerPage={categoriesPerPage}
        />
      </div>
    </div>
  );
};

export default CategoryPage;
