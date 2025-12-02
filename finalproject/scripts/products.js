// products.js - ES Module for Product Management

// ========================================
// LOAD PRODUCTS FROM JSON
// ========================================
export async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.products;
    } catch (error) {
        console.error('Error loading products:', error);
        throw error;
    }
}

// ========================================
// FILTER PRODUCTS BY CATEGORY
// ========================================
export function filterProducts(products, category) {
    if (category === 'all') {
        return products;
    }
    
    return products.filter(product => product.category === category);
}

// ========================================
// SORT PRODUCTS
// ========================================
export function sortProducts(products, sortBy) {
    const sortedProducts = [...products]; // Create a copy
    
    switch(sortBy) {
        case 'price-low':
            return sortedProducts.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sortedProducts.sort((a, b) => b.price - a.price);
        case 'name':
            return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        case 'rating':
            return sortedProducts.sort((a, b) => b.rating - a.rating);
        default:
            return sortedProducts;
    }
}

// ========================================
// SEARCH PRODUCTS
// ========================================
export function searchProducts(products, searchTerm) {
    const term = searchTerm.toLowerCase();
    
    return products.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
    );
}

// ========================================
// GET PRODUCT BY ID
// ========================================
export function getProductById(products, id) {
    return products.find(product => product.id === parseInt(id));
}

// ========================================
// GET PRODUCTS BY CATEGORY
// ========================================
export function getProductsByCategory(products) {
    const categories = {};
    
    products.forEach(product => {
        if (!categories[product.category]) {
            categories[product.category] = [];
        }
        categories[product.category].push(product);
    });
    
    return categories;
}

// ========================================
// GET IN-STOCK PRODUCTS
// ========================================
export function getInStockProducts(products) {
    return products.filter(product => product.inStock);
}

// ========================================
// GET OUT-OF-STOCK PRODUCTS
// ========================================
export function getOutOfStockProducts(products) {
    return products.filter(product => !product.inStock);
}

// ========================================
// FORMAT PRICE
// ========================================
export function formatPrice(price) {
    return `₦${price.toLocaleString('en-NG')}`;
}

// ========================================
// CALCULATE AVERAGE RATING
// ========================================
export function calculateAverageRating(products) {
    if (products.length === 0) return 0;
    
    const totalRating = products.reduce((sum, product) => sum + product.rating, 0);
    return (totalRating / products.length).toFixed(1);
}

// ========================================
// GET CATEGORY COUNTS
// ========================================
export function getCategoryCounts(products) {
    const counts = {};
    
    products.forEach(product => {
        counts[product.category] = (counts[product.category] || 0) + 1;
    });
    
    return counts;
}