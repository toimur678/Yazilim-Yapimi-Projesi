import express from "express"; // express
import con from "../utils/db.js"; // database connection
import jwt from "jsonwebtoken"; // jwt
import multer from "multer"; // multer
import path from "path"; // path

const router = express.Router(); // router

// Admin login backend
router.post("/adminlogin", (req, res) => {
  const sql1 = "SELECT * from admin Where email = ? and password = ?"; // connected with "admin" table
  con.query(sql1, [req.body.email, req.body.password], (err, result) => {
    if (err) {
      return res.json({ loginStatus: false, Error: "Query error" });
    }
    if (result.length > 0) {
      const email = result[0].email;
      const token = jwt.sign(
        { role: "admin", email: email, id: result[0].id },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
      const insertQuery =
        "INSERT INTO loginhistory (name, email) VALUES (?, ?)"; // connected with "loginhistory" table
      con.query(insertQuery, [result[0].name, result[0].email], (err) => {
        if (err) {
          console.error("Error adding login history:", err);
          return res.json({ loginStatus: false, Error: "Query error" });
        }
        res.cookie("token", token);
        return res.json({ loginStatus: true, id: result[0].id });
      });
    } else {
      return res.json({ loginStatus: false, Error: "wrong email or password" });
    }
  });
});

// Reset Password Backend
router.put("/resetpass", (req, res) => {
  const { email, password, otp } = req.body;

  if (!email || !password || !otp) {
    return res.json({
      Status: false,
      Error: "Email, password, and OTP are required",
    });
  }
  if (otp !== "000000") {
    // OTP is 000000
    return res.json({ Status: false, Error: "Invalid OTP" });
  }
  const sql = "UPDATE admin SET password = ? WHERE email = ?"; // connected with "admin" table
  con.query(sql, [password, email], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true });
  });
});

// image upload backend
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/Images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
});
// image upload backend

// Adding words, image upload backend
router.post("/add_words", upload.single("image"), (req, res) => {
  const sql = `INSERT INTO words 
    (english, turkish, sentence, image) 
    VALUES (?)`; // connected with "words" table

  const values = [
    req.body.english,
    req.body.turkish,
    req.body.sentence,
    req.file.filename,
  ];

  con.query(sql, [values], (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true });
  });
});

