import axios from "axios";

const API_URL = "http://localhost:5001/smartsaver-api/v1/auth";

export const registerUser = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });

    return response.data.token;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};
