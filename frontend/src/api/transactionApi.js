// api/transactionApi.js

import axios from "axios";

const API_URL = "http://localhost:5001/smartsaver-api/v1/transaction";

export const getTransactions = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch transactions"
    );
  }
};

export const addTransaction = async (token, transactionData) => {
  try {
    const response = await axios.post(API_URL, transactionData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to add transaction"
    );
  }
};

export const updateTransaction = async (token, id, transactionData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, transactionData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update transaction"
    );
  }
};

export const deleteTransaction = async (token, id) => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete transaction"
    );
  }
};

export const getCategories = async (token) => {
  try {
    const response = await axios.get(
      "http://localhost:5001/smartsaver-api/v1/categories",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch categories"
    );
  }
};
