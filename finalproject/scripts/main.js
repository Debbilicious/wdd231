// main.js - ES Module
import { loadProducts, filterProducts, sortProducts } from './products.js';
import { openModal, closeModal, initModal } from './modal.js';

// ========================================
// GLOBAL VARIABLES
// ========================================
let allProducts = [];
let currentCategory = 'all';

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize all functionality
    initNavigation();
    setActivePage(); // WAYFINDING - Set active page link
    initLastModified();
    initNewsletterForm();
    initModal();
    
    // Load products if on home or gallery page
    const productsGrid = document.getElementById('productsGrid') || document.getElementById('galleryGrid');
    if (productsGrid) {
        await loadAllProducts();
    }
    
    // Initialize filter buttons
    initFilterButtons();
    
    // Initialize sort functionality (gallery page)
    initSortFunctionality();
    
    // Initialize contact form timestamp
    initContactForm();
    
    // Display form data on thank you page
    displayFormData();
    
    // Load user preferences from localStorage
    loadUserPreferences();
});

// ========================================
// NAVIGATION
// ========================================
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    
    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', 
                hamburger.classList.contains('active'));
        });
        
        // Close menu when clicking on a link
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// ========================================
// WAYFINDING - ACTIVE PAGE NAVIGATION
// ========================================
function setActivePage() {
    const navLinks = document.querySelectorAll('nav a');
    const currentURL = window.location.href;

    navLinks.forEach((link) => {
        // Remove active class from all links first
        link.classList.remove('active');
        
        // Add active class to the current page link
        if (currentURL === link.href || currentURL.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });
}

// ========================================
// LOAD PRODUCTS - FETCH API WITH TRY/CATCH
// ========================================
async function loadAllProducts() {
    try {
        // Fetch products from JSON file using Fetch API
        const response = await fetch('data/products.json');
        
        // Check if response is OK
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Parse JSON data
        const data = await response.json();
        allProducts = data.products;
        
        // Store in localStorage for persistence
        localStorage.setItem('fashionProducts', JSON.stringify(allProducts));
        
        // Display products
        displayProducts(allProducts);
        
        console.log('Products loaded successfully:', allProducts.length);
    } catch (error) {
        // Error handling
        console.error('Error loading products:', error);
        displayError();
    }
}

// ========================================
// DISPLAY PRODUCTS - ARRAY METHODS & TEMPLATE LITERALS
// ========================================
function displayProducts(products) {
    const productsGrid = document.getElementById('productsGrid') || document.getElementById('galleryGrid');
    
    if (!productsGrid) return;
    
    // Determine if we're on gallery page (show all 20) or home page (show first 15)
    const isGalleryPage = document.getElementById('galleryGrid') !== null;
    const productsToShow = isGalleryPage ? products : products.slice(0, 15);
    
    productsGrid.innerHTML = '';
    
    if (productsToShow.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; font-size: 1.2rem; color: #7f8c8d;">No products found in this category.</p>';
        return;
    }
    
    // Using forEach array method to iterate through products
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// ========================================
// CREATE PRODUCT CARD - TEMPLATE LITERALS & DOM MANIPULATION
// ========================================
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-category', product.category);
    
    // Format price using template literals
    const formattedPrice = product.price.toLocaleString();
    
    // Generate star rating
    const stars = '⭐'.repeat(Math.floor(product.rating));
    
    // Using template literals for HTML generation
    card.innerHTML = `
        <div class="product-image-container">
            <img src="${product.image}" 
                 alt="${product.name}" 
                 class="product-image"
                 loading="lazy"
                 width="300"
                 height="380">
            <span class="product-category">${product.category}</span>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price-container">
                <p class="product-price">${formattedPrice}</p>
                <div class="product-rating">
                    <span class="stars">${stars}</span>
                    <span>${product.rating}</span>
                </div>
            </div>
            <span class="stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                ${product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
            <button class="view-details" data-id="${product.id}">View Details</button>
        </div>
    `;
    
    // DOM Manipulation - Add event listeners
    const viewBtn = card.querySelector('.view-details');
    viewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(product);
    });
    
    // Also open modal when clicking the card
    card.addEventListener('click', () => {
        openModal(product);
    });
    
    return card;
}

// ========================================
// FILTER FUNCTIONALITY - ARRAY FILTER METHOD
// ========================================
function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Get category
            const category = btn.getAttribute('data-category');
            currentCategory = category;
            
            // Using filter array method
            const filteredProducts = category === 'all' 
                ? allProducts 
                : allProducts.filter(p => p.category === category);
            
            displayProducts(filteredProducts);
        });
    });
}

