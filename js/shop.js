/**
 * Vertex Store - Shop Page Scripts
 * Handles filtering, sorting, pagination and display of products
 */

// Initialize shop functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initShop();
});

// Global variables
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let productsPerPage = 12;
let currentCategory = '';
let currentSort = 'featured';
let priceRange = {
    min: 0,
    max: Infinity
};
let showOutOfStock = true;

// Initialize shop functionality
function initShop() {
    // Load all products
    loadAllProducts();
    
    // Load categories
    loadCategories();
    
    // Set up event listeners
    setupFilters();
    setupSorting();
    setupViewModes();
    setupPagination();
    
    // Check for URL parameters
    checkUrlParams();
}

// Load all products
function loadAllProducts() {
    // Get products from window.storeData
    allProducts = Object.values(window.storeData.getProducts());
    
    // Apply initial filters and sorting
    filterAndSortProducts();
}

// Load categories
function loadCategories() {
    const categoryFilter = document.querySelector('.category-filter');
    if (!categoryFilter) return;
    
    // Get categories from window.storeData
    const categories = window.storeData.getCategories();
    
    // Add "All Categories" option
    const allCategoryLi = document.createElement('li');
    allCategoryLi.innerHTML = `
        <label>
            <input type="radio" name="category" value="all" checked>
            <span>All Categories</span>
        </label>
    `;
    categoryFilter.appendChild(allCategoryLi);
    
    // Add each category
    categories.forEach(category => {
        const categoryLi = document.createElement('li');
        categoryLi.innerHTML = `
            <label>
                <input type="radio" name="category" value="${category.id}">
                <span>${category.name}</span>
            </label>
        `;
        categoryFilter.appendChild(categoryLi);
    });
    
    // Add event listeners to category filters
    const categoryInputs = categoryFilter.querySelectorAll('input[name="category"]');
    categoryInputs.forEach(input => {
        input.addEventListener('change', function() {
            currentCategory = this.value === 'all' ? '' : this.value;
            currentPage = 1;
            filterAndSortProducts();
            updateUrlParams();
        });
    });
}

// Set up filter event listeners
function setupFilters() {
    // Price filter
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const priceFilterBtn = document.getElementById('price-filter-btn');
    
    if (priceFilterBtn) {
        priceFilterBtn.addEventListener('click', function() {
            const minPrice = minPriceInput.value ? parseFloat(minPriceInput.value) : 0;
            const maxPrice = maxPriceInput.value ? parseFloat(maxPriceInput.value) : Infinity;
            
            if (minPrice >= 0 && (maxPrice === Infinity || maxPrice >= minPrice)) {
                priceRange.min = minPrice;
                priceRange.max = maxPrice;
                currentPage = 1;
                filterAndSortProducts();
                updateUrlParams();
            } else {
                // Show error notification
                window.showNotification?.('Please enter valid price range', 'error');
            }
        });
    }
    
    // Stock filter
    const inStockFilter = document.getElementById('in-stock-filter');
    const outOfStockFilter = document.getElementById('out-of-stock-filter');
    
    if (inStockFilter && outOfStockFilter) {
        // Ensure at least one is checked
        inStockFilter.addEventListener('change', function() {
            if (!this.checked && !outOfStockFilter.checked) {
                outOfStockFilter.checked = true;
            }
            filterByStock();
        });
        
        outOfStockFilter.addEventListener('change', function() {
            if (!this.checked && !inStockFilter.checked) {
                inStockFilter.checked = true;
            }
            filterByStock();
        });
    }
    
    // Reset filters button
    const resetFiltersBtn = document.getElementById('reset-filters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            // Reset category
            const allCategoryRadio = document.querySelector('input[name="category"][value="all"]');
            if (allCategoryRadio) {
                allCategoryRadio.checked = true;
            }
            currentCategory = '';
            
            // Reset price
            if (minPriceInput) minPriceInput.value = '';
            if (maxPriceInput) maxPriceInput.value = '';
            priceRange.min = 0;
            priceRange.max = Infinity;
            
            // Reset stock
            if (inStockFilter) inStockFilter.checked = true;
            if (outOfStockFilter) outOfStockFilter.checked = true;
            
            // Reset page
            currentPage = 1;
            
            // Apply filters
            filterAndSortProducts();
            updateUrlParams();
            
            // Show notification
            window.showNotification?.('Filters have been reset', 'info');
        });
    }
}

// Handle stock filtering
function filterByStock() {
    const inStockFilter = document.getElementById('in-stock-filter');
    const outOfStockFilter = document.getElementById('out-of-stock-filter');
    
    const showInStock = inStockFilter?.checked ?? true;
    showOutOfStock = outOfStockFilter?.checked ?? true;
    
    currentPage = 1;
    filterAndSortProducts();
    updateUrlParams();
}

// Set up sorting event listeners
function setupSorting() {
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            filterAndSortProducts();
            updateUrlParams();
        });
    }
}

