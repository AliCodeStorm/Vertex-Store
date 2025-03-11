// Checkout page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize checkout page
    initializeCheckoutPage();
});

// Initialize checkout page functionality
function initializeCheckoutPage() {
    // Update order summary
    updateOrderSummary();
    
    // Setup form submission
    const shippingForm = document.getElementById('shippingForm');
    
    if (shippingForm) {
        shippingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            processOrder();
        });
    }
    
    // Setup payment method switching
    setupPaymentMethods();
    
    // Stock check animation
    simulateStockCheck();
}

// Update order summary in checkout
function updateOrderSummary() {
    const orderItems = document.getElementById('orderItems');
    const checkoutSubtotal = document.getElementById('checkoutSubtotal');
    const checkoutShipping = document.getElementById('checkoutShipping');
    const checkoutDiscount = document.getElementById('checkoutDiscount');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    if (!orderItems || !window.cartManager) return;
    
    const cart = window.cartManager.getCart();
    
    if (cart.length === 0) {
        // Redirect to cart if empty
        window.location.href = 'cart.html';
        return;
    }
    
    // Render order items
    orderItems.innerHTML = cart.map(item => `
        <div class="order-item">
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
                <span class="item-quantity">${item.quantity}</span>
            </div>
            <div class="item-details">
                <h4>${item.name}</h4>
                <div class="item-price">$${item.price.toFixed(2)}</div>
            </div>
        </div>
    `).join('');
    
    // Update totals
    if (checkoutSubtotal) {
        checkoutSubtotal.textContent = `$${window.cartManager.getSubtotal().toFixed(2)}`;
    }
    
    if (checkoutShipping) {
        const shipping = window.cartManager.getShippingCost();
        checkoutShipping.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    }
    
    if (checkoutDiscount) {
        const discount = window.cartManager.getDiscountAmount();
        checkoutDiscount.textContent = `-$${discount.toFixed(2)}`;
        checkoutDiscount.parentElement.style.display = discount > 0 ? 'flex' : 'none';
    }
    
    if (checkoutTotal) {
        checkoutTotal.textContent = `$${window.cartManager.getTotal().toFixed(2)}`;
    }
}

// Setup payment method switching
function setupPaymentMethods() {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const creditCardDetails = document.getElementById('creditCardDetails');
    
    if (!paymentMethods || !creditCardDetails) return;
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', (e) => {
            if (e.target.value === 'creditCard') {
                creditCardDetails.style.display = 'block';
            } else {
                creditCardDetails.style.display = 'none';
            }
        });
    });
}

// Simulate stock check before placing order
function simulateStockCheck() {
    const stockCheckMessage = document.getElementById('stockCheckMessage');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
} 