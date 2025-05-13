const express = require("express");
const router  = express.Router();
const db      = require("../data/db");

// POST /login — authenticate user
router.post("/", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const user = `SELECT id, fname, password
               FROM users
               WHERE username = ?`;

  db.get(user, [username], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (!row) {
      return res.status(401).json({ message: `${username} doesn's exist, Please! register` });
    }

    if (row.password !== password) {
      return res.status(401).json({ message: "Wrong password, 3 more attemps left until locked" });
    }

    // Send success response with redirect URL
    res.json({ 
      success: true,
      message: `Welcome back, ${row.fname}!`,
      redirect: "/"
    });
  });
});

module.exports = router;
