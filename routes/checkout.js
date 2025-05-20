const express = require('express');
const router = express.Router();
const db = require('../data/db');

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ success: false, message: 'You must be logged in' });
    }
}

// GET /checkout - Get checkout data
router.get('/', isAuthenticated, (req, res) => {
    const userId = req.session.user.id;
    
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        res.json({ 
            success: true, 
            user: {
                fname: user.fname,
                addresses: user.addresses ? JSON.parse(user.addresses) : [],
                payment: user.payment ? JSON.parse(user.payment) : []
            }
        });
    });
});

// POST /checkout/process - Process checkout
router.post('/process', isAuthenticated, (req, res) => {
    const userId = req.session.user.id;
    const { address, payment } = req.body;
    
    if (!address || !payment) {
        return res.status(400).json({ success: false, message: 'Address and payment information are required' });
    }
    
    console.log('Processing checkout for user:', userId);
    console.log('Address:', address);
    console.log('Payment:', payment);
    
    // Get user's current data
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
        if (err || !user) {
            console.error('Error getting user data:', err);
            return res.status(500).json({ success: false, message: 'Error accessing user data' });
        }
        
        console.log('Current user data:', user);
        
        // Parse existing addresses and payment methods
        let addresses = [];
        let payments = [];
        try {
            addresses = user.addresses ? JSON.parse(user.addresses) : [];
            payments = user.payment ? JSON.parse(user.payment) : [];
            console.log('Current addresses:', addresses);
            console.log('Current payments:', payments);
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
        
        // Add new address if it doesn't exist
        const addressExists = addresses.some(addr => 
            addr.line1 === address.line1 && 
            addr.city === address.city && 
            addr.state === address.state && 
            addr.zip === address.zip
        );
        
        if (!addressExists) {
            addresses.push(address);
        }
        
        // Add new payment method if it doesn't exist
        const paymentExists = payments.some(pay => 
            pay.cardNumber === payment.cardNumber && 
            pay.expiry === payment.expiry
        );
        
        if (!paymentExists) {
            payments.push(payment);
        }
        
        console.log('Updated addresses:', addresses);
        console.log('Updated payments:', payments);
        
        // Update user with new address and payment method, and clear cart
        const updateQuery = 'UPDATE users SET addresses = ?, payment = ?, cart = ? WHERE id = ?';
        const updateParams = [JSON.stringify(addresses), JSON.stringify(payments), '[]', userId];
        
        console.log('Update query:', updateQuery);
        console.log('Update params:', updateParams);
        
        db.run(updateQuery, updateParams, function(err) {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ success: false, message: 'Error updating user data' });
            }
            
            console.log('Update successful. Rows affected:', this.changes);
            
            // Verify the update
            db.get('SELECT addresses, payment, cart FROM users WHERE id = ?', [userId], (err, updatedUser) => {
                if (err) {
                    console.error('Error verifying update:', err);
                } else {
                    console.log('Updated user data:', updatedUser);
                }
                
                res.json({ 
                    success: true, 
                    message: 'Checkout completed successfully'
                });
            });
        });
    });
});

module.exports = router;
