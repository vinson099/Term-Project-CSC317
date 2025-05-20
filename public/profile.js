document.addEventListener('DOMContentLoaded', async () => {
  try {
      const response = await fetch('/profile');
      if (!response.ok) {
          if (response.status === 401) {
              window.location.href = '/login.html';
              return;
          }
          throw new Error('Failed to load profile');
      }
      
      const user = await response.json();
      console.log('Loaded user data:', user); // Debug log
      
      if (user) {
          // Update account info
          const fullNameInput = document.getElementById('full-name');
          const emailInput = document.getElementById('email');
          
          if (fullNameInput) fullNameInput.value = user.fname || '';
          if (emailInput) emailInput.value = user.username || '';

          // Update addresses section
          const addressesSection = document.getElementById('addresses');
          if (addressesSection && user.addresses) {
              const addressesList = addressesSection.querySelector('.address-list');
              if (addressesList) {
                  addressesList.innerHTML = ''; // Clear existing content
                  
                  user.addresses.forEach((address, index) => {
                      const addressCard = document.createElement('div');
                      addressCard.className = 'address-card';
                      addressCard.innerHTML = `
                          <h3>Address ${index + 1}</h3>
                          <p>${address.line1}</p>
                          <p>${address.city}, ${address.state} ${address.zip}</p>
                          <div class="address-actions">
                              <button class="btn btn-secondary edit-address" data-index="${index}">Edit</button>
                              <button class="btn btn-danger delete-address" data-index="${index}">Delete</button>
                          </div>
                      `;
                      addressesList.appendChild(addressCard);
                  });
              }
          }

          // Update payment methods section
          const paymentsSection = document.getElementById('payment-methods');
          if (paymentsSection && user.payments) {
              const paymentsList = paymentsSection.querySelector('.payment-methods-list');
              if (paymentsList) {
                  paymentsList.innerHTML = ''; // Clear existing content
                  
                  user.payments.forEach((payment, index) => {
                      const paymentCard = document.createElement('div');
                      paymentCard.className = 'payment-method-card';
                      paymentCard.innerHTML = `
                          <div class="card-info">
                              <span class="card-type">${payment.cardType}</span>
                              <span class="card-number">**** **** **** ${payment.cardNumber}</span>
                              <span class="card-expiry">Expires: ${payment.expiry}</span>
                          </div>
                          <div class="card-actions">
                              <button class="btn btn-secondary edit-payment" data-index="${index}">Edit</button>
                              <button class="btn btn-danger delete-payment" data-index="${index}">Delete</button>
                          </div>
                      `;
                      paymentsList.appendChild(paymentCard);
                  });
              }
          }
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

  // Handle navigation between sections
  const navLinks = document.querySelectorAll('.profile-nav a');
  const sections = document.querySelectorAll('.profile-section');

  navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href').substring(1);
          
          // Update active states
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
          
          sections.forEach(section => {
              section.classList.remove('active');
              if (section.id === targetId) {
                  section.classList.add('active');
              }
          });
      });
  });
}); 