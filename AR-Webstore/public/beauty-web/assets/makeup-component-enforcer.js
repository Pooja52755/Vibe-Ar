/**
 * makeup-component-enforcer.js
 * 
 * This script specifically ensures that individual makeup components
 * (lipstick, eyebrows, etc.) are properly applied when using Banuba SDK.
 * It provides more granular control over makeup application.
 */

(function() {
  console.log('[MakeupComponentEnforcer] Initializing...');
  
  // Make our functions globally available
  window.MakeupComponentEnforcer = {
    applyMakeupComponents: applyMakeupComponents,
    enforceComponentApplication: enforceComponentApplication,
    ensureAllComponentsApplied: ensureAllComponentsApplied
  };
  
  // Makeup component definitions with specific selectors and fallback methods
  const MAKEUP_COMPONENTS = {
    lipstick: {
      priority: 1,
      selectors: [
        '.lips-button', 
        '[data-component="lips"]', 
        '[data-makeup-component="lipstick"]',
        '.bnb-lips-option'
      ],
      fallbackCSS: (intensity = 1.0) => `saturate(${1 + intensity * 0.4}) brightness(${1 - intensity * 0.1})`,
      applyMethod: applyLipstick
    },
    eyebrows: {
      priority: 2,
      selectors: [
        '.brows-button', 
        '[data-component="brows"]', 
        '[data-makeup-component="eyebrows"]',
        '.bnb-brows-option'
      ],
      fallbackCSS: (intensity = 1.0) => `contrast(${1 + intensity * 0.1}) brightness(${1 - intensity * 0.05})`,
      applyMethod: applyEyebrows
    },
    eyeshadow: {
      priority: 3,
      selectors: [
        '.eyes-button', 
        '[data-component="eyes"]', 
        '[data-makeup-component="eyeshadow"]',
        '.bnb-eyes-option'
      ],
      fallbackCSS: (intensity = 1.0) => `saturate(${1 + intensity * 0.3})`,
      applyMethod: applyEyeshadow
    },
    foundation: {
      priority: 0, // Apply first
      selectors: [
        '.foundation-button', 
        '[data-component="foundation"]', 
        '[data-makeup-component="foundation"]',
        '.bnb-foundation-option'
      ],
      fallbackCSS: (intensity = 1.0) => `brightness(${1 + intensity * 0.05})`,
      applyMethod: applyFoundation
    },
    blush: {
      priority: 4,
      selectors: [
        '.blush-button', 
        '[data-component="blush"]', 
        '[data-makeup-component="blush"]',
        '.bnb-blush-option'
      ],
      fallbackCSS: (intensity = 1.0) => `saturate(${1 + intensity * 0.2})`,
      applyMethod: applyBlush
    },
    contour: {
      priority: 5,
      selectors: [
        '.contour-button', 
        '[data-component="contour"]', 
        '[data-makeup-component="contour"]',
        '.bnb-contour-option'
      ],
      fallbackCSS: (intensity = 1.0) => `contrast(${1 + intensity * 0.1})`,
      applyMethod: applyContour
    },
    highlighter: {
      priority: 6,
      selectors: [
        '.highlighter-button', 
        '[data-component="highlighter"]', 
        '[data-makeup-component="highlighter"]',
        '.bnb-highlighter-option'
      ],
      fallbackCSS: (intensity = 1.0) => `brightness(${1 + intensity * 0.1})`,
      applyMethod: applyHighlighter
    }
  };
  
  // Map filter IDs to specific makeup components to apply
  const FILTER_TO_COMPONENTS_MAP = {
    "Makeup_001": { // Natural everyday look
      lipstick: 0.5,
      eyebrows: 0.6,
      eyeshadow: 0.3,
      foundation: 0.7,
      blush: 0.4
    },
    "Makeup_002": { // Light blush and subtle lips
      lipstick: 0.4,
      blush: 0.7
    },
    "Makeup_003": { // Dramatic smokey eye
      eyeshadow: 0.9,
      eyebrows: 0.8
    },
    "Makeup_004": { // Bold red lips
      lipstick: 1.0
    },
    "Makeup_005": { // Professional office makeup
      foundation: 0.8,
      eyebrows: 0.7,
      eyeshadow: 0.5,
      lipstick: 0.6
    },
    "Makeup_006": { // Wedding/bridal makeup
      foundation: 0.9,
      eyeshadow: 0.7,
      lipstick: 0.8,
      blush: 0.6,
      highlighter: 0.8
    },
    "Makeup_007": { // Evening glam with shimmer
      eyeshadow: 0.9,
      lipstick: 0.8,
      highlighter: 1.0
    },
    "Makeup_008": { // Soft romantic pink tones
      lipstick: 0.7,
      blush: 0.8,
      eyeshadow: 0.5
    },
    "Makeup_009": { // Summer bronze glow
      foundation: 0.8,
      contour: 0.9,
      highlighter: 0.8
    },
    "Makeup_010": { // Vintage inspired makeup
      lipstick: 0.9,
      eyebrows: 0.8,
      eyeshadow: 0.7
    },
    "Makeup_011": { // Bold colorful eyeshadow
      eyeshadow: 1.0
    },
    "Makeup_012": { // Matte neutral tones
      foundation: 0.9,
      contour: 0.8,
      eyeshadow: 0.6
    },
    "Makeup_013": { // Korean glass skin
      foundation: 1.0,
      highlighter: 0.9,
      lipstick: 0.5
    },
    "Makeup_014": { // Gothic dark lips
      lipstick: 1.0,
      eyeshadow: 0.8
    },
    "Makeup_015": { // Festival makeup with glitter
      eyeshadow: 1.0,
      highlighter: 1.0,
      lipstick: 0.8
    }
  };
  
  // Track what components we need to apply
  let pendingComponents = {};
  
  // Initialize when the document is ready
  document.addEventListener('DOMContentLoaded', initialize);
  window.addEventListener('load', initialize);
  
  // Start periodic check
  setInterval(ensureAllComponentsApplied, 1000);
  
  /**
   * Initialize the component enforcer
   */
  function initialize() {
    console.log('[MakeupComponentEnforcer] Setting up component enforcement');
    
    // Hook into GenAI integration to track filter applications
    if (window.GenAIMakeupIntegration) {
      // Store the original filter application method
      const originalApplyFilters = window.GenAIMakeupIntegration.applyRecommendedFilters;
      
      if (originalApplyFilters) {
        window.GenAIMakeupIntegration.applyRecommendedFilters = function(filters) {
          // Process filters to get component information
          processFiltersIntoComponents(filters);
          
          // Call the original method
          return originalApplyFilters.apply(this, arguments)
            .then(result => {
              // After the original method, ensure our components are applied
              setTimeout(ensureAllComponentsApplied, 500);
              return result;
            });
        };
      }
    }
  }
  
  /**
   * Process filter IDs into specific component information
   * @param {Array<string>} filters - The filter IDs to process
   */
  function processFiltersIntoComponents(filters) {
    if (!filters || filters.length === 0) return;
    
    // Reset pending components
    pendingComponents = {};
    
    // Process each filter
    for (const filterId of filters) {
      if (FILTER_TO_COMPONENTS_MAP[filterId]) {
        const componentMap = FILTER_TO_COMPONENTS_MAP[filterId];
        
        // Merge component maps, taking the highest intensity
        Object.keys(componentMap).forEach(component => {
          const intensity = componentMap[component];
          
          if (!pendingComponents[component] || pendingComponents[component] < intensity) {
            pendingComponents[component] = intensity;
          }
        });
      }
    }
    
    console.log('[MakeupComponentEnforcer] Processed filters into components:', pendingComponents);
  }
  
  /**
   * Apply specific makeup components
   * @returns {Promise<boolean>} - Promise resolving to success status
   */
  function applyMakeupComponents() {
    return new Promise((resolve) => {
      if (Object.keys(pendingComponents).length === 0) {
        resolve(true);
        return;
      }
      
      console.log('[MakeupComponentEnforcer] Applying makeup components:', pendingComponents);
      
      // Get components in order of priority
      const orderedComponents = Object.keys(pendingComponents)
        .filter(key => MAKEUP_COMPONENTS[key])
        .sort((a, b) => MAKEUP_COMPONENTS[a].priority - MAKEUP_COMPONENTS[b].priority);
      
      // Apply each component in sequence
      let appliedCount = 0;
      
      const applyNextComponent = () => {
        if (appliedCount < orderedComponents.length) {
          const component = orderedComponents[appliedCount];
          const intensity = pendingComponents[component];
          
          if (MAKEUP_COMPONENTS[component] && MAKEUP_COMPONENTS[component].applyMethod) {
            MAKEUP_COMPONENTS[component].applyMethod(intensity);
          }
          
          appliedCount++;
          setTimeout(applyNextComponent, 200);
        } else {
          // All components applied
          resolve(true);
        }
      };
      
      applyNextComponent();
    });
  }
  
  /**
   * Enforce the application of a specific makeup component
   * @param {string} component - The component name
   * @param {number} intensity - The intensity (0.0 to 1.0)
   * @returns {boolean} - True if component was applied
   */
  function enforceComponentApplication(component, intensity = 1.0) {
    if (!MAKEUP_COMPONENTS[component]) {
      console.warn(`[MakeupComponentEnforcer] Unknown component: ${component}`);
      return false;
    }
    
    const componentDef = MAKEUP_COMPONENTS[component];
    
    // Try to click UI element for this component
    const success = tryClickComponentInUI(componentDef.selectors);
    
    if (!success) {
      // If UI element not found, try direct API method
      if (componentDef.applyMethod) {
        componentDef.applyMethod(intensity);
        return true;
      }
      
      // Apply fallback CSS if available
      if (componentDef.fallbackCSS) {
        applyFallbackCSS(component, intensity);
      }
    }
    
    return success;
  }
  
  /**
   * Try to find and click a component's UI element
   * @param {Array<string>} selectors - Selectors to try
   * @returns {boolean} - True if an element was found and clicked
   */
  function tryClickComponentInUI(selectors) {
    // Try each selector
    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        // Click the first matching element
        elements[0].click();
        console.log(`[MakeupComponentEnforcer] Found and clicked element: ${selector}`);
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Apply fallback CSS for a component
   * @param {string} component - The component name
   * @param {number} intensity - The intensity (0.0 to 1.0)
   */
  function applyFallbackCSS(component, intensity) {
    if (!MAKEUP_COMPONENTS[component] || !MAKEUP_COMPONENTS[component].fallbackCSS) {
      return;
    }
    
    const cssFilter = MAKEUP_COMPONENTS[component].fallbackCSS(intensity);
    console.log(`[MakeupComponentEnforcer] Applying fallback CSS for ${component}: ${cssFilter}`);
    
    // Apply to face area elements
    const faceElements = document.querySelectorAll('.bnb-makeup, .makeup-container, .face-area');
    faceElements.forEach(element => {
      // Store original filter if not already stored
      if (!element.getAttribute('data-original-filter')) {
        element.setAttribute('data-original-filter', element.style.filter || '');
      }
      
      // Apply additional filter
      const originalFilter = element.getAttribute('data-original-filter');
      element.style.filter = originalFilter ? `${originalFilter} ${cssFilter}` : cssFilter;
    });
  }
  
  /**
   * Ensure all pending components are applied
   */
  function ensureAllComponentsApplied() {
    if (Object.keys(pendingComponents).length === 0) {
      return;
    }
    
    // Apply each pending component
    Object.keys(pendingComponents).forEach(component => {
      if (MAKEUP_COMPONENTS[component]) {
        enforceComponentApplication(component, pendingComponents[component]);
      }
    });
  }
  
  // Component-specific application methods
  
  /**
   * Apply lipstick with given intensity
   * @param {number} intensity - The intensity (0.0 to 1.0)
   */
  function applyLipstick(intensity) {
    console.log(`[MakeupComponentEnforcer] Applying lipstick with intensity: ${intensity}`);
    
    // Try different Banuba SDK interfaces
    if (window.bnbMakeupInstance && window.bnbMakeupInstance.lips) {
      window.bnbMakeupInstance.lips.apply(intensity);
    } else if (window.banubaMakeup && window.banubaMakeup.applyComponent) {
      window.banubaMakeup.applyComponent('lips', intensity);
    } else if (window.store && window.store.makeup && window.store.makeup.lips) {
      window.store.makeup.lips.apply(intensity);
    } else {
      // Use more generic approach
      applyMakeupComponentGeneric('lips', intensity);
    }
  }
  
  /**
   * Apply eyebrows with given intensity
   * @param {number} intensity - The intensity (0.0 to 1.0)
   */
  function applyEyebrows(intensity) {
    console.log(`[MakeupComponentEnforcer] Applying eyebrows with intensity: ${intensity}`);
    
    // Try different Banuba SDK interfaces
    if (window.bnbMakeupInstance && window.bnbMakeupInstance.brows) {
      window.bnbMakeupInstance.brows.apply(intensity);
    } else if (window.banubaMakeup && window.banubaMakeup.applyComponent) {
      window.banubaMakeup.applyComponent('brows', intensity);
    } else if (window.store && window.store.makeup && window.store.makeup.brows) {
      window.store.makeup.brows.apply(intensity);
    } else {
      // Use more generic approach
      applyMakeupComponentGeneric('brows', intensity);
    }
  }
  
  /**
   * Apply eyeshadow with given intensity
   * @param {number} intensity - The intensity (0.0 to 1.0)
   */
  function applyEyeshadow(intensity) {
    console.log(`[MakeupComponentEnforcer] Applying eyeshadow with intensity: ${intensity}`);
    
    // Try different Banuba SDK interfaces
    if (window.bnbMakeupInstance && window.bnbMakeupInstance.eyeshadow) {
      window.bnbMakeupInstance.eyeshadow.apply(intensity);
    } else if (window.banubaMakeup && window.banubaMakeup.applyComponent) {
      window.banubaMakeup.applyComponent('eyeshadow', intensity);
    } else if (window.store && window.store.makeup && window.store.makeup.eyeshadow) {
      window.store.makeup.eyeshadow.apply(intensity);
    } else {
      // Use more generic approach
      applyMakeupComponentGeneric('eyeshadow', intensity);
    }
  }
  
  /**
   * Apply foundation with given intensity
   * @param {number} intensity - The intensity (0.0 to 1.0)
   */
  function applyFoundation(intensity) {
    console.log(`[MakeupComponentEnforcer] Applying foundation with intensity: ${intensity}`);
    
    // Try different Banuba SDK interfaces
    if (window.bnbMakeupInstance && window.bnbMakeupInstance.foundation) {
      window.bnbMakeupInstance.foundation.apply(intensity);
    } else if (window.banubaMakeup && window.banubaMakeup.applyComponent) {
      window.banubaMakeup.applyComponent('foundation', intensity);
    } else if (window.store && window.store.makeup && window.store.makeup.foundation) {
      window.store.makeup.foundation.apply(intensity);
    } else {
      // Use more generic approach
      applyMakeupComponentGeneric('foundation', intensity);
    }
  }
  
  /**
   * Apply blush with given intensity
   * @param {number} intensity - The intensity (0.0 to 1.0)
   */
  function applyBlush(intensity) {
    console.log(`[MakeupComponentEnforcer] Applying blush with intensity: ${intensity}`);
    
    // Try different Banuba SDK interfaces
    if (window.bnbMakeupInstance && window.bnbMakeupInstance.blush) {
      window.bnbMakeupInstance.blush.apply(intensity);
    } else if (window.banubaMakeup && window.banubaMakeup.applyComponent) {
      window.banubaMakeup.applyComponent('blush', intensity);
    } else if (window.store && window.store.makeup && window.store.makeup.blush) {
      window.store.makeup.blush.apply(intensity);
    } else {
      // Use more generic approach
      applyMakeupComponentGeneric('blush', intensity);
    }
  }
  
  /**
   * Apply contour with given intensity
   * @param {number} intensity - The intensity (0.0 to 1.0)
   */
  function applyContour(intensity) {
    console.log(`[MakeupComponentEnforcer] Applying contour with intensity: ${intensity}`);
    
    // Try different Banuba SDK interfaces
    if (window.bnbMakeupInstance && window.bnbMakeupInstance.contour) {
      window.bnbMakeupInstance.contour.apply(intensity);
    } else if (window.banubaMakeup && window.banubaMakeup.applyComponent) {
      window.banubaMakeup.applyComponent('contour', intensity);
    } else if (window.store && window.store.makeup && window.store.makeup.contour) {
      window.store.makeup.contour.apply(intensity);
    } else {
      // Use more generic approach
      applyMakeupComponentGeneric('contour', intensity);
    }
  }
  
  /**
   * Apply highlighter with given intensity
   * @param {number} intensity - The intensity (0.0 to 1.0)
   */
  function applyHighlighter(intensity) {
    console.log(`[MakeupComponentEnforcer] Applying highlighter with intensity: ${intensity}`);
    
    // Try different Banuba SDK interfaces
    if (window.bnbMakeupInstance && window.bnbMakeupInstance.highlighter) {
      window.bnbMakeupInstance.highlighter.apply(intensity);
    } else if (window.banubaMakeup && window.banubaMakeup.applyComponent) {
      window.banubaMakeup.applyComponent('highlighter', intensity);
    } else if (window.store && window.store.makeup && window.store.makeup.highlighter) {
      window.store.makeup.highlighter.apply(intensity);
    } else {
      // Use more generic approach
      applyMakeupComponentGeneric('highlighter', intensity);
    }
  }
  
  /**
   * Generic function to apply a makeup component
   * @param {string} componentName - The component name
   * @param {number} intensity - The intensity (0.0 to 1.0)
   */
  function applyMakeupComponentGeneric(componentName, intensity) {
    // Try all possible methods to apply the component
    
    // Method 1: Look for a component-specific function in the window object
    const possibleApiFunctions = [
      window.bnb?.makeup?.[componentName]?.apply,
      window.bnb?.effect?.makeup?.[componentName]?.apply,
      window.banubaMakeup?.[componentName]?.apply,
      window.banubaSDK?.makeup?.[componentName]?.apply
    ];
    
    for (const func of possibleApiFunctions) {
      if (typeof func === 'function') {
        try {
          func(intensity);
          console.log(`[MakeupComponentEnforcer] Applied ${componentName} using API function`);
          return;
        } catch (error) {
          console.warn(`[MakeupComponentEnforcer] Error applying ${componentName}:`, error);
        }
      }
    }
    
    // Method 2: Try to simulate UI interaction
    const componentSelectors = MAKEUP_COMPONENTS[componentName]?.selectors || [];
    if (tryClickComponentInUI(componentSelectors)) {
      return;
    }
    
    // Method 3: Apply CSS fallback if available
    if (MAKEUP_COMPONENTS[componentName]?.fallbackCSS) {
      applyFallbackCSS(componentName, intensity);
    }
  }
})();