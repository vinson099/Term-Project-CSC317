document.addEventListener('DOMContentLoaded', function() {
  // Load cart when page loads
  loadCart();
  
  // Add event listeners for cart operations
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('add-to-cart-btn')) {
      const productId = Number(event.target.getAttribute('data-product-id'));
      addToCart(productId);
    }
    
    if (event.target.classList.contains('remove-from-cart')) {
      const productId = Number(event.target.getAttribute('data-product-id'));
      removeFromCart(productId);
    }
    
    if (event.target.classList.contains('update-quantity')) {
      const productId = Number(event.target.getAttribute('data-product-id'));
      const quantity = document.querySelector(`.quantity-input[data-product-id="${productId}"]`).value;
      updateCartItem(productId, quantity);
    }
  });
});

async function loadCart() {
  try {
    const response = await fetch('/cart');
    const data = await response.json();

    if (data.success) {
      displayCart(data.cart);
      updateCartCounter(data.cart);
    } else {
      console.error('Failed to load cart:', data.message);
    }
  } catch (error) {
    console.error('Error loading cart:', error);
  }
}

async function addToCart(productId) {
  try {
    const response = await fetch('/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId })
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert('Item added to cart!');
      displayCart(data.cart);
      updateCartCounter(data.cart);
    } else {
      alert(data.message || 'Failed to add item to cart');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    alert('Error adding item to cart');
  }
}

async function removeFromCart(productId) {
  try {
    const response = await fetch('/cart/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId })
    });
    
    const data = await response.json();
    
    if (data.success) {
      displayCart(data.cart);
      updateCartCounter(data.cart);
    } else {
      alert(data.message || 'Failed to remove item from cart');
    }
  } catch (error) {
    console.error('Error removing from cart:', error);
  }
}

async function updateCartItem(productId, quantity) {
  try {
    const response = await fetch('/cart/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId, quantity: parseInt(quantity) })
    });
    
    const data = await response.json();
    
    if (data.success) {
      displayCart(data.cart);
      updateCartCounter(data.cart);
    } else {
      alert(data.message || 'Failed to update cart');
    }
  } catch (error) {
    console.error('Error updating cart:', error);
  }
}

function displayCart(cart) {
  const cartContainer = document.getElementById('cart-items');
  
  if (!cartContainer) {
    console.error('Cart container not found');
    return;
  }
  
  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty</p>';
    return;
  }
  
  let totalPrice = 0;
  let html = '<ul class="cart-list">';
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;
    
    html += `
      <li class="cart-item">
        <div class="cart-item-image">
          <img src="${item.image_url}" alt="${item.title}">
        </div>
        <div class="cart-item-details">
          <h3>${item.title}</h3>
          <p>$${item.price.toFixed(2)}</p>
          <div class="quantity-controls">
            <input type="number" class="quantity-input" data-product-id="${item.productId}" value="${item.quantity}" min="1">
            <button class="update-quantity" data-product-id="${item.productId}">Update</button>
          </div>
          <button class="remove-from-cart" data-product-id="${item.productId}">Remove</button>
        </div>
        <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
      </li>
    `;
  });
  
  html += '</ul>';
  html += `<div class="cart-total">Total: $${totalPrice.toFixed(2)}</div>`;
  html += `<button id="checkout-btn" class="checkout-btn">Proceed to Checkout</button>`;
  
  cartContainer.innerHTML = html;
  
  // Add event listener for checkout button
  document.getElementById('checkout-btn').addEventListener('click', function() {
    alert('Checkout functionality to be implemented!');
  });
}

function updateCartCounter(cart) {
  const cartCounter = document.getElementById('cart-counter');
  if (!cartCounter) return;
  
  let itemCount = 0;
  cart.forEach(item => {
    itemCount += item.quantity;
  });
  
  cartCounter.textContent = itemCount;
}
