class CartManager {
  constructor() {
    // Load cart from localStorage or initialize empty
    this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    this.observers = [];
    
    // Listen for stock changes
    stockManager.subscribe(this);
  }
  
  // Get all items in the cart
  getCart() {
    return this.cart;
  }
  
  // Check if a product is in the cart
  isInCart(productId) {
    return this.cart.some(item => item.id === productId);
  }
  
  // Add a product to the cart
  addToCart(productId, quantity = 1) {
    const product = stockManager.getProduct(productId);
    
    if (!product) {
      console.error(`Product with ID ${productId} not found`);
      return false;
    }
    
    // Check if there's enough stock
    if (!stockManager.hasEnoughStock(productId, quantity)) {
      this.showNotification('Not enough items in stock!', 'error');
      return false;
    }
    
    // Check if the product is already in the cart
    const existingItem = this.cart.find(item => item.id === productId);
    
    if (existingItem) {
      // Check if there's enough stock for the increased quantity
      if (!stockManager.hasEnoughStock(productId, existingItem.quantity + quantity)) {
        this.showNotification('Not enough items in stock!', 'error');
        return false;
      }
      
      // Update quantity
      existingItem.quantity += quantity;
    } else {
      // Add new item to cart
      this.cart.push({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
        addedAt: new Date().toISOString()
      });
    }
    
    // Save to localStorage
    this.saveCart();
    
    // Notify observers
    this.notifyObservers();
    
    // Show success notification
    this.showNotification(`${product.name} added to cart!`, 'success');
    
    return true;
  }
  
  // Remove a product from the cart
  removeFromCart(productId) {
    const initialLength = this.cart.length;
    this.cart = this.cart.filter(item => item.id !== productId);
    
    if (initialLength !== this.cart.length) {
      // Save to localStorage
      this.saveCart();
      
      // Notify observers
      this.notifyObservers();
      
      // Show notification
      this.showNotification('Item removed from cart', 'info');
      
      return true;
    }
    
    return false;
  }
  
  // Update quantity of a product in the cart
  updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
      return this.removeFromCart(productId);
    }
    
    const item = this.cart.find(item => item.id === productId);
    
    if (item) {
      // Check if there's enough stock
      if (!stockManager.hasEnoughStock(productId, newQuantity)) {
        this.showNotification('Not enough items in stock!', 'error');
        return false;
      }
      
      // Update quantity
      item.quantity = newQuantity;
      
      // Save to localStorage
      this.saveCart();
      
      // Notify observers
      this.notifyObservers();
      
      return true;
    }
    
    return false;
  }
  
  // Clear the cart
  clearCart() {
    this.cart = [];
    
    // Save to localStorage
    this.saveCart();
    
    // Notify observers
    this.notifyObservers();
    
    return true;
  }
  
  // Calculate the total number of items in the cart
  getTotalItems() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }
  
  // Calculate the subtotal of the cart
  getSubtotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
  
  // Apply a coupon to the cart
  applyCoupon(code) {
    // In a real app, this would check against valid coupon codes in a database
    const validCoupons = {
      'WELCOME10': { discount: 0.1, type: 'percent' },
      'SAVE20': { discount: 0.2, type: 'percent' },
      'FLAT50': { discount: 50, type: 'fixed' }
    };
    
    const coupon = validCoupons[code];
    
    if (!coupon) {
      this.showNotification('Invalid coupon code', 'error');
      return false;
    }
    
    // Store the applied coupon
    localStorage.setItem('appliedCoupon', JSON.stringify({
      code,
      ...coupon
    }));
    
    // Notify observers
    this.notifyObservers();
    
    // Show success notification
    this.showNotification('Coupon applied successfully!', 'success');
    
    return true;
  }
  
  // Get the applied coupon, if any
  getAppliedCoupon() {
    return JSON.parse(localStorage.getItem('appliedCoupon')) || null;
  }
  
  // Remove the applied coupon
  removeCoupon() {
    localStorage.removeItem('appliedCoupon');
    
    // Notify observers
    this.notifyObservers();
    
    // Show notification
    this.showNotification('Coupon removed', 'info');
    
    return true;
  }
  
  // Calculate the discount amount
  getDiscountAmount() {
    const coupon = this.getAppliedCoupon();
    if (!coupon) return 0;
    
    const subtotal = this.getSubtotal();
    
    if (coupon.type === 'percent') {
      return subtotal * coupon.discount;
    } else if (coupon.type === 'fixed') {
      return Math.min(coupon.discount, subtotal); // Don't discount more than the subtotal
    }
    
    return 0;
  }
  
  // Calculate the shipping cost
  getShippingCost() {
    const subtotal = this.getSubtotal();
    
    // Free shipping for orders over $50
    if (subtotal >= 50) {
      return 0;
    }
    
    // Base shipping cost is $5.99
    return 5.99;
  }
  
  // Calculate the total cost
  getTotal() {
    const subtotal = this.getSubtotal();
    const shipping = this.getShippingCost();
    const discount = this.getDiscountAmount();
    
    return subtotal + shipping - discount;
  }
  
  // Check if any cart item has low stock
  hasLowStockItems() {
    return this.cart.some(item => stockManager.isLowStock(item.id));
  }
  
  // Save the cart to localStorage
  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }
  
  // Add an observer to be notified of cart changes
  subscribe(observer) {
    if (typeof observer.updateCartDisplay === 'function') {
      this.observers.push(observer);
    }
  }
  
  // Remove an observer
  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }
  
  // Notify all observers about cart changes
  notifyObservers() {
    this.observers.forEach(observer => {
      observer.updateCartDisplay(this.cart);
    });
  }
  
  // Handle stock updates (implements stockManager observer interface)
  updateStockDisplay(productId, newStock, oldStock) {
    const item = this.cart.find(item => item.id === productId);
    
    if (item) {
      // If the product is out of stock, remove it from the cart
      if (newStock === 0) {
        this.removeFromCart(productId);
        this.showNotification(`${item.name} has been removed from your cart as it is now out of stock.`, 'error');
        return;
      }
      
      // If there's not enough stock for the current quantity, reduce the quantity
      if (newStock < item.quantity) {
        this.updateQuantity(productId, newStock);
        this.showNotification(`${item.name} quantity has been updated due to stock changes.`, 'warning');
        return;
      }
      
      // If the stock has decreased but we still have enough, show a warning
      if (newStock < oldStock && newStock <= 5) {
        this.showNotification(`Only ${newStock} ${item.name}(s) left in stock!`, 'warning');
      }
      
      // If the stock has increased and was previously low, show info
      if (newStock > oldStock && oldStock <= 5 && newStock > 5) {
        this.showNotification(`${item.name} is back in stock!`, 'info');
      }
    }
  }
  
  // Show a notification
  showNotification(message, type = 'info') {
    // Create notification element
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
    
    // Add to notifications container or create one if it doesn't exist
    let container = document.querySelector('.notifications-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'notifications-container';
      document.body.appendChild(container);
    }
    
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
}

// Create global instance
const cartManager = new CartManager(); 