import React, { useState } from "react";
import "./style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUP = () => {
  const [user, setUser] = useState({
    name: "",
    surname: "",
    age: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user.name || !user.surname || !user.age || !user.email || !user.password) {
      alert("All fields are required");
      return;
    }
    axios
      .post("http://localhost:3000/auth/add_player", {
        name: user.name,
        surname: user.surname,
        age: user.age,
        email: user.email,
        password: user.password,
      })
      .then((result) => {
        if (result.data.Status) {
          navigate("/");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3 rounded w-25 border loginForm">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
        <div className="mb-3">
            <label htmlFor="name">
              <strong>Name:</strong>
            </label>
            <input
              type="text"
              name="name"
              autoComplete="off"
              placeholder="Enter Name"
              className="form-control rounded-100"
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="surname">
              <strong>Surname:</strong>
            </label>
            <input
              type="text"
              name="surname"
              autoComplete="off"
              placeholder="Enter Surname"
              className="form-control rounded-100"
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="age">
              <strong>Age:</strong>
            </label>
            <input
              type="text"
              name="age"
              autoComplete="off"
              placeholder="Enter Age"
              className="form-control rounded-100"
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
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
              <strong>Password:</strong>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              className="form-control rounded-100"
              onChange={handleInputChange}
            />
          </div>
          
          <button
            className="btn btn-primary w-100 rounded-100 mb-2 mt-3"
            type="submit"
          >
            Complete Sign up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUP;
