const express = require("express");
const router = express.Router();
const db = require('../db.js');

router.post("/", (req, res) => {
    const { fname, username, password } = req.body;
  
    if (!fname || !username || !password) {
      return res.status(400).json({ message: "Name, username and password are all required" });
    }
  
    // First check if username already exists
    db.get("SELECT username FROM users WHERE username = ?", [username], (err, row) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      
      if (row) {
        return res.status(400).json({ message: "Username already exists" });
      }
  
      // If username doesn't exist, create new user
      const insertUser = `INSERT INTO users (fname, username, password)
                        VALUES (?, ?, ?)`;
  
      db.run(insertUser, [fname, username, password], function(err) {
        if (err) {
          return res.status(500).json({ message: "Registration failed" });
        }
        res.json({ 
          success: true,
          message: "Registration successful! You can now login.",
          redirect: "/login.html"
        });
      });
    });
});

module.exports = router;