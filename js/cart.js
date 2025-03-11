// Cart page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart page
    initializeCartPage();
});

// Initialize cart page functionality
function initializeCartPage() {
    // Subscribe to cart updates
    if (window.cartManager) {
        window.cartManager.subscribe({
            updateCartDisplay: updateCartDisplay
        });
        
        // Initial cart render
        updateCartDisplay(window.cartManager.getCart());
    }
    
    // Setup coupon code application
    const couponInput = document.getElementById('couponCode');
    const applyCouponBtn = document.getElementById('applyCoupon');
    
    if (couponInput && applyCouponBtn) {
        applyCouponBtn.addEventListener('click', () => {
            const code = couponInput.value.trim();
            if (!code) return;
            
            if (window.cartManager) {
                window.cartManager.applyCoupon(code);
            }
        });
    }
}

// Update cart display with current cart items
function updateCartDisplay(cart) {
    const cartContainer = document.getElementById('cartContainer');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const cartSummary = document.getElementById('cartSummary');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const discountElement = document.getElementById('discount');
    const totalElement = document.getElementById('total');
    const stockWarning = document.getElementById('stockWarning');
    
    if (!cartContainer || !emptyCartMessage || !cartSummary) return;
    
    // Check if cart is empty
    if (cart.length === 0) {
        cartContainer.innerHTML = '';
        emptyCartMessage.style.display = 'block';
        cartSummary.style.display = 'none';
        return;
    }
    
    // Show cart and hide empty message
    emptyCartMessage.style.display = 'none';
    cartSummary.style.display = 'block';
    
    // Render cart items
    cartContainer.innerHTML = `
        <div class="cart-header">
            <div class="cart-row">
                <div class="cart-col product-col">Product</div>
                <div class="cart-col price-col">Price</div>
                <div class="cart-col quantity-col">Quantity</div>
                <div class="cart-col subtotal-col">Subtotal</div>
                <div class="cart-col remove-col"></div>
            </div>
        </div>
        <div class="cart-body">
            ${cart.map(item => `
                <div class="cart-row" data-product-id="${item.id}">
                    <div class="cart-col product-col">
                        <div class="cart-product">
                            <img src="${item.image}" alt="${item.name}">
                            <div class="product-info">
                                <h3>${item.name}</h3>
                                <div class="product-meta">
                                    ${window.stockManager && window.stockManager.isLowStock(item.id) ? 
                                        `<span class="stock-warning blink">Only ${window.stockManager.getProduct(item.id).stock} left!</span>` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="cart-col price-col">$${item.price.toFixed(2)}</div>
                    <div class="cart-col quantity-col">
                        <div class="quantity-control">
                            <button class="decrease-quantity" data-product-id="${item.id}">-</button>
                            <input type="number" value="${item.quantity}" min="1" class="item-quantity" data-product-id="${item.id}">
                            <button class="increase-quantity" data-product-id="${item.id}">+</button>
                        </div>
                    </div>
                    <div class="cart-col subtotal-col">$${(item.price * item.quantity).toFixed(2)}</div>
                    <div class="cart-col remove-col">
                        <button class="remove-from-cart" data-product-id="${item.id}">×</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    // Update totals
    if (subtotalElement && window.cartManager) {
        subtotalElement.textContent = `$${window.cartManager.getSubtotal().toFixed(2)}`;
    }
    
    if (shippingElement && window.cartManager) {
        const shipping = window.cartManager.getShippingCost();
        shippingElement.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    }
    
    if (discountElement && window.cartManager) {
        const discount = window.cartManager.getDiscountAmount();
        discountElement.textContent = `-$${discount.toFixed(2)}`;
        discountElement.parentElement.style.display = discount > 0 ? 'flex' : 'none';
    }
    
    if (totalElement && window.cartManager) {
        totalElement.textContent = `$${window.cartManager.getTotal().toFixed(2)}`;
    }
    
    // Show stock warning if needed
    if (stockWarning && window.cartManager) {
        stockWarning.style.display = window.cartManager.hasLowStockItems() ? 'block' : 'none';
    }
    
    // Add event listeners to quantity controls and remove buttons
    setupCartEventListeners();
}

// Setup cart event listeners
function setupCartEventListeners() {
    // Quantity decrease buttons
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.dataset.productId;
            const quantityInput = document.querySelector(`.item-quantity[data-product-id="${productId}"]`);
            if (quantityInput) {
                const currentValue = parseInt(quantityInput.value);
                if (currentValue > 1) {
                    quantityInput.value = currentValue - 1;
                    if (window.cartManager) {
                        window.cartManager.updateQuantity(productId, currentValue - 1);
                    }
                }
            }
        });
    });
    
    // Quantity increase buttons
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.dataset.productId;
            const quantityInput = document.querySelector(`.item-quantity[data-product-id="${productId}"]`);
            if (quantityInput) {
                const currentValue = parseInt(quantityInput.value);
                quantityInput.value = currentValue + 1;
                if (window.cartManager) {
                    window.cartManager.updateQuantity(productId, currentValue + 1);
                }
            }
        });
    });
    
    // Quantity input changes
    document.querySelectorAll('.item-quantity').forEach(input => {
        input.addEventListener('change', (e) => {
            const productId = e.target.dataset.productId;
            const newValue = parseInt(e.target.value);
            if (newValue > 0) {
                if (window.cartManager) {
                    window.cartManager.updateQuantity(productId, newValue);
                }
            } else {
                e.target.value = 1;
                if (window.cartManager) {
                    window.cartManager.updateQuantity(productId, 1);
                }
            }
        });
    });
    
    // Remove from cart buttons
    document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.dataset.productId;
            if (window.cartManager) {
                window.cartManager.removeFromCart(productId);
            }
        });
    });
} 