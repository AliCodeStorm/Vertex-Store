// Main JavaScript file for the store

// DOM Ready Handler
document.addEventListener('DOMContentLoaded', function() {
    // Initialize real-time notifications system
    initNotifications();
    
    // Initialize search functionality
    initSearch();
    
    // Initialize mobile navigation
    initMobileNav();
    
    // Handle page-specific initialization
    const currentPage = getCurrentPage();
    initializePage(currentPage);
    
    // Setup event listeners for common elements
    setupEventListeners();
});

// Get current page based on URL
function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    if (!filename || filename === '' || filename === 'index.html') {
        return 'home';
    }
    
    return filename.replace('.html', '');
}

// Initialize page-specific functionality
function initializePage(page) {
    console.log(`Initializing page: ${page}`);
    
    switch(page) {
        case 'home':
            initializeCarousel();
            loadFeaturedProducts();
            loadNewArrivals();
            loadRecentlyViewed();
            break;
        case 'shop':
            initializeFilters();
            loadAllProducts();
            break;
        case 'product':
            initializeProductPage();
            break;
        case 'cart':
            initializeCartPage();
            break;
        case 'checkout':
            initializeCheckoutPage();
            break;
        case 'order':
            initializeOrderPage();
            break;
        case 'dashboard':
            initializeDashboardPage();
            break;
        case 'admin':
            initializeAdminPage();
            break;
    }
}

// Initialize carousel/slider functionality
function initializeCarousel() {
    const carousel = document.querySelector('.hero-carousel');
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.hero-slide');
    const dots = carousel.querySelectorAll('.dot');
    const prevBtn = carousel.querySelector('.prev-slide');
    const nextBtn = carousel.querySelector('.next-slide');
    
    let currentSlide = 0;
    
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show the current slide and make dot active
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
    
    // Add event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Add event listeners to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Auto-rotate slides every 5 seconds
    setInterval(nextSlide, 5000);
}

// Load featured products on the homepage
function loadFeaturedProducts() {
    const container = document.querySelector('.featured-products .product-grid');
    if (!container) return;
    
    const featuredProducts = window.storeData.getFeaturedProducts();
    
    container.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
    
    // Add event listeners to the Add to Cart buttons
    container.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
}

// Load new arrivals on the homepage
function loadNewArrivals() {
    const container = document.querySelector('.new-arrivals .product-grid');
    if (!container) return;
    
    const newProducts = window.storeData.getNewArrivals();
    
    container.innerHTML = newProducts.map(product => createProductCard(product)).join('');
    
    // Add event listeners to the Add to Cart buttons
    container.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
}

// Load recently viewed products
function loadRecentlyViewed() {
    const container = document.querySelector('.recently-viewed .product-carousel');
    if (!container) return;
    
    const recentlyViewed = window.storeData.getRecentlyViewed();
    
    if (recentlyViewed.length === 0) {
        // Hide the section if no recently viewed products
        const section = document.querySelector('.recently-viewed');
        if (section) section.style.display = 'none';
        return;
    }
    
    container.innerHTML = recentlyViewed.map(product => createProductCard(product)).join('');
    
    // Add event listeners to the Add to Cart buttons
    container.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
}

// Create HTML for a product card
function createProductCard(product) {
    const isInStock = product.stock > 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;
    
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.isNew ? '<span class="product-badge new">New</span>' : ''}
                ${!isInStock ? '<span class="product-badge out-of-stock">Out of Stock</span>' : ''}
                <div class="product-actions">
                    <button class="quick-view-btn" data-product-id="${product.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="wishlist-btn" data-product-id="${product.id}">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">
                    <a href="product.html?id=${product.id}">${product.name}</a>
                </h3>
                <div class="product-rating">
                    ${'<i class="fas fa-star"></i>'.repeat(Math.floor(product.rating))}
                    ${product.rating % 1 !== 0 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                    ${'<i class="far fa-star"></i>'.repeat(5 - Math.ceil(product.rating))}
                    <span>${product.rating} (${product.reviewCount})</span>
                </div>
                <div class="product-price">
                    ${product.originalPrice > product.price ? 
                        `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                </div>
                <div class="product-stock ${isLowStock ? 'low-stock' : isInStock ? 'in-stock' : 'out-of-stock'}" 
                     data-product-id="${product.id}">
                    ${isLowStock ? 
                        `<span class="blink">Only ${product.stock} left!</span>` : 
                        isInStock ? 
                            `<i class="fas fa-check-circle"></i> In Stock` : 
                            `<i class="fas fa-times-circle"></i> Out of Stock`}
                </div>
                <button class="btn add-to-cart" data-product-id="${product.id}" ${!isInStock ? 'disabled' : ''}>
                    ${isInStock ? '<i class="fas fa-shopping-cart"></i> Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
    `;
}

// Handle Add to Cart button click
function handleAddToCart(e) {
    const productId = e.currentTarget.dataset.productId;
    const product = window.storeData.getProduct(productId);
    
    if (product && product.stock > 0) {
        if (window.cartManager) {
            window.cartManager.addToCart(productId);
        } else {
            console.error('Cart manager not initialized');
        }
    }
}

// Initialize notification system
function initNotifications() {
    // Create notification container if not exist
    if (!document.querySelector('.notifications-container')) {
        const container = document.createElement('div');
        container.className = 'notifications-container';
        document.body.appendChild(container);
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const container = document.querySelector('.notifications-container');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                           type === 'error' ? 'fa-times-circle' : 
                           type === 'warning' ? 'fa-exclamation-triangle' : 
                           'fa-info-circle'}"></i>
        </div>
        <div class="notification-message">${message}</div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    container.appendChild(notification);
    
    // Add close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.add('hiding');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('hiding');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Initialize mobile navigation
function initMobileNav() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('nav ul');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
}

// Initialize search functionality
function initSearch() {
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', () => {
            performSearch(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
    }
}

// Perform search
function performSearch(query) {
    if (!query.trim()) return;
    
    window.location.href = `shop.html?search=${encodeURIComponent(query.trim())}`;
}

// Setup common event listeners
function setupEventListeners() {
    // User dropdown toggle
    const userIcon = document.getElementById('userIcon');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userIcon && userDropdown) {
        userIcon.addEventListener('click', (e) => {
            e.preventDefault();
            userDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userIcon.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        });
    }
    
    // Login and register buttons
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginModal();
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showRegisterModal();
        });
    }
    
    // Initialize chat functionality
    initChat();
}

