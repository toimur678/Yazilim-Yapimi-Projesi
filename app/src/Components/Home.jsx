import axios from "axios";
import React, { useEffect, useState } from "react";

const Home = () => {
  // Setting the initial state of the playerTotal, wordTotal, scoreTotal, and players
  const [playerTotal, setplayerTotal] = useState(0);
  const [wordTotal, setwordTotal] = useState(0);
  const [scoreTotal, setScoreTotal] = useState(0);
  const [players, setplayers] = useState([]);
  // Fetching the player records, player count, word count, and salary count from the database
  useEffect(() => {
    playerCount();
    wordCount();
    scoreCount();
    playerRecords();
  }, []);

  const playerRecords = () => {
    axios
      .get("http://localhost:3000/auth/player_records") // Fetching the player records from the database
      .then((result) => {
        if (result.data.Status) {
          setplayers(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      });
  };
  const playerCount = () => {
    axios
      .get("http://localhost:3000/auth/player_count") // Fetching the player count from the database
      .then((result) => {
        if (result.data.Status) {
          setplayerTotal(result.data.Result[0].admin);
        }
      });
  };
  const wordCount = () => {
    axios
      .get("http://localhost:3000/auth/word_count") // Fetching the word count from the database
      .then((result) => {
        if (result.data.Status) {
          setwordTotal(result.data.Result[0].word);
        }
      });
  };
  const scoreCount = () => {
    axios
      .get("http://localhost:3000/auth/score_count") // Fetching the score count from the database
      .then((result) => {
        if (result.data.Status) {
          setScoreTotal(result.data.Result[0].totalscore);
        } else {
          alert(result.data.Error);
        }
      });
  };
  return (
    <div>
      <div
        className="p-3 d-flex justify-content-around mt-3"
        style={{ marginLeft: "250px" }}
      >
        <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>All Players</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{playerTotal}</h5>
          </div>
        </div>
        <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>All words</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{wordTotal}</h5>
          </div>
        </div>
        <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>All Player Points</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{scoreTotal}</h5>
          </div>
        </div>
      </div>
      <div className="mt-4 px-5 pt-3" style={{ marginLeft: "250px" }}>
        <h3>List of players</h3>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
