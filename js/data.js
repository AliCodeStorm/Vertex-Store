// Sample product data initialization
const productData = {
    'p1': {
        id: 'p1',
        name: 'Wireless Headphones',
        price: 99.99,
        originalPrice: 129.99,
        stock: 15,
        image: 'images/products/headphones-1.jpg',
        images: [
            'images/products/headphones-1.jpg',
            'images/products/headphones-2.jpg',
            'images/products/headphones-3.jpg',
            'images/products/headphones-4.jpg'
        ],
        category: 'audio',
        description: 'Premium wireless headphones with noise cancellation. Experience crystal-clear sound quality with deep bass and crisp highs. Features include Bluetooth 5.0 connectivity, 30-hour battery life, and comfortable over-ear design.',
        rating: 4.5,
        reviewCount: 128,
        isNew: true,
        isFeatured: true
    },
    'p2': {
        id: 'p2',
        name: 'Smart Watch',
        price: 149.99,
        originalPrice: 189.99,
        stock: 8,
        image: 'images/products/smartwatch-1.jpg',
        images: [
            'images/products/smartwatch-1.jpg',
            'images/products/smartwatch-2.jpg',
            'images/products/smartwatch-3.jpg',
            'images/products/smartwatch-4.jpg'
        ],
        category: 'wearables',
        description: 'Track your fitness and stay connected with this smart watch. Features include heart rate monitoring, sleep tracking, GPS, water resistance up to 50m, and compatibility with iOS and Android devices. Customizable watch faces and interchangeable bands available.',
        rating: 4.3,
        reviewCount: 95,
        isNew: true,
        isFeatured: true
    },
    'p3': {
        id: 'p3',
        name: 'Bluetooth Speaker',
        price: 79.99,
        originalPrice: 99.99,
        stock: 3,
        image: 'images/products/speaker-1.jpg',
        images: [
            'images/products/speaker-1.jpg',
            'images/products/speaker-2.jpg',
            'images/products/speaker-3.jpg',
            'images/products/speaker-4.jpg'
        ],
        category: 'audio',
        description: 'Portable Bluetooth speaker with amazing sound quality. Waterproof design makes it perfect for outdoor use. Features include 12-hour battery life, built-in microphone for calls, and the ability to connect multiple speakers for stereo sound.',
        rating: 4.7,
        reviewCount: 62,
        isNew: false,
        isFeatured: true
    },
    'p4': {
        id: 'p4',
        name: 'Laptop Backpack',
        price: 49.99,
        originalPrice: 69.99,
        stock: 0,
        image: 'images/products/backpack-1.jpg',
        images: [
            'images/products/backpack-1.jpg',
            'images/products/backpack-2.jpg',
            'images/products/backpack-3.jpg',
            'images/products/backpack-4.jpg'
        ],
        category: 'accessories',
        description: 'Durable backpack with laptop compartment and USB charging port. Features include water-resistant material, anti-theft design, multiple compartments for organization, and padded shoulder straps for comfort. Fits laptops up to 15.6 inches.',
        rating: 4.2,
        reviewCount: 43,
        isNew: false,
        isFeatured: false
    },
    'p5': {
        id: 'p5',
        name: 'HD Webcam',
        price: 89.99,
        originalPrice: 109.99,
        stock: 10,
        image: 'images/products/webcam-1.jpg',
        images: [
            'images/products/webcam-1.jpg',
            'images/products/webcam-2.jpg',
            'images/products/webcam-3.jpg',
            'images/products/webcam-4.jpg'
        ],
        category: 'electronics',
        description: 'High-definition webcam perfect for video calls and streaming. Features 1080p resolution, auto-focus, light correction, noise-canceling microphone, and universal compatibility with all major video conferencing platforms.',
        rating: 4.4,
        reviewCount: 37,
        isNew: true,
        isFeatured: false
    },
    'p6': {
        id: 'p6',
        name: 'Mechanical Keyboard',
        price: 129.99,
        originalPrice: 149.99,
        stock: 7,
        image: 'images/products/keyboard-1.jpg',
        images: [
            'images/products/keyboard-1.jpg',
            'images/products/keyboard-2.jpg',
            'images/products/keyboard-3.jpg',
            'images/products/keyboard-4.jpg'
        ],
        category: 'electronics',
        description: 'Tactile mechanical keyboard for gaming and typing enthusiasts. Features RGB backlighting with customizable effects, N-key rollover, durable switches rated for 50 million keystrokes, and programmable macro keys for enhanced productivity.',
        rating: 4.8,
        reviewCount: 105,
        isNew: false,
        isFeatured: true
    },
    'p7': {
        id: 'p7',
        name: 'Wireless Mouse',
        price: 39.99,
        originalPrice: 59.99,
        stock: 12,
        image: 'images/products/mouse-1.jpg',
        images: [
            'images/products/mouse-1.jpg',
            'images/products/mouse-2.jpg',
            'images/products/mouse-3.jpg'
        ],
        category: 'electronics',
        description: 'Ergonomic wireless mouse with precision tracking. Features include adjustable DPI settings, silent click technology, 6 programmable buttons, and up to 12 months battery life. Compatible with Windows, macOS, and Linux.',
        rating: 4.6,
        reviewCount: 78,
        isNew: true,
        isFeatured: false
    },
    'p8': {
        id: 'p8',
        name: 'Smartphone Stand',
        price: 19.99,
        originalPrice: 29.99,
        stock: 20,
        image: 'images/products/stand-1.jpg',
        images: [
            'images/products/stand-1.jpg',
            'images/products/stand-2.jpg'
        ],
        category: 'accessories',
        description: 'Adjustable smartphone stand for desk or bedside use. Features include 270-degree rotation, height adjustment, stable base, and compatibility with all smartphone sizes. Perfect for video calls, watching movies, or following recipes.',
        rating: 4.1,
        reviewCount: 52,
        isNew: false,
        isFeatured: false
    },
    'p9': {
        id: 'p9',
        name: 'Wireless Earbuds',
        price: 69.99,
        originalPrice: 89.99,
        stock: 5,
        image: 'images/products/earbuds-1.jpg',
        images: [
            'images/products/earbuds-1.jpg',
            'images/products/earbuds-2.jpg',
            'images/products/earbuds-3.jpg'
        ],
        category: 'audio',
        description: 'True wireless earbuds with premium sound quality. Features include active noise cancellation, touch controls, 24-hour battery life with charging case, IPX7 waterproof rating, and built-in microphones for clear calls even in noisy environments.',
        rating: 4.5,
        reviewCount: 91,
        isNew: true,
        isFeatured: true
    },
    'p10': {
        id: 'p10',
        name: 'Portable Power Bank',
        price: 49.99,
        originalPrice: 59.99,
        stock: 15,
        image: 'images/products/powerbank-1.jpg',
        images: [
            'images/products/powerbank-1.jpg',
            'images/products/powerbank-2.jpg'
        ],
        category: 'electronics',
        description: 'High-capacity 20,000mAh power bank for charging on the go. Features include fast charging technology, dual USB ports, USB-C input/output, LED power indicator, and compact design. Charge multiple devices simultaneously.',
        rating: 4.3,
        reviewCount: 67,
        isNew: false,
        isFeatured: false
    },
    'p11': {
        id: 'p11',
        name: 'Smart Home Hub',
        price: 129.99,
        originalPrice: 159.99,
        stock: 8,
        image: 'images/products/smarthome-1.jpg',
        images: [
            'images/products/smarthome-1.jpg',
            'images/products/smarthome-2.jpg'
        ],
        category: 'smart-home',
        description: 'Central hub for controlling all your smart home devices. Features include voice control, compatibility with major smart home ecosystems, scheduling capabilities, energy monitoring, and intuitive mobile app for remote access.',
        rating: 4.4,
        reviewCount: 43,
        isNew: true,
        isFeatured: true
    },
    'p12': {
        id: 'p12',
        name: 'Fitness Tracker',
        price: 59.99,
        originalPrice: 79.99,
        stock: 0,
        image: 'images/products/fitness-1.jpg',
        images: [
            'images/products/fitness-1.jpg',
            'images/products/fitness-2.jpg',
            'images/products/fitness-3.jpg'
        ],
        category: 'wearables',
        description: 'Comprehensive fitness tracker with heart rate monitoring. Features include step counting, sleep analysis, 14+ exercise modes, water resistance, smartphone notifications, and up to 7 days of battery life on a single charge.',
        rating: 4.2,
        reviewCount: 85,
        isNew: false,
        isFeatured: false
    }
};

