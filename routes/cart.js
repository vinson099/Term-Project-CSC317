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

// Remove item from cart
router.post('/remove', isAuthenticated, (req, res) => {
  const userId = req.session.user.id;
  const { productId } = req.body;
  
  if (!productId) {
    return res.status(400).json({ success: false, message: 'Product ID is required' });
  }
  
  db.get('SELECT cart FROM users WHERE id = ?', [userId], (err, user) => {
    if (err || !user) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error accessing cart' });
      }

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      
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
      if (err) {
        return res.status(500).json({ success: false, message: 'Error accessing cart' });
      }

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      
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
      if (err) {
        return res.status(500).json({ success: false, message: 'Error accessing cart' });
      }

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      
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

function renderCart(cart) {
  const cartItemsContainer = document.getElementById('cart-items');
  const subtotalSpan = document.getElementById('subtotal');
  const taxSpan = document.getElementById('tax');
  const totalSpan = document.getElementById('total');

  let subtotal = 0;

  // Clear previous items
  cartItemsContainer.innerHTML = '';

  if (!cart || cart.length === 0) {
    cartItemsContainer.innerHTML = '<div class="cart-empty">Your cart is empty.</div>';
    subtotalSpan.textContent = '$0.00';
    taxSpan.textContent = '$0.00';
    totalSpan.textContent = '$0.00';
    return;
  }

  cart.forEach(item => {
    // Render each item (you can improve this markup)
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <div>
        <img src="${item.image_url}" alt="${item.title}" style="width:80px;vertical-align:middle;">
        <span>${item.title}</span>
      </div>
      <div>
        $${item.price.toFixed(2)} × ${item.quantity}
      </div>
      <div>
        $${(item.price * item.quantity).toFixed(2)}
      </div>
    `;
    cartItemsContainer.appendChild(itemDiv);

    subtotal += item.price * item.quantity;
  });

  const tax = subtotal * 0.10; // 10% tax
  const total = subtotal + tax;

  subtotalSpan.textContent = `$${subtotal.toFixed(2)}`;
  taxSpan.textContent = `$${tax.toFixed(2)}`;
  totalSpan.textContent = `$${total.toFixed(2)}`;
}
module.exports = router;