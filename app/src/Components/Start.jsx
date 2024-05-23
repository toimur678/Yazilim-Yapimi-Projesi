import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
useEffect;

const Start = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:3000/verify") // Verifying the user's session
      .then((result) => {
        if (result.data.Status) {
          if (result.data.role === "admin") {
            navigate("/dashboard");
          } else {
            navigate("/" + result.data.id);
          }
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-5 rounded w-40 border loginForm">
        <h1 className="text-center">Welcome to Word Memo!</h1>
        <br></br>
        <h5 className="text-center">Please login or signup</h5>
        <div className="d-flex justify-content-center mb-2 mt-5">
          <button
            type="button"
            className="btn btn-primary w-50"
            onClick={() => {
              navigate("/adminlogin");
            }}
          >
            Login
          </button>
        </div>
        <div className="d-flex justify-content-center mb-2 mt-3">
          <button
            type="button"
            className="btn btn-warning w-50"
            onClick={() => {
              navigate("/sign_up");
            }}
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default Start;
