const sqlite3 = require("sqlite3");
const path    = require("path");

// Open (or create) the database file
const db = new sqlite3.Database(path.join(__dirname, "database.sqlite"), (err) => {
  if (err) console.error("Could not open database:", err.message);
  else      console.log("Connected to SQLite database.");
});

db.serialize(() => {
  // If you ever need to reset, uncomment the next line:
  //db.run("DROP TABLE IF EXISTS users");

  db.run(
    `CREATE TABLE IF NOT EXISTS users (
       id       INTEGER PRIMARY KEY AUTOINCREMENT,
       fname    TEXT,
       username TEXT UNIQUE NOT NULL,
       password TEXT NOT NULL
     );`,
    (err) => {
      if (err) console.error("Error creating users table:", err.message);
      else      console.log("Users table is ready.");
    }
  );
});

module.exports = db;




// const sqlite3= require("sqlite3");
// const path = require("path")
// const db = new sqlite3.Database('./database.sqlite');
// db.serialize(() => {
//     // If you ever need to reset, uncomment the next line:
//     // db.run("DROP TABLE IF EXISTS users");
// db.run (`
//     CREATE TABLE IF NOT EXISTS users(
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     fname TEXT,
//     username TEXT UNIQUE NOT NULL,
//     password TEXT NOT NULL
//     )
//     `)}
//     module.exports = db;
