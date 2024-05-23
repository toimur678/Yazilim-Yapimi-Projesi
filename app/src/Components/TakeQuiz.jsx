import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const TakeQuiz = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/random_word") // Gets data from the server table named "words"
      .then((result) => {
        if (result.data.Status) {
          setEmployee(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:3000/auth/random_word/" + id)
      .then((result) => {
        setEmployee({
          ...employee,
          english: result.data.Result[0].english,
          turkish: result.data.Result[0].turkish,
        });
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleRefresh = () => {
    axios
      .delete("http://localhost:3000/auth/post_random_words")
      .then((result) => {
        if (result.data.Status) {
          window.location.reload();
        } else {
          alert(result.data.Error);
        }
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3000/auth/all_ans_submit")
      .then((result) => {
        if (result.data.loginStatus) {
          navigate("/dashboard/result");
        } else {
          setError(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="px-5 mt-3" style={{ marginLeft: "250px" }}>
      <div className="p-3 d-flex justify-content-start">
        <h3>Word Memorization Test</h3>
      </div>
      <div style={{ display: "flex" }}>
        <button
          className="p-3 d-flex justify-content-center btn btn-primary w-25 wide-button"
          onClick={handleSubmit}
        >
          Finish exam
        </button>
        <button
          className="p-3 d-flex justify-content-center btn btn-danger w-25 wide-button ms-3"
          onClick={handleRefresh}
        >
          Refresh for new question
        </button>
      </div>
      {error && <div className="mt-3 text-danger">{error}</div>}
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>English</th>
              <th>Write your answer in Turkish</th>
            </tr>
          </thead>
          <tbody>
            {employee.map((e) => (
              <tr key={e.id}>
                <td>
                  <img
                    src={`http://localhost:3000/Images/${e.image}`}
                    className="image_question"
                    alt={e.english}
                  />
                </td>
                <td className="text">{e.english}</td>
                <td>
                  <Link
                    to={`/dashboard/answer/${e.id}`}
                    className="btn btn-warning btn-sm me-5 wide-button"
                  >
                    Your answer
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TakeQuiz;
