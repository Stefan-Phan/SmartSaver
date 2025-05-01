// lib/api/userApi.ts (or adjust path as needed)
import { User } from "@/types/User";
import axios from "axios";

const API_URL = "http://localhost:5001/smartsaver-api/v1/users";

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get<User[]>(API_URL);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

export const addUser = async (userData: Omit<User, "ID">): Promise<User> => {
  try {
    const response = await axios.post<User>(API_URL, userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to add user");
  }
};

export const getOneUser = async (id: number): Promise<User> => {
  try {
    const response = await axios.get<User>(`${API_URL}/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to get user");
  }
};

export const deleteUser = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
};

export const updateUserWeeklyLimit = async (
  weeklyLimit: number,
  token: string
): Promise<User> => {
  try {
    const response = await axios.put<User>(
      `${API_URL}/weeklyLimit`,
      { WeeklyLimit: weeklyLimit },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update weekly limit"
    );
  }
};
