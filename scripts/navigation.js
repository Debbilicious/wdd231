// Get references to the menu toggle button and navigation
const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.getElementById('main-nav');

// Add click event listener to the hamburger button
menuToggle.addEventListener('click', () => {
    // Toggle the 'open' class on the navigation
    mainNav.classList.toggle('open');
    
    // Update ARIA attribute for accessibility
    const isExpanded = mainNav.classList.contains('open');
    menuToggle.setAttribute('aria-expanded', isExpanded);
    
    // Change hamburger icon to X when open
    if (isExpanded) {
        menuToggle.textContent = '✕';
    } else {
        menuToggle.textContent = '☰';
    }
});

// Close menu when window is resized to larger view
// This prevents the menu from staying open when switching to desktop view
window.addEventListener('resize', () => {
    if (window.innerWidth >= 640) {
        mainNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '☰';
    }
});

