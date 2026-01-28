import React, { useState } from "react";
import "./login.css"; // reuse login styles
import api from "../../utils/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";


// ================= PASSWORD STRENGTH CHECK (NEW) =================
// ================= STRONG PASSWORD CHECK (FIXED) =================
const isStrongPassword = (password) => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&        // uppercase
    /[0-9]/.test(password) &&        // number
    /[^A-Za-z0-9]/.test(password)    // ANY special character (#, @, !, etc)
  );
};


const Register = () => {
  const navigate = useNavigate();

  const [registerField, setRegisterField] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const [loader, setLoader] = useState(false);

  const handleChange = (e) => {
    setRegisterField({
      ...registerField,
      [e.target.name]: e.target.value,
    });
  };

 // ================= REGISTER HANDLER WITH SECURITY =================
  const handleRegister = async () => {
  const { userName, email, password } = registerField;

  if (!userName || !email || !password) {
    toast.error("All fields are required");
    return;
  }

  // NEW: Strong password validation
  if (!isStrongPassword(password)) {
    toast.error(
      "Use a strong password: 8+ chars, 1 uppercase, 1 number, 1 symbol."
    );
    return;
  }

  setLoader(true);

  try {
    await api.post("/auth/signup", registerField);
    toast.success("Registration successful! Please login.");
    navigate("/login");
  } catch (err) {
    toast.error(err.response?.data?.message || "Registration failed");
  } finally {
    setLoader(false);
  }
};

  return (
    <div className="login">
      <div className="login_card">
        <h1 className="login_title">Register</h1>

        <div className="loginCredentials">
          <input
            type="text"
            name="userName"
            placeholder="Enter userName"
            value={registerField.userName}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={registerField.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={registerField.password}
            onChange={handleChange}
          />
          {/* ================= PASSWORD STRENGTH UI (NEW) ================= */}
   <p style={{ fontSize: "13px", color: "#aaa", textAlign: "center" }}>
  Use a <span style={{ color: "lightgreen", fontWeight: "600" }}>
    strong password
  </span> (8+ chars, 1 uppercase, 1 number, 1 symbol)
</p>


        </div>

        <button
          className="login-btn"
          onClick={handleRegister}
          disabled={loader}
        >
          {loader ? "Registering..." : "Register"}
        </button>

        <p className="login-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Register;
