/**
 * Vertex Store - Product Detail Page Scripts
 * Handles product detail display, image gallery, tabs, reviews, and related products
 */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeProductPage();
});

// Initialize product page functionality
function initializeProductPage() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        // No product ID found, redirect to shop
        window.location.href = 'shop.html';
        return;
    }
    
    // Load product details
    loadProductDetails(productId);
    
    // Initialize tabs
    initTabs();
    
    // Set up image zoom modal
    setupImageZoom();
    
    // Set up review form
    setupReviewForm(productId);
    
    // Track product view in local storage
    trackProductView(productId);
}

// Load product details
function loadProductDetails(productId) {
    // Get product data from storeData
    const product = window.storeData.getProduct(productId);
    
    if (!product) {
        // Product not found, show error
        const productDetailElem = document.getElementById('product-detail');
        productDetailElem.innerHTML = `
            <div class="product-not-found">
                <i class="fas fa-exclamation-circle"></i>
                <h2>Product Not Found</h2>
                <p>Sorry, the product you're looking for doesn't exist or has been removed.</p>
                <a href="shop.html" class="btn btn-primary">Return to Shop</a>
            </div>
        `;
        return;
    }
    
    // Update page title and breadcrumb
    document.title = `${product.name} - Vertex Store`;
    document.getElementById('product-breadcrumb-name').textContent = product.name;
    
    // Create product HTML
    const productDetailElem = document.getElementById('product-detail');
    
    // Determine stock status
    let stockStatus = '';
    let stockText = '';
    
    if (product.stock <= 0) {
        stockStatus = 'out-of-stock';
        stockText = 'Out of Stock';
    } else if (product.stock < 5) {
        stockStatus = 'low-stock';
        stockText = `Low Stock: ${product.stock} left`;
    } else {
        stockStatus = 'in-stock';
        stockText = 'In Stock';
    }
    
    // Calculate discount percentage if there's an original price
    let discountBadge = '';
    if (product.originalPrice && product.originalPrice > product.price) {
        const discountPercentage = Math.round((1 - product.price / product.originalPrice) * 100);
        discountBadge = `<span class="product-badge sale">-${discountPercentage}%</span>`;
    }
    
    // New badge
    const newBadge = product.isNew ? '<span class="product-badge new">New</span>' : '';
    
    // Generate rating stars
    const ratingStars = getRatingStars(product.rating);
    
    // Create product HTML
    productDetailElem.innerHTML = `
        <div class="product-content">
            <div class="product-gallery">
                <div class="main-image">
                    <img src="${product.image}" alt="${product.name}" id="main-product-image">
                    ${discountBadge}
                    ${newBadge}
                    <button class="zoom-image-btn" title="Zoom Image">
                        <i class="fas fa-search-plus"></i>
                    </button>
                </div>
                <div class="thumbnail-gallery">
                    <div class="thumbnail active" data-image="${product.image}">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    ${product.gallery ? product.gallery.map((img, index) => `
                        <div class="thumbnail" data-image="${img}">
                            <img src="${img}" alt="${product.name} - Image ${index + 2}">
                        </div>
                    `).join('') : ''}
                </div>
            </div>
            <div class="product-info">
                <h1 class="product-title">${product.name}</h1>
                <div class="product-meta">
                    <div class="product-rating">
                        <div class="stars">
                            ${ratingStars}
                        </div>
                        <a href="#reviews-panel" class="rating-count">${product.reviewCount} reviews</a>
                    </div>
                    <div class="product-sku">
                        SKU: <span class="sku">VTX-${productId}</span>
                    </div>
                </div>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <div class="stock-status ${stockStatus}">
                    <i class="fas ${stockStatus === 'in-stock' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                    <span class="stock-count">${stockText}</span>
                </div>
                <div class="product-description">
                    <p>${product.description}</p>
                </div>
                <div class="product-actions">
                    <div class="quantity-selector">
                        <button class="decrease-quantity" ${product.stock <= 0 ? 'disabled' : ''}>-</button>
                        <input type="number" value="1" min="1" max="${product.stock}" id="product-quantity" ${product.stock <= 0 ? 'disabled' : ''}>
                        <button class="increase-quantity" ${product.stock <= 0 ? 'disabled' : ''}>+</button>
                    </div>
                    <button class="btn btn-primary add-to-cart" ${product.stock <= 0 ? 'disabled' : ''} data-product-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn btn-outline wishlist-btn" data-product-id="${product.id}">
                        <i class="fas fa-heart"></i> Add to Wishlist
                    </button>
                </div>
                <div class="product-meta-info">
                    <div class="meta-item">
                        <span class="meta-label">Category:</span>
                        <a href="shop.html?category=${product.category}" class="product-category">${getCategoryName(product.category)}</a>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Share:</span>
                        <div class="social-share">
                            <a href="#" onclick="shareProduct('facebook'); return false;" title="Share on Facebook"><i class="fab fa-facebook-f"></i></a>
                            <a href="#" onclick="shareProduct('twitter'); return false;" title="Share on Twitter"><i class="fab fa-twitter"></i></a>
                            <a href="#" onclick="shareProduct('pinterest'); return false;" title="Share on Pinterest"><i class="fab fa-pinterest"></i></a>
                            <a href="#" onclick="shareProduct('email'); return false;" title="Share via Email"><i class="fas fa-envelope"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Load product description tab
    document.getElementById('description-panel').innerHTML = `
        <div class="product-description-full">
            <h3>Product Description</h3>
            <p>${product.description}</p>
            ${product.features ? `
                <h4>Key Features:</h4>
                <ul class="features-list">
                    ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            ` : ''}
            ${product.details ? `<p>${product.details}</p>` : ''}
        </div>
    `;
    
    // Load product specifications tab
    if (product.specifications) {
        document.getElementById('specifications-panel').innerHTML = `
            <div class="product-specifications">
                <h3>Technical Specifications</h3>
                <table class="specs-table">
                    <tbody>
                        ${Object.entries(product.specifications).map(([key, value]) => `
                            <tr>
                                <th>${key}</th>
                                <td>${value}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } else {
        document.getElementById('specifications-panel').innerHTML = `
            <p>No specifications available for this product.</p>
        `;
    }
    
    // Update review count in tab button
    const reviewTabBtn = document.querySelector('.tab-btn[data-tab="reviews"]');
    reviewTabBtn.querySelector('.review-count').textContent = `(${product.reviewCount})`;
    
    // Set up related products
    loadRelatedProducts(productId);
    
    // Set up recently viewed products
    loadRecentlyViewed(productId);
    
    // Set up thumbnail gallery
    setupThumbnailGallery();
    
    // Set up quantity selector
    setupQuantitySelector(product.stock);
    
    // Set up add to cart button
    setupAddToCartButton(product);
}

// Initialize tabs
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding panel
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-panel`).classList.add('active');
        });
    });
    
    // Handle hash in URL (e.g., #reviews)
    if (window.location.hash) {
        const tabId = window.location.hash.substring(1).replace('-panel', '');
        const tabButton = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
        if (tabButton) {
            tabButton.click();
        }
    }
}

