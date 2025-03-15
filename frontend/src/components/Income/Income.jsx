// IncomePage.jsx
import React, { useState, useEffect } from "react";
import {
  getIncomes,
  addIncome,
  updateIncome,
  deleteIncome,
} from "../../api/incomeApi";
import { Link } from "react-router-dom";

function IncomePage() {
  const [incomes, setIncomes] = useState([]);
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchIncomes(storedToken);
    } else {
      setError("Token not found.");
    }
  }, []);

  const fetchIncomes = async (token) => {
    try {
      const data = await getIncomes(token);
      setIncomes(data);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const income = { Source: source, Amount: amount, Date: date, Notes: notes };

    try {
      if (editingId) {
        await updateIncome(editingId, income, token);
        setSuccess("Income updated successfully!");
      } else {
        await addIncome(income, token);
        setSuccess("Income added successfully!");
      }
      fetchIncomes(token);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (income) => {
    setEditingId(income.ID);
    setSource(income.Source);
    setAmount(income.Amount);
    setDate(income.Date);
    setNotes(income.Notes);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    try {
      await deleteIncome(id, token);
      fetchIncomes(token);
      setSuccess("Income deleted successfully!");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setSource("");
    setAmount("");
    setDate("");
    setNotes("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="container mx-auto p-4">
      <Link
        to="/dashboard"
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 inline-block"
      >
        Dashboard
      </Link>
      <h2 className="text-2xl font-bold mb-4">Income Records</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="border p-2 mr-2"
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 mr-2"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 mr-2"
          required
        />
        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editingId ? "Update Income" : "Add Income"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-400 text-white p-2 rounded ml-2"
          >
            Cancel Edit
          </button>
        )}
      </form>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Source</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Notes</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {incomes.map((income) => (
            <tr key={income.ID}>
              <td className="border p-2">{income.Source}</td>
              <td className="border p-2">{income.Amount}</td>
              <td className="border p-2">{income.Date}</td>
              <td className="border p-2">{income.Notes}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(income)}
                  className="bg-yellow-500 text-white p-1 rounded mr-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(income.ID)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IncomePage;
