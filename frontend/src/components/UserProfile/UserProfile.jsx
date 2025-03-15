// UserProfile.jsx
import React, { useState, useEffect } from "react";
import { updateWeeklyLimit } from "../../api/userApi";
import axios from "axios";
import { Link } from "react-router-dom";
import "./UserProfile.css"; // Import the CSS file
import { FaTachometerAlt } from "react-icons/fa";

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
    return <div className="loading-container">Loading...</div>;
  }

  if (!user && !isLoading) {
    return (
      <div className="user-profile-container">
        <div className="user-profile-content">
          <h2 className="user-profile-title">User Profile</h2>
          {error && <div className="user-profile-error-message">{error}</div>}
          <p>User data not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-container">
      <div className="user-profile-content">
        <h3 className="user-profile-title">User Profile</h3>
        <Link to="/dashboard" className="user-profile-dashboard-link">
          <FaTachometerAlt /> Dashboard
        </Link>
        {error && <div className="user-profile-error-message">{error}</div>}

        {successMessage && (
          <div className="user-profile-success-message">{successMessage}</div>
        )}

        <div className="user-profile-info">
          <div className="info-item">
            <label className="info-label">Name:</label>
            <p className="info-value">{user.Name}</p>
          </div>

          <div className="info-item">
            <label className="info-label">Email:</label>
            <p className="info-value">{user.Email}</p>
          </div>

          <div className="info-item">
            <label className="info-label">Weekly Limit:</label>
            <input
              type="number"
              value={weeklyLimit}
              onChange={handleWeeklyLimitChange}
              className="info-input"
            />
          </div>
        </div>

        <button
          onClick={handleUpdateWeeklyLimit}
          className="user-profile-update-button"
        >
          Update Weekly Limit
        </button>
      </div>
    </div>
  );
}

export default UserProfile;
