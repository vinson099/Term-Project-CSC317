// Function to display messages in the message box
function showMessage(message, type = 'error') {
    const messageBox = document.getElementById('message-box');
    messageBox.textContent = message;
    messageBox.className = `message-box ${type}`;
    messageBox.style.display = 'block';
    
    // Auto-hide success messages after 3 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 3000);
    }
}

document.getElementById('register-btn').addEventListener('click', async() => {
    const fname = document.getElementById('register-name').value;
    const username = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if(!fname || !username || !password) {
        return showMessage('Please fill in all fields');
    }
    
    if(password !== confirmPassword) {
        return showMessage("Passwords do not match");
    }
    
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fname, username, password })
        });

        const result = await response.json();
        
        if (response.ok && result.success) {
            showMessage(result.message, 'success');
            
        } else {
            showMessage(result.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showMessage('An error occurred during registration');
    }
});

// for login
document.getElementById("login-btn").addEventListener("click", async() => {
    const username = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
  
    if (!username || !password) {
      return showMessage("Please enter both username and password");
    }

    try {
      const resp = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await resp.json();
      
      if (resp.ok && result.success) {
        localStorage.setItem('username', username);
        showMessage(result.message, 'success');
        window.location.href = result.redirect;
      } else {
        showMessage(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      showMessage("An error occurred during login");
    }
});

document.getElementById('goToRegister').addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('register-form').style.display = 'block';
});

document.getElementById('goToLogin').addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('register-form').style.display = 'none';
  document.getElementById('login-form').style.display = 'block';
});
  
//for cart
const cartItems = document.getElementById('cart-items');
if (cartItems) {
  cartItems.innerHTML = response;
}