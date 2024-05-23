import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ManageWords = () => {
  const [words, setWords] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/words") // Gets data from the server table named "words"
      .then((result) => {
        if (result.data.Status) {
          setWords(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);
  const handleDelete = (id) => {
    axios
      .delete("http://localhost:3000/auth/delete_words/" + id) // Deletes the selected word from the database
      .then((result) => {
        if (result.data.Status) {
          window.location.reload();
        } else {
          alert(result.data.Error);
        }
      });
  };
  return (
    <div className="px-5 mt-3" style={{ marginLeft: "250px" }}>
      <div className="p-3 d-flex justify-content-center ml-10">
        <h3>All word list</h3>
      </div>
      <Link to="/dashboard/add_words" className="btn btn-success">
        Add New Vocabulary
      </Link>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>English</th>
              <th>Turkish</th>
              <th>Sentence</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {words.map((e) => (
              <tr>
                <td>{e.english}</td>
                <td>{e.turkish}</td>
                <td>{e.sentence}</td>
                <td>
                  <img
                    src={`http://localhost:3000/Images/` + e.image}
                    className="image"
                  />
                </td>
                <td>
                  <Link
                    to={`/dashboard/edit_words/` + e.id}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(e.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageWords;
