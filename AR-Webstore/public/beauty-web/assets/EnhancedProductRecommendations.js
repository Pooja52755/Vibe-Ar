/**
 * Enhanced product recommendation system that displays relevant makeup products
 * based on AI-applied filters and user preferences.
 * 
 * This script:
 * 1. Shows product recommendations based on applied makeup filters
 * 2. Filters products by color similarity to applied makeup
 * 3. Categorizes products by type (lipstick, eyeshadow, blush)
 * 4. Handles product display in a responsive grid layout
 * 5. Provides add-to-cart functionality
 */

class EnhancedProductRecommendations {
  constructor() {
    // Use mock product data if available, otherwise use default data
    this.productData = window.MOCK_PRODUCT_DATA || {
      // Default fallback product data
      lipsticks: [],
      eyeshadows: [],
      blush: []
    };
    
    this.selectedProducts = [];
    this.productContainer = null;
    this.isDisplayingProducts = false;
    
    // Initialize when document is ready
    if (document.readyState === 'complete') {
      this.initialize();
    } else {
      window.addEventListener('load', () => this.initialize());
    }
  }
  
  /**
   * Initialize the product recommendation system
   */
  initialize() {
    console.log('Initializing Enhanced Product Recommendations...');
    
    // Create product display container
    this.createProductContainer();
    
    // Listen for makeup application events
    document.addEventListener('makeupApplied', (event) => {
      if (event.detail) {
        this.displayProductRecommendations(event.detail);
      }
    });
  }
  
  /**
   * Create the product display container
   */
  createProductContainer() {
    // Check if container already exists
    if (document.getElementById('enhanced-product-recommendations')) {
      return;
    }
    
    // Create container
    this.productContainer = document.createElement('div');
    this.productContainer.id = 'enhanced-product-recommendations';
    this.productContainer.className = 'product-recommendations';
    this.productContainer.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: white;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
      z-index: 999;
      padding: 15px;
      transition: transform 0.3s ease;
      transform: translateY(100%);
      max-height: 60vh;
      overflow-y: auto;
    `;
    
    // Create header
    const header = document.createElement('div');
    header.className = 'product-recommendations-header';
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    `;
    
    // Create title
    const title = document.createElement('h3');
    title.textContent = 'Recommended Products';
    title.style.cssText = `
      margin: 0;
      font-size: 18px;
      color: #333;
    `;
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
    `;
    closeButton.onclick = () => this.hideProductRecommendations();
    
    // Add title and close button to header
    header.appendChild(title);
    header.appendChild(closeButton);
    
    // Add header to container
    this.productContainer.appendChild(header);
    
    // Create product grid container
    const productGrid = document.createElement('div');
    productGrid.className = 'product-grid';
    productGrid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 15px;
    `;
    
    // Add product grid to container
    this.productContainer.appendChild(productGrid);
    
    // Add container to document
    document.body.appendChild(this.productContainer);
    
    // Create indicator that shows when products are available
    this.createProductIndicator();
  }
  
  /**
   * Create an indicator that shows when product recommendations are available
   */
  createProductIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'product-recommendations-indicator';
    indicator.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #8e44ad;
      color: white;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
      cursor: pointer;
      z-index: 1000;
      opacity: 0;
      transform: scale(0.8);
      transition: opacity 0.3s, transform 0.3s;
    `;
    
    // Add icon
    indicator.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
    `;
    
    // Add click handler to show recommendations
    indicator.onclick = () => {
      this.showProductRecommendations();
    };
    
