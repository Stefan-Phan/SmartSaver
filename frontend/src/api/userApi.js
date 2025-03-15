import axios from "axios";

const API_URL = "http://localhost:5001/smartsaver-api/v1/users";

export const getUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

export const addUser = async (userData) => {
  try {
    const response = await axios.post(API_URL, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add user");
  }
};

export const getOneUser = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to get user");
  }
};

export const deleteUser = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
};

export const updateWeeklyLimit = async (weeklyLimit, token) => {
  //removed ID from parameters.
  try {
    const response = await axios.put(
      `${API_URL}/weeklyLimit`, //removed the id from url.
      { WeeklyLimit: weeklyLimit },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update weekly limit"
    );
  }
};
