"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { updateUserWeeklyLimit } from "@/lib/api/userAPI";
import { User } from "@/types/User";

const UserProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [weeklyLimit, setWeeklyLimit] = useState<number | string>("");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  const fetchUser = async (token: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get<User>(
        "http://localhost:5001/smartsaver-api/v1/users/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data);
      setWeeklyLimit(response.data.WeeklyLimit);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWeeklyLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeeklyLimit(e.target.value);
  };

  const handleUpdateWeeklyLimit = async () => {
    try {
      if (typeof weeklyLimit === "string" && isNaN(Number(weeklyLimit))) {
        setError("Please enter a valid number for the weekly limit.");
        setSuccessMessage("");
        return;
      }
      await updateUserWeeklyLimit(Number(weeklyLimit), token);
      setSuccessMessage("Weekly limit updated successfully!");
      setError("");
      fetchUser(token);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      setSuccessMessage("");
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
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
          <p className="mt-1">{user?.Name}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email:
          </label>
          <p className="mt-1">{user?.Email}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Weekly Limit:
          </label>
          <p className="mt-1">{user?.WeeklyLimit}</p>
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
    </div>
  );
};

export default UserProfilePage;
