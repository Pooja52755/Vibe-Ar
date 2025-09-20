/**
 * AppInitializer.js - Ensures the application initializes properly
 */

(function() {
  console.log('[AppInitializer] Starting app initialization...');
  
  // Wait for document to be ready
  window.addEventListener('load', init);
  
  // For immediate execution if already loaded
  if (document.readyState === 'complete') {
    init();
  }
  
  /**
   * Initialize the application
   */
  function init() {
    console.log('[AppInitializer] Initializing app...');
    
    // Remove verification buttons
    removeVerificationButtons();
    
    // Make sure back button is visible
    enhanceBackButton();
    
    // Make sure selected features are visible
    enhanceSelectedFeatures();
    
    // Clear any products showing by default
    hideInitialProducts();
  }
  
  /**
   * Remove verification and mock buttons
   */
  function removeVerificationButtons() {
    // Hide elements by ID
    const elementsToHide = [
      'test-verification-button',
      'show-mock-products-button',
      'verification-log',
      'ai-product-container'
    ];
    
    elementsToHide.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.style.display = 'none';
        
        // Try to remove from DOM
        try {
          element.parentElement.removeChild(element);
        } catch (e) {
          // Ignore errors
        }
      }
    });
    
    // Remove buttons with specific text
    const buttonTexts = [
      'Verify Product Behavior',
      'Show Mock Products',
      'Mock Products'
    ];
    
    document.querySelectorAll('button').forEach(button => {
      const text = button.textContent.trim();
      if (buttonTexts.some(bt => text.includes(bt))) {
        button.style.display = 'none';
        
        // Try to remove from DOM
        try {
          button.parentElement.removeChild(button);
        } catch (e) {
          // Ignore errors
        }
      }
    });
  }
  
  /**
   * Enhance back button visibility
   */
  function enhanceBackButton() {
    // Find back button
    const backButton = document.querySelector('.back-button') ||
                      document.querySelector('[aria-label="Back"]') ||
                      document.querySelector('[data-role="back"]');
    
    if (backButton) {
      // Make sure it's visible
      backButton.style.display = 'block';
      backButton.style.visibility = 'visible';
      backButton.style.opacity = '1';
    }
  }
  
  /**
   * Enhance selected features visibility
   */
  function enhanceSelectedFeatures() {
    // Find selected features
    const selectedFeatures = document.querySelector('.selected-features') ||
                            document.querySelector('[data-role="selected-features"]') ||
                            document.querySelector('.selected-filters');
    
    if (selectedFeatures) {
      // Make sure it's visible
      selectedFeatures.style.display = 'block';
      selectedFeatures.style.visibility = 'visible';
      selectedFeatures.style.opacity = '1';
    }
  }
  
  /**
   * Hide any products showing by default
   */
  function hideInitialProducts() {
    // Hide product recommendations
    const container = document.getElementById('product-recommendations');
    if (container) {
      // Check if we have any active filters before hiding
      const hasFilters = checkForActiveFilters();
      if (!hasFilters) {
        container.style.display = 'none';
      }
    }
    
    // Also hide any mock product containers
    const mockContainer = document.getElementById('ai-product-container');
    if (mockContainer) {
      mockContainer.style.display = 'none';
    }
  }
  
  /**
   * Check if there are any active filters
   * @returns {boolean} True if filters are active
   */
  function checkForActiveFilters() {
    // Check if selected features section exists
    const selectedFeatures = document.querySelector('.selected-features') ||
                            document.querySelector('[data-role="selected-features"]') ||
                            document.querySelector('.selected-filters');
    
    if (!selectedFeatures) {
      return false;
    }
    
    // Check for any filter elements
    const filters = selectedFeatures.querySelectorAll('.filter, .feature, .selected-item');
    return filters.length > 0;
  }
})();