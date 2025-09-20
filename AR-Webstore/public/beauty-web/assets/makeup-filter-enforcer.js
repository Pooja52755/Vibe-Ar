/**
 * makeup-filter-enforcer.js
 * 
 * This script ensures that makeup filters are properly applied to images,
 * even when there are issues with the Banuba SDK or when images are loaded
 * from fallback sources.
 */

(function() {
  console.log('[MakeupFilterEnforcer] Initializing...');
  
  // Make our functions globally available
  window.MakeupFilterEnforcer = {
    applyPendingFilters: applyPendingFilters,
    ensureFiltersApplied: ensureFiltersApplied
  };
  
  // Track if we have pending filters to apply
  let pendingFilters = null;
  
  // Watch for DOM changes to catch new images being added
  observeDOMForImages();
  
  // Initialize when the document is ready
  document.addEventListener('DOMContentLoaded', initialize);
  window.addEventListener('load', initialize);
  
  /**
   * Initialize the makeup filter enforcer
   */
  function initialize() {
    console.log('[MakeupFilterEnforcer] Setting up image listeners');
    
    // Listen for image load events to apply filters
    document.addEventListener('load', function(event) {
      const target = event.target;
      if (target.tagName === 'IMG') {
        // Check if this is a makeup preview image
        if (isMakeupPreviewImage(target)) {
          console.log('[MakeupFilterEnforcer] Detected makeup preview image load:', target);
          
          // Apply any pending filters
          if (pendingFilters) {
            applyFiltersToImage(target, pendingFilters);
          }
        }
      }
    }, true); // Use capture phase
    
    // Hook into GenAI integration to track filter applications
    if (window.GenAIMakeupIntegration) {
      const originalApplyFilters = window.GenAIMakeupIntegration.applyRecommendedFilters;
      
      if (originalApplyFilters) {
        window.GenAIMakeupIntegration.applyRecommendedFilters = function(filters) {
          // Store the filters for later use
          pendingFilters = filters;
          
          // Call the original method
          return originalApplyFilters.apply(this, arguments);
        };
      }
    }
    
    // Set up periodic check to ensure filters are applied
    setInterval(ensureFiltersApplied, 1000);
  }
  
  /**
   * Check if an image is likely a makeup preview image
   * @param {HTMLImageElement} img - The image to check
   * @returns {boolean} - True if the image is likely a makeup preview
   */
  function isMakeupPreviewImage(img) {
    // Check various indicators
    return img.closest('.bnb-makeup') !== null || 
           img.classList.contains('preview-image') || 
           img.classList.contains('makeup-preview') || 
           img.id === 'makeup-preview' ||
           img.closest('.makeup-container') !== null ||
           img.closest('.bnb-container') !== null;
  }
  
  /**
   * Apply any pending filters to all makeup preview images
   */
  function applyPendingFilters() {
    if (!pendingFilters) return;
    
    // Find all potential makeup preview images
    const previewImages = Array.from(document.querySelectorAll('img')).filter(isMakeupPreviewImage);
    
    if (previewImages.length > 0) {
      console.log(`[MakeupFilterEnforcer] Applying pending filters to ${previewImages.length} images`);
      
      // Apply filters to each image
      previewImages.forEach(img => {
        applyFiltersToImage(img, pendingFilters);
      });
    }
  }
  
  /**
   * Apply specific filters to an image
   * @param {HTMLImageElement} img - The image to apply filters to
   * @param {Array<string>} filters - The filters to apply
   */
  function applyFiltersToImage(img, filters) {
    if (!filters || filters.length === 0) return;
    
    // Map filter IDs to CSS filters
    const filterMap = {
      "Makeup_001": "brightness(1.05) contrast(1.02) saturate(1.05)",
      "Makeup_002": "brightness(1.05) contrast(1.0) saturate(1.1)",
      "Makeup_003": "brightness(0.98) contrast(1.15) saturate(1.1)",
      "Makeup_004": "brightness(1.0) contrast(1.15) saturate(1.2)",
      "Makeup_005": "brightness(1.05) contrast(1.05) saturate(1.0)",
      "Makeup_006": "brightness(1.1) contrast(1.02) saturate(1.05)",
      "Makeup_007": "brightness(1.1) contrast(1.2) saturate(1.2)",
      "Makeup_008": "brightness(1.05) contrast(1.0) saturate(1.15)",
      "Makeup_009": "brightness(1.15) contrast(1.1) saturate(1.2) sepia(0.1)",
      "Makeup_010": "brightness(1.0) contrast(1.1) saturate(0.9) sepia(0.2)",
      "Makeup_011": "brightness(1.05) contrast(1.2) saturate(1.3)",
      "Makeup_012": "brightness(1.0) contrast(1.1) saturate(0.95)",
      "Makeup_013": "brightness(1.1) contrast(1.0) saturate(1.0)",
      "Makeup_014": "brightness(0.95) contrast(1.2) saturate(1.0)",
      "Makeup_015": "brightness(1.1) contrast(1.15) saturate(1.3)"
    };
    
    // Apply the first filter found
    let appliedFilter = null;
    
    for (const filterId of filters) {
      if (filterMap[filterId]) {
        appliedFilter = filterMap[filterId];
        break;
      }
    }
    
    if (!appliedFilter) {
      // Use default filter if none found
      appliedFilter = "brightness(1.05) contrast(1.05) saturate(1.1)";
    }
    
    // Apply the filter
    img.style.filter = appliedFilter;
    
    // Mark as having a filter applied
    img.setAttribute('data-filter-applied', 'true');
    
    console.log(`[MakeupFilterEnforcer] Applied filter ${appliedFilter} to image:`, img);
  }
  
  /**
   * Ensure filters are applied to all makeup preview images
   */
  function ensureFiltersApplied() {
    if (!pendingFilters) return;
    
    // Find all potential makeup preview images that don't have filters
    const unfiltered = Array.from(document.querySelectorAll('img')).filter(img => 
      isMakeupPreviewImage(img) && !img.hasAttribute('data-filter-applied')
    );
    
    if (unfiltered.length > 0) {
      console.log(`[MakeupFilterEnforcer] Found ${unfiltered.length} unfiltered preview images`);
      
      // Apply filters to each unfiltered image
      unfiltered.forEach(img => {
        applyFiltersToImage(img, pendingFilters);
      });
    }
  }
  
  /**
   * Observe DOM changes to detect new images being added
   */
  function observeDOMForImages() {
    // Create a mutation observer to watch for new images
    const observer = new MutationObserver(mutations => {
      let newImagesAdded = false;
      
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Check if the added node is an image
              if (node.tagName === 'IMG') {
                newImagesAdded = true;
              }
              
              // Check if the added node contains images
              const images = node.querySelectorAll('img');
              if (images.length > 0) {
                newImagesAdded = true;
              }
            }
          }
        }
      }
      
      // If new images were added, check if we need to apply filters
      if (newImagesAdded && pendingFilters) {
        setTimeout(applyPendingFilters, 100);
      }
    });
    
    // Start observing the document
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
})();