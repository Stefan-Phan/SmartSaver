import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getCategories,
  addCategory,
  deleteCategory,
} from "../../api/categoryApi";
import { getTransactions } from "../../api/transactionApi";

function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    Name: "",
  });
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [categoryUsage, setCategoryUsage] = useState({});
  const [isLoading, setIsLoading] = useState(true);

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
      const data = await getCategories(token);
      setCategories(data);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions(token);
      setTransactions(data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  const calculateCategoryUsage = () => {
    const usage = {};

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

  const handleInputChange = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      if (!newCategory.Name.trim()) {
        setError("Category name is required");
        return;
      }

      await addCategory(token, newCategory);
      fetchCategories();
      setNewCategory({
        Name: "",
      });
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      // Check if category is in use by any transactions
      if (categoryUsage[id] && categoryUsage[id].count > 0) {
        setError(
          `Cannot delete category: it's being used by ${categoryUsage[id].count} transaction(s)`
        );
        return;
      }

      await deleteCategory(token, id);
      fetchCategories();
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/dashboard"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Back to dashboard
          </Link>
          <h2 className="text-2xl font-bold">Categories</h2>

          <Link
            to="/transaction"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Back to Transactions
          </Link>
        </div>

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
            <div className="spinner-border text-blue-500" role="status">
              <span className="sr-only">Loading...</span>
            </div>
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
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-gray-500"
                    >
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
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none"
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
}

export default CategoryPage;
