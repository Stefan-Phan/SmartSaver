"use client";

import { useState, useEffect } from "react";

// Icons
import { Plus, Edit } from "lucide-react"; // Import the Edit icon

// Types
import { Category } from "@/types/Category";
import { Transaction } from "@/types/Transaction";

// Components
import AddCategoryModal from "../components/category/AddCategoryModal";
import EditCategoryModal from "../components/category/EditCategoryModal"; // Import the new modal
import Pagination from "../components/transaction/Pagination";
import CategoryRow from "../components/category/CategoryRow";

// API Functions
import {
  getCategories as fetchCategoriesApi,
  addCategory as addCategoryApi,
  deleteCategory as deleteCategoryApi,
  updateCategory as updateCategoryApi, // Import the update API function
  getTotalWeeklyLimit,
} from "@/lib/api/categoryAPI";
import { getTransactions as fetchTransactionsApi } from "@/lib/api/transactionAPI";
import CategoryLimitChart from "../components/category/CategoryLimitChart";

export default function CategoryPage() {
  // State
  const [token, setToken] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categoryUsage, setCategoryUsage] = useState<{
    [categoryId: number]: { count: number; total: number };
  }>({});

  const [totalWeeklyLimit, setTotalWeeklyLimit] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for edit modal
  const [editingCategory, setEditingCategory] = useState<Category | null>(null); // State for the category being edited

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // Initial token load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  // Fetch data after token is set
  useEffect(() => {
    if (token) {
      fetchCategories();
      fetchTransactions();
      fetchTotalWeeklyLimit();
    }
  }, [token]);

  // Calculate usage after data is loaded
  useEffect(() => {
    if (transactions.length && categories.length) {
      calculateCategoryUsage();
    }
    setIsLoading(false);
  }, [transactions, categories]);

  // Update pagination when categories change
  useEffect(() => {
    setTotalPages(Math.ceil(categories.length / categoriesPerPage));
    setCurrentPage(1);
  }, [categories, categoriesPerPage]);

  // API Calls
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
      setIsLoading(true);
      const data = await fetchTransactionsApi(token);
      setTransactions(data);
    } catch (err: any) {
      console.error("Error fetching transactions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTotalWeeklyLimit = async () => {
    try {
      setIsLoading(true);
      const total = await getTotalWeeklyLimit(token);
      setTotalWeeklyLimit(total);
    } catch (err: any) {
      console.error("Error fetching total weekly limit:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCategoryUsage = () => {
    const usage: { [categoryId: number]: { count: number; total: number } } =
      {};

    transactions.forEach((tx) => {
      const amount = parseFloat(tx.Amount);
      if (usage[tx.CategoryID]) {
        usage[tx.CategoryID].count += 1;
        usage[tx.CategoryID].total += amount;
      } else {
        usage[tx.CategoryID] = { count: 1, total: amount };
      }
    });

    setCategoryUsage(usage);
  };

  // Event Handlers
  const handleAddCategory = async (categoryData: any) => {
    try {
      await addCategoryApi(token, categoryData);
      fetchCategories();
      fetchTotalWeeklyLimit();
      setIsAddModalOpen(false);
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleOpenEditModal = (category: Category) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditingCategory(null);
    setIsEditModalOpen(false);
  };

  const handleUpdateCategory = async (categoryData: Category) => {
    if (!editingCategory) return;
    try {
      await updateCategoryApi(token, editingCategory.ID, categoryData);
      fetchCategories();
      fetchTotalWeeklyLimit();
      handleCloseEditModal();
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
      fetchTotalWeeklyLimit();
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
      <div className="mb-4 text-right text-indigo-700 font-semibold">
        Total Weekly Limit: ${totalWeeklyLimit}
      </div>

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCategory}
      />

      {/* Edit Category Modal */}
      {editingCategory && (
        <EditCategoryModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onUpdate={handleUpdateCategory}
          category={editingCategory}
        />
      )}

      {/* Category Limit Chart */}
      {categories.length > 0 && totalWeeklyLimit !== null && (
        <CategoryLimitChart
          categories={categories}
          totalWeeklyLimit={totalWeeklyLimit}
        />
      )}

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
            onClick={() => setIsAddModalOpen(true)}
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
                      Weekly Limit
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
                    <CategoryRow
                      key={category.ID}
                      category={category}
                      usage={
                        categoryUsage[category.ID] || { count: 0, total: 0 }
                      }
                      onDelete={handleDeleteCategory}
                      onEdit={handleOpenEditModal}
                    />
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
}
