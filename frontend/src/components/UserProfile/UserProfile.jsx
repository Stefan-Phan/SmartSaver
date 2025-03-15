import React, { useState, useEffect } from "react";
import { updateWeeklyLimit } from "../../api/userApi";
import axios from "axios";
import { Link } from "react-router-dom";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [weeklyLimit, setWeeklyLimit] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setError("Token not found.");
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5001/smartsaver-api/v1/users/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data);
      setWeeklyLimit(response.data.WeeklyLimit);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWeeklyLimitChange = (e) => {
    setWeeklyLimit(e.target.value);
  };

  const handleUpdateWeeklyLimit = async () => {
    try {
      await updateWeeklyLimit(weeklyLimit, token);
      setSuccessMessage("Weekly limit updated successfully!");
      setError("");
      fetchUser(token);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setSuccessMessage("");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">User Profile</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <p>User data not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">User Profile</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Name:
          </label>
          <p className="mt-1">{user.Name}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email:
          </label>
          <p className="mt-1">{user.Email}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Weekly Limit:
          </label>
          <input
            type="number"
            value={weeklyLimit}
            onChange={handleWeeklyLimitChange}
            className="mt-1 p-2 border rounded w-full"
          />
        </div>

        <button
          onClick={handleUpdateWeeklyLimit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Update Weekly Limit
        </button>
      </div>
      <Link
        to="/dashboard"
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Dashboard
      </Link>
    </div>
  );
}

export default UserProfile;
