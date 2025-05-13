document.addEventListener('DOMContentLoaded', () => {
  // Get username from localStorage (set during login)
  const username = localStorage.getItem('username');
  if (!username) {
    window.location.href = '/login.html';
    return;
  }

  // Fetch user profile data
  fetch(`/profile/${username}`)
    .then(res => res.json())
    .then(user => {
      document.querySelector('.user-name').textContent = user.fname;
      document.querySelector('.user-email').textContent = user.username;
      document.getElementById('full-name').value = user.fname;
      document.getElementById('email').value = user.username;
    })
    .catch(err => {
      console.error('Failed to load profile:', err);
      alert('Failed to load profile data');
    });

  // Handle profile form submission
  document.querySelector('.profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const updatedData = {
      username: document.getElementById('email').value,
      fname: document.getElementById('full-name').value
    };

    fetch('/profile/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        alert('Profile updated successfully');
      } else {
        alert('Failed to update profile');
      }
    })
    .catch(err => {
      console.error('Error updating profile:', err);
      alert('Error updating profile');
    });
  });

    // Handle logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    async function handleLogout() {
    try {
        const response = await fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        
        if (data.success) {
            // Clear local storage
            localStorage.removeItem('user');
            
            // Redirect to login page
            window.location.href = '/login.html';
        } else {
            alert('Logout failed. Please try again.');
        }
    } catch (error) {
        console.error('Logout error:', error);
        alert('Logout failed. Please try again.');
    }
}
});
