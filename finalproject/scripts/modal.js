// modal.js - ES Module for Modal Functionality

let modal = null;
let modalContent = null;
let closeBtn = null;

// ========================================
// INITIALIZE MODAL
// ========================================
export function initModal() {
    modal = document.getElementById('productModal');
    modalContent = document.getElementById('modalBody');
    closeBtn = document.querySelector('.modal .close');
    
    if (!modal) return;
    
    // Close button click
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Click outside modal to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// ========================================
// OPEN MODAL WITH PRODUCT DETAILS
// ========================================
export function openModal(product) {
    if (!modal || !modalContent) return;
    
    // Format price
    const formattedPrice = `${product.price.toLocaleString()}`;
    
    // Generate star rating
    const stars = '⭐'.repeat(Math.floor(product.rating));
    
    // Create modal content
    modalContent.innerHTML = `
        <img src="${product.image}" 
             alt="${product.name}" 
             class="modal-image"
             width="600"
             height="300">
        <div class="modal-details">
            <span class="product-category">${product.category}</span>
            <h2>${product.name}</h2>
            <p class="product-price">${formattedPrice}</p>
            <div class="product-rating">
                <span>${stars}</span>
                <span>${product.rating} out of 5</span>
            </div>
            <p class="product-description">${product.description}</p>
            <p class="stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                ${product.inStock ? '✓ In Stock - Ready to Ship' : '✗ Currently Out of Stock'}
            </p>
            <div style="margin-top: 2rem;">
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Product Details:</h3>
                <p><strong>Product ID:</strong> ${product.id}</p>
                <p><strong>Category:</strong> ${product.category}</p>
                <p><strong>Rating:</strong> ${product.rating}/5.0</p>
                <p><strong>Availability:</strong> ${product.inStock ? 'In Stock' : 'Out of Stock'}</p>
            </div>
            ${product.inStock ? `
                <button class="submit-btn" style="margin-top: 2rem;" onclick="alert('Product added to cart! This is a demo.')">
                    Add to Cart
                </button>
            ` : ''}
        </div>
    `;
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Store view in localStorage
    storeProductView(product.id);
}

// ========================================
// CLOSE MODAL
// ========================================
export function closeModal() {
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

// ========================================
// STORE PRODUCT VIEW (LOCAL STORAGE)
// ========================================
function storeProductView(productId) {
    try {
        // Get existing views
        let viewHistory = JSON.parse(localStorage.getItem('productViews') || '[]');
        
        // Add new view with timestamp
        const view = {
            productId: productId,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString()
        };
        
        viewHistory.push(view);
        
        // Keep only last 50 views
        if (viewHistory.length > 50) {
            viewHistory = viewHistory.slice(-50);
        }
        
        // Save back to localStorage
        localStorage.setItem('productViews', JSON.stringify(viewHistory));
        
        console.log('Product view stored:', view);
    } catch (error) {
        console.error('Error storing product view:', error);
    }
}

// ========================================
// GET VIEWING HISTORY
// ========================================
export function getViewingHistory() {
    try {
        return JSON.parse(localStorage.getItem('productViews') || '[]');
    } catch (error) {
        console.error('Error getting viewing history:', error);
        return [];
    }
}

// ========================================
// GET MOST VIEWED PRODUCTS
// ========================================
export function getMostViewedProducts() {
    const views = getViewingHistory();
    const productCounts = {};
    
    views.forEach(view => {
        productCounts[view.productId] = (productCounts[view.productId] || 0) + 1;
    });
    
    // Convert to array and sort by count
    return Object.entries(productCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([productId, count]) => ({ productId: parseInt(productId), views: count }));
}

// ========================================
// CLEAR VIEWING HISTORY
// ========================================
export function clearViewingHistory() {
    localStorage.removeItem('productViews');
    console.log('Viewing history cleared');
}