"use client";

import React, { useState, useEffect, useRef } from "react";
import { getAIRecommendation } from "@/lib/api/aiAPI";
import { Send, User, Bot, Loader2, MessageSquare } from "lucide-react";
import { Category } from "@/types/Category";
import { getCategories } from "@/lib/api/categoryAPI";

interface Message {
  text: string;
  sender: "user" | "ai";
}

const AskAI: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [categoryName, setCategoryName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [mode, setMode] = useState<string>("Fun");
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchCategories();
    }
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories(token);
      setCategories(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryName(e.target.value);
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMode(e.target.value);
  };

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !categoryName.trim() || loading) return;

    const userMessage: Message = { text: question, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setQuestion("");
    setCategoryName("");
    setLoading(true);

    try {
      const data = await getAIRecommendation(
        token,
        question,
        categoryName,
        mode
      );
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
    } finally {
      setLoading(false);
    }
  };

  const getModeColor = () => {
    switch (mode) {
      case "Fun":
        return "bg-violet-500 hover:bg-violet-600";
      case "Sad":
        return "bg-blue-500 hover:bg-blue-600";
      case "Angry":
        return "bg-red-500 hover:bg-red-600";
      case "Wise":
        return "bg-amber-500 hover:bg-amber-600";
      default:
        return "bg-emerald-500 hover:bg-emerald-600";
    }
  };

  return (
    <div className="flex flex-col bg-gray-50 shadow-lg overflow-hidden border border-gray-200 h-screen">
      <div className="bg-white px-6 py-4 border-b border-gray-200 sticky top-0 z-10">
        <h2 className="text-xl font-semibold text-gray-800">AI Assistant</h2>
        <p className="text-sm text-gray-500">Ask me anything in {mode} mode</p>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-grow flex flex-col bg-gray-50 p-4 overflow-y-auto"
      >
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-center text-gray-400">
            <div>
              <MessageSquare size={48} className="mx-auto mb-3 text-gray-300" />
              <p>No messages yet. Start a conversation!</p>
            </div>
          </div>
        )}

        <div className="flex-grow space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-x-3 max-w-3/4 ${
                message.sender === "user"
                  ? "ml-auto flex-row-reverse"
                  : "mr-auto"
              }`}
            >
              <div
                className={`flex items-center justify-center rounded-full w-8 h-8 ${
                  message.sender === "user"
                    ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white"
                    : "bg-gradient-to-br from-indigo-400 to-purple-500 text-white"
                }`}
              >
                {message.sender === "user" ? (
                  <User size={16} />
                ) : (
                  <Bot size={16} />
                )}
              </div>
              <div
                className={`py-2 px-4 rounded-2xl shadow-sm ${
                  message.sender === "user"
                    ? "bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 text-gray-800"
                    : "bg-white border border-gray-100 text-gray-800"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-x-3 mr-auto">
              <div className="flex items-center justify-center rounded-full w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 text-white">
                <Bot size={16} />
              </div>
              <div className="py-3 px-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-indigo-500" />
                  <span className="text-gray-500 text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white p-4 border-t border-gray-200 sticky bottom-0">
        <form onSubmit={handleAskAI} className="flex items-center gap-3">
          <input
            type="text"
            value={question}
            onChange={handleInputChange}
            placeholder="Type your question..."
            className="flex-grow p-3 border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-gray-700 shadow-sm"
            disabled={loading}
          />

          <select
            name="CategoryName"
            value={categoryName}
            onChange={handleCategoryChange}
            className="p-3 border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-gray-700 shadow-sm w-42"
            disabled={loading}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.ID} value={category.Name}>
                {category.Name}
              </option>
            ))}
          </select>

          <select
            value={mode}
            onChange={handleModeChange}
            className="p-3 border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-gray-700 shadow-sm w-28"
            disabled={loading}
          >
            <option value="Fun">Fun</option>
            <option value="Sad">Sad</option>
            <option value="Angry">Angry</option>
            <option value="Wise">Wise</option>
          </select>

          <button
            type="submit"
            disabled={loading || !question.trim()}
            className={`${getModeColor()} text-white rounded-full w-12 h-12 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300 transition-colors duration-200 shadow-md ${
              loading || !question.trim() ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AskAI;