// Initialize localStorage with product data if not already set
function initializeData() {
    // Generate placeholder images if needed
    if (typeof window.generateProductPlaceholders === 'function') {
        // Check if we need to replace missing images
        const products = JSON.parse(localStorage.getItem('products')) || productData;
        
        Object.keys(products).forEach(key => {
            const product = products[key];
            
            // Generate placeholder images for products without images
            if (!product.images || product.images.length === 0) {
                product.images = window.generateProductPlaceholders(4);
                product.image = product.images[0];
            }
        });
        
        // Save updated products
        localStorage.setItem('products', JSON.stringify(products));
    } else {
        // Just save the original data if placeholder generator isn't available
        if (!localStorage.getItem('products')) {
            localStorage.setItem('products', JSON.stringify(productData));
        }
    }
    
    // Initialize other necessary data
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('recentlyViewed')) {
        localStorage.setItem('recentlyViewed', JSON.stringify([]));
    }
    
    // Initialize categories
    if (!localStorage.getItem('categories')) {
        const categories = [
            {
                id: 'electronics',
                name: 'Electronics',
                image: 'images/categories/electronics.jpg',
                description: 'Latest gadgets and electronic devices'
            },
            {
                id: 'audio',
                name: 'Audio',
                image: 'images/categories/audio.jpg',
                description: 'Headphones, speakers, and audio accessories'
            },
            {
                id: 'wearables',
                name: 'Wearables',
                image: 'images/categories/wearables.jpg',
                description: 'Smart watches and fitness trackers'
            },
            {
                id: 'accessories',
                name: 'Accessories',
                image: 'images/categories/accessories.jpg',
                description: 'Essential accessories for your devices'
            },
            {
                id: 'smart-home',
                name: 'Smart Home',
                image: 'images/categories/smart-home.jpg',
                description: 'Make your home smarter with these devices'
            }
        ];
        
        localStorage.setItem('categories', JSON.stringify(categories));
    }
}

