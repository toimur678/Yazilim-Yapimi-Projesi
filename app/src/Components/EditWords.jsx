import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditWords = () => {
  const { id } = useParams();
  // Setting the initial state of the words
  const [words, setWords] = useState({
    english: "",
    turkish: "",
    sentence: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/words_id/" + id) // Fetching the word data from the database
      .then((result) => {
        setWords({
          ...words,
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
      .put("http://localhost:3000/auth/edit_words/" + id, words) // Updating the word data in the database
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard/manage_words");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Edit Word Informations</h3>

        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label for="inputEnglish" className="form-label">
              English
            </label>
            <input
              type="text"
              className="form-control rounded-100"
              id="inputEnglish"
              value={words.english}
              onChange={(e) => setWords({ ...words, english: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label for="inputTurkish" className="form-label">
              Turkish
            </label>
            <input
              type="text"
              className="form-control rounded-100"
              id="inputTurkish"
              value={words.turkish}
              onChange={(e) => setWords({ ...words, turkish: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label for="inputSentence" className="form-label">
              Sentence
            </label>
            <input
              type="text"
              className="form-control rounded-100"
              id="inputSentence"
              value={words.sentence}
              onChange={(e) => setWords({ ...words, sentence: e.target.value })}
            />
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100 mt-3">
              Update info
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWords;
