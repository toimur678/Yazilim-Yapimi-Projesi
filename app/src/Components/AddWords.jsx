import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddWords = () => {
  // Setting the initial state of the words
  const [addwords, setAddWords] = useState({
    english: "",
    turkish: "",
    sentence: "",
    image: "",
  });
  const navigate = useNavigate();

  // Adding the word to the database
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("english", addwords.english);
    formData.append("turkish", addwords.turkish);
    formData.append("sentence", addwords.sentence);
    formData.append("image", addwords.image);

    axios
      .post("http://localhost:3000/auth/add_words", formData) // Adding the word to the database
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
    <div
      className="d-flex justify-content-center align-items-center mt-3"
      style={{ marginLeft: "250px" }}
    >
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add words</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label for="inputEnglish" className="form-label">
              English
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputEnglish"
              onChange={(e) =>
                setAddWords({ ...addwords, english: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label for="inputTurkish" className="form-label">
              Turkish
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputTurkish"
              onChange={(e) =>
                setAddWords({ ...addwords, turkish: e.target.value })
              }
            />
          </div>

          <div className="col-12">
            <label for="inputSentence" className="form-label">
              Sentence
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputSentence"
              onChange={(e) =>
                setAddWords({ ...addwords, sentence: e.target.value })
              }
            />
          </div>

          <div className="col-12 mb-3">
            <label className="form-label" for="inputGroupFile01">
              Select Image
            </label>
            <input
              type="file"
              className="form-control rounded-0"
              id="inputGroupFile01"
              name="image"
              onChange={(e) =>
                setAddWords({ ...addwords, image: e.target.files[0] })
              }
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWords;
