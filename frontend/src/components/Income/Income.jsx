// IncomePage.jsx
import React, { useState, useEffect } from "react";
import {
  getIncomes,
  addIncome,
  updateIncome,
  deleteIncome,
} from "../../api/incomeApi";
import { Link } from "react-router-dom";
import "./Income.css";
import {
  FaTachometerAlt,
  FaPlusCircle,
  FaQuestionCircle,
  FaMoneyBillAlt,
} from "react-icons/fa";

function IncomePage() {
  const [incomes, setIncomes] = useState([]);
  const [newIncome, setNewIncome] = useState({
    Source: "",
    Amount: "",
    Date: new Date().toISOString().split("T")[0],
    Notes: "",
  });
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchIncomes();
    }
  }, [token]);

  const fetchIncomes = async () => {
    try {
      const data = await getIncomes(token);
      setIncomes(data);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    setNewIncome({ ...newIncome, [e.target.name]: e.target.value });
  };

  const handleAddIncome = async (e) => {
    e.preventDefault();
    try {
      await addIncome(newIncome, token);
      fetchIncomes();
      setNewIncome({
        Source: "",
        Amount: "",
        Date: new Date().toISOString().split("T")[0],
        Notes: "",
      });
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteIncome = async (id) => {
    try {
      await deleteIncome(id, token);
      fetchIncomes();
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="income-page-container">
      <div className="income-page-content">
        <h3 className="income-page-title">Income History</h3>
        <ul className="list">
          {incomes.map((income) => (
            <li key={income.ID} className="plus">
              {income.Source}{" "}
              <span>+${parseFloat(income.Amount).toFixed(2)}</span>
              <button
                className="delete-btn"
                onClick={() => handleDeleteIncome(income.ID)}
              >
                x
              </button>
            </li>
          ))}
        </ul>

        {error && <div className="income-error-message">{error}</div>}

        <div className="income-add-form">
          <h3 className="income-add-title">Add New Income</h3>
          <form onSubmit={handleAddIncome}>
            <div className="form-control">
              <label htmlFor="source">Source</label>
              <input
                type="text"
                id="source"
                name="Source"
                placeholder="Enter source..."
                value={newIncome.Source}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-control">
              <label htmlFor="amount">Amount</label>
              <input
                type="number"
                id="amount"
                name="Amount"
                placeholder="Enter amount..."
                value={newIncome.Amount}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-control">
              <label htmlFor="notes">Notes</label>
              <input
                type="text"
                id="notes"
                name="Notes"
                placeholder="Enter notes..."
                value={newIncome.Notes}
                onChange={handleInputChange}
              />
            </div>
            <button className="btn" type="submit">
              Add income
            </button>
          </form>
        </div>
      </div>
      <div className="income-links">
        <Link to="/category" className="income-link">
          <FaPlusCircle /> Add more category
        </Link>
        <Link to="/ask-ai" className="income-link">
          <FaQuestionCircle /> AskAI
        </Link>
        <Link to="/transaction" className="income-link">
          <FaMoneyBillAlt /> Transaction Details
        </Link>
        <Link to="/dashboard" className="income-link">
          <FaTachometerAlt /> Dashboard
        </Link>
      </div>
    </div>
  );
}

export default IncomePage;
