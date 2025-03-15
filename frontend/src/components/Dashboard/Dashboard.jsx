import React, { useState, useEffect } from "react";
import { getTransactions, getCategories } from "../../api/transactionApi";
import { getIncomes } from "../../api/incomeApi";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Link } from "react-router-dom";

Chart.register(ArcElement, Tooltip, Legend);

function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [chartData, setChartData] = useState(null);
  const [selectedCategoryTransactions, setSelectedCategoryTransactions] =
    useState([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);
  const [totalBalance, setTotalBalance] = useState(0);

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

  const fetchIncomes = async () => {
    try {
      const data = await getIncomes(token);
      setIncomes(data);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (transactions.length > 0 && categories.length > 0) {
      const categoryTotals = {};
      transactions.forEach((transaction) => {
        const category = categories.find(
          (cat) => cat.ID === transaction.CategoryID
        );
        if (category) {
          if (!categoryTotals[category.Name]) {
            categoryTotals[category.Name] = 0;
          }
          categoryTotals[category.Name] += parseFloat(transaction.Amount);
        }
      });

      const labels = Object.keys(categoryTotals);
      const data = Object.values(categoryTotals);
      const backgroundColors = labels.map(
        () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
      );

      setChartData({
        labels,
        datasets: [
          {
            data,
            backgroundColor: backgroundColors,
          },
        ],
      });
    }
  }, [transactions, categories]);

  useEffect(() => {
    let incomeTotal = incomes.reduce(
      (acc, income) => acc + parseFloat(income.Amount),
      0
    );
    let transactionTotal = transactions.reduce(
      (acc, transaction) => acc + parseFloat(transaction.Amount),
      0
    );
    setTotalBalance(incomeTotal - transactionTotal);
  }, [incomes, transactions]);

  const handleSliceClick = (event, elements) => {
    if (elements.length > 0) {
      const clickedIndex = elements[0].index;
      const categoryName = chartData.labels[clickedIndex];
      setSelectedCategoryName(categoryName);
      const selectedCategory = categories.find(
        (cat) => cat.Name === categoryName
      );
      if (selectedCategory) {
        const filteredTransactions = transactions.filter(
          (trans) => trans.CategoryID === selectedCategory.ID
        );
        setSelectedCategoryTransactions(filteredTransactions);
      } else {
        setSelectedCategoryTransactions([]);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Dashboard</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Total Balance: ${totalBalance.toFixed(2)}
        </div>

        {chartData && (
          <div className="mb-6">
            <Pie data={chartData} options={{ onClick: handleSliceClick }} />
          </div>
        )}

        {selectedCategoryTransactions.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-3">
              Transactions for {selectedCategoryName}
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCategoryTransactions.map((transaction) => (
                    <tr key={transaction.ID} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction.Name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${parseFloat(transaction.Amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatDate(transaction.Date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <Link
        to="/transaction"
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Transaction Detail
      </Link>
      <Link
        to="/category"
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Add more category
      </Link>
      <Link
        to="/user-profile"
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        UserProfile
      </Link>
      <Link
        to="/ask-ai"
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        AskAI
      </Link>
      <Link
        to="/income"
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Income
      </Link>
    </div>
  );
}

export default DashboardPage;
