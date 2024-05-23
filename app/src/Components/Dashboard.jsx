import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

const Dashboard = () => {
  const anvigate = useNavigate();
  axios.defaults.withCredentials = true;
  const handleLogout = () => {
    axios.get("http://localhost:3000/auth/logout").then((result) => {
      if (result.data.Status) {
        localStorage.removeItem("valid");
        anvigate("/");
      }
    });
  };
  return (
    <div className="container-fluid" >
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-success bg-gradient" style={{position: 'fixed'}}>
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100" >
            <Link
              to="/dashboard"
              className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none"
            >
              <span className="fs-5 fw-bolder d-none d-sm-inline">MENU</span>
            </Link>
            <ul
              className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
              id="menu"
            >
              <li className="w-100">
                <Link
                  to="/dashboard"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i className="fs-4 bi-speedometer2 ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Dashboard</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/manage_words"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi bi-alphabet-uppercase ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Manage Words</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/quiz"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi bi-book-half ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Quiz</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/settings"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi bi-gear-wide-connected ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Settings</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/report"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi bi-cloud-arrow-down ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Report Download</span>
                </Link>
              </li>
              <li className="w-100" onClick={handleLogout}>
                <Link className="nav-link px-0 align-middle text-white">
                  <i className="fs-4 bi-power ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="col p-0 m-0" >
          <div className="p-4 d-flex justify-content-center shadow" style={{ marginLeft: "250px" }}>
            <h1>WORD GUESSING GAME v.1.0</h1>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
