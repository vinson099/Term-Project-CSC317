const express = require("express");
const router = express.Router();
const db = require("../db.js");

// Get user profile data
router.get("/:username", (req, res) => {
  const username = req.params.username;
  
  db.get("SELECT id, fname, username FROM users WHERE username = ?", 
    [username], 
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    });
});

// Update user profile
router.post("/update", (req, res) => {
  const { username, fname } = req.body;

  db.run("UPDATE users SET fname = ? WHERE username = ?",
    [fname, username],
    (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update profile" });
      }
      res.json({ success: true, message: "Profile updated successfully" });
    });
});

module.exports = router;