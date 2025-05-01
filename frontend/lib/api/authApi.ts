import axios from "axios";

const API_BASE_URL = "http://localhost:5001/smartsaver-api/v1/auth";

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<string> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password,
    });
    return response.data.token;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};
