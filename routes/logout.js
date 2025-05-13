const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    // Clear session
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Logout failed" });
        }
        res.json({ success: true, message: "Logged out successfully" });
    });
});

module.exports = router;