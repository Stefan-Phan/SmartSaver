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
    const message = error.response?.data?.error || "Registration failed";
    if (message.includes("already in use")) {
      throw new Error("This email is already in use");
    }
    throw new Error(message);
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{ token: string; userId: string }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password,
    });

    const { token, userId } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);

    return { token, userId };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Login failed";

    if (message.includes("couldn't find an account")) {
      throw new Error("We couldn't find an account with that email");
    } else if (message.includes("Incorrect password")) {
      throw new Error("Incorrect password. Please try again");
    }

    throw new Error(message);
  }
};
