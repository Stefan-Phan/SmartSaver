// api/aiApi.js
import axios from "axios";

const API_URL = "http://localhost:5001/smartsaver-api/v1/api/ai";

export const getAIRecommendation = async (token, question, mode) => {
  try {
    const response = await axios.post(
      `${API_URL}/recommendation`,
      { question, mode },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to get AI recommendation"
    );
  }
};
