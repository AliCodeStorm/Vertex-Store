class RecommendationEngine {
  constructor() {
    this.viewedProducts = JSON.parse(localStorage.getItem('viewedProducts')) || [];
    this.initializeRecommendations();
  }
  
  initializeRecommendations() {
    // Track product views
    this.trackProductViews();
    
    // Display recommendations if container exists
    this.displayRecommendations();
  }
  
  trackProductViews() {
    // Check if we're on a product page
    const productId = new URLSearchParams(window.location.search).get('id');
    
    if (productId && stockManager.products[productId]) {
      // Add to viewed products
      if (!this.viewedProducts.includes(productId)) {
        // Keep only the last 10 viewed products
        if (this.viewedProducts.length >= 10) {
          this.viewedProducts.pop();
        }
        
        this.viewedProducts.unshift(productId);
        localStorage.setItem('viewedProducts', JSON.stringify(this.viewedProducts));
      }
    }
  }
  
  displayRecommendations() {
    const recommendationsContainer = document.querySelector('.recommendations');
    if (!recommendationsContainer) return;
    
    // Get recommendations based on viewed products
    const recommendations = this.getRecommendations();
    
    if (recommendations.length === 0) {
      recommendationsContainer.innerHTML = '<p>No recommendations available yet.</p>';
      return;
    }
    
    recommendationsContainer.innerHTML = `
      <h2>Recommended for You</h2>
      <div class="recommendations-grid">
        ${recommendations.map(product => `
          <div class="product-card" data-product-id="${product.id}">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">$${product.price.toFixed(2)}</p>
            <p class="stock-display ${product.stock > 5 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock'}" 
               data-product-id="${product.id}">
              ${product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>
            <button class="add-to-cart" data-product-id="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>
              Add to Cart
            </button>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  getRecommendations() {
    // Simple recommendation algorithm based on viewed products
    const recommendations = [];
    const allProducts = stockManager.products;
    
    // If user has viewed products, recommend from same categories
    if (this.viewedProducts.length > 0) {
      const viewedCategories = this.viewedProducts
        .map(id => allProducts[id]?.category)
        .filter(Boolean);
      
      // Find products in the same categories that haven't been viewed
      Object.values(allProducts).forEach(product => {
        if (!this.viewedProducts.includes(product.id) && 
            viewedCategories.includes(product.category) &&
            recommendations.length < 4) {
          recommendations.push(product);
        }
      });
    }
    
    // If we don't have enough recommendations, add popular products
    if (recommendations.length < 4) {
      // In a real app, you'd have popularity data
      // Here we'll just use products with most stock as a proxy
      const remainingProducts = Object.values(allProducts)
        .filter(p => !this.viewedProducts.includes(p.id) && 
                    !recommendations.some(r => r.id === p.id))
        .sort((a, b) => b.stock - a.stock);
      
      while (recommendations.length < 4 && remainingProducts.length > 0) {
        recommendations.push(remainingProducts.shift());
      }
    }
    
    return recommendations;
  }
}

// Initialize recommendations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const recommendations = new RecommendationEngine();
}); 