// Showing all the words
router.get("/words", (req, res) => {
  const sql = "SELECT * FROM words"; // connected with "words" table
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

// Getting random words for the question
router.get("/random_word", (req, res) => {
  const sql = "SELECT * FROM random;"; // connected with "words" table
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

// Getting all the word IDs
router.get("/words_id/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM words WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

// Deleting everything from table answers and then adding random words to the table
router.delete("/post_random_words", (req, res) => {
  const sql1 = "DELETE FROM answers;"; // connected with "answers" table
  const sql2 = "CALL add_random_words();"; // connected with "add_random_words" stored procedure

  con.query(sql1, (err, result1) => {
    if (err) {
      return res.json({ Status: false, Error: "Query Error: " + err });
    }
    con.query(sql2, (err, result2) => {
      if (err) {
        return res.json({ Status: false, Error: "Query Error: " + err });
      }
      return res.json({ Status: true, Result: result2 });
    });
  });
});

// Editing word informations (english, turkish, sentence)
router.put("/edit_words/:id", (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE words 
        set english = ?, turkish = ?, sentence = ?
        Where id = ?`; // connected with "words" table
  const values = [req.body.english, req.body.turkish, req.body.sentence];
  con.query(sql, [...values, id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

// Submitting the answer
router.put("/submit_ans/:id", (req, res) => {
  const id = req.params.id;
  const sql = `INSERT INTO answers (turkish, sentence) VALUES (?, ?);`; // connected with "answers" table
  const sql2 = `CALL delete_first_row();`; // connected with "delete_first_row" stored procedure
  const values = [req.body.turkish, req.body.sentence];

  con.beginTransaction((err) => {
    if (err) {
      return res.json({ Status: false, Error: "Transaction Error: " + err });
    }

    con.query(sql, values, (err, result) => {
      if (err) {
        return con.rollback(() => {
          res.json({ Status: false, Error: "Query Error: " + err });
        });
      }

      con.query(sql2, (err, result) => {
        if (err) {
          return con.rollback(() => {
            res.json({
              Status: false,
              Error: "Stored Procedure Error: " + err,
            });
          });
        }

        con.commit((err) => {
          if (err) {
            return con.rollback(() => {
              res.json({ Status: false, Error: "Commit Error: " + err });
            });
          }

          res.json({ Status: true, Result: result });
        });
      });
    });
  });
});

// Checking if all the questions are answered or not
router.post("/all_ans_submit", (req, res) => {
  const sql = "SELECT COUNT(*) AS allsubmit FROM random;"; // connected with "random" table
  const sql2 = "CALL insert_result_history();"; // connected with "insert_result_history" stored procedure

  con.query(sql, (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });

    const count = result[0].allsubmit;
    if (count === 0) {
      con.query(sql2, (err2, result2) => {
        if (err2) return res.json({ loginStatus: false, Error: "Query error" });

        return res.json({ loginStatus: true });
      });
    } else {
      return res.json({
        loginStatus: false,
        Error: "Please Answer All The Questions!", // if not all the questions are answered
      });
    }
  });
});

// Checking if you got full marks or not
router.post("/final_submit", (req, res) => {
  const sql1 =
    "SELECT score AS finalscore FROM resulthistory ORDER BY id DESC LIMIT 1;"; // connected with "resulthistory" table
  const sql2 = "SELECT get_latest_word_limit() AS maxLIMIT;"; // connected with "get_latest_word_limit" stored procedure
  const sql3 = "CALL insert_timerend();"; // connected with "insert_timerend" stored procedure

  con.query(sql1, (err, result1) => {
    if (err) {
      return res.json({ loginStatus: false, Error: "Query error" });
    }
    const finalSC = result1[0].finalscore;

    con.query(sql2, (err, result2) => {
      if (err) {
        return res.json({ loginStatus: false, Error: "Query error" });
      }
      const maxL = result2[0].maxLIMIT;

      if (finalSC === maxL) {
        con.query(sql3, (err, result3) => {
          if (err) {
            return res.json({ loginStatus: false, Error: "Query errorrrrr" });
          }
          return res.json({ loginStatus: true });
        });
      } else {
        return res.json({
          loginStatus: false,
          Error: "Not enough score! Please take exam again!", // if not full marks
        });
      }
    });
  });
});

// Deleting words by ID
router.delete("/delete_words/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from words where id = ?"; // connected with "words" table
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

// Adding player or users to the database
router.post("/add_player", (req, res) => {
  const { name, surname, age, email, password } = req.body;
  const sql =
    "INSERT INTO admin (`name`, `surname`, `age`, `email`, `password`) VALUES (?, ?, ?, ?, ?)"; // connected with "admin" table
  con.query(sql, [name, surname, age, email, password], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true });
  });
});

// Getting a result history of a player
router.get("/result_history", (req, res) => {
  const sql =
    "SELECT * FROM resulthistory WHERE loginID = (SELECT get_latest_player_id());"; // connected with "resulthistory" table
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

// Showing Take Exam button after the time is up
router.get("/check_time", (req, res) => {
  const sql = "CALL check_time();"; // connected with "check_time" stored procedure

  con.query(sql, (err, result) => {
    if (err) {
      console.error("Query Error: ", err);
      return res.json({ Status: false, Error: "Query Error" });
    }
    if (result.length > 0) {
      return res.json({ Status: true, Result: result[0] });
    } else {
      return res.json({ Status: false, Error: "No result found" });
    }
  });
});

// Remainng time backend
router.get("/remaining_time", (req, res) => {
  const sql = "SELECT calculate_timediff() AS timeDiff;";
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Query Error: ", err);
      return res.json({ Status: false, Error: "Query Error" });
    }
    if (result.length > 0) {
      return res.json({ Status: true, Result: result[0] });
    } else {
      return res.json({ Status: false, Error: "No result found" });
    }
  });
});

// Getting score
router.get("/score_result", (req, res) => {
  const sql = "SELECT * FROM resulthistory ORDER BY id DESC LIMIT 1;"; // connected with "resulthistory" table
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    if (result.length > 0) {
      return res.json({ Status: true, Result: result[0] });
    } else {
      return res.json({ Status: false, Error: "No results found" });
    }
  });
});

// Getting a full report
router.get("/report", (req, res) => {
  const sql = "SELECT * FROM report_view;"; // connected with "report_view" view
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

// Word limit setting backend
router.post("/add_word_limit", (req, res) => {
  const sql = "INSERT INTO wordlimit (`newLimit`) VALUES (?)"; // connected with "wordlimit" table
  con.query(sql, [req.body.limit], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true });
  });
});

// Total player count
router.get("/player_count", (req, res) => {
  const sql = "select count(id) as admin from admin"; // connected with "admin" table
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

// Total word count
router.get("/word_count", (req, res) => {
  const sql = "select count(id) as word from words"; // connected with "words" table
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

// Total score count
router.get("/score_count", (req, res) => {
  const sql = "select sum(score) as totalscore from resulthistory"; // connected with "resulthistory" table
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

// Getting all the player records
router.get("/player_records", (req, res) => {
  const sql = "select * from admin"; // connected with "admin" table
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

// Logging out backend
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true });
});

export { router as adminRouter };
