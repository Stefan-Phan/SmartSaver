// Add this to your existing api/transactionApi.js file or create a new categoryApi.js file
import axios from "axios";

const API_URL = "http://localhost:5001/smartsaver-api/v1/categories";

export const getCategories = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch categories"
    );
  }
};

export const addCategory = async (token, categoryData) => {
  try {
    const response = await axios.post(API_URL, categoryData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add category");
  }
};

export const deleteCategory = async (token, id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete category"
    );
  }
};