// Show login modal
function showLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (!loginModal) return;
    
    loginModal.style.display = 'block';
    
    // Close modal when clicking X
    const closeModal = loginModal.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            loginModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });
    
    // Switch to register
    const switchToRegister = document.getElementById('switchToRegister');
    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'none';
            showRegisterModal();
        });
    }
}

// Show register modal
function showRegisterModal() {
    const registerModal = document.getElementById('registerModal');
    if (!registerModal) return;
    
    registerModal.style.display = 'block';
    
    // Close modal when clicking X
    const closeModal = registerModal.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            registerModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === registerModal) {
            registerModal.style.display = 'none';
        }
    });
    
    // Switch to login
    const switchToLogin = document.getElementById('switchToLogin');
    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            registerModal.style.display = 'none';
            showLoginModal();
        });
    }
}

// Initialize live chat functionality
function initChat() {
    const chatToggleBtn = document.getElementById('chatToggleBtn');
    const liveChat = document.getElementById('liveChat');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const chatInput = document.getElementById('chatInput');
    const sendChatBtn = document.getElementById('sendChatBtn');
    const chatBody = document.getElementById('chatBody');
    
    if (chatToggleBtn && liveChat && closeChatBtn) {
        chatToggleBtn.addEventListener('click', () => {
            liveChat.classList.toggle('open');
        });
        
        closeChatBtn.addEventListener('click', () => {
            liveChat.classList.remove('open');
        });
    }
    
    if (sendChatBtn && chatInput && chatBody) {
        // Send message on button click
        sendChatBtn.addEventListener('click', () => {
            sendChatMessage();
        });
        
        // Send message on Enter key
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
    
    function sendChatMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'message user';
        userMessage.innerHTML = `
            <p>${message}</p>
            <span class="time">Just now</span>
        `;
        chatBody.appendChild(userMessage);
        
        // Clear input
        chatInput.value = '';
        
        // Scroll to bottom
        chatBody.scrollTop = chatBody.scrollHeight;
        
        // Simulate response after a delay
        setTimeout(() => {
            const responseMessage = document.createElement('div');
            responseMessage.className = 'message support';
            
            // Generate a simple automatic response
            let response = '';
            if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
                response = 'Hello! How can I assist you today?';
            } else if (message.toLowerCase().includes('help')) {
                response = 'I\'d be happy to help! What do you need assistance with?';
            } else if (message.toLowerCase().includes('shipping') || message.toLowerCase().includes('delivery')) {
                response = 'We offer free shipping on orders over $50. Standard delivery takes 3-5 business days.';
            } else if (message.toLowerCase().includes('return') || message.toLowerCase().includes('refund')) {
                response = 'Our return policy allows returns within 30 days of purchase. Please keep the original packaging.';
            } else if (message.toLowerCase().includes('payment') || message.toLowerCase().includes('pay')) {
                response = 'We accept all major credit cards, PayPal, and Apple Pay.';
            } else if (message.toLowerCase().includes('price') || message.toLowerCase().includes('discount') || message.toLowerCase().includes('coupon')) {
                response = 'You can use code WELCOME10 for 10% off your first order!';
            } else if (message.toLowerCase().includes('stock') || message.toLowerCase().includes('availability')) {
                response = 'Our inventory is updated in real-time. If an item shows as in stock, it\'s available to purchase.';
            } else {
                response = 'Thank you for your message. How else can I assist you today?';
            }
            
            responseMessage.innerHTML = `
                <p>${response}</p>
                <span class="time">Just now</span>
            `;
            chatBody.appendChild(responseMessage);
            
            // Scroll to bottom
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
    }
}

// Make functions globally available
window.storeUI = {
    showNotification: showNotification,
    createProductCard: createProductCard
}; 