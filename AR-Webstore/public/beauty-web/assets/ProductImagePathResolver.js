/**
 * ProductImagePathResolver.js - Resolves product image paths and handles fallbacks
 * 
 * This script ensures that product image paths are correctly resolved and 
 * provides fallback mechanisms when images are not found.
 */

(function() {
  console.log('[ProductImagePathResolver] Initializing...');
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('load', init);
  
  // For immediate execution if already loaded
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  }
  
  // Store original image path resolver function if it exists
  const originalCreateProductCard = window.createProductCard;
  
  /**
   * Initialize the image path resolver
   */
  function init() {
    console.log('[ProductImagePathResolver] Setting up...');
    
    // Override createProductCard function to use our enhanced version
    overrideProductCardCreation();
    
    // Setup image path mapping between look images and product images
    setupImagePathMapping();
    
    // Setup monitoring for product image loading errors
    setupImageErrorHandling();
  }
  
  /**
   * Override product card creation to enhance image handling
   */
  function overrideProductCardCreation() {
    // Store reference to original function for FilterMatchedProductRecommendations.js
    if (typeof window.createProductCard === 'function') {
      console.log('[ProductImagePathResolver] Overriding createProductCard function');
      window.originalCreateProductCard = window.createProductCard;
      window.createProductCard = enhancedCreateProductCard;
    }
    
    // Check for class-based implementation in EnhancedProductRecommendations.js
    if (window.ProductRecommender && window.ProductRecommender.prototype.createProductCard) {
      console.log('[ProductImagePathResolver] Overriding ProductRecommender.createProductCard method');
      window.ProductRecommender.prototype.originalCreateProductCard = 
        window.ProductRecommender.prototype.createProductCard;
      window.ProductRecommender.prototype.createProductCard = enhancedCreateProductCard;
    }
  }
  
  /**
   * Enhanced create product card function with better image handling
   * @param {Object} product - Product object
   * @returns {HTMLElement} Product card element
   */
  function enhancedCreateProductCard(product) {
    // Enhance product with resolved image path
    const enhancedProduct = {
      ...product,
      image: resolveProductImagePath(product)
    };
    
    // Call original function if available
    if (this && typeof this.originalCreateProductCard === 'function') {
      return this.originalCreateProductCard(enhancedProduct);
    } else if (typeof window.originalCreateProductCard === 'function') {
      return window.originalCreateProductCard(enhancedProduct);
    } else {
      // Fallback if original function not available
      return createBasicProductCard(enhancedProduct);
    }
  }
  
  /**
   * Resolve product image path with multiple fallback options
   * @param {Object} product - Product object
   * @returns {string} Resolved image path
   */
  function resolveProductImagePath(product) {
    if (!product) return null;
    
    // If product already has an image path, verify it
    if (product.image) {
      // Add check for relative vs absolute paths
      if (product.image.startsWith('http') || product.image.startsWith('/')) {
        return product.image;
      }
      
      // Check if we should use AR-Webstore paths or Banuba paths
      if (window.location.pathname.includes('/beauty-web/') || 
          document.querySelector('script[src*="banuba"]')) {
        // We're in the Banuba app, use paths relative to it
        return product.image;
      } else {
        // We're in AR-Webstore, use full path
        return `/beauty-web/${product.image}`;
      }
    }
    
    // Try to build path based on product type and name/color
    const category = product.category || getProductCategory(product);
    
    if (category) {
      // Build path based on product category and color/name
      let imageName = '';
      
      if (product.color && product.color.startsWith('#')) {
        // Convert hex color to name for image lookup
        const colorName = getColorName(product.color);
        imageName = colorName.toLowerCase();
      } else if (product.name) {
        // Extract potential color name from product name
        const nameParts = product.name.toLowerCase().split(' ');
        const colorWords = ['red', 'pink', 'nude', 'coral', 'berry', 'gold', 'smoky', 'neutral'];
        
        for (const part of nameParts) {
          if (colorWords.includes(part)) {
            imageName = part;
            break;
          }
        }
        
        // If no color word found, use first word of name
        if (!imageName && nameParts.length > 0) {
          imageName = nameParts[0];
        }
      }
      
      // Construct image path with category and name
      if (imageName) {
        // Check if we should use AR-Webstore paths or Banuba paths
        const basePath = window.location.pathname.includes('/beauty-web/') || 
                       document.querySelector('script[src*="banuba"]')
                     ? 'assets/products/' 
                     : '/beauty-web/assets/products/';
                     
        return `${basePath}${category}/${imageName}.jpg`;
      }
    }
    
    // Fallback to using look images from Banuba
    if (product.lookName) {
      const looksPath = window.location.pathname.includes('/beauty-web/') || 
                       document.querySelector('script[src*="banuba"]')
                     ? 'assets/looks/' 
                     : '/beauty-web/assets/looks/';
      return `${looksPath}${product.lookName}.jpg`;
    }
    
    // Final fallback - placeholder image
    return window.location.pathname.includes('/beauty-web/') || 
           document.querySelector('script[src*="banuba"]')
         ? 'assets/products/placeholder.jpg' 
         : '/beauty-web/assets/products/placeholder.jpg';
  }
  
  /**
   * Determine product category from product object
   * @param {Object} product - Product object
   * @returns {string} Product category
   */
  function getProductCategory(product) {
    // Try to extract category from product data
    if (product.category) return product.category;
    if (product.type) return product.type;
    
    // Check for category-specific properties
    if (product.finish === 'Matte' && product.color) return 'lipstick';
    if (product.shades && Array.isArray(product.shades)) return 'eyeshadow';
    if (product.coverage) return 'foundation';
    
    // Check ID for category hints
    if (product.id && product.id.includes('-')) {
      const categoryPart = product.id.split('-')[0];
      const validCategories = ['lipstick', 'eyeshadow', 'foundation', 'blush', 'eyeliner', 'mascara'];
      if (validCategories.includes(categoryPart)) {
        return categoryPart;
      }
    }
    
    // Default to placeholder
    return 'placeholder';
  }
  
  /**
   * Convert hex color to closest named color
   * @param {string} hex - Hex color code
   * @returns {string} Color name
   */
  function getColorName(hex) {
    // Simple color mapping for common makeup colors
    const colorMap = {
      '#CC0000': 'red',
      '#FF0000': 'red',
      '#FF66B2': 'pink',
      '#FF6666': 'coral',
      '#CC9966': 'nude',
      '#990066': 'berry',
      '#000000': 'black',
      '#FFD700': 'gold'
    };
    
    // Check for exact match
    if (colorMap[hex]) {
      return colorMap[hex];
    }
    
    // Simplified color distance calculation
    // Convert hex to RGB
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);
    
    // Calculate distance to each color and find closest
    let closestColor = 'placeholder';
    let minDistance = Infinity;
    
    for (const [colorHex, colorName] of Object.entries(colorMap)) {
      const cr = parseInt(colorHex.substr(1, 2), 16);
      const cg = parseInt(colorHex.substr(3, 2), 16);
      const cb = parseInt(colorHex.substr(5, 2), 16);
      
      const distance = Math.sqrt(
        Math.pow(r - cr, 2) + 
        Math.pow(g - cg, 2) + 
        Math.pow(b - cb, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = colorName;
      }
    }
    
    return closestColor;
  }
  
  /**
   * Basic product card creation (fallback)
   * @param {Object} product - Product object
   * @returns {HTMLElement} Product card element
   */
  function createBasicProductCard(product) {
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
    
    // Create product image
    const image = document.createElement('img');
    image.src = product.image || 'assets/products/placeholder.jpg';
    image.alt = product.name || 'Product';
    image.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: cover;
    `;
    
    // Handle image loading errors
    image.onerror = function() {
      // Set background color based on product color if available
      if (product.color && product.color.startsWith('#')) {
        imageContainer.style.backgroundColor = product.color;
        
        // Create text overlay with product name
        const textOverlay = document.createElement('span');
        textOverlay.textContent = (product.name || 'Product').split(' ')[0];
        textOverlay.style.cssText = `
          color: white;
          font-size: 12px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        `;
        imageContainer.appendChild(textOverlay);
      }
      
      // Remove the broken image
      this.style.display = 'none';
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
    name.textContent = product.name || 'Product';
    name.style.cssText = `
      margin: 0 0 4px;
      font-size: 12px;
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `;
    
    // Product brand
    const brand = document.createElement('p');
    brand.textContent = product.brand || 'Brand';
    brand.style.cssText = `
      margin: 0 0 4px;
      font-size: 10px;
      color: #666;
    `;
    
    // Product price
    const price = document.createElement('p');
    price.textContent = product.price || '$0.00';
    price.style.cssText = `
      margin: 0;
      font-size: 12px;
      font-weight: bold;
      color: #000;
    `;
    
    info.appendChild(name);
    info.appendChild(brand);
    info.appendChild(price);
    card.appendChild(info);
    
    return card;
  }
  
  /**
   * Setup image path mapping between look images and product images
   */
  function setupImagePathMapping() {
    // This creates a mapping between Banuba look names and product image folders
    window.lookToProductMapping = {
      'Aster': {
        lipstick: 'pink',
        eyeshadow: 'berry',
        blush: 'coral'
      },
      'Bluebell': {
        lipstick: 'berry',
        eyeshadow: 'berry',
        eyeliner: 'black'
      },
      'Coral': {
        lipstick: 'coral',
        blush: 'coral',
        eyeshadow: 'sunset'
      },
      'Dolly': {
        lipstick: 'pink',
        eyeshadow: 'gold',
        blush: 'coral'
      },
      'Jasmine': {
        lipstick: 'nude',
        eyeshadow: 'neutral',
        foundation: 'natural'
      },
      'Queen': {
        lipstick: 'red',
        eyeshadow: 'smoky',
        eyeliner: 'black'
      },
      'Smoky': {
        eyeshadow: 'smoky',
        eyeliner: 'black',
        mascara: 'black'
      },
      'Twilight': {
        lipstick: 'berry',
        eyeshadow: 'berry',
        blush: 'coral'
      },
      '40s': {
        lipstick: 'red',
        eyeshadow: 'neutral',
        eyeliner: 'black'
      },
      'Confetti': {
        eyeshadow: 'sunset',
        lipstick: 'pink'
      }
    };
  }
  
  /**
   * Setup global image error handling for product cards
   */
  function setupImageErrorHandling() {
    // Set up a mutation observer to watch for new product cards
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          // Look for product cards and images
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Check if node is a product card
              if (node.classList && node.classList.contains('product-card')) {
                setupImageErrorHandlerForCard(node);
              }
              
              // Check for product cards inside the added node
              const productCards = node.querySelectorAll('.product-card');
              productCards.forEach(card => {
                setupImageErrorHandlerForCard(card);
              });
            }
          });
        }
      });
    });
    
    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  /**
   * Setup image error handler for a specific product card
   * @param {HTMLElement} card - Product card element
   */
  function setupImageErrorHandlerForCard(card) {
    // Find the image element
    const image = card.querySelector('img');
    if (!image) return;
    
    // If image already has error handler, don't add again
    if (image.hasAttribute('data-error-handler-set')) return;
    
    // Mark as having error handler
    image.setAttribute('data-error-handler-set', 'true');
    
    // Set up fallback system
    image.addEventListener('error', function() {
      // Get container
      const container = this.parentElement;
      if (!container) return;
      
      // Try to extract product info
      let productInfo = {};
      
      // Try to find product name
      const nameEl = card.querySelector('h4') || card.querySelector('h3');
      if (nameEl) {
        productInfo.name = nameEl.textContent.trim();
      }
      
      // Try to find product color
      const style = window.getComputedStyle(container);
      if (style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
        productInfo.color = style.backgroundColor;
      }
      
      // If we have a color but not a name, use a default
      if (productInfo.color && !productInfo.name) {
        productInfo.name = 'Product';
      }
      
      // Apply visual fallback
      container.style.backgroundColor = productInfo.color || '#f0f0f0';
      
      // Create text overlay
      const textOverlay = document.createElement('span');
      textOverlay.textContent = productInfo.name 
        ? productInfo.name.split(' ')[0] 
        : 'Product';
      textOverlay.style.cssText = `
        color: white;
        font-size: 12px;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      `;
      
      // Hide the broken image
      this.style.display = 'none';
      
      // Add text overlay if not already present
      if (!container.querySelector('span')) {
        container.appendChild(textOverlay);
      }
    });
    
    // Force error check in case image already failed
    if (image.complete && (image.naturalWidth === 0 || image.naturalHeight === 0)) {
      image.dispatchEvent(new Event('error'));
    }
  }
})();