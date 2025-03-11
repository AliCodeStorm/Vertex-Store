/**
 * Vertex Store - Animations and Real-Time Effects
 * This file handles all animations and real-time visual effects for the store
 */

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initAnimations();
    initNotificationSystem();
    initLiveChat();
    initRealTimeStockUpdates();
});

// Initialize all animations
function initAnimations() {
    // Product hover effects
    initProductHoverEffects();
    
    // Add to cart animations
    initAddToCartAnimations();
    
    // Hero carousel
    initHeroCarousel();
    
    // Product carousels
    initProductCarousels();
    
    // Scroll animations
    initScrollAnimations();
}

// Product hover effects
function initProductHoverEffects() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hovered');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hovered');
        });
    });
}

// Add to cart animations
function initAddToCartAnimations() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!this.disabled) {
                e.preventDefault();
                createFlyToCartAnimation(this);
                
                // Update cart count with animation
                setTimeout(() => {
                    updateCartCountWithAnimation();
                }, 800);
            }
        });
    });
}

// Create flying image animation when adding to cart
function createFlyToCartAnimation(button) {
    // Get the product card and image
    const productCard = button.closest('.product-card');
    if (!productCard) return;
    
    const productImage = productCard.querySelector('.product-image img');
    if (!productImage) return;
    
    // Get cart icon position
    const cartIcon = document.querySelector('.cart-icon');
    if (!cartIcon) return;
    
    const cartRect = cartIcon.getBoundingClientRect();
    const imageRect = productImage.getBoundingClientRect();
    
    // Create flying element
    const flyingImage = document.createElement('div');
    flyingImage.className = 'fly-to-cart';
    flyingImage.style.backgroundImage = `url(${productImage.src})`;
    flyingImage.style.width = '50px';
    flyingImage.style.height = '50px';
    flyingImage.style.position = 'fixed';
    flyingImage.style.zIndex = '9999';
    flyingImage.style.borderRadius = '50%';
    flyingImage.style.backgroundSize = 'cover';
    flyingImage.style.backgroundPosition = 'center';
    flyingImage.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    
    // Set initial position
    flyingImage.style.top = `${imageRect.top}px`;
    flyingImage.style.left = `${imageRect.left}px`;
    
    // Add to body
    document.body.appendChild(flyingImage);
    
    // Set final position after a small delay (for transition to work)
    setTimeout(() => {
        flyingImage.style.top = `${cartRect.top + cartRect.height/2 - 25}px`;
        flyingImage.style.left = `${cartRect.left + cartRect.width/2 - 25}px`;
        flyingImage.style.opacity = '0';
        flyingImage.style.transform = 'scale(0.3)';
    }, 10);
    
    // Remove element after animation
    setTimeout(() => {
        if (document.body.contains(flyingImage)) {
            document.body.removeChild(flyingImage);
        }
    }, 800);
}

// Update cart count with animation
function updateCartCountWithAnimation() {
    const cartCounts = document.querySelectorAll('.cart-count');
    
    cartCounts.forEach(count => {
        count.classList.add('update');
        
        setTimeout(() => {
            count.classList.remove('update');
        }, 500);
    });
}

// Initialize hero carousel
function initHeroCarousel() {
    const carousel = document.querySelector('.hero-carousel');
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.hero-slide');
    const dots = carousel.querySelectorAll('.dot');
    const prevBtn = carousel.querySelector('.prev-slide');
    const nextBtn = carousel.querySelector('.next-slide');
    
    let currentIndex = 0;
    let interval;
    
    // Show slide at index
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.classList.remove('fade-in');
        });
        
        // Update dots
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current slide
        slides[index].classList.add('active');
        slides[index].classList.add('fade-in');
        dots[index].classList.add('active');
    }
    
    // Go to next slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }
    
    // Go to previous slide
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
    }
    
    // Set up event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
            resetInterval();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextSlide();
            resetInterval();
        });
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentIndex = index;
            showSlide(currentIndex);
            resetInterval();
        });
    });
    
    // Auto rotation
    function startInterval() {
        interval = setInterval(nextSlide, 5000);
    }
    
    function resetInterval() {
        clearInterval(interval);
        startInterval();
    }
    
    // Initialize
    showSlide(currentIndex);
    startInterval();
}

// Initialize product carousels
function initProductCarousels() {
    const carousels = document.querySelectorAll('.product-carousel');
    
    carousels.forEach(carousel => {
        const prevBtn = carousel.querySelector('.prev-btn');
        const nextBtn = carousel.querySelector('.next-btn');
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: -280, behavior: 'smooth' });
            });
            
            nextBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: 280, behavior: 'smooth' });
            });
        }
    });
}

// Initialize scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.reveal');
    
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    function handleScroll() {
        animatedElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('active');
            }
        });
    }
    
    // Run once on load
    handleScroll();
    
    // Run on scroll
    window.addEventListener('scroll', handleScroll);
}