// Load related products
function loadRelatedProducts(currentProductId) {
    const container = document.querySelector('.related-products-slider');
    if (!container) return;
    
    // Get current product to find category
    const currentProduct = window.storeData.getProduct(currentProductId);
    if (!currentProduct) return;
    
    // Get all products in the same category
    const allProducts = Object.values(window.storeData.getProducts());
    const relatedProducts = allProducts.filter(product => 
        product.id !== currentProductId && 
        product.category === currentProduct.category
    ).slice(0, 4); // Limit to 4 products
    
    // If not enough related products in the same category, add some other products
    if (relatedProducts.length < 4) {
        const otherProducts = allProducts.filter(product => 
            product.id !== currentProductId && 
            !relatedProducts.some(p => p.id === product.id)
        ).slice(0, 4 - relatedProducts.length);
        
        relatedProducts.push(...otherProducts);
    }
    
    // Create HTML for related products
    const relatedProductsHTML = relatedProducts.map(product => {
        return createProductCard(product);
    }).join('');
    
    container.innerHTML = `
        <div class="product-slider">
            ${relatedProductsHTML}
        </div>
        <div class="slider-controls">
            <button class="prev-slide"><i class="fas fa-chevron-left"></i></button>
            <button class="next-slide"><i class="fas fa-chevron-right"></i></button>
        </div>
    `;
    
    // Set up slider controls
    setupSliderControls(container);
}