// Set up view mode (grid/list) event listeners
function setupViewModes() {
    const gridViewBtn = document.querySelector('.grid-view');
    const listViewBtn = document.querySelector('.list-view');
    const productGrid = document.querySelector('.product-grid');
    
    if (gridViewBtn && listViewBtn && productGrid) {
        gridViewBtn.addEventListener('click', function() {
            productGrid.classList.remove('list-view');
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
        });
        
        listViewBtn.addEventListener('click', function() {
            productGrid.classList.add('list-view');
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
        });
    }
}

// Set up pagination event listeners
function setupPagination() {
    const prevPageBtn = document.querySelector('.prev-page');
    const nextPageBtn = document.querySelector('.next-page');
    
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                displayProducts();
                updatePagination();
                updateUrlParams();
                
                // Scroll to top of products
                const shopContent = document.querySelector('.shop-content');
                if (shopContent) {
                    shopContent.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', function() {
            if (currentPage < Math.ceil(filteredProducts.length / productsPerPage)) {
                currentPage++;
                displayProducts();
                updatePagination();
                updateUrlParams();
                
                // Scroll to top of products
                const shopContent = document.querySelector('.shop-content');
                if (shopContent) {
                    shopContent.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }
}

// Filter and sort products
function filterAndSortProducts() {
    // Filter by category
    if (currentCategory) {
        filteredProducts = allProducts.filter(product => product.category === currentCategory);
    } else {
        filteredProducts = [...allProducts];
    }
    
    // Filter by price
    filteredProducts = filteredProducts.filter(product => 
        product.price >= priceRange.min && product.price <= priceRange.max
    );
    
    // Filter by stock
    if (!showOutOfStock) {
        filteredProducts = filteredProducts.filter(product => product.stock > 0);
    }
    
    // Sort products
    sortProducts();
    
    // Update product count
    updateProductCount();
    
    // Display products
    displayProducts();
    
    // Update pagination
    updatePagination();
}

// Sort products based on selected sorting option
function sortProducts() {
    switch (currentSort) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'newest':
            filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
            break;
        case 'featured':
        default:
            filteredProducts.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
            break;
    }
}

// Update product count display
function updateProductCount() {
    const productCount = document.getElementById('product-count');
    if (productCount) {
        productCount.textContent = filteredProducts.length;
    }
}

// Display products on the current page
function displayProducts() {
    const productGrid = document.querySelector('.shop-grid');
    if (!productGrid) return;
    
    // Clear grid
    productGrid.innerHTML = '';
    
    // Calculate start and end indices
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = Math.min(startIndex + productsPerPage, filteredProducts.length);
    
    // If no products found
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `
            <div class="no-products-found">
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search criteria.</p>
            </div>
        `;
        return;
    }
    
    // Add products to grid
    for (let i = startIndex; i < endIndex; i++) {
        const product = filteredProducts[i];
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    }
    
    // Add fade-in animation to products
    const cards = productGrid.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in');
        }, index * 50);
    });
}

