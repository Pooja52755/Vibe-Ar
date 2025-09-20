/**
 * FixProductImagesDisplay.js - Ensures product images are correctly displayed
 */

(function() {
  console.log('[FixProductImagesDisplay] Initializing...');
  
  // Store the original showMockProductCards function
  const originalShowMockProducts = window.showMockProductCards;
  
  // Wait for document to be ready
  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('load', init);
  
  // For immediate execution if already loaded
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  }
  
  /**
   * Initialize the fix
   */
  function init() {
    // Prevent automatic display of mock products on page load
    preventAutoProductDisplay();
    
    // Override showMockProductCards function
    overrideShowMockProducts();
    
    // Fix product image paths
    setupImagePathFixer();
    
    // Hide any product recommendations already showing
    hideProductRecommendations();
  }
  
  /**
   * Prevent automatic display of products on page load
   */
  function preventAutoProductDisplay() {
    // If products are showing without filters, hide them
    const container = document.getElementById('product-recommendations');
    if (container) {
      // Check if we have any active filters
      const hasActiveFilters = checkForActiveFilters();
      
      if (!hasActiveFilters) {
        container.style.display = 'none';
      }
    }
    
    // Remove any existing product cards if no filters are applied
    cleanupProductsWithoutFilters();
  }
  
  /**
   * Check if there are any active filters
   */
  function checkForActiveFilters() {
    // Check if any makeup filters are active in various ways
    
    // Method 1: Check for filter UI indicators
    const activeFilterElements = document.querySelectorAll('.active-filter, .filter-active, .selected-filter');
    if (activeFilterElements.length > 0) {
      return true;
    }
    
    // Method 2: Check global state if available
    if (window.appliedFilters) {
      const hasFilters = Object.values(window.appliedFilters).some(filter => filter !== null);
      if (hasFilters) {
        return true;
      }
    }
    
    // No active filters found
    return false;
  }
  
  /**
   * Clean up products if no filters are applied
   */
  function cleanupProductsWithoutFilters() {
    const productsContainer = document.getElementById('recommended-products');
    if (productsContainer) {
      productsContainer.innerHTML = '';
    }
  }
  
  /**
   * Override showMockProductCards function to ensure images load
   */
  function overrideShowMockProducts() {
    // Save reference to original function if it exists
    if (typeof window.showMockProductCards === 'function') {
      window.originalShowMockProducts = window.showMockProductCards;
      
      // Replace with enhanced version
      window.showMockProductCards = function() {
        // Call original function
        window.originalShowMockProducts();
        
        // Then fix the images
        setTimeout(fixProductImages, 100);
      };
    }
  }
  
  /**
   * Setup MutationObserver to fix image paths whenever new cards are added
   */
  function setupImagePathFixer() {
    // Watch for changes to the DOM
    const observer = new MutationObserver(mutations => {
      let shouldFixImages = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          // Check if any product cards were added
          mutation.addedNodes.forEach(node => {
            if (node.classList && node.classList.contains('product-card')) {
              shouldFixImages = true;
            } else if (node.querySelector && node.querySelector('.product-card')) {
              shouldFixImages = true;
            }
          });
        }
      });
      
      if (shouldFixImages) {
        fixProductImages();
      }
    });
    
    // Start observing
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
  }
  
  /**
   * Fix product images
   */
  function fixProductImages() {
    console.log('[FixProductImagesDisplay] Fixing product images...');
    
    // Get all product card images
    const productImages = document.querySelectorAll('.product-card img');
    
    productImages.forEach(img => {
      // Skip if already processed
      if (img.dataset.pathFixed) return;
      
      // Mark as processed
      img.dataset.pathFixed = 'true';
      
      // Get current src
      const currentSrc = img.src;
      
      // Fix common path issues
      if (currentSrc) {
        // Case 1: Using relative path when absolute needed
        if (currentSrc.includes('assets/products/') && !currentSrc.includes('/assets/products/')) {
          const newSrc = currentSrc.replace('assets/products/', '/beauty-web/assets/products/');
          console.log(`[FixProductImagesDisplay] Fixing path: ${currentSrc} -> ${newSrc}`);
          img.src = newSrc;
        }
        
        // Case 2: Using beauty-web path when in beauty-web already
        if (window.location.pathname.includes('/beauty-web/') && currentSrc.includes('/beauty-web/assets/')) {
          const newSrc = currentSrc.replace('/beauty-web/assets/', 'assets/');
          console.log(`[FixProductImagesDisplay] Fixing path: ${currentSrc} -> ${newSrc}`);
          img.src = newSrc;
        }
        
        // Case 3: Check if we need to use look images instead
        if ((currentSrc.includes('placeholder') || img.naturalWidth === 0) && 
            img.closest('.product-card')) {
          
          // Try to get product info
          const card = img.closest('.product-card');
          const nameEl = card.querySelector('h4, h3');
          const brandEl = card.querySelector('p:nth-child(2), .product-brand');
          
          if (nameEl) {
            const productName = nameEl.textContent.trim().toLowerCase();
            const productCategory = getProductCategoryFromName(productName);
            
            if (productCategory) {
              // Use Banuba look images as fallback
              const lookImageName = getLookNameForCategory(productCategory);
              if (lookImageName) {
                const newSrc = window.location.pathname.includes('/beauty-web/') 
                  ? `assets/looks/${lookImageName}.jpg` 
                  : `/beauty-web/assets/looks/${lookImageName}.jpg`;
                
                console.log(`[FixProductImagesDisplay] Using look image: ${newSrc}`);
                img.src = newSrc;
              }
            }
          }
        }
      }
      
      // Add error handler
      img.onerror = function() {
        console.log('[FixProductImagesDisplay] Image failed to load:', this.src);
        
        // Try alternate paths
        if (this.src.includes('/assets/products/')) {
          // Try look image as fallback
          const category = getProductCategoryFromPath(this.src);
          if (category) {
            const lookName = getLookNameForCategory(category);
            if (lookName) {
              const newSrc = window.location.pathname.includes('/beauty-web/') 
                ? `assets/looks/${lookName}.jpg` 
                : `/beauty-web/assets/looks/${lookName}.jpg`;
              
              console.log(`[FixProductImagesDisplay] Trying look image: ${newSrc}`);
              this.src = newSrc;
              return;
            }
          }
        }
        
        // If all else fails, hide the image and show a colored background
        this.style.display = 'none';
        const container = this.parentElement;
        if (container) {
          container.style.backgroundColor = '#f0f0f0';
          
          // Add product name as text
          const card = this.closest('.product-card');
          if (card) {
            const nameEl = card.querySelector('h4, h3');
            if (nameEl) {
              const textEl = document.createElement('span');
              textEl.textContent = nameEl.textContent.split(' ')[0];
              textEl.style.cssText = `
                color: #666;
                font-size: 14px;
                display: flex;
                height: 100%;
                align-items: center;
                justify-content: center;
              `;
              container.appendChild(textEl);
            }
          }
        }
      };
      
      // Force error check if image is already broken
      if (img.complete && (img.naturalWidth === 0 || img.naturalHeight === 0)) {
        img.dispatchEvent(new Event('error'));
      }
    });
  }
  
  /**
   * Get product category from product name
   */
  function getProductCategoryFromName(name) {
    name = name.toLowerCase();
    
    // Check for category keywords
    if (name.includes('lipstick') || name.includes('lip')) {
      return 'lipstick';
    } else if (name.includes('eyeshadow') || name.includes('palette') || name.includes('eye shadow')) {
      return 'eyeshadow';
    } else if (name.includes('foundation') || name.includes('base')) {
      return 'foundation';
    } else if (name.includes('blush') || name.includes('cheek')) {
      return 'blush';
    } else if (name.includes('eyeliner') || name.includes('liner')) {
      return 'eyeliner';
    } else if (name.includes('mascara') || name.includes('lash')) {
      return 'mascara';
    }
    
    // Check for color words that might indicate category
    if (name.includes('red') || name.includes('pink') || name.includes('nude') || 
        name.includes('coral') || name.includes('berry')) {
      return 'lipstick';
    } else if (name.includes('smoky') || name.includes('gold') || name.includes('neutral') ||
               name.includes('shimmer') || name.includes('matte')) {
      return 'eyeshadow';
    }
    
    return null;
  }
  
  /**
   * Get product category from image path
   */
  function getProductCategoryFromPath(path) {
    // Extract category from path like /assets/products/lipstick/red.jpg
    const match = path.match(/\/products\/([^\/]+)\//);
    return match ? match[1] : null;
  }
  
  /**
   * Get look name for a product category
   */
  function getLookNameForCategory(category) {
    // Map product categories to Banuba look names
    const categoryToLook = {
      'lipstick': 'Queen', // Red lipstick
      'eyeshadow': 'Smoky', // Smoky eye
      'foundation': 'Jasmine', // Natural look
      'blush': 'Coral', // Coral blush
      'eyeliner': 'Smoky', // Black eyeliner
      'mascara': 'Smoky' // Black mascara
    };
    
    return categoryToLook[category] || 'Aster'; // Default to Aster
  }
  
  /**
   * Hide product recommendations container
   */
  function hideProductRecommendations() {
    const container = document.getElementById('product-recommendations');
    if (container) {
      container.style.display = 'none';
    }
  }
})();