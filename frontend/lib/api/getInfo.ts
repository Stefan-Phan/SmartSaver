// import types
import { Category } from "@/types/Category";
import { Income } from "@/types/Income";
import { Transaction } from "@/types/Transaction";

import axios from "axios";

const API_BASE_URL = "http://localhost:5001/smartsaver-api/v1";

// Transactions
export const getTransactions = async (
  token: string
): Promise<Transaction[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/transaction`, {
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

// ... (add addTransaction, updateTransaction, deleteTransaction if needed)

// Categories
export const getCategories = async (token: string): Promise<Category[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`, {
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

// Incomes
export const getIncomes = async (token: string): Promise<Income[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/incomes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch incomes");
  }
};
