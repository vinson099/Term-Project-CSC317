document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is logged in
    try {
        const response = await fetch('/checkout');
        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = '/login.html';
                return;
            }
            throw new Error('Failed to load checkout data');
        }
        
        const data = await response.json();
        if (data.success && data.user) {
            // Auto-fill user data if available
            document.getElementById('name').value = data.user.fname || '';
            
            // Auto-fill address if available
            if (data.user.addresses && data.user.addresses.length > 0) {
                const address = data.user.addresses[0];
                document.getElementById('address').value = address.line1 || '';
                document.getElementById('city').value = address.city || '';
                document.getElementById('state').value = address.state || '';
                document.getElementById('zip').value = address.zip || '';
            }
        }

        // Handle form submission
        const form = document.getElementById('checkout-form');
        if (form) {
            form.addEventListener('submit', async function(e) {
                e.preventDefault(); // Prevent default form submission
                
                const address = {
                    line1: document.getElementById('address').value,
                    city: document.getElementById('city').value,
                    state: document.getElementById('state').value,
                    zip: document.getElementById('zip').value
                };

                const payment = {
                    cardName: document.getElementById('name').value,
                    cardNumber: document.getElementById('card-number').value.slice(-4),
                    expiry: document.getElementById('expiration-date').value,
                    cardType: document.getElementById('payment-method').value
                };

                try {
                    const response = await fetch('/checkout/process', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            address,
                            payment
                        })
                    });

                    const data = await response.json();
                    if (data.success) {
                        // Clear cart count in the UI
                        const cartCount = document.querySelector('.cart-count');
                        if (cartCount) {
                            cartCount.textContent = '0';
                        }
                        
                        // Clear cart from session storage
                        sessionStorage.removeItem('cart');
                        
                        alert('Order placed successfully!');
                        window.location.href = '/profile.html';
                    } else {
                        alert(data.message || 'Error processing checkout');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error processing checkout');
                }
            });
        }
    } catch (error) {
        console.error('Error checking session:', error);
        window.location.href = '/login.html';
    }
}); 