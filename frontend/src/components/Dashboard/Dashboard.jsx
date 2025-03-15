import React, { useState, useEffect } from "react";
import { getTransactions, getCategories } from "../../api/transactionApi";
import { getIncomes } from "../../api/incomeApi";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import {
  FaListAlt,
  FaPlusCircle,
  FaUser,
  FaQuestionCircle,
  FaMoneyBillAlt,
} from "react-icons/fa"; // Import icons

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
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);

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
    const incomeSum = incomes.reduce(
      (acc, income) => acc + parseFloat(income.Amount),
      0
    );
    const expenseSum = transactions.reduce(
      (acc, transaction) => acc + parseFloat(transaction.Amount),
      0
    );

    setIncomeTotal(incomeSum);
    setExpenseTotal(expenseSum);
    setTotalBalance(incomeSum - expenseSum);
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
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h2 className="dashboard-title">Dashboard</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="balance-display">
          <h4>Your Balance</h4>
          <h1 id="balance">${totalBalance.toFixed(2)}</h1>
        </div>

        <div className="inc-exp-container">
          <div>
            <h4>Income</h4>
            <p id="money-plus" className="money plus">
              +${incomeTotal.toFixed(2)}
            </p>
          </div>
          <div>
            <h4>Expense</h4>
            <p id="money-minus" className="money minus">
              -${expenseTotal.toFixed(2)}
            </p>
          </div>
        </div>

        {chartData && (
          <div className="chart-container">
            <Pie data={chartData} options={{ onClick: handleSliceClick }} />
          </div>
        )}

        {selectedCategoryTransactions.length > 0 && (
          <div className="category-transactions">
            <h3 className="category-title">
              Transactions for {selectedCategoryName}
            </h3>
            <div className="transactions-table-container">
              <table className="transactions-table">
                <thead>
                  <tr className="table-header">
                    <th className="table-header-cell">Name</th>
                    <th className="table-header-cell">Amount</th>
                    <th className="table-header-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCategoryTransactions.map((transaction) => (
                    <tr key={transaction.ID} className="table-row">
                      <td className="table-cell">{transaction.Name}</td>
                      <td className="table-cell">
                        ${parseFloat(transaction.Amount).toFixed(2)}
                      </td>
                      <td className="table-cell">
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
      <div className="dashboard-links">
        <Link to="/transaction" className="dashboard-link">
          <FaListAlt /> Transaction Detail
        </Link>
        <Link to="/category" className="dashboard-link">
          <FaPlusCircle /> Add more category
        </Link>
        <Link to="/user-profile" className="dashboard-link">
          <FaUser /> UserProfile
        </Link>
        <Link to="/ask-ai" className="dashboard-link">
          <FaQuestionCircle /> AskAI
        </Link>
        <Link to="/income" className="dashboard-link">
          <FaMoneyBillAlt /> Income
        </Link>
      </div>
    </div>
  );
}

export default DashboardPage;
