// Initialize sample product data if not already in localStorage
function initializeProductData() {
  if (!localStorage.getItem('products')) {
    const sampleProducts = {
      'p1': {
        id: 'p1',
        name: 'Wireless Headphones',
        price: 99.99,
        stock: 15,
        image: 'images/products/headphones.jpg',
        images: [
          'images/products/headphones-1.jpg',
          'images/products/headphones-2.jpg',
          'images/products/headphones-3.jpg',
          'images/products/headphones-4.jpg'
        ],
        category: 'electronics',
        description: 'Premium wireless headphones with noise cancellation.'
      },
      'p2': {
        id: 'p2',
        name: 'Smart Watch',
        price: 149.99,
        stock: 8,
        image: 'images/products/smartwatch.jpg',
        images: [
          'images/products/smartwatch-1.jpg',
          'images/products/smartwatch-2.jpg',
          'images/products/smartwatch-3.jpg',
          'images/products/smartwatch-4.jpg'
        ],
        category: 'electronics',
        description: 'Track your fitness and stay connected with this smart watch.'
      },
      'p3': {
        id: 'p3',
        name: 'Bluetooth Speaker',
        price: 79.99,
        stock: 3,
        image: 'images/products/speaker.jpg',
        images: [
          'images/products/speaker-1.jpg',
          'images/products/speaker-2.jpg',
          'images/products/speaker-3.jpg',
          'images/products/speaker-4.jpg'
        ],
        category: 'electronics',
        description: 'Portable Bluetooth speaker with amazing sound quality.'
      },
      'p4': {
        id: 'p4',
        name: 'Laptop Backpack',
        price: 49.99,
        stock: 0,
        image: 'images/products/backpack.jpg',
        images: [
          'images/products/backpack-1.jpg',
          'images/products/backpack-2.jpg',
          'images/products/backpack-3.jpg',
          'images/products/backpack-4.jpg'
        ],
        category: 'accessories',
        description: 'Durable backpack with laptop compartment and USB charging port.'
      }
    };
    
    localStorage.setItem('products', JSON.stringify(sampleProducts));
  }
}

// Run initialization when page loads
document.addEventListener('DOMContentLoaded', initializeProductData); 