// Create a product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = product.id;
    
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
    
    // Set up the HTML
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
            ${discountBadge}
            ${newBadge}
            ${outOfStockBadge}
            <div class="product-actions">
                <button class="quick-view-btn" title="Quick View">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="wishlist-btn" title="Add to Wishlist">
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
            <p class="product-description">
                ${product.description.substring(0, 100)}...
            </p>
            <button class="add-to-cart" ${product.stock <= 0 ? 'disabled' : ''} data-product-id="${product.id}">
                <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
        </div>
    `;
    
    // Add event listeners
    card.querySelector('.add-to-cart').addEventListener('click', function(e) {
        e.preventDefault();
        if (product.stock > 0) {
            addToCart(product.id);
        }
    });
    
    card.querySelector('.quick-view-btn').addEventListener('click', function() {
        window.showQuickView?.(product.id);
    });
    
    card.querySelector('.wishlist-btn').addEventListener('click', function() {
        window.toggleWishlist?.(product.id);
    });
    
    // Track product view when clicking on the product name
    card.querySelector('.product-name a').addEventListener('click', function() {
        window.storeData.trackProductView(product.id);
    });
    
    return card;
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

// Update pagination buttons and numbers
function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const prevPageBtn = document.querySelector('.prev-page');
    const nextPageBtn = document.querySelector('.next-page');
    const pageNumbers = document.querySelector('.page-numbers');
    
    // Update prev/next buttons
    if (prevPageBtn) {
        prevPageBtn.disabled = currentPage === 1;
    }
    
    if (nextPageBtn) {
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
    
    // Update page numbers
    if (pageNumbers) {
        pageNumbers.innerHTML = '';
        
        // Determine range of pages to show
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        // Adjust start if end is at max
        if (endPage === totalPages) {
            startPage = Math.max(1, endPage - 4);
        }
        
        // First page button
        if (startPage > 1) {
            const firstPageBtn = document.createElement('button');
            firstPageBtn.className = 'page-number';
            firstPageBtn.textContent = '1';
            firstPageBtn.addEventListener('click', () => goToPage(1));
            pageNumbers.appendChild(firstPageBtn);
            
            // Ellipsis if needed
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'page-ellipsis';
                ellipsis.textContent = '...';
                pageNumbers.appendChild(ellipsis);
            }
        }
        
        // Page number buttons
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'page-number';
            if (i === currentPage) {
                pageBtn.classList.add('active');
            }
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => goToPage(i));
            pageNumbers.appendChild(pageBtn);
        }
        
        // Last page button
        if (endPage < totalPages) {
            // Ellipsis if needed
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'page-ellipsis';
                ellipsis.textContent = '...';
                pageNumbers.appendChild(ellipsis);
            }
            
            const lastPageBtn = document.createElement('button');
            lastPageBtn.className = 'page-number';
            lastPageBtn.textContent = totalPages;
            lastPageBtn.addEventListener('click', () => goToPage(totalPages));
            pageNumbers.appendChild(lastPageBtn);
        }
    }
}

// Go to specific page
function goToPage(page) {
    if (page !== currentPage) {
        currentPage = page;
        displayProducts();
        updatePagination();
        updateUrlParams();
        
        // Scroll to top of products
        const shopContent = document.querySelector('.shop-content');
        if (shopContent) {
            shopContent.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Check URL parameters for filter values
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check for category
    if (urlParams.has('category')) {
        const category = urlParams.get('category');
        const categoryInput = document.querySelector(`input[name="category"][value="${category}"]`);
        if (categoryInput) {
            categoryInput.checked = true;
            currentCategory = category;
        }
    }
    
    // Check for price range
    if (urlParams.has('min_price')) {
        const minPrice = parseFloat(urlParams.get('min_price'));
        if (!isNaN(minPrice)) {
            priceRange.min = minPrice;
            const minPriceInput = document.getElementById('min-price');
            if (minPriceInput) {
                minPriceInput.value = minPrice;
            }
        }
    }
    
    if (urlParams.has('max_price')) {
        const maxPrice = parseFloat(urlParams.get('max_price'));
        if (!isNaN(maxPrice)) {
            priceRange.max = maxPrice;
            const maxPriceInput = document.getElementById('max-price');
            if (maxPriceInput) {
                maxPriceInput.value = maxPrice;
            }
        }
    }
    
    // Check for stock filter
    if (urlParams.has('out_of_stock')) {
        showOutOfStock = urlParams.get('out_of_stock') === 'true';
        const outOfStockFilter = document.getElementById('out-of-stock-filter');
        if (outOfStockFilter) {
            outOfStockFilter.checked = showOutOfStock;
        }
        
        // Ensure in-stock filter is checked if out-of-stock is unchecked
        if (!showOutOfStock) {
            const inStockFilter = document.getElementById('in-stock-filter');
            if (inStockFilter) {
                inStockFilter.checked = true;
            }
        }
    }
    
    // Check for sort
    if (urlParams.has('sort')) {
        const sort = urlParams.get('sort');
        const sortSelect = document.getElementById('sort-by');
        if (sortSelect) {
            const option = sortSelect.querySelector(`option[value="${sort}"]`);
            if (option) {
                sortSelect.value = sort;
                currentSort = sort;
            }
        }
    }
    
    // Check for page
    if (urlParams.has('page')) {
        const page = parseInt(urlParams.get('page'));
        if (!isNaN(page) && page > 0) {
            currentPage = page;
        }
    }
    
    // Apply filters
    filterAndSortProducts();
}

// Update URL parameters based on current filters
function updateUrlParams() {
    const urlParams = new URLSearchParams();
    
    // Add category param
    if (currentCategory) {
        urlParams.set('category', currentCategory);
    }
    
    // Add price range params
    if (priceRange.min > 0) {
        urlParams.set('min_price', priceRange.min);
    }
    
    if (priceRange.max < Infinity) {
        urlParams.set('max_price', priceRange.max);
    }
    
    // Add stock filter param
    if (!showOutOfStock) {
        urlParams.set('out_of_stock', 'false');
    }
    
    // Add sort param
    if (currentSort !== 'featured') {
        urlParams.set('sort', currentSort);
    }
    
    // Add page param
    if (currentPage > 1) {
        urlParams.set('page', currentPage);
    }
    
    // Update URL
    const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
    history.replaceState(null, '', newUrl);
}

// Add to cart function
function addToCart(productId) {
    // Get current cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Increment quantity
        existingItem.quantity += 1;
    } else {
        // Add new item
        cart.push({
            id: productId,
            quantity: 1
        });
    }
    
    // Save cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count (uses function from main.js)
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    } else if (typeof window.updateCartCountWithAnimation === 'function') {
        window.updateCartCountWithAnimation();
    }
    
    // Show notification
    window.showNotification?.('Product added to cart', 'success');
} 