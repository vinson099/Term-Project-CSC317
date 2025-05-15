const sqlite3 = require("sqlite3").verbose();
const path    = require("path");

// Open (or create) the database file
const db = new sqlite3.Database(path.join(__dirname, "database.sqlite"), (err) => {
  if (err) console.error("Could not open database:", err.message);
  else      console.log("Connected to SQLite database.");
});

db.serialize(() => {
  // If you ever need to reset, uncomment the next line:
  //db.run("DROP TABLE IF EXISTS store");

  db.run(
    `CREATE TABLE IF NOT EXISTS users (
       id       INTEGER PRIMARY KEY AUTOINCREMENT,
       fname    TEXT,
       username TEXT UNIQUE NOT NULL,
       password TEXT NOT NULL,
       cart     TEXT DEFAULT '[]'
     );`,
    (err) => {
      if (err) console.error("Error creating users table:", err.message);
      else      console.log("Users table is ready.");
    }
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS products (
       id         INTEGER PRIMARY KEY AUTOINCREMENT,
       title       TEXT NOT NULL,
       price       REAL NOT NULL,
       description TEXT NOT NULL,
       image_url   TEXT NOT NULL,
       features    TEXT NOT NULL
     );`,
    (err) => {
      if (err) console.error("Error creating products table:", err.message);
      else {
        console.log("Products table is ready.");
      }
    }
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS store (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       name TEXT NOT NULL,
       price REAL NOT NULL,
       description TEXT,
       image TEXT,
       category TEXT,
       stock INTEGER DEFAULT 0
     );`,
    (err) => {
      if (err) console.error("Error creating store table:", err.message);
      else console.log("Store table is ready.");
    }
  );
});

module.exports = db;





