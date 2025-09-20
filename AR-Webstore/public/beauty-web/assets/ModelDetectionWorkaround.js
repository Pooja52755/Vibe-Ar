/**
 * ModelDetectionWorkaround.js
 * Provides workarounds for model detection issues in the Beauty Web app
 */

(function() {
  console.log('[ModelDetection] Initializing model detection workaround');
  
  // Wait for DOM to be loaded
  window.addEventListener('DOMContentLoaded', initWorkaround);
  window.addEventListener('load', initWorkaround);
  
  // For immediate execution
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initWorkaround, 100);
  }
  
  // Track initialization
  let isInitialized = false;
  let checkInterval = null;
  
  /**
   * Initialize the workaround
   */
  function initWorkaround() {
    if (isInitialized) return;
    isInitialized = true;
    
    console.log('[ModelDetection] Setting up model detection workaround');
    
    // If we don't have the app yet, wait for it
    if (!window.app) {
      waitForApp();
      return;
    }
    
    applyWorkarounds();
  }
  
  /**
   * Wait for the app to be available
   */
  function waitForApp() {
    console.log('[ModelDetection] Waiting for app to be available');
    
    let attempts = 0;
    const maxAttempts = 20;
    
    const waitInterval = setInterval(() => {
      attempts++;
      
      if (window.app) {
        clearInterval(waitInterval);
        console.log('[ModelDetection] App found, applying workarounds');
        applyWorkarounds();
      } else if (attempts >= maxAttempts) {
        clearInterval(waitInterval);
        console.warn('[ModelDetection] App not found after maximum attempts, will try another approach');
        findAndFixModelElements();
      }
    }, 500);
  }
  
  /**
   * Apply workarounds to fix model detection
   */
  function applyWorkarounds() {
    // Start periodic checking for model visibility
    startModelDetectionCheck();
    
    // Fix the model related functions
    patchAppFunctions();
    
    // Find and make model elements visible
    findAndFixModelElements();
    
    // Create fallback model if needed
    createFallbackModelIfNeeded();
  }
  
  /**
   * Start periodic checking for model visibility
   */
  function startModelDetectionCheck() {
    if (checkInterval) clearInterval(checkInterval);
    
    checkInterval = setInterval(() => {
      // Check if we can find a visible model
      const modelFound = isModelVisible();
      
      // Update global state
      window._hasModelVisible = modelFound;
      
      // Log status (only on change)
      if (window._previousModelState !== modelFound) {
        console.log(`[ModelDetection] Model visibility changed: ${modelFound ? 'visible' : 'not visible'}`);
        window._previousModelState = modelFound;
      }
      
      // If model is not visible, try to fix it
      if (!modelFound) {
        findAndFixModelElements();
      }
    }, 2000);
  }
  
  /**
   * Patch app functions to fix model detection
   */
  function patchAppFunctions() {
    if (!window.app) return;
    
    // Store original functions
    const originalGetCurrentImageData = window.app.getCurrentImageData;
    
    // Override getCurrentImageData
    if (typeof originalGetCurrentImageData === 'function') {
      window.app.getCurrentImageData = function() {
        console.log('[ModelDetection] Enhanced app.getCurrentImageData called');
        
        try {
          // Try original function
          const originalData = originalGetCurrentImageData.apply(this, arguments);
          if (originalData) return originalData;
        } catch (error) {
          console.warn('[ModelDetection] Original app.getCurrentImageData failed:', error);
        }
        
        // If we reach here, the original function failed or returned no data
        // Try to get data directly from model elements
        return getModelImageData();
      };
    }
    
    // If the app has a face tracker, enhance it
    if (window.app && window.app.faceTracker) {
      const originalTrackFaces = window.app.faceTracker.trackFaces;
      
      if (typeof originalTrackFaces === 'function') {
        window.app.faceTracker.trackFaces = function(imageData, ...args) {
          console.log('[ModelDetection] Enhanced faceTracker.trackFaces called');
          
          // If no image data provided, try to get it
          if (!imageData) {
            imageData = getModelImageData();
            if (!imageData) {
              console.warn('[ModelDetection] No image data available for face tracking');
              return [];
            }
          }
          
          try {
            // Try original function
            const result = originalTrackFaces.call(this, imageData, ...args);
            return result;
          } catch (error) {
            console.warn('[ModelDetection] Original faceTracker.trackFaces failed:', error);
            return [];
          }
        };
      }
    }
  }
  
  /**
   * Check if the model is visible
   */
  function isModelVisible() {
    // Try to find model elements
    const modelElements = findModelElements();
    
    // Check if any model element is visible
    for (const element of modelElements) {
      if (isElementVisible(element)) {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Find elements that could be the model
   */
  function findModelElements() {
    const elements = [];
    
    // Canvas elements (likely model rendering)
    document.querySelectorAll('canvas').forEach(canvas => {
      if (canvas.width > 100 && canvas.height > 100) {
        elements.push(canvas);
      }
    });
    
    // Video elements (could be webcam feed or video source)
    document.querySelectorAll('video').forEach(video => {
      if (video.videoWidth > 100 && video.videoHeight > 100) {
        elements.push(video);
      }
    });
    
    // Main model container (if it exists)
    const modelContainer = document.getElementById('bnb-container');
    if (modelContainer) {
      elements.push(modelContainer);
    }
    
    return elements;
  }
  
  /**
   * Check if an element is visible
   */
  function isElementVisible(element) {
    if (!element) return false;
    
    const style = window.getComputedStyle(element);
    
    return !(
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      style.opacity === '0' ||
      element.offsetParent === null
    );
  }
  
  /**
   * Find model elements and fix visibility issues
   */
  function findAndFixModelElements() {
    console.log('[ModelDetection] Searching for model elements to fix');
    
    // Find the elements
    const modelElements = findModelElements();
    
    // Check if any model element needs fixing
    let fixedCount = 0;
    
    for (const element of modelElements) {
      if (!isElementVisible(element)) {
        fixElementVisibility(element);
        fixedCount++;
      }
    }
    
    if (fixedCount > 0) {
      console.log(`[ModelDetection] Fixed visibility for ${fixedCount} model elements`);
    }
  }
  
  /**
   * Fix visibility issues for an element
   */
  function fixElementVisibility(element) {
    if (!element) return;
    
    // Make sure element is visible
    element.style.display = '';
    element.style.visibility = 'visible';
    element.style.opacity = '1';
    
    // If it's a canvas, try to ensure it has content
    if (element.nodeName.toLowerCase() === 'canvas' && element.width > 0 && element.height > 0) {
      try {
        const ctx = element.getContext('2d');
        
        // Check if canvas is blank
        const imageData = ctx.getImageData(0, 0, element.width, element.height);
        const data = imageData.data;
        let isBlank = true;
        
        // Check a sample of pixels to see if the canvas is blank
        for (let i = 0; i < data.length; i += 40) {
          if (data[i+3] > 0) { // Check alpha channel
            isBlank = false;
            break;
          }
        }
        
        // If canvas is blank, add something to it
        if (isBlank) {
          // Just add a subtle gradient to make it non-blank
          const gradient = ctx.createLinearGradient(0, 0, element.width, element.height);
          gradient.addColorStop(0, 'rgba(240, 240, 240, 0.01)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0.01)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, element.width, element.height);
        }
      } catch (error) {
        console.warn('[ModelDetection] Error fixing canvas content:', error);
      }
    }
  }
  
  /**
   * Get image data from model elements
   */
  function getModelImageData() {
    // Find model elements
    const modelElements = findModelElements();
    
    // Try to get image data from each element
    for (const element of modelElements) {
      if (element.nodeName.toLowerCase() === 'canvas') {
        try {
          const ctx = element.getContext('2d');
          const imageData = ctx.getImageData(0, 0, element.width, element.height);
          if (imageData && imageData.data && imageData.data.length > 0) {
            return imageData;
          }
        } catch (error) {
          // Continue to next element
        }
      } else if (element.nodeName.toLowerCase() === 'video') {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = element.videoWidth;
          canvas.height = element.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(element, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          if (imageData && imageData.data && imageData.data.length > 0) {
            return imageData;
          }
        } catch (error) {
          // Continue to next element
        }
      }
    }
    
    // If we reach here, no valid image data was found
    return null;
  }
  
  /**
   * Create a fallback model if needed
   */
  function createFallbackModelIfNeeded() {
    // Check if we already have model elements
    const modelElements = findModelElements();
    if (modelElements.length > 0) {
      return; // No need to create fallback
    }
    
    console.log('[ModelDetection] No model elements found, creating fallback model');
    
    // Create a fallback canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'fallback-model-canvas';
    canvas.width = 640;
    canvas.height = 480;
    canvas.style.cssText = `
      position: absolute;
      top: -9999px;
      left: -9999px;
      z-index: -1;
    `;
    
    // Add some content to the canvas
    const ctx = canvas.getContext('2d');
    
    // Fill with a neutral color
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw a face-like shape
    ctx.fillStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, canvas.height / 2, 100, 140, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Add to document
    document.body.appendChild(canvas);
    
    // Store reference to fallback model
    window._fallbackModel = canvas;
    
    console.log('[ModelDetection] Fallback model created');
  }
})();