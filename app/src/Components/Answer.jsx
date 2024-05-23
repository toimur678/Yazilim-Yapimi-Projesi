import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Answer = () => {
  const { id } = useParams();
  // Setting the initial state of the answer
  const [ans, setAns] = useState({
    english: "",
    turkish: "",
    sentence: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/words_id/" + id) // Fetching the word data from the database
      .then((result) => {
        setAns({
          ...ans,
          english: result.data.Result[0].english,
          turkish: result.data.Result[0].turkish,
          sentence: result.data.Result[0].sentence,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:3000/auth/submit_ans/" + id, ans) // Submitting the answer to the database
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard/take_quiz");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center mt-3"
      style={{ marginLeft: "250px" }}
    >
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Write your answer of the word:</h3>
        <h1 className="text-center">{ans.english}</h1>

        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12"></div>
          <div className="col-12">
            <div>
              <label for="hidden" className="form-label"></label>
              <input type="hidden" />
            </div>
            <label for="inputTurkish" className="form-label">
              Write your answer in Turkish
            </label>
            <input
              type="text"
              className="form-control rounded-100"
              id="inputTurkish"
              onChange={(e) => setAns({ ...ans, turkish: e.target.value })}
            />
          </div>

          <div>
            <label for="hidden" className="form-label"></label>
            <input type="hidden" />
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Answer next question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Answer;