// Initialize notification system
function initNotificationSystem() {
    // Add global function to show notifications
    window.showNotification = function(message, type = 'info', duration = 5000) {
        const container = document.querySelector('.notifications-container');
        if (!container) return;
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Set icon based on type
        let icon = '';
        switch (type) {
            case 'success':
                icon = 'fa-check-circle';
                break;
            case 'error':
                icon = 'fa-exclamation-circle';
                break;
            case 'warning':
                icon = 'fa-exclamation-triangle';
                break;
            case 'info':
            default:
                icon = 'fa-info-circle';
                break;
        }
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="notification-message">${message}</div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to container
        container.appendChild(notification);
        
        // Setup close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', function() {
            closeNotification(notification);
        });
        
        // Auto close after duration
        if (duration) {
            setTimeout(() => {
                closeNotification(notification);
            }, duration);
        }
        
        return notification;
    };
    
    function closeNotification(notification) {
        notification.classList.add('hide');
        
        // Remove after animation completes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }
}

// Initialize live chat
function initLiveChat() {
    const chatToggle = document.querySelector('.chat-toggle');
    const liveChat = document.querySelector('.live-chat');
    const closeChat = document.querySelector('.close-chat');
    const minimizeChat = document.querySelector('.minimize-chat');
    const chatInput = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.chat-input button');
    
    if (chatToggle && liveChat) {
        // Toggle chat open/closed
        chatToggle.addEventListener('click', function() {
            liveChat.classList.toggle('open');
            
            // Focus input when opening
            if (liveChat.classList.contains('open') && chatInput) {
                setTimeout(() => {
                    chatInput.focus();
                }, 300);
            }
        });
        
        // Close chat
        if (closeChat) {
            closeChat.addEventListener('click', function() {
                liveChat.classList.remove('open');
            });
        }
        
        // Minimize chat
        if (minimizeChat) {
            minimizeChat.addEventListener('click', function() {
                liveChat.classList.toggle('minimized');
            });
        }
        
        // Send messages
        if (sendButton && chatInput) {
            sendButton.addEventListener('click', sendMessage);
            
            chatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
            
            function sendMessage() {
                const message = chatInput.value.trim();
                if (!message) return;
                
                const chatBody = liveChat.querySelector('.chat-body');
                
                // Create user message
                const userMessage = document.createElement('div');
                userMessage.className = 'message user';
                
                // Get current time
                const now = new Date();
                const time = now.getHours().toString().padStart(2, '0') + ':' + 
                             now.getMinutes().toString().padStart(2, '0');
                
                userMessage.innerHTML = `
                    <div class="message-bubble">${message}</div>
                    <div class="message-time">${time}</div>
                `;
                
                chatBody.appendChild(userMessage);
                chatInput.value = '';
                
                // Scroll to bottom
                chatBody.scrollTop = chatBody.scrollHeight;
                
                // Simulate typing
                const typingIndicator = document.createElement('div');
                typingIndicator.className = 'typing-indicator';
                typingIndicator.innerHTML = `
                    <span>Support is typing</span>
                    <div class="typing-dots">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                `;
                
                // Add typing indicator
                setTimeout(() => {
                    chatBody.appendChild(typingIndicator);
                    chatBody.scrollTop = chatBody.scrollHeight;
                }, 500);
                
                // Simulate response
                setTimeout(() => {
                    chatBody.removeChild(typingIndicator);
                    
                    // Create support message
                    const supportMessage = document.createElement('div');
                    supportMessage.className = 'message support';
                    
                    // Get current time
                    const now = new Date();
                    const time = now.getHours().toString().padStart(2, '0') + ':' + 
                                now.getMinutes().toString().padStart(2, '0');
                    
                    // Generate response
                    let response = '';
                    if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
                        response = 'Hello! How can I help you with your shopping today?';
                    } else if (message.toLowerCase().includes('price') || message.toLowerCase().includes('cost')) {
                        response = 'Our prices are very competitive. Is there a specific product you\'re interested in?';
                    } else if (message.toLowerCase().includes('shipping') || message.toLowerCase().includes('delivery')) {
                        response = 'We offer free shipping on orders over $50. Standard delivery takes 3-5 business days.';
                    } else if (message.toLowerCase().includes('return') || message.toLowerCase().includes('refund')) {
                        response = 'We have a 30-day return policy for all our products. Just make sure to keep the original packaging.';
                    } else {
                        response = 'Thank you for your message. How else can I assist you with your shopping experience?';
                    }
                    
                    supportMessage.innerHTML = `
                        <div class="message-bubble">${response}</div>
                        <div class="message-time">${time}</div>
                    `;
                    
                    chatBody.appendChild(supportMessage);
                    chatBody.scrollTop = chatBody.scrollHeight;
                    
                    // Mark as unread if chat is closed
                    if (!liveChat.classList.contains('open')) {
                        chatToggle.classList.add('unread');
                        
                        chatToggle.addEventListener('click', function removeUnread() {
                            chatToggle.classList.remove('unread');
                            chatToggle.removeEventListener('click', removeUnread);
                        });
                    }
                    
                }, 2000 + Math.random() * 1000);
            }
        }
    }
}

