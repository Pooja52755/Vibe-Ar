/**
 * LookAppliedMonitor.js - Monitors for Banuba makeup look selection
 * 
 * This script watches for Banuba look selection events and emits standardized
 * lookApplied events that our product recommendation system can use.
 */

(function() {
  console.log('[LookAppliedMonitor] Initializing...');
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('load', init);
  
  // For immediate execution if already loaded
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  }
  
  /**
   * Initialize the look monitor
   */
  function init() {
    console.log('[LookAppliedMonitor] Setting up...');
    
    // Watch for look selection UI changes
    monitorLookSelectionButtons();
    monitorLookSelectionEffects();
    
    // Set up MutationObserver to watch for dynamically added look buttons
    observeDOMChanges();
  }
  
  /**
   * Monitor look selection buttons in the UI
   */
  function monitorLookSelectionButtons() {
    // Watch for click events on look thumbnails or selection buttons
    document.addEventListener('click', function(event) {
      // Look for elements that might be look selection buttons
      const lookButton = findLookButtonFromEvent(event);
      
      if (lookButton) {
        // Try to extract look name from the button
        const lookName = extractLookNameFromButton(lookButton);
        
        if (lookName) {
          console.log(`[LookAppliedMonitor] Look selected via button: ${lookName}`);
          notifyLookApplied(lookName);
        }
      }
    }, true); // Use capture to get event before it reaches target
  }
  
  /**
   * Find look button from click event
   * @param {Event} event - Click event
   * @returns {Element|null} Look button element or null
   */
  function findLookButtonFromEvent(event) {
    const target = event.target;
    
    // Look for elements that match look button patterns
    // Check if it's a look thumbnail or container
    if (target.closest('.effect-item') || 
        target.closest('.look-item') || 
        target.closest('[data-effect-type="look"]') ||
        target.closest('[data-effect="look"]')) {
      return target.closest('.effect-item') || 
             target.closest('.look-item') || 
             target.closest('[data-effect-type="look"]') ||
             target.closest('[data-effect="look"]');
    }
    
    // Check for image thumbnails that might be look selectors
    if (target.tagName === 'IMG' && 
        (target.src.includes('/looks/') || target.src.includes('/effects/'))) {
      return target;
    }
    
    return null;
  }
  
  /**
   * Extract look name from button element
   * @param {Element} button - Look selection button
   * @returns {string|null} Look name or null
   */
  function extractLookNameFromButton(button) {
    // Try various ways to get the look name
    
    // Check for data attributes
    if (button.dataset.lookName) {
      return button.dataset.lookName;
    }
    
    if (button.dataset.effectName) {
      return button.dataset.effectName;
    }
    
    // Check for image src (extract file name without extension)
    const img = button.querySelector('img') || (button.tagName === 'IMG' ? button : null);
    if (img && img.src) {
      const match = img.src.match(/\/looks\/([^\/]+)\.[^\.]+$/);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    // Check for text content that might contain the look name
    const label = button.querySelector('.effect-name, .look-name') || button;
    if (label.textContent && label.textContent.trim()) {
      return label.textContent.trim();
    }
    
    return null;
  }
  
  /**
   * Monitor Banuba effect changes directly
   */
  function monitorLookSelectionEffects() {
    // This is a more advanced approach that tries to detect when Banuba applies a look
    // by monitoring the app state or effect changes
    
    // Try to access Banuba SDK through window objects
    const checkBanubaInterval = setInterval(() => {
      // Check for common Banuba SDK global objects
      if (window.bnbSdk || window.effectPlayer || window.Banuba) {
        clearInterval(checkBanubaInterval);
        
        console.log('[LookAppliedMonitor] Detected Banuba SDK, attempting to connect...');
        
        // Hook into effect changes if possible
        try {
          // This is speculative and depends on how Banuba SDK is structured
          // Actual implementation might vary
          if (window.bnbSdk && window.bnbSdk.addEventListener) {
            window.bnbSdk.addEventListener('effectChanged', (event) => {
              if (event.effectName && event.effectName.includes('looks/')) {
                const lookName = event.effectName.split('looks/')[1].split('.')[0];
                notifyLookApplied(lookName);
              }
            });
          }
        } catch (error) {
          console.log('[LookAppliedMonitor] Could not connect to Banuba SDK:', error);
        }
      }
    }, 1000);
    
    // Clear interval after 10 seconds to avoid indefinite polling
    setTimeout(() => clearInterval(checkBanubaInterval), 10000);
  }
  
  /**
   * Observe DOM for dynamically added look buttons
   */
  function observeDOMChanges() {
    // Create a MutationObserver to watch for new look buttons
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          // Check added nodes for look buttons
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // If this is a look button container, monitor its buttons
              if (node.classList && 
                  (node.classList.contains('effect-list') || 
                   node.classList.contains('look-list'))) {
                console.log('[LookAppliedMonitor] Detected new look container:', node);
                attachLookButtonListeners(node);
              }
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
   * Attach listeners to all look buttons in a container
   * @param {Element} container - Container element
   */
  function attachLookButtonListeners(container) {
    // Find all potential look buttons
    const lookButtons = container.querySelectorAll('.effect-item, .look-item, [data-effect-type="look"], [data-effect="look"]');
    
    lookButtons.forEach(button => {
      // Make sure we don't attach listeners twice
      if (!button.dataset.lookMonitored) {
        button.dataset.lookMonitored = 'true';
        
        button.addEventListener('click', () => {
          const lookName = extractLookNameFromButton(button);
          if (lookName) {
            console.log(`[LookAppliedMonitor] Look selected via monitored button: ${lookName}`);
            notifyLookApplied(lookName);
          }
        });
      }
    });
  }
  
  /**
   * Notify that a look has been applied
   * @param {string} lookName - Name of the applied look
   */
  function notifyLookApplied(lookName) {
    // Create and dispatch lookApplied event
    const event = new CustomEvent('lookApplied', {
      detail: {
        lookName: lookName,
        timestamp: Date.now()
      }
    });
    
    document.dispatchEvent(event);
  }
})();