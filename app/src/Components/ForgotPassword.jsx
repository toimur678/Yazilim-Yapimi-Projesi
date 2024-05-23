import React, { useState } from "react";
import "./style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  // Setting the initial state of the user
  const [user, setUser] = useState({
    email: "",
    password: "",
    otp: "",
  });

  const navigate = useNavigate(); // Navigating to the admin login page

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user.email || !user.password || !user.otp) {
      alert("All fields are required");
      return;
    }
    axios
      .put("http://localhost:3000/auth/resetpass", {
        // Resetting the password
        email: user.email,
        password: user.password,
        otp: user.otp,
      })
      .then((result) => {
        if (result.data.Status) {
          navigate("/adminlogin");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3 rounded w-25 border loginForm">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 mt-3">
            <label htmlFor="email">
              <strong>Email:</strong>
            </label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              placeholder="Enter Email"
              className="form-control rounded-100"
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>New Password:</strong>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter New Password"
              className="form-control rounded-100"
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="otp">
              <strong>Enter OTP:</strong>
            </label>
            <input
              type="password"
              name="otp"
              placeholder="Enter 6 digit OTP (000000)"
              className="form-control rounded-100"
              onChange={handleInputChange}
            />
          </div>
          <button
            className="btn btn-primary w-100 rounded-100 mb-2 mt-3"
            type="submit"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
