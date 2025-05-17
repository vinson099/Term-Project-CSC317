const links     = document.querySelectorAll('.profile-nav a');
const sections = document.querySelectorAll('.profile-content .profile-section');

links.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();

        links.forEach(l    => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        link.classList.add('active');

        const id = link.getAttribute('href').slice(1);
        const targetSection = document.getElementById(id);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    });
});

if (links.length > 0) {
    links[0].click();
}


const slideshow = document.getElementById('slideshow');

let scrollPos = 0;
let slideshowInterval;
let isPaused = false;

function startSlideshow() {
    slideshowInterval = setInterval(() => {
        if (!isPaused) {
            scrollPos += 320;
            if (scrollPos >= slideshow.scrollWidth - slideshow.clientWidth) {
                scrollPos = 0;
            }
            slideshow.scrollTo({ left: scrollPos, behavior: 'smooth' });
        }
    }, 3000);
}

// Start the slideshow
startSlideshow();

// Pause on hover
slideshow.addEventListener('mouseenter', () => {
    isPaused = true;
});

// Resume on mouse leave
slideshow.addEventListener('mouseleave', () => {
    isPaused = false;
});

const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const goToRegister = document.getElementById('goToRegister');
        const goToLogin = document.getElementById('goToLogin');

        goToRegister.addEventListener('click', () => {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        });

        goToLogin.addEventListener('click', () => {
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
        });

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartCount();
    
    alert('Product added to cart!');
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

document.addEventListener('DOMContentLoaded', updateCartCount);

        