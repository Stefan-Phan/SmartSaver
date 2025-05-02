import axios from "axios";
import { Transaction } from "@/types/Transaction";
import { Category } from "@/types/Category";
import { WeeklyReport } from "@/types/WeeklyReport";

const API_URL = "http://localhost:5001/smartsaver-api/v1/transaction";
const CATEGORIES_API_URL = "http://localhost:5001/smartsaver-api/v1/categories";

export const getTransactions = async (
  token: string
): Promise<Transaction[]> => {
  try {
    const response = await axios.get<Transaction[]>(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch transactions"
    );
  }
};

export const addTransaction = async (
  token: string,
  transactionData: Omit<Transaction, "ID">
): Promise<Transaction> => {
  try {
    const response = await axios.post<Transaction>(API_URL, transactionData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to add transaction"
    );
  }
};

export const updateTransaction = async (
  token: string,
  id: number,
  transactionData: Omit<Transaction, "ID">
): Promise<Transaction> => {
  try {
    const response = await axios.put<Transaction>(
      `${API_URL}/${id}`,
      transactionData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update transaction"
    );
  }
};

export const deleteTransaction = async (
  token: string,
  id: number
): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete transaction"
    );
  }
};

export const getTotalIncome = async (token: string): Promise<number> => {
  try {
    const response = await axios.get(`${API_URL}/total-income`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch total income"
    );
  }
};

export const getTotalExpenses = async (token: string): Promise<number> => {
  try {
    const response = await axios.get(`${API_URL}/total-expense`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch total expenses"
    );
  }
};

export const getBalance = async (token: string): Promise<number> => {
  try {
    const response = await axios.get(`${API_URL}/balance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch balance");
  }
};

export const getWeeklyReport = async (
  token: string
): Promise<WeeklyReport[]> => {
  try {
    const response = await axios.get<WeeklyReport[]>(
      `${API_URL}/weekly-report`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch weekly report"
    );
  }
};

export const getCategories = async (token: string): Promise<Category[]> => {
  try {
    const response = await axios.get<Category[]>(CATEGORIES_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch categories"
    );
  }
};
