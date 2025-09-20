/**
 * ImprovedFilterMatching.js - Better mapping between filters and product images
 */

(function() {
  console.log('[ImprovedFilterMatching] Initializing...');

  // Wait for document to be ready
  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('load', init);
  
  // For immediate execution if already loaded
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  }

  /**
   * Initialize the filter matching system
   */
  function init() {
    console.log('[ImprovedFilterMatching] Setting up...');
    
    // Setup better filter to product mapping
    setupFilterToProductMapping();
    
    // Watch for filter changes
    watchFilterChanges();
  }

  /**
   * Setup filter to product mapping
   */
  function setupFilterToProductMapping() {
    // Define better product list with correct paths
    window.FILTERED_PRODUCT_LIST = {
      lipstick: [
        {
          name: "Classic Red Lipstick",
          brand: "BeautyGlow",
          price: "$18.99",
          image: "assets/products/lipstick/red.jpg",
          category: "lipstick",
          color: "#CC0000"
        },
        {
          name: "Berry Blast", 
          brand: "BeautyGlow",
          price: "$19.99",
          image: "assets/products/lipstick/berry.jpg",
          category: "lipstick",
          color: "#990066"
        },
        {
          name: "Pink Perfection",
          brand: "GlamourGirl",
          price: "$16.99",
          image: "assets/products/lipstick/pink.jpg",
          category: "lipstick",
          color: "#FF66B2"
        },
        {
          name: "Coral Sunset",
          brand: "SummerGlow",
          price: "$17.99",
          image: "assets/products/lipstick/coral.jpg",
          category: "lipstick",
          color: "#FF6666"
        }
      ],
      eyeshadow: [
        {
          name: "Smoky Night Palette",
          brand: "GlamourGirl",
          price: "$32.99",
          image: "assets/products/eyeshadow/smoky.jpg",
          category: "eyeshadow",
          color: "#333333"
        },
        {
          name: "Berry Dreams",
          brand: "BeautyGlow",
          price: "$29.99",
          image: "assets/products/eyeshadow/sunset.jpg",
          category: "eyeshadow",
          color: "#990066"
        },
        {
          name: "Smoky Kohl Perfection",
          brand: "BeautyGlow",
          price: "$12.99",
          image: "assets/products/eyeshadow/smoky.jpg",
          category: "eyeshadow",
          color: "#333333"
        }
      ],
      foundation: [
        {
          name: "Perfect Match Foundation",
          brand: "BeautyGlow",
          price: "$29.99",
          image: "assets/products/foundation/perfect-match.jpg",
          category: "foundation"
        }
      ],
      eyeliner: [
        {
          name: "Perfect Precision Eyeliner",
          brand: "GlamourGirl",
          price: "$15.99",
          image: "assets/products/eyeliner/black.jpg",
          category: "eyeliner",
          color: "#000000"
        }
      ]
    };
  }

  /**
   * Watch for changes to the selected filters
   */
  function watchFilterChanges() {
    // Watch for filter changes in the selected features section
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          // Check selected features
          setTimeout(checkSelectedFeatures, 100);
        }
      });
    });
    
    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });
    
    // Also poll periodically
    setInterval(checkSelectedFeatures, 1000);
    
    // Initial check
    setTimeout(checkSelectedFeatures, 500);
  }

  /**
   * Check selected features and update product display
   */
  function checkSelectedFeatures() {
    // Find selected features section
    const selectedSection = document.querySelector('.selected-features') || 
                           document.querySelector('.selected-filters') ||
                           document.querySelector('[data-role="selected-features"]');
                          
    if (!selectedSection) return;
    
    // Extract selected filters
    const selectedFilters = extractSelectedFilters(selectedSection);
    
    // Update product display based on filters
    updateProductDisplay(selectedFilters);
  }

  /**
   * Extract selected filters from the UI
   * @param {Element} section - Selected features section
   * @returns {Object} Map of selected filters by category
   */
  function extractSelectedFilters(section) {
    const selectedFilters = {};
    
    // Look for common patterns in selected features UI
    const categories = ['Eyes', 'Lipstick', 'Blush', 'Foundation', 'Eyeliner', 'Mascara'];
    
    for (const category of categories) {
      // Look for category headings
      const categoryHeading = Array.from(section.querySelectorAll('h1, h2, h3, h4, div, span'))
        .find(el => el.textContent.trim() === category);
      
      if (categoryHeading) {
        // Look for selected filters near this heading
        const container = categoryHeading.parentElement;
        const selectedItems = container.querySelectorAll('.selected-item, .filter, .feature');
        
        if (selectedItems.length > 0) {
          selectedFilters[category.toLowerCase()] = true;
        }
      }
      
      // Also check for specific words or indicators
      const keywords = section.textContent.toLowerCase();
      if (keywords.includes(category.toLowerCase())) {
        selectedFilters[category.toLowerCase()] = true;
      }
    }
    
    // Direct check for specific filter types
    if (section.querySelector('[data-filter="eyeshadow"], .eyeshadow-filter')) {
      selectedFilters.eyeshadow = true;
    }
    
    if (section.querySelector('[data-filter="lipstick"], .lipstick-filter, [data-filter="color"]')) {
      selectedFilters.lipstick = true;
    }
    
    // Fallback check - just look at text content
    const text = section.textContent.toLowerCase();
    if (text.includes('eyeshadow')) selectedFilters.eyeshadow = true;
    if (text.includes('lipstick') || text.includes('color')) selectedFilters.lipstick = true;
    if (text.includes('eyeliner')) selectedFilters.eyeliner = true;
    if (text.includes('foundation')) selectedFilters.foundation = true;
    if (text.includes('blush')) selectedFilters.blush = true;
    
    return selectedFilters;
  }

  /**
   * Update product display based on selected filters
   * @param {Object} selectedFilters - Map of selected filters
   */
  function updateProductDisplay(selectedFilters) {
    console.log('[ImprovedFilterMatching] Selected filters:', selectedFilters);
    
    // Only show products if at least one filter is selected
    const hasFilters = Object.keys(selectedFilters).length > 0;
    
    if (!hasFilters) {
      hideAllProducts();
      return;
    }
    
    // Get matching products
    const matchingProducts = getMatchingProducts(selectedFilters);
    
    // Display products
    displayProducts(matchingProducts);
  }

  /**
   * Get matching products based on selected filters
   * @param {Object} selectedFilters - Map of selected filters
   * @returns {Array} Matching products
   */
  function getMatchingProducts(selectedFilters) {
    let matchingProducts = [];
    
    // Check each filter
    for (const category in selectedFilters) {
      if (window.FILTERED_PRODUCT_LIST[category]) {
        matchingProducts = matchingProducts.concat(window.FILTERED_PRODUCT_LIST[category]);
      }
    }
    
    // Limit to 8 products
    return matchingProducts.slice(0, 8);
  }

  /**
   * Hide all products
   */
  function hideAllProducts() {
    // Hide product recommendations container
    const container = document.getElementById('product-recommendations');
    if (container) {
      container.style.display = 'none';
    }
    
    // Also hide any mock product containers
    const mockContainer = document.getElementById('ai-product-container');
    if (mockContainer) {
      mockContainer.style.display = 'none';
    }
  }

  /**
   * Display products in the UI
   * @param {Array} products - Products to display
   */
  function displayProducts(products) {
    if (products.length === 0) {
      hideAllProducts();
      return;
    }
    
    // Get or create recommendations container
    let container = document.getElementById('product-recommendations');
    if (!container) {
      container = createProductRecommendationsContainer();
    }
    
    // Get products container
    let productsContainer = document.getElementById('recommended-products');
    if (!productsContainer) {
      productsContainer = document.createElement('div');
      productsContainer.id = 'recommended-products';
      productsContainer.style.cssText = `
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;
        gap: 10px;
        padding: 5px 0;
      `;
      container.appendChild(productsContainer);
    }
    
    // Clear current products
    productsContainer.innerHTML = '';
    
    // Create product cards
    products.forEach(product => {
      const card = createProductCard(product);
      productsContainer.appendChild(card);
    });
    
    // Show recommendations
    container.style.display = 'block';
  }

  /**
   * Create product recommendations container
   * @returns {HTMLElement} Container element
   */
  function createProductRecommendationsContainer() {
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
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      font-size: 20px;
      color: #666;
      cursor: pointer;
    `;
    closeButton.onclick = () => {
      container.style.display = 'none';
    };
    container.appendChild(closeButton);
    
    // Add to document
    document.body.appendChild(container);
    
    return container;
  }

  /**
   * Create a product card
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
    
    // Create product image
    const image = document.createElement('img');
    image.src = product.image;
    image.alt = product.name;
    image.dataset.category = product.category || '';
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
    name.textContent = product.name;
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
    brand.textContent = product.brand;
    brand.style.cssText = `
      margin: 0 0 4px;
      font-size: 10px;
      color: #666;
    `;
    
    // Product price
    const price = document.createElement('p');
    price.textContent = product.price;
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

})();