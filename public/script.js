const profileIcon = document.querySelector('.profile-icon');
 profileIcon.addEventListener('mouseenter', () => {
    profileIcon.style.transform = 'scale(1.1) rotate(5deg)';
    profileIcon.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.5)';
 });

profileIcon.addEventListener('mouseleave', () => {
    profileIcon.style.transform = '';
    profileIcon.style.boxShadow = '';
});


const links     = document.querySelectorAll('.profile-nav a');
const sections = document.querySelectorAll('.profile-content .profile-section');

links.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();

        // 1) remove .active from every link and section
        links.forEach(l    => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        // 2) add .active to the clicked link
        link.classList.add('active');

        // 3) show the matching section
        const id = link.getAttribute('href').slice(1); // Remove the '#'
        const targetSection = document.getElementById(id);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    });
});

// Show the first section by default
if (links.length > 0) {
    links[0].click(); // Simulate a click on the first link
}


// slideshow
const slideshow = document.getElementById('slideshow');


let scrollPos = 0;
setInterval(() => {
    scrollPos += 320;
    if (scrollPos >= slideshow.scrollWidth - slideshow.clientWidth) {
        scrollPos = 0;
    }
    slideshow.scrollTo({ left: scrollPos, behavior: 'smooth' });
}, 3000);
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



        