// Load recently viewed products
function loadRecentlyViewed(currentProductId) {
    const container = document.querySelector('.recently-viewed-products');
    if (!container) return;
    
    // Get recently viewed products from local storage
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
        .filter(id => id !== currentProductId)
        .slice(0, 4); // Limit to 4 products
    
    if (recentlyViewed.length === 0) {
        container.closest('section').style.display = 'none';
        return;
    }
    
    // Get product details for each ID
    const recentProducts = recentlyViewed.map(id => window.storeData.getProduct(id)).filter(Boolean);
    
    // Create HTML for recently viewed products
    const recentProductsHTML = recentProducts.map(product => {
        return createProductCard(product);
    }).join('');
    
    container.innerHTML = `
        <div class="product-slider">
            ${recentProductsHTML}
        </div>
    `;
}

// Set up slider controls
function setupSliderControls(sliderContainer) {
    const slider = sliderContainer.querySelector('.product-slider');
    const prevButton = sliderContainer.querySelector('.prev-slide');
    const nextButton = sliderContainer.querySelector('.next-slide');
    
    if (!slider || !prevButton || !nextButton) return;
    
    let position = 0;
    const slideWidth = 280; // Width of each product card + margin
    const visibleSlides = Math.floor(slider.clientWidth / slideWidth);
    const maxPosition = Math.max(0, slider.children.length - visibleSlides);
    
    prevButton.addEventListener('click', () => {
        position = Math.max(0, position - 1);
        slider.style.transform = `translateX(-${position * slideWidth}px)`;
        updateSliderButtons();
    });
    
    nextButton.addEventListener('click', () => {
        position = Math.min(maxPosition, position + 1);
        slider.style.transform = `translateX(-${position * slideWidth}px)`;
        updateSliderButtons();
    });
    
    function updateSliderButtons() {
        prevButton.disabled = position === 0;
        nextButton.disabled = position >= maxPosition;
    }
    
    // Initial update
    updateSliderButtons();
}

// Show add to cart animation
function showAddToCartAnimation(button) {
    // Create flying element
    const productImage = document.getElementById('main-product-image');
    const cartIcon = document.querySelector('.cart-icon');
    
    if (!productImage || !cartIcon) return;
    
    const flyingImage = document.createElement('div');
    flyingImage.className = 'flying-image';
    flyingImage.style.backgroundImage = `url(${productImage.src})`;
    
    // Get positions
    const buttonRect = button.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();
    
    // Set initial position
    flyingImage.style.top = `${buttonRect.top + window.scrollY}px`;
    flyingImage.style.left = `${buttonRect.left + window.scrollX}px`;
    flyingImage.style.width = '60px';
    flyingImage.style.height = '60px';
    
    // Add to DOM
    document.body.appendChild(flyingImage);
    
    // Trigger animation
    setTimeout(() => {
        flyingImage.style.top = `${cartRect.top + window.scrollY}px`;
        flyingImage.style.left = `${cartRect.left + window.scrollX}px`;
        flyingImage.style.width = '20px';
        flyingImage.style.height = '20px';
        flyingImage.style.opacity = '0.5';
    }, 10);
    
    // Remove element after animation completes
    flyingImage.addEventListener('transitionend', () => {
        document.body.removeChild(flyingImage);
        
        // Shake cart icon
        cartIcon.classList.add('shake');
        setTimeout(() => {
            cartIcon.classList.remove('shake');
        }, 500);
        
        // Update cart count with animation
        window.updateCartCountWithAnimation?.();
    });
}

// Set up thumbnail gallery
function setupThumbnailGallery() {
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Update active class
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update main image
            const imageUrl = this.getAttribute('data-image');
            mainImage.src = imageUrl;
            
            // Update zoom modal image
            document.getElementById('zoomed-image').src = imageUrl;
        });
    });
}

