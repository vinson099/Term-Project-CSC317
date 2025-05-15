document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Fetch user profile data
    const response = await fetch('/profile');
    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/login.html';
        return;
      }
      throw new Error('Failed to load profile');
    }
    
    const user = await response.json();
    if (user) {
      // Update the account information section
      document.getElementById('full-name').value = user.fname;
      document.getElementById('email').value = user.username;
    }
  } catch (err) {
    console.error('Failed to load profile:', err);
    alert('Failed to load profile data');
  }

  // Handle logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        const response = await fetch('/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        if (data.success) {
          window.location.href = '/login.html';
        } else {
          alert('Logout failed. Please try again.');
        }
      } catch (error) {
        console.error('Logout error:', error);
        alert('Logout failed. Please try again.');
      }
    });
  }
});
