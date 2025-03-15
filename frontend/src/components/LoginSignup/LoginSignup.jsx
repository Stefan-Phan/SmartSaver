import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../../api/authApi";
import "./LoginSignup.css";

import user_icon from "../assets/person.png";
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";

const LoginSignup = ({ action }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (action === "Sign Up") {
        const response = await registerUser(name, email, password);
        alert("Registration successful");
        navigate("/login");
      } else {
        const token = await loginUser(email, password);
        localStorage.setItem("token", token);
        alert("Login successful");
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const switchMode = () => {
    if (action === "Sign Up") {
      navigate("/login");
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <form className="inputs" onSubmit={handleSubmit}>
        {action === "Sign Up" && (
          <div className="input">
            <img src={user_icon} alt="" />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={action === "Sign Up"}
            />
          </div>
        )}

        <div className="input">
          <img src={email_icon} alt="" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {action === "Login" && (
          <div className="forgot-password">
            Lost Password? <span>Click Here!</span>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
        <div className="submit-container">
          <button type="submit" className="submit">
            {action}
          </button>
          <button type="button" className="submit gray" onClick={switchMode}>
            {action === "Login" ? "Sign Up" : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginSignup;
