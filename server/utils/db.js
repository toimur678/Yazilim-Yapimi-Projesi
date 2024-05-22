import mysql from "mysql"; // import mysql

const con = mysql.createConnection({
  // create connection with mysql
  host: "localhost",
  user: "root",
  password: "",
  database: "wordgame", // database name
});

con.connect(function (err) {
  if (err) {
    console.log("connection error");
  } else {
    console.log("Connected");
  }
});

export default con;
