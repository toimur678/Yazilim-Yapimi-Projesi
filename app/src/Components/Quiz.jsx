import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Quiz = () => {
  const [result, setResult] = useState([]);
  const [time, setTime] = useState({
    time_result: "",
  });
  const [remainingTime, setRemainingTime] = useState({
    timeDiff: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/result_history") // Fetching the exam history from the database
      .then((response) => {
        if (response.data.Status) {
          setResult(response.data.Result);
        } else {
          alert(response.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/check_time") // Checking the time for the next quiz test
      .then((response) => {
        console.log("check_time response: ", response.data);
        if (response.data.Status) {
          setTime(response.data.Result[0].time_result);
        } else {
          alert(response.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/remaining_time") // Checking the remaining time for the next quiz test
      .then((response) => {
        console.log("remaining_time response: ", response.data);
        if (response.data.Status) {
          setRemainingTime(response.data.Result);
        } else {
          alert(response.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="px-5 mt-3" style={{ marginLeft: "250px" }}>
      <div className="d-flex justify-content-center">
        <h3>Exam history</h3>
      </div>

      {time === 1 ? (
        <Link to="/dashboard/take_quiz" className="btn btn-warning w-25">
          Take Exam
        </Link>
      ) : (
        <Link className="btn btn-danger w-20">
          Time remaining for next quiz test
          <br />
          {remainingTime.timeDiff}
        </Link>
      )}

      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Player ID</th>
              <th>Exam Date</th>
              <th>Exam Time</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {result.map((r) => (
              <tr key={r.id}>
                <td className="text">{r.loginID}</td>
                <td className="text">
                  {new Date(r.date).toLocaleDateString()}
                </td>
                <td className="text">{r.time}</td>
                <td className="text">{r.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Quiz;
