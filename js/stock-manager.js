// Real-time stock management system
class StockManager {
  constructor() {
    // Load products from localStorage or initialize with default data
    this.products = JSON.parse(localStorage.getItem('products')) || {};
    this.observers = [];
    
    // Set up interval to simulate real-time updates from a server
    this.setupSimulatedUpdates();
  }
  
  // Get a product by its ID
  getProduct(productId) {
    return this.products[productId];
  }
  
  // Get all products
  getAllProducts() {
    return this.products;
  }
  
  // Update stock level for a product
  updateStock(productId, newQuantity) {
    if (this.products[productId]) {
      const oldQuantity = this.products[productId].stock;
      this.products[productId].stock = newQuantity;
      
      // Save to localStorage
      localStorage.setItem('products', JSON.stringify(this.products));
      
      // Notify observers about the stock change
      this.notifyObservers(productId, oldQuantity, newQuantity);
      
      return true;
    }
    return false;
  }
  
  // Check if a product is in stock
  isInStock(productId) {
    return this.products[productId] && this.products[productId].stock > 0;
  }
  
  // Check if product is low in stock
  isLowStock(productId, threshold = 5) {
    return this.products[productId] && 
           this.products[productId].stock > 0 && 
           this.products[productId].stock <= threshold;
  }
  
  // Reserve stock during checkout
  reserveStock(productId, quantity) {
    if (!this.hasEnoughStock(productId, quantity)) {
      return false;
    }
    
    // Temporarily reduce stock during checkout
    const currentStock = this.products[productId].stock;
    this.updateStock(productId, currentStock - quantity);
    
    // Return a release function that can be called if checkout is cancelled
    return () => {
      this.updateStock(productId, this.products[productId].stock + quantity);
    };
  }
  
  // Check if there's enough stock for a purchase
  hasEnoughStock(productId, quantity) {
    return this.products[productId] && this.products[productId].stock >= quantity;
  }
  
  // Add an observer to be notified of stock changes
  subscribe(observer) {
    if (typeof observer.updateStockDisplay === 'function') {
      this.observers.push(observer);
    }
  }
  
  // Remove an observer
  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }
  
  // Notify all observers about a stock change
  notifyObservers(productId, oldQuantity, newQuantity) {
    this.observers.forEach(observer => {
      observer.updateStockDisplay(productId, newQuantity, oldQuantity);
    });
  }
  
  // Simulate real-time updates that would come from a server
  setupSimulatedUpdates() {
    // Simulate occasional stock changes to random products
    setInterval(() => {
      const productIds = Object.keys(this.products);
      if (productIds.length === 0) return;
      
      // Randomly select a product
      const randomIndex = Math.floor(Math.random() * productIds.length);
      const productId = productIds[randomIndex];
      
      // Decide if we're increasing or decreasing stock
      const isIncrease = Math.random() > 0.3; // 70% chance of increase
      
      if (isIncrease) {
        // Simulate restocking (1-5 items)
        const addAmount = Math.floor(Math.random() * 5) + 1;
        const currentStock = this.products[productId].stock;
        this.updateStock(productId, currentStock + addAmount);
      } else {
        // Simulate purchase by other user (1-3 items)
        const removeAmount = Math.floor(Math.random() * 3) + 1;
        const currentStock = this.products[productId].stock;
        if (currentStock >= removeAmount) {
          this.updateStock(productId, currentStock - removeAmount);
        }
      }
    }, 30000); // Every 30 seconds
  }
}

// Create global instance
const stockManager = new StockManager(); 