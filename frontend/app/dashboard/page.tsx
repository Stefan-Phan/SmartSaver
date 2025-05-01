"use client";

import React, { useState, useEffect } from "react";

// import from api
import { getCategories, getIncomes, getTransactions } from "@/lib/api/getInfo";

// import component
import BenefitCards from "../components/dashboard/BenefitCards";

// import types
import { Transaction } from "@/types/Transaction";
import { Category } from "@/types/Category";
import { Income } from "@/types/Income";
import TransactionItem from "../components/dashboard/TransactionItem";

const DashboardPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [token, setToken] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [incomeTotal, setIncomeTotal] = useState<number>(0);
  const [expenseTotal, setExpenseTotal] = useState<number>(0);

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
      fetchIncomes();
    }
  }, [token]);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions(token);
      setTransactions(data);
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories(token);
      setCategories(data);
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchIncomes = async () => {
    try {
      const data = await getIncomes(token);
      setIncomes(data);
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((cat) => cat.ID === categoryId);
    return category ? category.Name : "Unknown";
  };

  return (
    <div className="flex font-sans">
      <div className="bg-white p-6 w-3/4">
        <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <BenefitCards />
        <div className="bg-white shadow-sm rounded-md p-4 mb-4">
          <h4 className="text-lg font-semibold mb-2">Your Balance</h4>
          <h1
            id="balance"
            className={`text-3xl font-bold ${
              totalBalance >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            ${totalBalance.toFixed(2)}
          </h1>
        </div>
        <div className="bg-white shadow-sm rounded-md p-4 mb-4 flex justify-around">
          <div className="text-center">
            <h4 className="text-md font-semibold uppercase text-gray-600">
              Income
            </h4>
            <p className="text-xl font-bold text-green-500">
              +${incomeTotal.toFixed(2)}
            </p>
          </div>
          <div className="text-center border-l border-gray-300 pl-4">
            <h4 className="text-md font-semibold uppercase text-gray-600">
              Expense
            </h4>
            <p className="text-xl font-bold text-red-500">
              -${expenseTotal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      <div
        className="flex flex-col bg-gray-50 p-10 w-1/4 justify-center items-center text-center"
        style={{
          borderTopLeftRadius: "4rem",
          borderBottomLeftRadius: "4rem",
        }}
      >
        <h3 className=" text-xl font-semibold mb-4">Recent Transactions</h3>
        {transactions.length > 0 ? (
          <div className="w-full">
            {transactions.map((transaction) => (
              <TransactionItem
                key={transaction.ID}
                transaction={transaction}
                categoryName={getCategoryName(transaction.CategoryID)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No recent transactions.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
