"use client";

import { useState, useEffect } from "react";

// Icons
import { Plus } from "lucide-react";

// Types
import { Category } from "@/types/Category";
import { Transaction } from "@/types/Transaction";

// Components
import AddCategoryModal from "../components/category/AddCategoryModal";
import EditCategoryModal from "../components/category/EditCategoryModal";

// API Functions
import {
  getCategories as fetchCategoriesApi,
  addCategory as addCategoryApi,
  deleteCategory as deleteCategoryApi,
  updateCategory as updateCategoryApi,
  getTotalWeeklyLimit,
} from "@/lib/api/categoryAPI";
import { getTransactions as fetchTransactionsApi } from "@/lib/api/transactionAPI";
import CategoryLimitChart from "../components/category/CategoryLimitChart";
import CategoryList from "../components/category/CategoryList";

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

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

  return (
    <div className="container mx-auto py-8 max-w-7xl">
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

        <CategoryList
          categories={categories}
          categoryUsage={categoryUsage}
          isLoading={isLoading}
          error={error}
          onDelete={handleDeleteCategory}
          onEdit={handleOpenEditModal}
        />
      </div>
    </div>
  );
}
