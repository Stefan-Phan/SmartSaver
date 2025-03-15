import axios from "axios";

const API_URL = "http://localhost:5001/smartsaver-api/v1/incomes";

export const getIncomes = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch incomes");
  }
};

export const addIncome = async (income, token) => {
  try {
    const response = await axios.post(API_URL, income, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add income");
  }
};

export const updateIncome = async (id, income, token) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, income, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update income");
  }
};

export const deleteIncome = async (id, token) => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete income");
  }
};
