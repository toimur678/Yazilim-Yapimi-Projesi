import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const Result = () => {
  const { id } = useParams();
  const [latestscore, setScore] = useState({
    score: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/score_result")
      .then((result) => {
        if (result.data.Status) {
          setScore(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3000/auth/final_submit")
      .then((result) => {
        if (result.data.loginStatus) {
          navigate("/dashboard");
        } else {
          setError(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
    };

  return (
    <div className="px-5 mt-3" style={{ marginLeft: "250px" }}>
      <div className="p-3 d-flex justify-content-center">
        <h1>Your Final Result: </h1>
      </div>
      <div className="p-3 d-flex justify-content-center">
        <h1>{latestscore.score}</h1>
      </div>
      {error && <div className="d-flex justify-content-center align-items-center mt-3 text-danger">{error}</div>}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button className="p-3 d-flex justify-content-center btn btn-success w-25 wide-button ms-3 mt-3"
        onClick={handleSubmit}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Result;
