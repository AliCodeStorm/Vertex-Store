/**
 * Vertex Store - Placeholder Images Generator
 * This file generates placeholder images for the store when real images are not available
 */

// Initialize placeholders when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initPlaceholders();
});

// Initialize all placeholders
function initPlaceholders() {
    // Replace missing product images
    replaceMissingProductImages();
    
    // Replace missing banner images
    replaceMissingBannerImages();
    
    // Replace missing category images
    replaceMissingCategoryImages();
    
    // Replace missing avatars
    replaceMissingAvatars();
}

// Generate product placeholders and expose to global scope
window.generateProductPlaceholders = function(count = 1) {
    const placeholders = [];
    for (let i = 0; i < count; i++) {
        // Create a unique path for each placeholder
        placeholders.push(`data:image/svg+xml,${encodeURIComponent(createProductSVG())}`);
    }
    return placeholders;
};

// Replace missing product images with placeholders
function replaceMissingProductImages() {
    // Select all product images
    const productImages = document.querySelectorAll('.product-image img');
    
    productImages.forEach(img => {
        // Add error handler to generate placeholder if image fails to load
        img.onerror = function() {
            // Generate a placeholder with product name if available
            const productCard = img.closest('.product-card');
            const productName = productCard ? productCard.querySelector('.product-name').textContent : 'Product';
            
            const options = {
                width: 300,
                height: 300,
                text: productName,
                fontSize: 24,
                backgroundColor: getRandomColor(),
                textColor: '#ffffff'
            };
            
            generatePlaceholder(img, options);
        };
    });
}

// Replace missing banner images
function replaceMissingBannerImages() {
    // Select all banner images
    const bannerImages = document.querySelectorAll('.hero-slide img, .offer-banner img');
    
    bannerImages.forEach(img => {
        img.onerror = function() {
            const options = {
                width: 1200,
                height: 400,
                text: 'Banner Image',
                fontSize: 48,
                backgroundColor: getRandomColor(),
                textColor: '#ffffff',
                isWide: true
            };
            
            generatePlaceholder(img, options);
        };
    });
}

// Replace missing category images
function replaceMissingCategoryImages() {
    // Select all category images
    const categoryImages = document.querySelectorAll('.category-card img');
    
    categoryImages.forEach(img => {
        img.onerror = function() {
            // Get category name if available
            const categoryCard = img.closest('.category-card');
            const categoryName = categoryCard ? categoryCard.querySelector('h3').textContent : 'Category';
            
            const options = {
                width: 300,
                height: 200,
                text: categoryName,
                fontSize: 28,
                backgroundColor: getRandomColor(),
                textColor: '#ffffff'
            };
            
            generatePlaceholder(img, options);
        };
    });
}

// Replace missing avatar images
function replaceMissingAvatars() {
    // Select all avatar images
    const avatarImages = document.querySelectorAll('.user-avatar img, .agent-avatar img');
    
    avatarImages.forEach(img => {
        img.onerror = function() {
            // Get user initials if available
            const name = img.alt || 'User';
            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
            
            const options = {
                width: 100,
                height: 100,
                text: initials,
                fontSize: 36,
                backgroundColor: getRandomColor(),
                textColor: '#ffffff',
                isCircle: true
            };
            
            generatePlaceholder(img, options);
        };
    });
}

// Generate placeholder for a specific image element
function generatePlaceholder(imgElement, options) {
    const defaults = {
        width: 300,
        height: 300,
        text: 'Placeholder',
        fontSize: 24,
        backgroundColor: '#cccccc',
        textColor: '#333333',
        isCircle: false,
        isWide: false
    };
    
    const settings = { ...defaults, ...options };
    
    // Create SVG placeholder
    let svgContent;
    
    if (settings.isCircle) {
        // Circle SVG for avatars
        svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${settings.width}" height="${settings.height}" viewBox="0 0 ${settings.width} ${settings.height}">
            <circle cx="${settings.width / 2}" cy="${settings.height / 2}" r="${settings.width / 2}" fill="${settings.backgroundColor}" />
            <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${settings.fontSize}px" fill="${settings.textColor}" text-anchor="middle" dominant-baseline="middle">${settings.text}</text>
        </svg>
        `;
    } else if (settings.isWide) {
        // Wide SVG with pattern for banners
        svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${settings.width}" height="${settings.height}" viewBox="0 0 ${settings.width} ${settings.height}">
            <defs>
                <pattern id="diagonalPattern" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(45)">
                    <rect width="30" height="40" fill="${settings.backgroundColor}" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diagonalPattern)" />
            <rect width="100%" height="100%" fill="${settings.backgroundColor}" opacity="0.7" />
            <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${settings.fontSize}px" fill="${settings.textColor}" text-anchor="middle" dominant-baseline="middle">${settings.text}</text>
        </svg>
        `;
    } else {
        // Regular SVG for products and categories
        svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${settings.width}" height="${settings.height}" viewBox="0 0 ${settings.width} ${settings.height}">
            <rect width="100%" height="100%" fill="${settings.backgroundColor}" />
            <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${settings.fontSize}px" fill="${settings.textColor}" text-anchor="middle" dominant-baseline="middle">${settings.text}</text>
        </svg>
        `;
    }
    
    // Set the image src to the generated SVG
    imgElement.src = `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
    imgElement.setAttribute('alt', settings.text);
}

// Create a product SVG for inline usage
function createProductSVG() {
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
    const backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
        <rect width="100%" height="100%" fill="${backgroundColor}" />
        <rect x="75" y="60" width="150" height="150" fill="rgba(255,255,255,0.2)" rx="10" ry="10" />
        <circle cx="150" cy="135" r="50" fill="rgba(255,255,255,0.5)" />
        <text x="50%" y="75%" font-family="Arial, sans-serif" font-size="24px" fill="#ffffff" text-anchor="middle">PRODUCT</text>
    </svg>
    `;
}

// Generate a random color
function getRandomColor() {
    const colors = [
        '#3498db', // Blue
        '#e74c3c', // Red
        '#2ecc71', // Green
        '#f39c12', // Orange
        '#9b59b6', // Purple
        '#1abc9c', // Teal
        '#34495e', // Dark Blue
        '#d35400', // Burnt Orange
        '#27ae60', // Emerald
        '#8e44ad'  // Violet
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
} 