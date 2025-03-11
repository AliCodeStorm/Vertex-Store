class UIManager {
  constructor() {
    // Register with cart and stock managers
    cartManager.subscribe(this);
    stockManager.subscribe(this);
    
    // Initialize UI elements
    this.initializeUI();
  }
  
  initializeUI() {
    // Update cart count in header
    this.updateCartCount();
    
    // Add event listeners based on the current page
    this.setupPageSpecificListeners();
    
    // Update product displays
    this.updateAllProductDisplays();
  }
  
  setupPageSpecificListeners() {
    const currentPage = this.getCurrentPage();
    
    // Common listeners for all pages
    this.setupCartIconListeners();
    this.setupChatListeners();
    
    // Page-specific listeners
    switch (currentPage) {
      case 'index':
        this.setupIndexPageListeners();
        break;
      case 'shop':
        this.setupShopPageListeners();
        break;
      case 'product':
        this.setupProductPageListeners();
        break;
      case 'cart':
        this.setupCartPageListeners();
        break;
      case 'checkout':
        this.setupCheckoutPageListeners();
        break;
      case 'order':
        this.setupOrderPageListeners();
        break;
      case 'dashboard':
        this.setupDashboardPageListeners();
        break;
      case 'admin':
        this.setupAdminPageListeners();
        break;
    }
  }
  
  getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    if (!filename || filename === '' || filename === 'index.html') {
      return 'index';
    }
    
    return filename.replace('.html', '');
  }
  
  setupCartIconListeners() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
      cartCount.textContent = cartManager.getTotalItems();
    }
  }
  
  setupChatListeners() {
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
        this.sendChatMessage();
      });
      
      // Send message on Enter key
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendChatMessage();
        }
      });
    }
  }
  
  sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatBody = document.getElementById('chatBody');
    
    if (!chatInput || !chatBody) return;
    
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'message user';
    userMessage.innerHTML = `
      <p>${message}</p>
      <span class="time">${new Date().toLocaleTimeString()}</span>
    `;
    
    chatBody.appendChild(userMessage);
    
    // Send message to server
    // This is a placeholder and should be replaced with actual implementation
    console.log('Sending chat message:', message);
    
    // Clear input
    chatInput.value = '';
  }
  
  updateCartDisplay(cart) {
    // Update cart count badge
    this.updateCartCount();
    
    // Update cart page if we're on it
    if (window.location.pathname.includes('cart.html')) {
      this.renderCartItems(cart);
      this.updateCartTotal();
    }
  }
  
  updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
      const totalItems = cartManager.cart.reduce((total, item) => total + item.quantity, 0);
      cartCount.textContent = totalItems;
      
      // Animate the count change
      cartCount.classList.add('pulse');
      setTimeout(() => cartCount.classList.remove('pulse'), 300);
    }
  }
  
  updateStockDisplay(productId, newStock) {
    // Update all instances of this product on the page
    const stockElements = document.querySelectorAll(`.stock-display[data-product-id="${productId}"]`);
    
    stockElements.forEach(element => {
      // Update the stock display
      element.textContent = newStock > 0 ? `${newStock} in stock` : 'Out of stock';
      
      // Update styling based on stock level
      element.classList.remove('in-stock', 'low-stock', 'out-of-stock');
      
      if (newStock === 0) {
        element.classList.add('out-of-stock');
      } else if (newStock <= 5) {
        element.classList.add('low-stock');
        // Add blinking animation for low stock
        element.innerHTML = `<span class="blink">Only ${newStock} left!</span>`;
      } else {
        element.classList.add('in-stock');
      }
      
      // Disable add to cart buttons if out of stock
      const addToCartBtn = document.querySelector(`.add-to-cart[data-product-id="${productId}"]`);
      if (addToCartBtn) {
        addToCartBtn.disabled = newStock === 0;
      }
    });
  }
  
  renderCartItems(cart) {
    const cartContainer = document.querySelector('.cart-items');
    if (!cartContainer) return;
    
    if (cart.length === 0) {
      cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
      return;
    }
    
    cartContainer.innerHTML = cart.map(item => `
      <div class="cart-item" data-product-id="${item.id}">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
          <h3>${item.name}</h3>
          <p>$${item.price.toFixed(2)}</p>
          <div class="quantity-control">
            <button class="decrease-quantity" data-product-id="${item.id}">-</button>
            <input type="number" value="${item.quantity}" min="1" class="item-quantity" data-product-id="${item.id}">
            <button class="increase-quantity" data-product-id="${item.id}">+</button>
          </div>
        </div>
        <button class="remove-from-cart" data-product-id="${item.id}">×</button>
      </div>
    `).join('');
    
    // Add event listeners to new elements
    this.setupCartEventListeners();
  }
  
  updateCartTotal() {
    const totalElement = document.querySelector('.cart-total');
    if (totalElement) {
      totalElement.textContent = `$${cartManager.getTotal().toFixed(2)}`;
      
      // Animate the total change
      totalElement.classList.add('highlight');
      setTimeout(() => totalElement.classList.remove('highlight'), 500);
    }
  }
  
  updateAllProductDisplays() {
    // Update all product displays on the page
    Object.keys(stockManager.products).forEach(productId => {
      this.updateStockDisplay(productId, stockManager.products[productId].stock);
    });
  }
  
  setupEventListeners() {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', (e) => {
        const productId = e.target.dataset.productId;
        const product = stockManager.products[productId];
        
        if (cartManager.addToCart(product)) {
          // Show success animation
          this.showAddToCartAnimation(e.target);
        }
      });
    });
    
    // Setup cart-specific listeners if on cart page
    if (window.location.pathname.includes('cart.html')) {
      this.setupCartEventListeners();
    }
  }
  
  setupCartEventListeners() {
    // Remove from cart buttons
    document.querySelectorAll('.remove-from-cart').forEach(button => {
      button.addEventListener('click', (e) => {
        const productId = e.target.dataset.productId;
        cartManager.removeFromCart(productId);
      });
    });
    
    // Quantity controls
    document.querySelectorAll('.increase-quantity').forEach(button => {
      button.addEventListener('click', (e) => {
        const productId = e.target.dataset.productId;
        const item = cartManager.cart.find(item => item.id === productId);
        if (item) {
          cartManager.updateQuantity(productId, item.quantity + 1);
        }
      });
    });
    
    document.querySelectorAll('.decrease-quantity').forEach(button => {
      button.addEventListener('click', (e) => {
        const productId = e.target.dataset.productId;
        const item = cartManager.cart.find(item => item.id === productId);
        if (item && item.quantity > 1) {
          cartManager.updateQuantity(productId, item.quantity - 1);
        }
      });
    });
    
    document.querySelectorAll('.item-quantity').forEach(input => {
      input.addEventListener('change', (e) => {
        const productId = e.target.dataset.productId;
        const newQuantity = parseInt(e.target.value);
        if (newQuantity > 0) {
          cartManager.updateQuantity(productId, newQuantity);
        } else {
          // Reset to 1 if invalid input
          e.target.value = 1;
          cartManager.updateQuantity(productId, 1);
        }
      });
    });
  }
  
  showAddToCartAnimation(button) {
    // Create flying cart animation
    const productCard = button.closest('.product-card');
    if (!productCard) return;
    
    const productImage = productCard.querySelector('img').cloneNode(true);
    const cartIcon = document.querySelector('.cart-icon');
    
    if (!cartIcon) return;
    
    // Style the flying image
    productImage.classList.add('flying-image');
    document.body.appendChild(productImage);
    
    // Get positions
    const startPos = productCard.getBoundingClientRect();
    const endPos = cartIcon.getBoundingClientRect();
    
    // Set start position
    productImage.style.top = `${startPos.top}px`;
    productImage.style.left = `${startPos.left}px`;
    productImage.style.width = `${startPos.width}px`;
    productImage.style.height = `${startPos.height}px`;
    
    // Animate to cart
    setTimeout(() => {
      productImage.style.top = `${endPos.top}px`;
      productImage.style.left = `${endPos.left}px`;
      productImage.style.width = '30px';
      productImage.style.height = '30px';
      productImage.style.opacity = '0';
    }, 10);
    
    // Remove after animation
    setTimeout(() => {
      productImage.remove();
    }, 1000);
  }
}

// Initialize UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const ui = new UIManager();
}); 