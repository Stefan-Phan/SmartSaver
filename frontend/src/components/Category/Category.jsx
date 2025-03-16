import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getCategories,
  addCategory,
  deleteCategory,
} from "../../api/categoryApi";
import { getTransactions } from "../../api/transactionApi";
import "./Category.css";
import {
  FaTachometerAlt,
  FaPlusCircle,
  FaQuestionCircle,
  FaMoneyBillAlt,
  FaListAlt,
  FaUser,
} from "react-icons/fa";

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
    <div>
      <div className="dashboard-links">
        <Link to="/transaction" className="dashboard-link">
          <FaListAlt /> Transaction
        </Link>
        <Link to="/category" className="dashboard-link">
          <FaPlusCircle /> Category
        </Link>
        <Link to="/ask-ai" className="dashboard-link">
          <FaQuestionCircle /> AskAI
        </Link>
        <Link to="/user-profile" className="dashboard-link">
          <FaUser /> UserProfile
        </Link>
        <Link to="/dashboard" className="dashboard-link">
          <FaTachometerAlt /> Dashboard
        </Link>
      </div>
      <div className="category-page-container">
        <div className="category-page-content">
          <div className="category-header">
            <h2 className="category-title">Categories</h2>
          </div>

          {error && <div className="category-error-message">{error}</div>}

          <div className="category-add-form">
            <h3 className="category-add-title">Add New Category</h3>
            <form onSubmit={handleAddCategory} className="category-form">
              <div className="form-control">
                <label htmlFor="categoryName">Category Name</label>
                <input
                  type="text"
                  name="Name"
                  placeholder="Enter category name"
                  value={newCategory.Name}
                  onChange={handleInputChange}
                  className="category-input"
                />
              </div>
              <button type="submit" className="btn">
                Add Category
              </button>
            </form>
          </div>

          {isLoading ? (
            <div className="loading-container">Loading categories...</div>
          ) : (
            <div className="category-table-container">
              <table className="category-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Usage Count</th>
                    <th>Total Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="no-categories">
                        No categories found. Add your first category above.
                      </td>
                    </tr>
                  ) : (
                    categories.map((category) => (
                      <tr key={category.ID}>
                        <td>{category.Name}</td>
                        <td>
                          {categoryUsage[category.ID]?.count || 0}{" "}
                          transaction(s)
                        </td>
                        <td>
                          $
                          {categoryUsage[category.ID]?.total?.toFixed(2) ||
                            "0.00"}
                        </td>
                        <td>
                          <button
                            onClick={() => handleDeleteCategory(category.ID)}
                            className="delete-category-button"
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
    </div>
  );
}

export default CategoryPage;
