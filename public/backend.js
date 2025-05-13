document.getElementById('register-btn').addEventListener('click', async() => {
    const fname = document.getElementById('register-name').value;
    const username = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if(!fname || !username || !password) {
        return alert('Please fill in all fields');
    }
    
    if(password !== confirmPassword) {
        return alert("Passwords do not match");
    }
    
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fname, username, password })
        });

        const result = await response.json();
        
        if (response.ok && result.success) {
            alert(result.message);
            
        } else {
            alert(result.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred during registration');
    }
});

// for login
document.getElementById("login-btn").addEventListener("click", async() => {
    const username = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
  
    if (!username || !password) {
      return alert("Please enter both username and password");
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
        alert(result.message);
        window.location.href = result.redirect;
      } else {
        alert(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login");
    }
});
  