// AskAI.jsx
import React, { useState, useEffect } from "react";
import { getAIRecommendation } from "../../api/aiApi";
import { Link } from "react-router-dom";
import "./AskAI.css"; // Import the CSS file
import {
  FaTachometerAlt,
  FaPlusCircle,
  FaQuestionCircle,
  FaMoneyBillAlt,
} from "react-icons/fa";

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
    <div className="ask-ai-page-container">
      <div className="ask-ai-page-content">
        <h3 className="ask-ai-page-title">Ask AI</h3>
        <Link to="/dashboard" className="ask-ai-dashboard-link">
          <FaTachometerAlt /> Dashboard
        </Link>

        {error && <div className="ask-ai-error-message">{error}</div>}

        <div className="ask-ai-mode-selection">
          <label className="ask-ai-mode-label">Mode:</label>
          <select
            value={mode}
            onChange={handleModeChange}
            className="ask-ai-mode-select"
          >
            <option value="Fun">Fun</option>
            <option value="Sad">Sad</option>
            <option value="Angry">Angry</option>
            <option value="Wise">Wise</option>
          </select>
        </div>

        <form onSubmit={handleAskAI} className="ask-ai-form">
          <div className="form-control">
            <label className="ask-ai-question-label">Your Question:</label>
            <textarea
              value={question}
              onChange={handleInputChange}
              rows="4"
              className="ask-ai-question-textarea"
            ></textarea>
          </div>
          <button type="submit" className="btn">
            Ask AI
          </button>
        </form>

        {recommendation && (
          <div className="ask-ai-recommendation">
            <h3 className="ask-ai-recommendation-title">AI Recommendation:</h3>
            <p className="ask-ai-recommendation-text">{recommendation}</p>
          </div>
        )}
      </div>
      <div className="ask-ai-links">
        <Link to="/category" className="ask-ai-link">
          <FaPlusCircle /> Add more category
        </Link>
        <Link to="/ask-ai" className="ask-ai-link">
          <FaQuestionCircle /> AskAI
        </Link>
        <Link to="/income" className="ask-ai-link">
          <FaMoneyBillAlt /> Income
        </Link>
        <Link to="/dashboard" className="ask-ai-link">
          <FaTachometerAlt /> Dashboard
        </Link>
      </div>
    </div>
  );
}

export default AskAI;
