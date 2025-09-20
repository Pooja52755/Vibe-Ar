/**
 * FilterBasedRecommendations.js - Shows product recommendations based on applied filters
 */

(function() {
  console.log('[FilterBasedRecommendations] Initializing...');
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', initFilterRecommendations);
  window.addEventListener('load', initFilterRecommendations);
  
  // For immediate execution if already loaded
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initFilterRecommendations();
  }
  
  // Track current applied filters
  let currentFilters = {
    lipstick: null,
    eyeshadow: null,
    foundation: null,
    blush: null,
    eyeliner: null,
    mascara: null
  };
  
  /**
   * Initialize the recommendations system
   */
  function initFilterRecommendations() {
    if (document.getElementById('filter-recommendations-initialized')) {
      return;
    }
    
    console.log('[FilterBasedRecommendations] Setting up...');
    
    // Create marker to prevent multiple initializations
    const marker = document.createElement('div');
    marker.id = 'filter-recommendations-initialized';
    marker.style.display = 'none';
    document.body.appendChild(marker);
    
    // Create container for recommendations
    createRecommendationsContainer();
    
    // Listen for filter events
    setupFilterEventListeners();
    
    // Try to find existing recommendations interface
    connectToExistingInterface();
  }
  
  /**
   * Create a container for showing product recommendations
   */
  function createRecommendationsContainer() {
    // Check if container already exists
    if (document.getElementById('product-recommendations-container')) {
      return;
    }
    
    const container = document.createElement('div');
    container.id = 'product-recommendations-container';
    container.className = 'product-recommendations-container';
    container.innerHTML = `
      <div class="recommendations-header">
        <h3>Recommended Products</h3>
        <span class="recommendations-subtitle">Based on your current look</span>
      </div>
      <div id="recommendations-content" class="recommendations-content">
        <div class="no-recommendations">Apply makeup to see product recommendations</div>
      </div>
    `;
    
    // Add to document - try to find the appropriate location
    const possibleParents = [
      document.querySelector('.bnb-layout__side'),
      document.querySelector('.bnb-features'),
      document.querySelector('.panel'),
      document.body
    ];
    
    for (const parent of possibleParents) {
      if (parent) {
        parent.appendChild(container);
        console.log('[FilterBasedRecommendations] Added recommendations container to', parent);
        break;
      }
    }
  }
  
  /**
   * Setup event listeners for makeup filter changes
   */
  function setupFilterEventListeners() {
    // Listen for all makeup change events
    const events = [
      'lipstick:changed', 'eyes-makeup:changed', 'face-makeup:changed',
      'makeupApplied', 'makeupUpdated', 'filterApplied'
    ];
    
    // Listen for Store events if available
    if (window.Store) {
      window.Store.on('lipstick:changed', ({ enabled, color }) => {
        if (enabled && color) {
          updateFilter('lipstick', { color: color });
        } else {
          updateFilter('lipstick', null);
        }
      });
      
      window.Store.on('eyes-makeup:changed', (name, { enabled, color }) => {
        if (name === 'eyeshadow' && enabled && color) {
          updateFilter('eyeshadow', { color: color });
        } else if (!enabled) {
          updateFilter('eyeshadow', null);
        }
      });
      
      window.Store.on('face-makeup:changed', (name, { enabled, color }) => {
        if (name === 'blush' && enabled && color) {
          updateFilter('blush', { color: color });
        } else if (!enabled) {
          updateFilter('blush', null);
        }
      });
    }
    
    // Listen for direct makeup applied events
    document.addEventListener('makeupApplied', (event) => {
      if (event.detail && event.detail.filters) {
        processAppliedFilters(event.detail.filters);
      }
    });
    
    // Backup: Check periodically for makeup changes
    setInterval(checkForMakeupChanges, 2000);
  }
  
  /**
   * Connect to existing product recommendation interface if available
   */
  function connectToExistingInterface() {
    // Check if EnhancedProductRecommendations exists
    if (window.enhancedProductRecommendations) {
      console.log('[FilterBasedRecommendations] Found existing recommendations interface');
      
      // Add our listener to their events
      document.addEventListener('productRecommendationsUpdated', (event) => {
        if (event.detail && event.detail.products) {
          displayRecommendations(event.detail.products);
        }
      });
    }
  }
  
  /**
   * Process filters that were applied to the makeup
   * @param {Array} filters - List of applied filters
   */
  function processAppliedFilters(filters) {
    if (!Array.isArray(filters)) return;
    
    console.log('[FilterBasedRecommendations] Processing filters:', filters);
    
    // Reset current filters
    currentFilters = {
      lipstick: null,
      eyeshadow: null,
      foundation: null,
      blush: null,
      eyeliner: null,
      mascara: null
    };
    
    // Process each filter
    filters.forEach(filter => {
      if (!filter || !filter.type) return;
      
      switch (filter.type.toLowerCase()) {
        case 'lipstick':
          currentFilters.lipstick = {
            color: filter.color || '#FF0000',
            intensity: filter.intensity || 1.0
          };
          break;
          
        case 'eyeshadow':
          currentFilters.eyeshadow = {
            color: filter.color || '#888888',
            intensity: filter.intensity || 1.0,
            style: filter.style || 'neutral'
          };
          break;
          
        case 'blush':
          currentFilters.blush = {
            color: filter.color || '#FF6666',
            intensity: filter.intensity || 1.0
          };
          break;
          
        case 'foundation':
          currentFilters.foundation = {
            shade: filter.shade || 'medium',
            coverage: filter.coverage || 'medium'
          };
          break;
          
        case 'eyeliner':
          currentFilters.eyeliner = {
            color: filter.color || '#000000',
            style: filter.style || 'classic'
          };
          break;
          
        case 'mascara':
          currentFilters.mascara = {
            intensity: filter.intensity || 1.0
          };
          break;
      }
    });
    
    // Update recommendations based on new filters
    updateRecommendations();
  }
  
  /**
   * Update a specific filter
   * @param {string} type - Filter type (lipstick, eyeshadow, etc.)
   * @param {Object} details - Filter details
   */
  function updateFilter(type, details) {
    if (!type || !currentFilters.hasOwnProperty(type)) return;
    
    console.log(`[FilterBasedRecommendations] Updating ${type} filter:`, details);
    
    // Update the filter
    currentFilters[type] = details;
    
    // Update recommendations
    updateRecommendations();
  }
  
  /**
   * Check for makeup changes by inspecting the DOM or other indicators
   */
  function checkForMakeupChanges() {
    // Check for any visual indicators that makeup has changed
    const hasLipstick = document.querySelector('.lipstick-applied, .lips-active');
    const hasEyeshadow = document.querySelector('.eyeshadow-applied, .eyes-active');
    const hasBlush = document.querySelector('.blush-applied, .face-active');
    
    // Update filters based on visual indicators
    if (hasLipstick && !currentFilters.lipstick) {
      updateFilter('lipstick', { color: '#FF0000' });
    }
    
    if (hasEyeshadow && !currentFilters.eyeshadow) {
      updateFilter('eyeshadow', { color: '#888888' });
    }
    
    if (hasBlush && !currentFilters.blush) {
      updateFilter('blush', { color: '#FF6666' });
    }
  }
  
  /**
   * Update product recommendations based on current filters
   */
  function updateRecommendations() {
    console.log('[FilterBasedRecommendations] Updating recommendations with filters:', currentFilters);
    
    // Collect products to recommend
    const recommendations = [];
    
    // Check which filters are active and add corresponding products
    if (currentFilters.lipstick) {
      const lipsticks = getMatchingProducts('lipstick', currentFilters.lipstick);
      recommendations.push(...lipsticks);
    }
    
    if (currentFilters.eyeshadow) {
      const eyeshadows = getMatchingProducts('eyeshadow', currentFilters.eyeshadow);
      recommendations.push(...eyeshadows);
    }
    
    if (currentFilters.blush) {
      const blushes = getMatchingProducts('blush', currentFilters.blush);
      recommendations.push(...blushes);
    }
    
    if (currentFilters.foundation) {
      const foundations = getMatchingProducts('foundation', currentFilters.foundation);
      recommendations.push(...foundations);
    }
    
    if (currentFilters.eyeliner) {
      const eyeliners = getMatchingProducts('eyeliner', currentFilters.eyeliner);
      recommendations.push(...eyeliners);
    }
    
    if (currentFilters.mascara) {
      const mascaras = getMatchingProducts('mascara', currentFilters.mascara);
      recommendations.push(...mascaras);
    }
    
    // Display the recommendations
    displayRecommendations(recommendations);
    
    // Dispatch event for other components
    document.dispatchEvent(new CustomEvent('productRecommendationsUpdated', {
      detail: { products: recommendations, filters: currentFilters }
    }));
  }
  
  /**
   * Get products that match the specified filter
   * @param {string} category - Product category
   * @param {Object} filter - Filter details
   * @returns {Array} Matching products
   */
  function getMatchingProducts(category, filter) {
    // If no product data, return empty array
    if (!window.MAKEUP_PRODUCTS || !window.MAKEUP_PRODUCTS[category]) {
      return [];
    }
    
    // Get all products in this category
    const products = window.MAKEUP_PRODUCTS[category];
    
    // If no filter, return top products
    if (!filter) {
      return products.slice(0, 2);
    }
    
    // Find products that match the filter
    let matches = [];
    
    // Different matching logic for each category
    switch (category) {
      case 'lipstick':
        matches = findMatchingLipsticks(products, filter);
        break;
        
      case 'eyeshadow':
        matches = findMatchingEyeshadows(products, filter);
        break;
        
      case 'blush':
        matches = findMatchingBlushes(products, filter);
        break;
        
      case 'foundation':
        matches = findMatchingFoundations(products, filter);
        break;
        
      case 'eyeliner':
        matches = findMatchingEyeliners(products, filter);
        break;
        
      case 'mascara':
        matches = findMatchingMascaras(products, filter);
        break;
        
      default:
        matches = products.slice(0, 2);
    }
    
    // Ensure we don't return too many products
    return matches.slice(0, 2);
  }
  
  /**
   * Find lipsticks that match the filter
   * @param {Array} products - All lipstick products
   * @param {Object} filter - Lipstick filter
   * @returns {Array} Matching lipsticks
   */
  function findMatchingLipsticks(products, filter) {
    if (!filter.color) return products.slice(0, 2);
    
    // Convert filter color to RGB
    const filterRgb = hexToRgb(filter.color);
    if (!filterRgb) return products.slice(0, 2);
    
    // Find products with similar colors
    return products
      .map(product => {
        // Convert product color to RGB
        const productRgb = hexToRgb(product.color);
        if (!productRgb) return { product, score: 100 };
        
        // Calculate color similarity (lower is better)
        const colorDiff = colorDistance(filterRgb, productRgb);
        return { product, score: colorDiff };
      })
      .sort((a, b) => a.score - b.score) // Sort by score (lowest first)
      .map(item => item.product); // Extract just the products
  }
  
  /**
   * Find eyeshadows that match the filter
   * @param {Array} products - All eyeshadow products
   * @param {Object} filter - Eyeshadow filter
   * @returns {Array} Matching eyeshadows
   */
  function findMatchingEyeshadows(products, filter) {
    if (!filter.color) return products.slice(0, 2);
    
    // Convert filter color to RGB
    const filterRgb = hexToRgb(filter.color);
    if (!filterRgb) return products.slice(0, 2);
    
    // Find palettes with similar colors
    return products
      .map(product => {
        if (!product.shades || !Array.isArray(product.shades)) {
          return { product, score: 100 };
        }
        
        // Find closest shade in the palette
        let bestMatch = 100;
        product.shades.forEach(shade => {
          const shadeRgb = hexToRgb(shade);
          if (shadeRgb) {
            const diff = colorDistance(filterRgb, shadeRgb);
            bestMatch = Math.min(bestMatch, diff);
          }
        });
        
        return { product, score: bestMatch };
      })
      .sort((a, b) => a.score - b.score) // Sort by score (lowest first)
      .map(item => item.product); // Extract just the products
  }
  
  /**
   * Find blushes that match the filter
   * @param {Array} products - All blush products
   * @param {Object} filter - Blush filter
   * @returns {Array} Matching blushes
   */
  function findMatchingBlushes(products, filter) {
    // Same logic as lipsticks
    return findMatchingLipsticks(products, filter);
  }
  
  /**
   * Find foundations that match the filter
   * @param {Array} products - All foundation products
   * @param {Object} filter - Foundation filter
   * @returns {Array} Matching foundations
   */
  function findMatchingFoundations(products, filter) {
    if (!filter.shade) return products.slice(0, 2);
    
    // Find foundations with matching shade
    return products
      .filter(product => {
        if (!product.shades || !Array.isArray(product.shades)) {
          return false;
        }
        
        // Check if product has the shade
        return product.shades.some(shade => 
          shade.toLowerCase() === filter.shade.toLowerCase());
      })
      .slice(0, 2);
  }
  
  /**
   * Find eyeliners that match the filter
   * @param {Array} products - All eyeliner products
   * @param {Object} filter - Eyeliner filter
   * @returns {Array} Matching eyeliners
   */
  function findMatchingEyeliners(products, filter) {
    if (!filter.color) return products.slice(0, 2);
    
    // Find eyeliners with matching color
    return products
      .filter(product => {
        if (!product.color) return false;
        
        // Match by color name since eyeliners often have named colors
        return product.color.toLowerCase() === getColorName(filter.color).toLowerCase();
      })
      .slice(0, 2);
  }
  
  /**
   * Find mascaras that match the filter
   * @param {Array} products - All mascara products
   * @param {Object} filter - Mascara filter
   * @returns {Array} Matching mascaras
   */
  function findMatchingMascaras(products, filter) {
    // For mascara, we'll just return the best-rated ones
    return products
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 2);
  }
  
  /**
   * Display product recommendations in the UI
   * @param {Array} products - Products to display
   */
  function displayRecommendations(products) {
    const container = document.getElementById('recommendations-content');
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Check if we have products
    if (!products || products.length === 0) {
      container.innerHTML = '<div class="no-recommendations">Apply makeup to see product recommendations</div>';
      return;
    }
    
    // Group products by category
    const categories = {};
    products.forEach(product => {
      if (!product.id) return;
      
      // Extract category from product ID or use a property
      let category = product.category;
      if (!category) {
        // Try to extract from ID (e.g., "lipstick-001")
        const match = product.id.match(/^([a-z]+)-\d+/);
        if (match) category = match[1];
      }
      
      if (!category) return;
      
      // Add to category
      if (!categories[category]) {
        categories[category] = [];
      }
      
      // Avoid duplicates
      if (!categories[category].some(p => p.id === product.id)) {
        categories[category].push(product);
      }
    });
    
    // Create HTML for each category
    Object.entries(categories).forEach(([category, products]) => {
      // Skip empty categories
      if (products.length === 0) return;
      
      // Create category container
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'recommendation-category';
      
      // Add category title
      const title = document.createElement('h4');
      title.className = 'category-title';
      title.textContent = formatCategoryName(category);
      categoryDiv.appendChild(title);
      
      // Add products
      const productsDiv = document.createElement('div');
      productsDiv.className = 'category-products';
      
      // Add each product
      products.forEach(product => {
        const productDiv = createProductElement(product);
        productsDiv.appendChild(productDiv);
      });
      
      categoryDiv.appendChild(productsDiv);
      container.appendChild(categoryDiv);
    });
  }
  
  /**
   * Create a product element
   * @param {Object} product - Product data
   * @returns {HTMLElement} Product element
   */
  function createProductElement(product) {
    const div = document.createElement('div');
    div.className = 'product-item';
    div.setAttribute('data-product-id', product.id);
    
    // Create image element
    const image = document.createElement('div');
    image.className = 'product-image';
    
    if (product.image) {
      // Add real image if available
      const img = document.createElement('img');
      img.src = product.image;
      img.alt = product.name;
      img.onerror = function() {
        // If image fails to load, show color swatch instead
        this.style.display = 'none';
        image.style.backgroundColor = product.color || '#CCCCCC';
      };
      image.appendChild(img);
    } else {
      // Show color swatch if no image
      image.style.backgroundColor = product.color || '#CCCCCC';
    }
    
    // Create details container
    const details = document.createElement('div');
    details.className = 'product-details';
    
    // Add product name
    const name = document.createElement('div');
    name.className = 'product-name';
    name.textContent = product.name;
    details.appendChild(name);
    
    // Add product brand if available
    if (product.brand) {
      const brand = document.createElement('div');
      brand.className = 'product-brand';
      brand.textContent = product.brand;
      details.appendChild(brand);
    }
    
    // Add product price if available
    if (product.price) {
      const price = document.createElement('div');
      price.className = 'product-price';
      price.textContent = product.price;
      details.appendChild(price);
    }
    
    // Add to main container
    div.appendChild(image);
    div.appendChild(details);
    
    // Add click event
    div.addEventListener('click', () => {
      // Dispatch product selected event
      document.dispatchEvent(new CustomEvent('productSelected', {
        detail: { product }
      }));
      
      // Show a toast notification
      showToast(`${product.name} selected`);
    });
    
    return div;
  }
  
  /**
   * Show a toast notification
   * @param {string} message - Message to show
   */
  function showToast(message) {
    // Check if a toast already exists
    let toast = document.querySelector('.product-toast');
    
    // Create a new toast if needed
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'product-toast';
      document.body.appendChild(toast);
    }
    
    // Update toast content
    toast.textContent = message;
    toast.classList.add('show');
    
    // Remove after a delay
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
  
  /**
   * Format a category name for display
   * @param {string} category - Category name
   * @returns {string} Formatted name
   */
  function formatCategoryName(category) {
    if (!category) return '';
    return category.charAt(0).toUpperCase() + category.slice(1);
  }
  
  /**
   * Get a color name from a hex color
   * @param {string} hex - Hex color
   * @returns {string} Color name
   */
  function getColorName(hex) {
    if (!hex) return 'Unknown';
    
    // Basic color matching
    const rgb = hexToRgb(hex);
    if (!rgb) return 'Unknown';
    
    const { r, g, b } = rgb;
    
    // Simple color name mapping
    if (r > 200 && g < 100 && b < 100) return 'Red';
    if (r > 200 && g > 150 && b < 100) return 'Orange';
    if (r > 200 && g > 200 && b < 100) return 'Yellow';
    if (r < 100 && g > 150 && b < 100) return 'Green';
    if (r < 100 && g < 100 && b > 200) return 'Blue';
    if (r > 150 && g < 100 && b > 150) return 'Purple';
    if (r > 200 && g > 100 && b > 150) return 'Pink';
    if (r < 100 && g < 100 && b < 100) return 'Black';
    if (r > 200 && g > 200 && b > 200) return 'White';
    if (r > 150 && g > 100 && b > 50) return 'Brown';
    
    return 'Unknown';
  }
  
  /**
   * Convert hex color to RGB
   * @param {string} hex - Hex color
   * @returns {Object|null} RGB values
   */
  function hexToRgb(hex) {
    if (!hex) return null;
    
    // Handle shorthand hex
    if (hex.length === 4) {
      hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    
    // Parse hex
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  
  /**
   * Calculate color distance (Euclidean)
   * @param {Object} color1 - First color RGB
   * @param {Object} color2 - Second color RGB
   * @returns {number} Color distance
   */
  function colorDistance(color1, color2) {
    return Math.sqrt(
      Math.pow(color2.r - color1.r, 2) +
      Math.pow(color2.g - color1.g, 2) +
      Math.pow(color2.b - color1.b, 2)
    );
  }
})();