// ========================================
// SORT FUNCTIONALITY - ARRAY SORT METHOD (Gallery Page)
// ========================================
function initSortFunctionality() {
    const sortSelect = document.getElementById('sortSelect');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            const sortValue = e.target.value;
            let sortedProducts = [...allProducts];
            
            // Apply current filter first using filter method
            if (currentCategory !== 'all') {
                sortedProducts = sortedProducts.filter(p => p.category === currentCategory);
            }
            
            // Using sort array method
            switch(sortValue) {
                case 'price-low':
                    sortedProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    sortedProducts.sort((a, b) => b.price - a.price);
                    break;
                case 'name':
                    sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'rating':
                    sortedProducts.sort((a, b) => b.rating - a.rating);
                    break;
                default:
                    // Keep original order
                    break;
            }
            
            displayProducts(sortedProducts);
        });
    }
}

// ========================================
// DISPLAY ERROR
// ========================================
function displayError() {
    const productsGrid = document.getElementById('productsGrid') || document.getElementById('galleryGrid');
    if (productsGrid) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                <p style="font-size: 1.2rem; color: #e74c3c;">
                    Oops! Unable to load products. Please try again later.
                </p>
            </div>
        `;
    }
}

// ========================================
// LAST MODIFIED DATE
// ========================================
function initLastModified() {
    const lastModifiedElement = document.getElementById('lastModified');
    if (lastModifiedElement) {
        const lastModified = new Date(document.lastModified);
        lastModifiedElement.textContent = lastModified.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// ========================================
// NEWSLETTER FORM - LOCAL STORAGE
// ========================================
function initNewsletterForm() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            // Store in localStorage
            const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
            if (!subscribers.includes(email)) {
                subscribers.push(email);
                localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
                
                alert('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
            } else {
                alert('You are already subscribed!');
            }
        });
    });
}

// ========================================
// CONTACT FORM TIMESTAMP
// ========================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const timestampField = document.getElementById('timestamp');
    
    if (contactForm && timestampField) {
        // Set timestamp when form loads
        timestampField.value = new Date().toISOString();
        
        // Update timestamp when form is submitted
        contactForm.addEventListener('submit', (e) => {
            timestampField.value = new Date().toISOString();
        });
    }
}

// ========================================
// DISPLAY FORM DATA (Thank You Page) - URL SEARCH PARAMS
// ========================================
function displayFormData() {
    const submissionDetails = document.getElementById('submissionDetails');
    
    if (submissionDetails) {
        const urlParams = new URLSearchParams(window.location.search);
        
        if (urlParams.toString()) {
            let html = '<h2>Submission Summary</h2>';
            
            const fields = {
                'firstName': 'First Name',
                'lastName': 'Last Name',
                'email': 'Email',
                'phone': 'Phone',
                'inquiryType': 'Inquiry Type',
                'message': 'Message',
                'newsletter': 'Newsletter Subscription',
                'timestamp': 'Submitted At'
            };
            
            for (const [key, label] of Object.entries(fields)) {
                const value = urlParams.get(key);
                if (value) {
                    let displayValue = value;
                    
                    // Format timestamp
                    if (key === 'timestamp') {
                        displayValue = new Date(value).toLocaleString();
                    }
                    
                    // Format newsletter
                    if (key === 'newsletter') {
                        displayValue = value === 'yes' ? 'Yes' : 'No';
                    }
                    
                    html += `
                        <div class="detail-item">
                            <strong>${label}:</strong> ${displayValue}
                        </div>
                    `;
                }
            }
            
            submissionDetails.innerHTML = html;
        }
    }
}

// ========================================
// LOCAL STORAGE - USER PREFERENCES
// ========================================
function loadUserPreferences() {
    const preferences = localStorage.getItem('userPreferences');
    
    if (preferences) {
        const prefs = JSON.parse(preferences);
        console.log('User preferences loaded:', prefs);
    } else {
        // Set default preferences
        const defaultPrefs = {
            theme: 'light',
            itemsPerPage: 15
        };
        localStorage.setItem('userPreferences', JSON.stringify(defaultPrefs));
    }
}

// ========================================
// EXPORT FOR USE IN OTHER MODULES
// ========================================
export { allProducts, displayProducts, createProductCard };