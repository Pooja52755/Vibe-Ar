/**
 * FilterMatchedProductRecommendations.js - Shows product recommendations based on applied filters
 */

(function() {
  console.log('[FilterMatchedProductRecommendations] Initializing...');
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('load', init);
  
  // For immediate execution if already loaded
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  }
  
  // Store for applied filters
  let appliedFilters = {
    lipstick: null,
    eyeshadow: null,
    blush: null,
    foundation: null,
    eyeliner: null,
    mascara: null
  };
  
  /**
   * Initialize the product recommendations
   */
  function init() {
    console.log('[FilterMatchedProductRecommendations] Setting up...');
    
    // Create product recommendations container
    createRecommendationsContainer();
    
    // Listen for filter application events
    listenForFilterEvents();
    
    // Listen for makeup applied events
    document.addEventListener('makeupApplied', handleMakeupApplied);
    
    // Add controls to show all products
    createProductCatalogButton();
  }
  
  /**
   * Create recommendations container
   */
  function createRecommendationsContainer() {
    // Check if container already exists
    if (document.getElementById('product-recommendations')) {
      return;
    }
    
    // Create container
    const container = document.createElement('div');
    container.id = 'product-recommendations';
    container.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(255, 255, 255, 0.95);
      padding: 10px;
      border-top: 1px solid #ddd;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      max-height: 30vh;
      overflow-y: auto;
      display: none; /* Hidden by default */
      transition: transform 0.3s ease;
    `;
    
    // Add title
    const title = document.createElement('h3');
    title.textContent = 'Product Recommendations';
    title.style.cssText = `
      margin: 0 0 10px 0;
      padding: 0;
      font-size: 16px;
      color: #333;
      text-align: center;
    `;
    container.appendChild(title);
    
    // Add products container
    const productsContainer = document.createElement('div');
    productsContainer.id = 'recommended-products';
    productsContainer.style.cssText = `
      display: flex;
      flex-wrap: nowrap;
      overflow-x: auto;
      gap: 10px;
      padding: 5px 0;
    `;
    container.appendChild(productsContainer);
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.cssText = `
      position: absolute;
      top: 5px;
      right: 5px;
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #666;
    `;
    closeButton.onclick = () => {
      container.style.display = 'none';
    };
    container.appendChild(closeButton);
    
    // Add to document
    document.body.appendChild(container);
  }
  
  /**
   * Create a button to show all products
   */
  function createProductCatalogButton() {
    // Check if button already exists
    if (document.getElementById('show-products-button')) {
      return;
    }
    
    // Create button
    const button = document.createElement('button');
    button.id = 'show-products-button';
    button.textContent = '💄 Products';
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #FF4081;
      color: white;
      border: none;
      border-radius: 50px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      z-index: 1001;
    `;
    
    // Add click event
    button.onclick = () => {
      const container = document.getElementById('product-recommendations');
      if (container) {
        // If no recommendations, show some default ones
        const productsContainer = document.getElementById('recommended-products');
        if (productsContainer && productsContainer.children.length === 0) {
          // Show default recommendations from all categories
          showDefaultRecommendations();
        }
        
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
      }
    };
    
    // Add to document
    document.body.appendChild(button);
  }
  
  /**
   * Listen for filter application events
   */
  function listenForFilterEvents() {
    // Listen for store changes
    if (window.Store) {
      console.log('[FilterMatchedProductRecommendations] Setting up store listeners');
      
      // Listen for lipstick changes
      window.Store.on('lipstick:changed', (data) => {
        if (data.enabled && data.color) {
          appliedFilters.lipstick = {
            color: data.color,
            intensity: 1.0
          };
          updateRecommendations();
        }
      });
      
      // Listen for eye makeup changes
      window.Store.on('eyes-makeup:changed', (name, data) => {
        if (data.enabled && data.color) {
          if (name === 'eyeshadow') {
            appliedFilters.eyeshadow = {
              color: data.color,
              intensity: 1.0
            };
          } else if (name === 'eyeliner') {
            appliedFilters.eyeliner = {
              color: data.color,
              intensity: 1.0
            };
          }
          updateRecommendations();
        }
      });
      
      // Listen for face makeup changes
      window.Store.on('face-makeup:changed', (name, data) => {
        if (data.enabled && data.color) {
          if (name === 'blush') {
            appliedFilters.blush = {
              color: data.color,
              intensity: 1.0
            };
          }
          updateRecommendations();
        }
      });
    }
    
    // Add a global listener for any filter changes
    document.addEventListener('filterApplied', (event) => {
      if (event.detail && event.detail.type) {
        console.log('[FilterMatchedProductRecommendations] Filter applied:', event.detail);
        
        // Update applied filters
        const { type, color, intensity } = event.detail;
        appliedFilters[type] = { color, intensity };
        
        // Update recommendations
        updateRecommendations();
      }
    });
  }
  
  /**
   * Handle makeup applied event
   * @param {CustomEvent} event - The makeup applied event
   */
  function handleMakeupApplied(event) {
    if (!event.detail || !event.detail.filters) return;
    
    console.log('[FilterMatchedProductRecommendations] Makeup applied:', event.detail.filters);
    
    // Process filters and update applied filters
    const filters = event.detail.filters;
    filters.forEach(filter => {
      if (filter.type && filter.color) {
        appliedFilters[filter.type] = {
          color: filter.color,
          intensity: filter.intensity || 1.0
        };
      }
    });
    
    // Update recommendations
    updateRecommendations();
    
    // Show recommendations
    const container = document.getElementById('product-recommendations');
    if (container) {
      container.style.display = 'block';
    }
  }
  
  /**
   * Update product recommendations based on applied filters
   */
  function updateRecommendations() {
    console.log('[FilterMatchedProductRecommendations] Updating recommendations with filters:', appliedFilters);
    
    // Get recommendations container
    const container = document.getElementById('recommended-products');
    if (!container) return;
    
    // Clear current recommendations
    container.innerHTML = '';
    
    // Check if we have any applied filters
    const hasFilters = Object.values(appliedFilters).some(filter => filter !== null);
    
    if (!hasFilters) {
      return;
    }
    
    // Get products based on applied filters
    const recommendedProducts = getMatchingProducts();
    
    // Display products
    recommendedProducts.forEach(product => {
      const productCard = createProductCard(product);
      container.appendChild(productCard);
    });
    
    // Show recommendations
    const recommendationsContainer = document.getElementById('product-recommendations');
    if (recommendationsContainer) {
      recommendationsContainer.style.display = 'block';
    }
  }
  
  /**
   * Get products matching the applied filters
   * @returns {Array} Array of product objects
   */
  function getMatchingProducts() {
    const products = [];
    
    // Add products based on applied filters
    for (const [category, filter] of Object.entries(appliedFilters)) {
      if (filter && window.MAKEUP_PRODUCTS && window.MAKEUP_PRODUCTS[category]) {
        // Get matching products from this category
        const categoryProducts = findMatchingProductsByColor(category, filter.color);
        products.push(...categoryProducts);
      }
    }
    
    // Limit to 8 products maximum
    return products.slice(0, 8);
  }
  
  /**
   * Find products matching a specific color
   * @param {string} category - Product category
   * @param {string} color - Color to match (hex code)
   * @returns {Array} Array of matching products
   */
  function findMatchingProductsByColor(category, color) {
    if (!window.MAKEUP_PRODUCTS || !window.MAKEUP_PRODUCTS[category]) {
      return [];
    }
    
    // Convert color to RGB for comparison
    const targetRgb = hexToRgb(color);
    if (!targetRgb) return [];
    
    // Get all products from this category
    const allProducts = window.MAKEUP_PRODUCTS[category];
    
    // Sort products by color similarity
    const productsWithSimilarity = allProducts.map(product => {
      // Get product color (could be single color or array of shades)
      let productColor = product.color;
      
      // For palettes with multiple shades
      if (!productColor && product.shades && Array.isArray(product.shades)) {
        // Use the first shade as primary color
        productColor = product.shades[0];
      }
      
      // Calculate color similarity
      let similarity = 1; // Default high similarity
      if (productColor) {
        const productRgb = hexToRgb(productColor);
        if (productRgb) {
          similarity = calculateColorSimilarity(targetRgb, productRgb);
        }
      }
      
      return { ...product, similarity };
    });
    
    // Sort by similarity (lower is better) and take top 2
    return productsWithSimilarity
      .sort((a, b) => a.similarity - b.similarity)
      .slice(0, 2);
  }
  
  /**
   * Show default recommendations from all categories
   */
  function showDefaultRecommendations() {
    // Get recommendations container
    const container = document.getElementById('recommended-products');
    if (!container) return;
    
    // Clear current recommendations
    container.innerHTML = '';
    
    // Array to hold recommendations
    const recommendations = [];
    
    // Get top products from each category
    for (const category in window.MAKEUP_PRODUCTS) {
      if (window.MAKEUP_PRODUCTS[category] && window.MAKEUP_PRODUCTS[category].length > 0) {
        // Get top product from each category
        const topProduct = window.MAKEUP_PRODUCTS[category][0];
        recommendations.push(topProduct);
      }
    }
    
    // Display products
    recommendations.forEach(product => {
      const productCard = createProductCard(product);
      container.appendChild(productCard);
    });
  }
  
  /**
   * Create a product card element
   * @param {Object} product - Product data
   * @returns {HTMLElement} Product card element
   */
  function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.cssText = `
      flex: 0 0 auto;
      width: 120px;
      border-radius: 8px;
      background-color: white;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      position: relative;
    `;
    
    // Create image container
    const imageContainer = document.createElement('div');
    imageContainer.style.cssText = `
      width: 100%;
      height: 90px;
      background-color: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    `;
    
    // Create product image or placeholder
    const image = document.createElement('img');
    image.src = product.image || `assets/products/${product.category || 'placeholder'}.jpg`;
    image.alt = product.name;
    image.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: cover;
    `;
    
    // Add error handler for image loading
    image.onerror = function() {
      // Set background color based on product color if available
      if (product.color && product.color.startsWith('#')) {
        imageContainer.style.backgroundColor = product.color;
        
        // Create text overlay with product name
        const textOverlay = document.createElement('span');
        textOverlay.textContent = product.name.split(' ')[0];
        textOverlay.style.cssText = `
          color: white;
          font-size: 12px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        `;
        imageContainer.appendChild(textOverlay);
      } else {
        // Generic placeholder with product type
        const productType = product.id.split('-')[0];
        imageContainer.textContent = productType;
        imageContainer.style.color = '#999';
        imageContainer.style.fontSize = '12px';
      }
    };
    
    imageContainer.appendChild(image);
    card.appendChild(imageContainer);
    
    // Create product info
    const info = document.createElement('div');
    info.style.cssText = `
      padding: 8px;
    `;
    
    // Product name
    const name = document.createElement('h4');
    name.textContent = product.name;
    name.style.cssText = `
      margin: 0;
      font-size: 12px;
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `;
    info.appendChild(name);
    
    // Product brand
    const brand = document.createElement('p');
    brand.textContent = product.brand || '';
    brand.style.cssText = `
      margin: 2px 0;
      font-size: 10px;
      color: #666;
    `;
    info.appendChild(brand);
    
    // Product price
    const price = document.createElement('p');
    price.textContent = product.price || '';
    price.style.cssText = `
      margin: 2px 0 0 0;
      font-size: 11px;
      font-weight: bold;
      color: #ff4081;
    `;
    info.appendChild(price);
    
    card.appendChild(info);
    
    // Add bestseller badge if applicable
    if (product.bestseller) {
      const badge = document.createElement('div');
      badge.textContent = 'Best';
      badge.style.cssText = `
        position: absolute;
        top: 5px;
        right: 5px;
        background-color: #ff4081;
        color: white;
        font-size: 9px;
        padding: 2px 5px;
        border-radius: 10px;
      `;
      card.appendChild(badge);
    }
    
    return card;
  }
  
  /**
   * Calculate color similarity between two RGB colors (lower is more similar)
   * @param {Object} rgb1 - First RGB color {r, g, b}
   * @param {Object} rgb2 - Second RGB color {r, g, b}
   * @returns {number} Similarity score (lower is more similar)
   */
  function calculateColorSimilarity(rgb1, rgb2) {
    const rDiff = rgb1.r - rgb2.r;
    const gDiff = rgb1.g - rgb2.g;
    const bDiff = rgb1.b - rgb2.b;
    
    // Euclidean distance in RGB space
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
  }
  
  /**
   * Convert hex color code to RGB object
   * @param {string} hex - Hex color code
   * @returns {Object|null} RGB object {r, g, b} or null if invalid
   */
  function hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Handle RGB
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    
    // Check length
    if (hex.length !== 6) {
      return null;
    }
    
    // Parse RGB values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
  }
})();