// Login.jsx (or wherever your login form is)
import React, { useState } from "react";
import "./login.css";
import api from "../../utils/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();

  const [loginField, setLoginField] = useState({
    identifier: "",   // ← CHANGED from userName
    password: "",
  });

  const [loader, setLoader] = useState(false);

  const handleChange = (e) => {
    setLoginField({
      ...loginField,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    if (!loginField.identifier.trim() || !loginField.password) {
      toast.error("All fields are required");
      return;
    }

    setLoader(true);

    try {
      const payload = {
        identifier: loginField.identifier.trim(),
        password: loginField.password,
      };

      console.log("Sending login payload:", payload);

      const res = await api.post("/auth/login", payload);

      const { token, user } = res.data;   

      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id);
      localStorage.setItem("userName", user.userName || "User");
      localStorage.setItem("userProfilePic", user.profilePic || "");

      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      console.error("Login error:", err.response?.data);
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="login">
      <div className="login_card">
        <h1 className="login_title">Login</h1>

        <div className="loginCredentials">
          <input
            type="text"
            name="identifier"
            placeholder="Username or Email"
            value={loginField.identifier}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginField.password}
            onChange={handleChange}
          />
        </div>

        <button
          className="login-btn"
          onClick={handleLogin}
          disabled={loader}
        >
          {loader ? "Logging in..." : "Login"}
        </button>

        <p className="login-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;