    // Add indicator to document
    document.body.appendChild(indicator);
  }
  
  /**
   * Show the product recommendations panel
   */
  showProductRecommendations() {
    if (!this.productContainer) return;
    
    this.productContainer.style.transform = 'translateY(0)';
    this.isDisplayingProducts = true;
  }
  
  /**
   * Hide the product recommendations panel
   */
  hideProductRecommendations() {
    if (!this.productContainer) return;
    
    this.productContainer.style.transform = 'translateY(100%)';
    this.isDisplayingProducts = false;
  }
  
  /**
   * Show the product recommendations indicator
   */
  showProductIndicator() {
    const indicator = document.getElementById('product-recommendations-indicator');
    if (!indicator) return;
    
    indicator.style.opacity = '1';
    indicator.style.transform = 'scale(1)';
  }
  
  /**
   * Hide the product recommendations indicator
   */
  hideProductIndicator() {
    const indicator = document.getElementById('product-recommendations-indicator');
    if (!indicator) return;
    
    indicator.style.opacity = '0';
    indicator.style.transform = 'scale(0.8)';
  }
  
  /**
   * Display product recommendations based on applied makeup
   * @param {Object} makeupDetails - Applied makeup details
   */
  displayProductRecommendations(makeupDetails) {
    console.log('Displaying product recommendations for:', makeupDetails);
    
    // Ensure we have a product container
    if (!this.productContainer) {
      this.createProductContainer();
    }
    
    // Get the product grid
    const productGrid = this.productContainer.querySelector('.product-grid');
    if (!productGrid) return;
    
    // Clear previous products
    productGrid.innerHTML = '';
    
    // Update header with occasion information if available
    const title = this.productContainer.querySelector('h3');
    if (title && makeupDetails.occasion) {
      title.textContent = `Products for ${makeupDetails.occasion}`;
    } else if (title) {
      title.textContent = 'Recommended Products';
    }
    
    // Find matching products for each makeup category
    const matchingProducts = this.findMatchingProducts(makeupDetails);
    
    // Display matching products
    let totalProducts = 0;
    
    // Add section for lipsticks if we have any
    if (matchingProducts.lipsticks && matchingProducts.lipsticks.length > 0) {
      totalProducts += matchingProducts.lipsticks.length;
      this.addProductSection(productGrid, 'Lipsticks', matchingProducts.lipsticks);
    }
    
    // Add section for eyeshadows if we have any
    if (matchingProducts.eyeshadows && matchingProducts.eyeshadows.length > 0) {
      totalProducts += matchingProducts.eyeshadows.length;
      this.addProductSection(productGrid, 'Eyeshadows', matchingProducts.eyeshadows);
    }
    
    // Add section for blush if we have any
    if (matchingProducts.blush && matchingProducts.blush.length > 0) {
      totalProducts += matchingProducts.blush.length;
      this.addProductSection(productGrid, 'Blush', matchingProducts.blush);
    }
    
    // Show or hide recommendations based on number of products
    if (totalProducts > 0) {
      this.showProductIndicator();
      
      // Auto-show recommendations on first display
      if (!this.isDisplayingProducts && this.selectedProducts.length === 0) {
        this.showProductRecommendations();
      }
    } else {
      this.hideProductIndicator();
    }
    
    // Save the current selection
    this.selectedProducts = [...matchingProducts.lipsticks, ...matchingProducts.eyeshadows, ...matchingProducts.blush];
  }
  
  /**
   * Add a product section to the grid
   * @param {HTMLElement} container - Grid container
   * @param {string} title - Section title
   * @param {Array} products - Products to display
   */
  addProductSection(container, title, products) {
    // Create section title that spans full width
    const sectionTitle = document.createElement('div');
    sectionTitle.className = 'product-section-title';
    sectionTitle.textContent = title;
    sectionTitle.style.cssText = `
      grid-column: 1 / -1;
      margin-top: 10px;
      margin-bottom: 5px;
      font-weight: bold;
      color: #333;
      font-size: 16px;
    `;
    
    // Add section title to container
    container.appendChild(sectionTitle);
    
    // Add products
    products.forEach(product => {
      container.appendChild(this.createProductCard(product));
    });
  }
  
  /**
   * Create a product card
   * @param {Object} product - Product data
   * @returns {HTMLElement} Product card element
   */
  createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.cssText = `
      border: 1px solid #eee;
      border-radius: 8px;
      overflow: hidden;
      background-color: white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      transition: transform 0.2s, box-shadow 0.2s;
    `;
    
    // Add hover effect
    card.onmouseover = () => {
      card.style.transform = 'translateY(-5px)';
      card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
    };
    
    card.onmouseout = () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
    };
    
    // Product image with fallback
    const imageContainer = document.createElement('div');
    imageContainer.style.cssText = `
      height: 120px;
      background-color: #f9f9f9;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    `;
    
    const image = document.createElement('img');
    image.src = product.image;
    image.alt = product.name;
    image.style.cssText = `
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    `;
    
    // Add fallback for broken images
    image.onerror = function() {
      // Try a fallback image if available
      if (product.fallbackImage) {
        this.src = product.fallbackImage;
      } else {
        // Create a color swatch as fallback
        this.style.display = 'none';
        const colorSwatch = document.createElement('div');
        colorSwatch.style.cssText = `
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: ${product.color || '#ddd'};
        `;
        imageContainer.appendChild(colorSwatch);
      }
    };
    
    imageContainer.appendChild(image);
    card.appendChild(imageContainer);
    
    // Product info container
    const infoContainer = document.createElement('div');
    infoContainer.style.cssText = `
      padding: 10px;
    `;
    
    // Product name
    const name = document.createElement('h4');
    name.textContent = product.name;
    name.style.cssText = `
      margin: 0 0 5px 0;
      font-size: 14px;
      color: #333;
    `;
    infoContainer.appendChild(name);
    
    // Product price
    if (product.price) {
      const price = document.createElement('div');
      price.textContent = product.price;
      price.style.cssText = `
        font-size: 14px;
        font-weight: bold;
        color: #8e44ad;
        margin-bottom: 8px;
      `;
      infoContainer.appendChild(price);
    }
    
    // Color swatch
    if (product.color) {
      const colorContainer = document.createElement('div');
      colorContainer.style.cssText = `
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      `;
      
      const colorSwatch = document.createElement('div');
      colorSwatch.style.cssText = `
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: ${product.color};
        margin-right: 5px;
        border: 1px solid #ddd;
      `;
      
      const colorLabel = document.createElement('span');
      colorLabel.textContent = product.colorName || 'Color';
      colorLabel.style.cssText = `
        font-size: 12px;
        color: #666;
      `;
      
      colorContainer.appendChild(colorSwatch);
      colorContainer.appendChild(colorLabel);
      infoContainer.appendChild(colorContainer);
    }
    
    // Add to cart button
    const addButton = document.createElement('button');
    addButton.textContent = 'Add to Cart';
    addButton.style.cssText = `
      width: 100%;
      background-color: #8e44ad;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 6px 0;
      font-size: 12px;
      cursor: pointer;
      transition: background-color 0.2s;
    `;
    
    addButton.onmouseover = () => {
      addButton.style.backgroundColor = '#7d3c98';
    };
    
    addButton.onmouseout = () => {
      addButton.style.backgroundColor = '#8e44ad';
    };
    
    addButton.onclick = () => {
      this.addProductToCart(product);
    };
    
    infoContainer.appendChild(addButton);
    card.appendChild(infoContainer);
    
    return card;
  }
  
  /**
   * Add a product to the cart
   * @param {Object} product - Product to add
   */
  addProductToCart(product) {
    console.log('Adding product to cart:', product);
    
    // Show confirmation message
    this.showAddToCartConfirmation(product);
    
    // Dispatch event for other components
    const event = new CustomEvent('productAddedToCart', {
      detail: { product }
    });
    document.dispatchEvent(event);
  }
  
  /**
   * Show a confirmation message when product is added to cart
   * @param {Object} product - Added product
   */
  showAddToCartConfirmation(product) {
    // Create confirmation message
    const confirmation = document.createElement('div');
    confirmation.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #4CAF50;
      color: white;
      padding: 10px 20px;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      z-index: 9999;
      font-size: 14px;
      opacity: 0;
      transition: opacity 0.3s;
    `;
    
    confirmation.textContent = `${product.name} added to cart`;
    
    // Add to document
    document.body.appendChild(confirmation);
    
    // Animate in
    setTimeout(() => {
      confirmation.style.opacity = '1';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
      confirmation.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(confirmation);
      }, 300);
    }, 3000);
  }
  
  /**
   * Find products that match the applied makeup
   * @param {Object} makeupDetails - Applied makeup details
   * @returns {Object} Matching products by category
   */
  findMatchingProducts(makeupDetails) {
    const results = {
      lipsticks: [],
      eyeshadows: [],
      blush: []
    };
    
    // Match lipsticks
    if (makeupDetails.lipstick || makeupDetails.lips) {
      const lipColor = makeupDetails.lipstick?.color || makeupDetails.lips?.color;
      
      if (lipColor && this.productData.lipsticks) {
        results.lipsticks = this.findSimilarColorProducts(
          this.productData.lipsticks,
          lipColor,
          3 // Limit to 3 products
        );
      }
    }
    
    // Match eyeshadows
    if (makeupDetails.eyeshadow || makeupDetails.eyes) {
      const eyeshadowColor = makeupDetails.eyeshadow?.color || makeupDetails.eyes?.color;
      
      if (eyeshadowColor && this.productData.eyeshadows) {
        results.eyeshadows = this.findSimilarColorProducts(
          this.productData.eyeshadows,
          eyeshadowColor,
          3 // Limit to 3 products
        );
      }
    }
    
    // Match blush
    if (makeupDetails.blush || makeupDetails.cheeks) {
      const blushColor = makeupDetails.blush?.color || makeupDetails.cheeks?.color;
      
      if (blushColor && this.productData.blush) {
        results.blush = this.findSimilarColorProducts(
          this.productData.blush,
          blushColor,
          3 // Limit to 3 products
        );
      }
    }
    
    return results;
  }
  
  /**
   * Find products with similar colors
   * @param {Array} products - List of products
   * @param {string} targetColor - Color to match (hex)
   * @param {number} limit - Maximum number of products to return
   * @returns {Array} Matching products
   */
  findSimilarColorProducts(products, targetColor, limit = 3) {
    if (!products || !products.length) return [];
    
    // Convert target color to RGB
    const targetRGB = this.hexToRgb(targetColor);
    if (!targetRGB) return [];
    
    // Calculate color similarity for each product
    const productsWithSimilarity = products.map(product => {
      const productRGB = this.hexToRgb(product.color);
      
      if (!productRGB) {
        return { ...product, similarity: 0 };
      }
      
      // Calculate color distance (lower is more similar)
      const distance = Math.sqrt(
        Math.pow(targetRGB.r - productRGB.r, 2) +
        Math.pow(targetRGB.g - productRGB.g, 2) +
        Math.pow(targetRGB.b - productRGB.b, 2)
      );
      
      // Convert distance to similarity score (higher is more similar)
      const similarity = 1 - (distance / 441.67); // Max distance is sqrt(255^2 + 255^2 + 255^2)
      
      return { ...product, similarity };
    });
    
    // Sort by similarity (highest first) and limit results
    return productsWithSimilarity
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }
  
  /**
   * Convert hex color to RGB
   * @param {string} hex - Hex color code
   * @returns {Object|null} RGB values or null if invalid
   */
  hexToRgb(hex) {
    if (!hex) return null;
    
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Handle shorthand hex
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    
    // Validate hex format
    if (hex.length !== 6) {
      return null;
    }
    
    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Check if values are valid
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      return null;
    }
    
    return { r, g, b };
  }
}

// Initialize the enhanced product recommendations
document.addEventListener('DOMContentLoaded', () => {
  window.enhancedProductRecommendations = new EnhancedProductRecommendations();
});