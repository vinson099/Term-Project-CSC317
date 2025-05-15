const express = require("express");
const router = express.Router();
const db = require("../data/db");

// Get user profile data
router.get("/", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    // Send the user data from session
    res.json({
        fname: req.session.user.fname,
        username: req.session.user.username
    });
});

module.exports = router;