// Initialize real-time stock updates
function initRealTimeStockUpdates() {
    // Simulate real-time stock updates
    setInterval(() => {
        simulateStockUpdate();
    }, 15000);
    
    function simulateStockUpdate() {
        // Don't update too frequently to avoid annoying the user
        if (Math.random() > 0.3) return;
        
        const products = window.storeData?.getProducts?.() || {};
        if (!products || Object.keys(products).length === 0) return;
        
        // Choose random product to update
        const productIds = Object.keys(products);
        const randomId = productIds[Math.floor(Math.random() * productIds.length)];
        const product = products[randomId];
        
        // Find all instances of this product on the page
        const productCards = document.querySelectorAll(`.product-card[data-product-id="${randomId}"]`);
        
        if (productCards.length === 0) return;
        
        // Either increase or decrease stock
        const isIncrease = Math.random() > 0.5;
        
        // Update product in localStorage
        if (isIncrease) {
            product.stock += Math.floor(Math.random() * 3) + 1;
        } else {
            if (product.stock > 0) {
                product.stock -= Math.floor(Math.random() * Math.min(3, product.stock)) + 1;
            } else {
                return; // Skip update if already at 0
            }
        }
        
        // Update localStorage
        localStorage.setItem('products', JSON.stringify(products));
        
        // Update UI
        productCards.forEach(card => {
            const stockElem = card.querySelector('.stock-status');
            const stockCountElem = stockElem?.querySelector('.stock-count');
            
            if (stockElem && stockCountElem) {
                // Update classes
                stockElem.classList.remove('in-stock', 'low-stock', 'out-of-stock');
                
                if (product.stock <= 0) {
                    stockElem.classList.add('out-of-stock');
                    stockCountElem.textContent = 'Out of Stock';
                    
                    // Disable add to cart button
                    const addToCartBtn = card.querySelector('.add-to-cart');
                    if (addToCartBtn) {
                        addToCartBtn.disabled = true;
                    }
                    
                    // Add out of stock badge if not present
                    if (!card.querySelector('.product-badge.out-of-stock')) {
                        const imgContainer = card.querySelector('.product-image');
                        if (imgContainer) {
                            const badge = document.createElement('span');
                            badge.className = 'product-badge out-of-stock';
                            badge.textContent = 'Out of Stock';
                            imgContainer.appendChild(badge);
                        }
                    }
                } else if (product.stock < 5) {
                    stockElem.classList.add('low-stock');
                    stockCountElem.textContent = `Low Stock: ${product.stock} left`;
                    stockCountElem.classList.add('blink');
                    
                    // Enable add to cart button
                    const addToCartBtn = card.querySelector('.add-to-cart');
                    if (addToCartBtn) {
                        addToCartBtn.disabled = false;
                    }
                    
                    // Remove out of stock badge if present
                    const outOfStockBadge = card.querySelector('.product-badge.out-of-stock');
                    if (outOfStockBadge && outOfStockBadge.parentNode) {
                        outOfStockBadge.parentNode.removeChild(outOfStockBadge);
                    }
                } else {
                    stockElem.classList.add('in-stock');
                    stockCountElem.textContent = 'In Stock';
                    stockCountElem.classList.remove('blink');
                    
                    // Enable add to cart button
                    const addToCartBtn = card.querySelector('.add-to-cart');
                    if (addToCartBtn) {
                        addToCartBtn.disabled = false;
                    }
                    
                    // Remove out of stock badge if present
                    const outOfStockBadge = card.querySelector('.product-badge.out-of-stock');
                    if (outOfStockBadge && outOfStockBadge.parentNode) {
                        outOfStockBadge.parentNode.removeChild(outOfStockBadge);
                    }
                }
                
                // Add temporary highlight
                stockElem.classList.add('stock-update', isIncrease ? 'increase' : 'decrease');
                
                // Remove after animation
                setTimeout(() => {
                    stockElem.classList.remove('stock-update', 'increase', 'decrease');
                }, 2000);
                
                // Show notification if it's a significant change
                if (product.stock === 0) {
                    window.showNotification?.(`${product.name} is now out of stock!`, 'error');
                } else if (product.stock <= 3 && !isIncrease) {
                    window.showNotification?.(`${product.name} is running low: Only ${product.stock} left!`, 'warning');
                } else if (product.stock >= 10 && isIncrease) {
                    window.showNotification?.(`${product.name} is back in stock!`, 'success');
                }
            }
        });
    }
} 