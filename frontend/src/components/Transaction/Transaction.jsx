import React, { useState, useEffect } from "react";
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
  getCategories,
} from "../../api/transactionApi";
import { getIncomes, addIncome, deleteIncome } from "../../api/incomeApi";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaPlusCircle,
  FaQuestionCircle,
  FaMoneyBillAlt,
  FaTrashAlt,
  FaListAlt,
  FaUser,
} from "react-icons/fa";
import "./Transaction.css";

function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [combinedEntries, setCombinedEntries] = useState([]);

  const [newTransaction, setNewTransaction] = useState({
    Name: "",
    Amount: "",
    CategoryName: "",
  });

  const [newIncome, setNewIncome] = useState({
    Source: "",
    Amount: "",
    Notes: "",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    try {
      const transactionsData = await getTransactions(token);
      const incomesData = await getIncomes(token);
      const categoriesData = await getCategories(token);

      setTransactions(transactionsData);
      setIncomes(incomesData);
      setCategories(categoriesData);

      const combined = [...transactionsData, ...incomesData];

      const sortedEntries = combined.sort((a, b) => {
        return new Date(b.CreatedAt) - new Date(a.CreatedAt);
      });

      setCombinedEntries(sortedEntries);

      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e, setter) => {
    setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      const selectedCategory = categories.find(
        (cat) => cat.Name === newTransaction.CategoryName
      );
      if (!selectedCategory) return setError("Selected category not found.");
      await addTransaction(token, {
        ...newTransaction,
        CategoryID: selectedCategory.ID,
      });
      fetchData();
      setNewTransaction({
        Name: "",
        Amount: "",
        CategoryName: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddIncome = async (e) => {
    e.preventDefault();
    try {
      await addIncome(newIncome, token);
      fetchData();
      setNewIncome({
        Source: "",
        Amount: "",
        Notes: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction(token, id);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteIncome = async (id) => {
    try {
      await deleteIncome(id, token);
      fetchData();
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
      <div className="finance-page-container">
        <h3 className="finance-page-title">Finance Overview</h3>
        <ul className="list">
          {combinedEntries.map((item) => (
            <li key={item.ID} className={item.Source ? "plus" : "minus"}>
              {item.Name || item.Source}{" "}
              <span>${Math.abs(item.Amount).toFixed(2)}</span>
              <FaTrashAlt
                className="delete-btn"
                onClick={() =>
                  item.Source
                    ? handleDeleteIncome(item.ID)
                    : handleDeleteTransaction(item.ID)
                }
              >
                x
              </FaTrashAlt>
            </li>
          ))}
        </ul>
        {error && <div className="finance-error-message">{error}</div>}
        <div className="finance-forms">
          <div className="transaction-form">
            <h3>Add New Expense</h3>
            <form onSubmit={handleAddTransaction}>
              <div className="form-control">
                <label>Name</label>
                <input
                  type="text"
                  name="Name"
                  placeholder="Enter name..."
                  value={newTransaction.Name}
                  onChange={(e) => handleInputChange(e, setNewTransaction)}
                />
              </div>
              <div className="form-control">
                <label>Amount</label>
                <input
                  type="number"
                  name="Amount"
                  placeholder="Enter amount..."
                  value={newTransaction.Amount}
                  onChange={(e) => handleInputChange(e, setNewTransaction)}
                />
              </div>
              <div className="form-control">
                <label>Category</label>
                <select
                  name="CategoryName"
                  value={newTransaction.CategoryName}
                  onChange={(e) => handleInputChange(e, setNewTransaction)}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.ID} value={category.Name}>
                      {category.Name}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn">
                Add Expense
              </button>
            </form>
          </div>
          <div className="income-form">
            <h3>Add New Income</h3>
            <form onSubmit={handleAddIncome}>
              <div className="form-control">
                <label>Source</label>
                <input
                  type="text"
                  name="Source"
                  placeholder="Enter source..."
                  value={newIncome.Source}
                  onChange={(e) => handleInputChange(e, setNewIncome)}
                />
              </div>
              <div className="form-control">
                <label>Amount</label>
                <input
                  type="number"
                  name="Amount"
                  placeholder="Enter amount..."
                  value={newIncome.Amount}
                  onChange={(e) => handleInputChange(e, setNewIncome)}
                />
              </div>
              <button type="submit" className="btn">
                Add Income
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionPage;
