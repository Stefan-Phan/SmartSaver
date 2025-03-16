import React, { useState, useEffect, useRef } from "react";
import { getAIRecommendation } from "../../api/aiApi";
import { Link } from "react-router-dom";
import "./AskAI.css";
import {
  FaTachometerAlt,
  FaPlusCircle,
  FaQuestionCircle,
  FaMoneyBillAlt,
  FaListAlt,
  FaUser,
  FaPaperPlane,
} from "react-icons/fa";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faRobot } from "@fortawesome/free-solid-svg-icons";

function AskAI() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("Fun");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleModeChange = (e) => {
    setMode(e.target.value);
  };

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = { text: question, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setQuestion("");

    try {
      const data = await getAIRecommendation(token, question, mode);
      const aiMessage = { text: data.recommendation, sender: "ai" };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      setError("");
    } catch (err) {
      setError(err.message);
      const aiErrorMessage = { text: "Error: " + err.message, sender: "ai" };
      setMessages((prevMessages) => [...prevMessages, aiErrorMessage]);
    }
  };

  return (
    <div className="ask-ai-page-container">
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
      <div className="ask-ai-chat-container">
        <div className="ask-ai-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender === "user" ? "user" : "ai"}`}
            >
              <div className="message-icon">
                <FontAwesomeIcon
                  icon={message.sender === "user" ? faUserCircle : faRobot}
                  size="2x"
                />
              </div>
              <div className="message-text">{message.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="ask-ai-input-area">
          <form onSubmit={handleAskAI} className="ask-ai-input-form">
            <input
              type="text"
              value={question}
              onChange={handleInputChange}
              placeholder="Type your question..."
              className="ask-ai-input"
            />
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
            <button type="submit" className="ask-ai-send-button">
              <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AskAI;