// Set up image zoom modal
function setupImageZoom() {
    const zoomBtn = document.querySelector('.zoom-image-btn');
    const modal = document.querySelector('.image-zoom-modal');
    const closeBtn = modal?.querySelector('.close-modal');
    const zoomedImage = document.getElementById('zoomed-image');
    const zoomInBtn = modal?.querySelector('.zoom-in');
    const zoomOutBtn = modal?.querySelector('.zoom-out');
    const zoomResetBtn = modal?.querySelector('.zoom-reset');
    
    if (!zoomBtn || !modal || !closeBtn || !zoomedImage) return;
    
    let scale = 1;
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;
    
    zoomBtn.addEventListener('click', function() {
        const mainImage = document.getElementById('main-product-image');
        zoomedImage.src = mainImage.src;
        modal.classList.add('active');
        resetZoom();
    });
    
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
    });
    
    zoomInBtn.addEventListener('click', function() {
        scale = Math.min(scale + 0.5, 4);
        updateTransform();
    });
    
    zoomOutBtn.addEventListener('click', function() {
        scale = Math.max(scale - 0.5, 1);
        updateTransform();
        if (scale === 1) {
            translateX = 0;
            translateY = 0;
            updateTransform();
        }
    });
    
    zoomResetBtn.addEventListener('click', resetZoom);
    
    zoomedImage.addEventListener('mousedown', startDrag);
    zoomedImage.addEventListener('touchstart', e => {
        const touch = e.touches[0];
        startDrag({ clientX: touch.clientX, clientY: touch.clientY });
    });
    
    function startDrag(e) {
        if (scale > 1) {
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            zoomedImage.style.cursor = 'grabbing';
        }
    }
    
    window.addEventListener('mousemove', e => {
        if (isDragging) {
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateTransform();
        }
    });
    
    window.addEventListener('touchmove', e => {
        if (isDragging) {
            const touch = e.touches[0];
            translateX = touch.clientX - startX;
            translateY = touch.clientY - startY;
            updateTransform();
            e.preventDefault();
        }
    });
    
    window.addEventListener('mouseup', () => {
        endDrag();
    });
    
    window.addEventListener('touchend', () => {
        endDrag();
    });
    
    function endDrag() {
        isDragging = false;
        zoomedImage.style.cursor = 'grab';
    }
    
    function updateTransform() {
        zoomedImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }
    
    function resetZoom() {
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
    }
}

// Setup quantity selector
function setupQuantitySelector(maxStock) {
    const quantityInput = document.getElementById('product-quantity');
    const decreaseBtn = document.querySelector('.decrease-quantity');
    const increaseBtn = document.querySelector('.increase-quantity');
    
    if (!quantityInput || !decreaseBtn || !increaseBtn) return;
    
    decreaseBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });
    
    increaseBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (value < maxStock) {
            quantityInput.value = value + 1;
        }
    });
    
    quantityInput.addEventListener('change', function() {
        let value = parseInt(this.value);
        if (isNaN(value) || value < 1) {
            this.value = 1;
        } else if (value > maxStock) {
            this.value = maxStock;
        }
    });
}

// Setup add to cart button
function setupAddToCartButton(product) {
    const addToCartBtn = document.querySelector('.add-to-cart');
    
    if (!addToCartBtn) return;
    
    addToCartBtn.addEventListener('click', function() {
        if (product.stock <= 0) return;
        
        const quantity = parseInt(document.getElementById('product-quantity').value);
        if (isNaN(quantity) || quantity < 1) return;
        
        // Add to cart
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if product already in cart
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            // Update quantity
            existingItem.quantity += quantity;
        } else {
            // Add new item
            cart.push({
                id: product.id,
                quantity: quantity
            });
        }
        
        // Save cart
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Show add to cart animation
        showAddToCartAnimation(addToCartBtn);
        
        // Show notification
        window.showNotification?.(`Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to cart`, 'success');
    });
}

