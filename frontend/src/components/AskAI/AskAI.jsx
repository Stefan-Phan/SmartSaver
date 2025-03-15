// AskAI.jsx
import React, { useState, useEffect } from "react";
import { getAIRecommendation } from "../../api/aiApi";
import { Link } from "react-router-dom";

function AskAI() {
  const [question, setQuestion] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("Fun");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleInputChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleModeChange = (e) => {
    setMode(e.target.value);
  };

  const handleAskAI = async (e) => {
    e.preventDefault();
    try {
      const data = await getAIRecommendation(token, question, mode);
      setRecommendation(data.recommendation);
      setError("");
    } catch (err) {
      setError(err.message);
      setRecommendation(null);
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
          <h2 className="text-2xl font-bold">Ask AI</h2>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mode:
          </label>
          <select
            value={mode}
            onChange={handleModeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Fun">Fun</option>
            <option value="Sad">Sad</option>
            <option value="Angry">Angry</option>
            <option value="Wise">Wise</option>
          </select>
        </div>

        <form onSubmit={handleAskAI} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Question:
          </label>
          <textarea
            value={question}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Ask AI
          </button>
        </form>

        {recommendation && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-3">AI Recommendation:</h3>
            <p>{recommendation}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AskAI;
