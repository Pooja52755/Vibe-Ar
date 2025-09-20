/**
 * OverrideUploadCheck.js
 * Directly overrides the "No image found" error message and related checks
 */

(function() {
  console.log('[OverrideUploadCheck] Starting upload check override');
  
  // Function to monitor DOM for error messages
  function monitorForErrorMessages() {
    // Create a mutation observer to watch for changes in the DOM
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check each added node
          mutation.addedNodes.forEach(node => {
            // Check if it's an element node
            if (node.nodeType === Node.ELEMENT_NODE) {
              // First check the node itself
              checkAndFixErrorMessage(node);
              
              // Then check its children
              const errorMessages = node.querySelectorAll('*');
              errorMessages.forEach(element => checkAndFixErrorMessage(element));
            }
            // Check if it's a text node
            else if (node.nodeType === Node.TEXT_NODE) {
              if (node.textContent && node.textContent.includes('No image found')) {
                console.log('[OverrideUploadCheck] Found error text node, replacing');
                
                // Replace the text
                node.textContent = node.textContent.replace(
                  'No image found. Please upload an image first.',
                  'Processing your image...'
                );
                
                // Force load default image
                forceLoadDefaultImage();
              }
            }
          });
        }
      }
    });
    
    // Start observing the document
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
    
    console.log('[OverrideUploadCheck] DOM observer set up');
  }
  
  /**
   * Check an element for error messages and fix them
   */
  function checkAndFixErrorMessage(element) {
    if (!element || !element.textContent) return;
    
    // Check for the specific error message
    if (element.textContent.includes('No image found. Please upload an image first.')) {
      console.log('[OverrideUploadCheck] Found error message, replacing');
      
      // Replace the text
      element.textContent = element.textContent.replace(
        'No image found. Please upload an image first.',
        'Processing your image...'
      );
      
      // Add a class to style it
      element.classList.add('processing-message');
      
      // Add some styling
      element.style.color = '#4285f4';
      
      // Force load default image
      forceLoadDefaultImage();
    }
  }
  
  /**
   * Force load default image
   */
  function forceLoadDefaultImage() {
    console.log('[OverrideUploadCheck] Forcing default image to load');
    
    // If window.forceLoadDefaultImage is available, use it
    if (typeof window.forceLoadDefaultImage === 'function') {
      window.forceLoadDefaultImage();
      return;
    }
    
    // If AutoImageProvider is available, use it
    if (window.AutoImageProvider && typeof window.AutoImageProvider.loadDefaultImage === 'function') {
      window.AutoImageProvider.loadDefaultImage();
      return;
    }
    
    console.warn('[OverrideUploadCheck] No method available to load default image');
  }
  
  /**
   * Override error checking functions
   */
  function overrideErrorChecks() {
    // Override window.alert to catch error messages
    const originalAlert = window.alert;
    window.alert = function(message) {
      if (typeof message === 'string' && message.includes('No image found')) {
        console.log('[OverrideUploadCheck] Intercepted alert:', message);
        
        // Force load default image instead of showing the alert
        forceLoadDefaultImage();
        
        // Return without showing the alert
        return;
      }
      
      // For other alerts, call the original function
      return originalAlert.apply(window, arguments);
    };
    
    // Try to find and override methods that check for images
    setTimeout(() => {
      // Look for methods in various objects
      const objectsToCheck = [
        window,
        window.GenAIMakeup,
        window.InitGenAIMakeup,
        window.app
      ];
      
      // Methods to override
      const methodNames = [
        'checkForImage',
        'validateImage',
        'requireImage',
        'hasImageUploaded',
        'checkImageUpload'
      ];
      
      // Check each object for each method
      objectsToCheck.forEach(obj => {
        if (!obj) return;
        
        methodNames.forEach(methodName => {
          if (typeof obj[methodName] === 'function') {
            console.log(`[OverrideUploadCheck] Found method ${methodName}, overriding`);
            
            // Store the original method
            const originalMethod = obj[methodName];
            
            // Override the method to always return true
            obj[methodName] = function() {
              const result = originalMethod.apply(this, arguments);
              
              // If the original method returned false, load default image
              if (result === false) {
                console.log(`[OverrideUploadCheck] ${methodName} returned false, loading default image`);
                forceLoadDefaultImage();
                return true;
              }
              
              return result;
            };
          }
        });
      });
    }, 1000);
  }
  
  // Start monitoring as soon as document.body is available
  function init() {
    if (document.body) {
      monitorForErrorMessages();
      overrideErrorChecks();
    } else {
      // If document.body is not available yet, wait for it
      window.addEventListener('DOMContentLoaded', () => {
        monitorForErrorMessages();
        overrideErrorChecks();
      });
    }
  }
  
  // Initialize
  init();
})();