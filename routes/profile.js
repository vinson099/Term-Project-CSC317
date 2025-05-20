const express = require("express");
const router = express.Router();
const db = require("../data/db");

// Get user profile data
router.get("/", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = req.session.user.id;
    console.log('Fetching profile for user:', userId); // Debug log

    // Get user data including addresses and payment info
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: "Database error" });
        }

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        console.log('Raw user data:', user); // Debug log

        // Parse addresses and payment info
        let addresses = [];
        let payments = [];
        try {
            addresses = user.addresses ? JSON.parse(user.addresses) : [];
            payments = user.payment ? JSON.parse(user.payment) : [];
            console.log('Parsed addresses:', addresses); // Debug log
            console.log('Parsed payments:', payments); // Debug log
        } catch (e) {
            console.error('Error parsing user data:', e);
        }

        // Send the user data
        const responseData = {
            fname: user.fname,
            username: user.username,
            addresses: addresses,
            payments: payments
        };
        
        console.log('Sending response:', responseData); // Debug log
        res.json(responseData);
    });
});

module.exports = router;