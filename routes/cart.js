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

// Render cart page
router.get('/view', (req, res) => {
  res.render('cart', {
    title: 'Your Shopping Cart',
    user: req.session.user || null
  });
});

// Get cart contents
router.get('/', isAuthenticated, (req, res) => {
  const userId = req.session.user.id;
  
  db.get('SELECT cart FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    let cart = [];
    try {
      cart = JSON.parse(user.cart || '[]');
    } catch (e) {
      console.error('Error parsing cart:', e);
    }
    
    res.json({ success: true, cart });
  });
});

// // Add item to cart
// router.post('/add', isAuthenticated, (req, res) => {
//   const userId = req.session.user.id;
//   const { productId, quantity = 1 } = req.body;
  
//   if (!productId) {
//     return res.status(400).json({ success: false, message: 'Product ID is required' });
//   }
  
//   // First get the current cart
//   db.get('SELECT cart FROM users WHERE id = ?', [userId], (err, user) => {
//     if (err || !user) {
//       return res.status(500).json({ success: false, message: 'Error accessing cart' });
//     }
    
//     let cart = [];
//     try {
//       cart = JSON.parse(user.cart || '[]');
//     } catch (e) {
//       console.error('Error parsing cart:', e);
//     }
    
//     // Check if product exists
//     db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
//       if (err || !product) {
//         return res.status(404).json({ success: false, message: 'Product not found' });
//       }
      
//       // Check if product is already in cart
//       const existingItem = cart.find(item => item.productId === productId);
      
//       if (existingItem) {
//         existingItem.quantity += quantity;
//       } else {
//         cart.push({
//           productId,
//           title: product.title,
//           price: product.price,
//           image_url: product.image_url,
//           quantity
//         });
//       }
      
//       // Update the cart in the database
//       db.run('UPDATE users SET cart = ? WHERE id = ?', 
//         [JSON.stringify(cart), userId],
//         function(err) {
//           if (err) {
//             return res.status(500).json({ success: false, message: 'Error updating cart' });
//           }
          
//           res.json({ 
//             success: true, 
//             message: 'Product added to cart',
//             cart
//           });
//         }
//       );
//     });
//   });
// });

// Remove item from cart
router.post('/remove', isAuthenticated, (req, res) => {
  const userId = req.session.user.id;
  const { productId } = req.body;
  
  if (!productId) {
    return res.status(400).json({ success: false, message: 'Product ID is required' });
  }
  
  db.get('SELECT cart FROM users WHERE id = ?', [userId], (err, user) => {
    if (err || !user) {
      return res.status(500).json({ success: false, message: 'Error accessing cart' });
    }
    
    let cart = [];
    try {
      cart = JSON.parse(user.cart || '[]');
      cart = cart.filter(item => item.productId != productId);
    } catch (e) {
      console.error('Error parsing cart:', e);
    }
    
    db.run('UPDATE users SET cart = ? WHERE id = ?', 
      [JSON.stringify(cart), userId],
      function(err) {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error updating cart' });
        }
        
        res.json({ 
          success: true, 
          message: 'Item removed from cart',
          cart
        });
      }
    );
  });
});

// Update item quantity
router.post('/update', isAuthenticated, (req, res) => {
  const userId = req.session.user.id;
  const { productId, quantity } = req.body;
  
  if (!productId || !quantity) {
    return res.status(400).json({ success: false, message: 'Product ID and quantity are required' });
  }
  
  db.get('SELECT cart FROM users WHERE id = ?', [userId], (err, user) => {
    if (err || !user) {
      return res.status(500).json({ success: false, message: 'Error accessing cart' });
    }
    
    let cart = [];
    try {
      cart = JSON.parse(user.cart || '[]');
      const item = cart.find(item => item.productId == productId);
      
      if (item) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          cart = cart.filter(item => item.productId != productId);
        } else {
          item.quantity = quantity;
        }
      }
    } catch (e) {
      console.error('Error parsing cart:', e);
    }
    
    db.run('UPDATE users SET cart = ? WHERE id = ?', 
      [JSON.stringify(cart), userId],
      function(err) {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error updating cart' });
        }
        
        res.json({ 
          success: true, 
          message: 'Cart updated',
          cart
        });
      }
    );
  });
});

// Add item to cart
router.post('/add', isAuthenticated, (req, res) => {
  const userId = req.session.user.id;
  let { productId, quantity = 1 } = req.body;
  productId = Number(productId); // Ensure it's a number

  if (!productId) {
    return res.status(400).json({ success: false, message: 'Product ID is required' });
  }

  db.get('SELECT cart FROM users WHERE id = ?', [userId], (err, user) => {
    if (err || !user) {
      return res.status(500).json({ success: false, message: 'Error accessing cart' });
    }

    let cart = [];
    try {
      cart = JSON.parse(user.cart || '[]');
    } catch (e) {
      console.error('Error parsing cart:', e);
    }

    db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
      if (err || !product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      const existingItem = cart.find(item => item.productId === productId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          productId,
          title: product.title,
          price: product.price,
          image_url: product.image_url,
          quantity
        });
      }

      db.run('UPDATE users SET cart = ? WHERE id = ?', 
        [JSON.stringify(cart), userId],
        function(err) {
          if (err) {
            return res.status(500).json({ success: false, message: 'Error updating cart' });
          }

          res.json({ 
            success: true, 
            message: 'Product added to cart',
            cart
          });
        }
      );
    });
  });
});

module.exports = router;