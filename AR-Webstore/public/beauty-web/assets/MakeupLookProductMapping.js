/**
 * MakeupLookProductMapping.js - Maps Banuba makeup looks to product images
 * 
 * This file creates a connection between the Banuba makeup filters/looks and 
 * the corresponding product images that should be displayed in product cards.
 */

// Mapping between Banuba makeup look names and product types/colors with image paths
const MAKEUP_LOOK_MAPPING = {
  // Maps look name to product categories and specific colors
  'Aster': {
    lipstick: {
      color: '#FF66B2', // Pink
      image: 'assets/products/lipstick/pink.jpg'
    },
    eyeshadow: {
      color: '#8B008B', // Purple
      image: 'assets/products/eyeshadow/sunset.jpg'
    },
    blush: {
      color: '#FF6666', // Coral
      image: 'assets/products/lipstick/coral.jpg'
    }
  },
  'Bluebell': {
    lipstick: '#990066', // Berry
    eyeshadow: ['#8B008B', '#9932CC', '#BA55D3'], // Purple tones
    eyeliner: '#000000' // Black
  },
  'Coral': {
    lipstick: '#FF6666', // Coral
    blush: '#FF6666', // Coral
    eyeshadow: ['#FFA07A', '#FF8C00'] // Orange/coral tones
  },
  'Dolly': {
    lipstick: '#FF66B2', // Pink
    eyeshadow: ['#FFD700', '#DAA520'], // Gold tones
    blush: '#FF6666' // Coral
  },
  'Jasmine': {
    lipstick: '#CC9966', // Nude
    eyeshadow: ['#F5DEB3', '#D2B48C', '#8B4513'], // Neutral tones
    foundation: 'Medium' // Medium shade
  },
  'Queen': {
    lipstick: '#CC0000', // Red
    eyeshadow: ['#000000', '#333333', '#666666'], // Smoky tones
    eyeliner: '#000000' // Black
  },
  'Smoky': {
    eyeshadow: ['#000000', '#333333', '#666666', '#999999'], // Smoky tones
    eyeliner: '#000000', // Black
    mascara: '#000000' // Black
  },
  'Twilight': {
    lipstick: '#990066', // Berry
    eyeshadow: ['#8B008B', '#9932CC', '#BA55D3'], // Purple tones
    blush: '#FF6666' // Coral
  },
  '40s': {
    lipstick: '#CC0000', // Red
    eyeshadow: ['#F5DEB3', '#D2B48C'], // Neutral tones
    eyeliner: '#000000' // Black
  },
  'Confetti': {
    eyeshadow: ['#FF6347', '#FFA07A', '#FFDAB9', '#FFD700', '#FF8C00'], // Colorful tones
    lipstick: '#FF66B2' // Pink
  }
};

/**
 * Get recommended products based on a specific makeup look
 * @param {string} lookName - Name of the Banuba makeup look
 * @returns {Array} Array of filter objects with type and color information
 */
function getProductRecommendationsForLook(lookName) {
  const lookMapping = MAKEUP_LOOK_MAPPING[lookName];
  if (!lookMapping) return [];
  
  // Convert mapping to filter format expected by the product recommendation system
  const filters = [];
  
  for (const [type, colorValue] of Object.entries(lookMapping)) {
    // Handle both single colors and arrays of colors
    if (typeof colorValue === 'string') {
      filters.push({
        type: type,
        color: colorValue
      });
    } else if (Array.isArray(colorValue)) {
      // For arrays, just use the first color as the primary color
      filters.push({
        type: type,
        color: colorValue[0]
      });
    }
  }
  
  return filters;
}

/**
 * Initialize the connection between Banuba looks and product recommendations
 */
function initMakeupLookProductMapping() {
  console.log('[MakeupLookProductMapping] Initializing...');
  
  // Listen for look applied event from Banuba
  document.addEventListener('lookApplied', function(event) {
    if (event.detail && event.detail.lookName) {
      const lookName = event.detail.lookName;
      console.log(`[MakeupLookProductMapping] Look applied: ${lookName}`);
      
      // Get product recommendations for this look
      const filters = getProductRecommendationsForLook(lookName);
      
      if (filters.length > 0) {
        // Dispatch makeup applied event with the filters
        const makeupAppliedEvent = new CustomEvent('makeupApplied', {
          detail: {
            source: 'lookMapping',
            lookName: lookName,
            filters: filters
          }
        });
        
        document.dispatchEvent(makeupAppliedEvent);
      }
    }
  });
  
  // Also initialize direct connection to Banuba effects if possible
  connectToBanubaEffects();
}

/**
 * Try to connect to Banuba effects to listen for look changes
 */
function connectToBanubaEffects() {
  // This will be implemented later if we can access Banuba's API directly
  // For now, we rely on the lookApplied event
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initMakeupLookProductMapping);

// For immediate execution if already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initMakeupLookProductMapping();
}

// Export functions for other modules
window.makeupLookMapping = {
  getProductRecommendationsForLook,
  lookMappings: MAKEUP_LOOK_MAPPING
};