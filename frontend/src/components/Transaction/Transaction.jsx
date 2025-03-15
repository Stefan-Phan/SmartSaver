import React, { useState, useEffect } from "react";
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
  getCategories,
} from "../../api/transactionApi";

import {
  FaTachometerAlt,
  FaPlusCircle,
  FaQuestionCircle,
  FaMoneyBillAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Transaction.css";

function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    Name: "",
    Amount: "",
    CategoryName: "",
    Date: new Date().toISOString().split("T")[0],
  });
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);

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

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions(token);
      setTransactions(data);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories(token);
      setCategories(data);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      if (!newTransaction.CategoryName) {
        setError("Please select a category.");
        return;
      }

      const selectedCategory = categories.find(
        (cat) => cat.Name === newTransaction.CategoryName
      );

      if (!selectedCategory) {
        setError("Selected category not found.");
        return;
      }

      const transactionToSave = {
        ...newTransaction,
        CategoryID: selectedCategory.ID,
      };

      await addTransaction(token, transactionToSave);
      fetchTransactions();
      setNewTransaction({
        Name: "",
        Amount: "",
        CategoryName: "",
        Date: new Date().toISOString().split("T")[0],
      });
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction(token, id);
      fetchTransactions();
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="transaction-page-container">
      <div className="transaction-page-content">
        <h3 className="transaction-page-title">Expense History</h3>
        <ul id="list" className="list">
          {transactions.map((transaction) => (
            <li
              key={transaction.ID}
              className={transaction.Amount > 0 ? "minus" : "plus"}
            >
              {transaction.Name}{" "}
              <span>
                {transaction.Amount < 0 ? "-" : "+"}$
                {Math.abs(parseFloat(transaction.Amount).toFixed(2))}
              </span>
              <button
                className="delete-btn"
                onClick={() => handleDeleteTransaction(transaction.ID)}
              >
                x
              </button>
            </li>
          ))}
        </ul>

        {error && <div className="transaction-error-message">{error}</div>}

        <div className="transaction-add-form">
          <h3 className="transaction-add-title">Add New Transaction</h3>
          <form id="form" onSubmit={handleAddTransaction}>
            <div className="form-control">
              <label htmlFor="text">Text</label>
              <input
                type="text"
                id="text"
                name="Name"
                placeholder="Enter text..."
                value={newTransaction.Name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-control">
              <label htmlFor="amount">
                Amount <br />
              </label>
              <input
                type="number"
                id="amount"
                name="Amount"
                placeholder="Enter amount..."
                value={newTransaction.Amount}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-control">
              <label className="transaction-form-label">Category</label>
              <select
                name="CategoryName"
                value={newTransaction.CategoryName}
                onChange={handleInputChange}
                className="transaction-form-select"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.ID} value={category.Name}>
                    {category.Name}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn" type="submit">
              Add transaction
            </button>
          </form>
        </div>
      </div>
      <div className="transaction-links">
        <Link to="/category" className="transaction-link">
          <FaPlusCircle /> Add more category
        </Link>
        <Link to="/ask-ai" className="transaction-link">
          <FaQuestionCircle /> AskAI
        </Link>
        <Link to="/income" className="transaction-link">
          <FaMoneyBillAlt /> Income
        </Link>
        <Link to="/dashboard" className="transaction-link">
          <FaTachometerAlt /> Dashboard
        </Link>
      </div>
    </div>
  );
}

export default TransactionPage;
