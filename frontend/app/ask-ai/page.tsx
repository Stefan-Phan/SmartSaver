"use client";

import React, { useState, useEffect, useRef } from "react";
import { getAIRecommendation } from "@/lib/api/aiAPI";
import { FaPaperPlane } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faRobot } from "@fortawesome/free-solid-svg-icons";

interface Message {
  text: string;
  sender: "user" | "ai";
}

const AskAI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [mode, setMode] = useState<string>("Fun");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMode(e.target.value);
  };

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage: Message = { text: question, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setQuestion("");

    try {
      const data = await getAIRecommendation(token, question, mode);
      const aiMessage: Message = { text: data.recommendation, sender: "ai" };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      setError("");
    } catch (err: any) {
      setError(err.message);
      const aiErrorMessage: Message = {
        text: `Error: ${err.message}`,
        sender: "ai",
      };
      setMessages((prevMessages) => [...prevMessages, aiErrorMessage]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col h-screen">
      <div className="flex-grow flex flex-col bg-transparent">
        <div className="flex-grow overflow-y-auto p-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-center p-3 m-1 rounded-xl word-wrap break-word ${
                message.sender === "user"
                  ? "bg-green-200 self-end flex-row-reverse gap-x-2"
                  : "bg-white self-start justify-start"
              }`}
            >
              <div className="flex items-center justify-center">
                <FontAwesomeIcon
                  icon={message.sender === "user" ? faUserCircle : faRobot}
                  size="2x"
                />
              </div>
              <div className="flex-grow-0">{message.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex items-center p-2 bg-gray-100 border-t border-gray-300">
          <form onSubmit={handleAskAI} className="flex flex-grow">
            <input
              type="text"
              value={question}
              onChange={handleInputChange}
              placeholder="Type your question..."
              className="flex-grow p-2 border rounded-xl mr-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <select
              value={mode}
              onChange={handleModeChange}
              className="p-2 border rounded-xl mr-2 w-24 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="Fun">Fun</option>
              <option value="Sad">Sad</option>
              <option value="Angry">Angry</option>
              <option value="Wise">Wise</option>
            </select>
            <button
              type="submit"
              className="bg-emerald-500 text-white rounded-full w-10 h-10 flex items-center justify-center"
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AskAI;