// Setup review form
function setupReviewForm(productId) {
    const reviewForm = document.getElementById('review-form');
    const ratingStars = document.querySelectorAll('.rating-input i');
    let selectedRating = 0;
    
    if (!reviewForm) return;
    
    // Set up star rating selection
    ratingStars.forEach(star => {
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            highlightStars(rating);
        });
        
        star.addEventListener('mouseout', function() {
            highlightStars(selectedRating);
        });
        
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-rating'));
            highlightStars(selectedRating);
        });
    });
    
    function highlightStars(rating) {
        ratingStars.forEach(star => {
            const starRating = parseInt(star.getAttribute('data-rating'));
            if (starRating <= rating) {
                star.className = 'fas fa-star';
            } else {
                star.className = 'far fa-star';
            }
        });
    }
    
    // Handle form submission
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (selectedRating === 0) {
            window.showNotification?.('Please select a rating', 'error');
            return;
        }
        
        const reviewData = {
            productId: productId,
            name: document.getElementById('review-name').value,
            email: document.getElementById('review-email').value,
            rating: selectedRating,
            title: document.getElementById('review-title').value,
            content: document.getElementById('review-content').value,
            date: new Date().toISOString()
        };
        
        // In a real application, you would send this to a server
        // For this demo, we'll just show a success message
        
        // Reset form
        reviewForm.reset();
        selectedRating = 0;
        highlightStars(0);
        
        // Show success message
        window.showNotification?.('Thank you for your review!', 'success');
    });
}

// Track product view
function trackProductView(productId) {
    // Add product to recently viewed list in localStorage
    let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    
    // Remove if already in list
    recentlyViewed = recentlyViewed.filter(id => id !== productId);
    
    // Add to beginning of list
    recentlyViewed.unshift(productId);
    
    // Limit to 10 items
    recentlyViewed = recentlyViewed.slice(0, 10);
    
    // Save back to localStorage
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
}

// Share product on social media
function shareProduct(platform) {
    const url = window.location.href;
    const title = document.title;
    
    let shareUrl = '';
    
    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
            break;
        case 'pinterest':
            const image = document.getElementById('main-product-image').src;
            shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(image)}&description=${encodeURIComponent(title)}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Check out this product: ' + url)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank');
    }
}

// Create a product card element for related products
function createProductCard(product) {
    // Determine stock status
    let stockStatus = '';
    let stockText = '';
    
    if (product.stock <= 0) {
        stockStatus = 'out-of-stock';
        stockText = 'Out of Stock';
    } else if (product.stock < 5) {
        stockStatus = 'low-stock';
        stockText = `Low Stock: ${product.stock} left`;
    } else {
        stockStatus = 'in-stock';
        stockText = 'In Stock';
    }
    
    // Calculate discount percentage if there's an original price
    let discountBadge = '';
    if (product.originalPrice && product.originalPrice > product.price) {
        const discountPercentage = Math.round((1 - product.price / product.originalPrice) * 100);
        discountBadge = `<span class="product-badge sale">-${discountPercentage}%</span>`;
    }
    
    // New badge
    const newBadge = product.isNew ? '<span class="product-badge new">New</span>' : '';
    
    // Out of stock badge
    const outOfStockBadge = product.stock <= 0 ? '<span class="product-badge out-of-stock">Out of Stock</span>' : '';
    
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <a href="product.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                    ${discountBadge}
                    ${newBadge}
                    ${outOfStockBadge}
                </a>
                <div class="product-actions">
                    <button class="quick-view-btn" title="Quick View" data-product-id="${product.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="wishlist-btn" title="Add to Wishlist" data-product-id="${product.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">
                    <a href="product.html?id=${product.id}">${product.name}</a>
                </h3>
                <div class="product-rating">
                    ${getRatingStars(product.rating)}
                    <span>(${product.reviewCount})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <div class="stock-status ${stockStatus}">
                    <i class="fas ${stockStatus === 'in-stock' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                    <span class="stock-count">${stockText}</span>
                </div>
                <button class="add-to-cart" ${product.stock <= 0 ? 'disabled' : ''} data-product-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Get HTML for rating stars
function getRatingStars(rating) {
    let starsHTML = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            starsHTML += '<i class="fas fa-star"></i>';
        } else if (i === fullStars && hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        } else {
            starsHTML += '<i class="far fa-star"></i>';
        }
    }
    
    return starsHTML;
}

// Get category name from ID
function getCategoryName(categoryId) {
    const categories = window.storeData.getCategories();
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Uncategorized';
}
