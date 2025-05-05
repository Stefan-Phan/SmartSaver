// lib/api/categoryApi.ts (or adjust path as needed)
import axios from "axios";
import { Category } from "@/types/Category"; // Assuming you have this type defined

const API_URL = "http://localhost:5001/smartsaver-api/v1/categories";

export const getCategories = async (token: string): Promise<Category[]> => {
  try {
    const response = await axios.get<Category[]>(API_URL, {
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

export const addCategory = async (
  token: string,
  categoryData: Omit<Category, "ID">
): Promise<Category> => {
  try {
    const response = await axios.post<Category>(API_URL, categoryData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to add category");
  }
};

export const updateCategory = async (
  token: string,
  id: number,
  categoryData: Category
): Promise<Category> => {
  try {
    const response = await axios.put<Category>(
      `${API_URL}/${id}`,
      categoryData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update category"
    );
  }
};

export const deleteCategory = async (
  token: string,
  id: number
): Promise<Category> => {
  try {
    const response = await axios.delete<Category>(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete category"
    );
  }
};

export const getTotalWeeklyLimit = async (token: string): Promise<number> => {
  try {
    const response = await axios.get<{ totalWeeklyLimit: number }>(
      `${API_URL}/total-weekly-limit`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.totalWeeklyLimit;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch total weekly limit"
    );
  }
};