// Track recently viewed products
function trackProductView(productId) {
    if (!productId) return;
    
    let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    
    // Remove if already in list
    recentlyViewed = recentlyViewed.filter(id => id !== productId);
    
    // Add to beginning of list
    recentlyViewed.unshift(productId);
    
    // Keep only the last 10 items
    if (recentlyViewed.length > 10) {
        recentlyViewed = recentlyViewed.slice(0, 10);
    }
    
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
}

// Call on page load
document.addEventListener('DOMContentLoaded', initializeData);

// Export functions for other scripts
window.storeData = {
    getProducts: function() {
        return JSON.parse(localStorage.getItem('products')) || {};
    },
    getProduct: function(productId) {
        const products = this.getProducts();
        return products[productId] || null;
    },
    getRecentlyViewed: function() {
        const recentIds = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
        const products = this.getProducts();
        return recentIds.map(id => products[id]).filter(p => p !== undefined);
    },
    getFeaturedProducts: function() {
        const products = this.getProducts();
        return Object.values(products).filter(p => p.isFeatured);
    },
    getNewArrivals: function() {
        const products = this.getProducts();
        return Object.values(products).filter(p => p.isNew);
    },
    getCategories: function() {
        return JSON.parse(localStorage.getItem('categories')) || [];
    },
    getCategory: function(categoryId) {
        const categories = this.getCategories();
        return categories.find(c => c.id === categoryId) || null;
    },
    getProductsByCategory: function(categoryId) {
        const products = this.getProducts();
        return Object.values(products).filter(p => p.category === categoryId);
    },
    trackProductView: trackProductView
}; 