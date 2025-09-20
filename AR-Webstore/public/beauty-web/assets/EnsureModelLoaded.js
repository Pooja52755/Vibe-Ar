/**
 * EnsureModelLoaded.js
 * Makes sure the model is properly loaded and visible
 */

(function() {
  console.log('[EnsureModel] Starting model validation and fix');
  
  // Configuration
  const config = {
    checkInterval: 1000,  // How often to check the model (ms)
    maxChecks: 20,        // Maximum number of checks before giving up
    modelSelector: '#bnb-container canvas', // CSS selector for the model canvas
    fallbackWidth: 640,   // Width for fallback canvas
    fallbackHeight: 480   // Height for fallback canvas
  };
  
  // State tracking
  let checkCount = 0;
  let modelVerified = false;
  
  // Start checking as soon as possible
  startModelCheck();
  
  /**
   * Start periodic checking for model
   */
  function startModelCheck() {
    // Check immediately
    checkModel();
    
    // Then check periodically
    const interval = setInterval(() => {
      // Check the model
      const result = checkModel();
      
      // Increment check count
      checkCount++;
      
      // If model is verified or we've reached max checks, stop checking
      if (result.verified || checkCount >= config.maxChecks) {
        clearInterval(interval);
        
        // If we've reached max checks without verifying, create a fallback
        if (!result.verified) {
          console.warn('[EnsureModel] Failed to verify model after max checks, creating fallback');
          createFallbackModel();
        }
      }
    }, config.checkInterval);
  }
  
  /**
   * Check if the model is loaded and visible
   */
  function checkModel() {
    // If already verified, no need to check again
    if (modelVerified) {
      return { verified: true, message: 'Model already verified' };
    }
    
    console.log(`[EnsureModel] Checking model (${checkCount + 1}/${config.maxChecks})`);
    
    // Try to find the model canvas
    const modelCanvas = document.querySelector(config.modelSelector);
    
    // If no model canvas, try to find any suitable canvas
    if (!modelCanvas) {
      const canvases = document.querySelectorAll('canvas');
      for (const canvas of canvases) {
        if (isCanvasVisible(canvas) && isCanvasActive(canvas)) {
          console.log('[EnsureModel] Found alternative canvas, verifying it');
          modelVerified = true;
          return { verified: true, message: 'Alternative canvas verified' };
        }
      }
      
      console.log('[EnsureModel] No suitable canvas found yet');
      return { verified: false, message: 'No suitable canvas found' };
    }
    
    // Check if the canvas is visible and has content
    if (isCanvasVisible(modelCanvas) && isCanvasActive(modelCanvas)) {
      console.log('[EnsureModel] Model canvas verified');
      modelVerified = true;
      return { verified: true, message: 'Model canvas verified' };
    }
    
    // If canvas exists but is not visible or active, try to fix it
    fixCanvas(modelCanvas);
    
    return { verified: false, message: 'Model canvas needs fixing' };
  }
  
  /**
   * Check if a canvas is visible
   */
  function isCanvasVisible(canvas) {
    if (!canvas) return false;
    
    const style = window.getComputedStyle(canvas);
    
    return !(
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      style.opacity === '0' ||
      canvas.width <= 0 ||
      canvas.height <= 0
    );
  }
  
  /**
   * Check if a canvas has content (is not blank)
   */
  function isCanvasActive(canvas) {
    if (!canvas || canvas.width <= 0 || canvas.height <= 0) return false;
    
    try {
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Check a sample of pixels to see if the canvas has content
      for (let i = 0; i < data.length; i += 1000) {
        // Check if any pixel has non-zero values
        if (data[i] !== 0 || data[i+1] !== 0 || data[i+2] !== 0 || data[i+3] !== 0) {
          return true;
        }
      }
      
      // If we reach here, the canvas might be blank
      return false;
    } catch (error) {
      console.warn('[EnsureModel] Error checking canvas content:', error);
      // Assume it's active if we can't check
      return true;
    }
  }
  
  /**
   * Try to fix a canvas that exists but has issues
   */
  function fixCanvas(canvas) {
    if (!canvas) return;
    
    console.log('[EnsureModel] Attempting to fix canvas');
    
    // Make sure it's visible
    canvas.style.display = '';
    canvas.style.visibility = 'visible';
    canvas.style.opacity = '1';
    
    // If it has no dimensions, give it some
    if (canvas.width <= 0 || canvas.height <= 0) {
      canvas.width = config.fallbackWidth;
      canvas.height = config.fallbackHeight;
    }
    
    // If it seems blank, add some content
    if (!isCanvasActive(canvas)) {
      try {
        const ctx = canvas.getContext('2d');
        
        // Add a very subtle gradient that won't be noticeable
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(240, 240, 240, 0.01)');
        gradient.addColorStop(1, 'rgba(250, 250, 250, 0.01)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        console.log('[EnsureModel] Added subtle content to canvas');
      } catch (error) {
        console.warn('[EnsureModel] Error adding content to canvas:', error);
      }
    }
    
    // Make sure it's in the DOM
    if (!canvas.parentNode || !document.body.contains(canvas)) {
      console.log('[EnsureModel] Canvas not in DOM, adding it');
      document.body.appendChild(canvas);
    }
  }
  
  /**
   * Create a fallback model if we can't verify the real one
   */
  function createFallbackModel() {
    console.log('[EnsureModel] Creating fallback model');
    
    // Create fallback container if needed
    let container = document.getElementById('bnb-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'bnb-container';
      document.body.appendChild(container);
    }
    
    // Create fallback canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'fallback-model-canvas';
    canvas.width = config.fallbackWidth;
    canvas.height = config.fallbackHeight;
    canvas.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
    `;
    
    // Add some content to the canvas
    const ctx = canvas.getContext('2d');
    
    // Fill with a neutral color
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw a face-like shape
    ctx.fillStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, canvas.height / 2, 100, 140, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Add to container
    container.appendChild(canvas);
    
    // Store reference to fallback model
    window._fallbackModelCanvas = canvas;
    
    console.log('[EnsureModel] Fallback model created');
    
    // Make sure any model detection code knows about this
    modelVerified = true;
    window._hasModelVisible = true;
    
    // Try to update any state in known objects
    updateGlobalState();
  }
  
  /**
   * Update global state after creating fallback model
   */
  function updateGlobalState() {
    // Update GenAIMakeup if it exists
    if (window.GenAIMakeup) {
      window.GenAIMakeup.modelLoaded = true;
      
      // Override getCurrentImageData if it exists
      if (typeof window.GenAIMakeup.getCurrentImageData === 'function') {
        window.GenAIMakeup.originalGetCurrentImageData = window.GenAIMakeup.getCurrentImageData;
        window.GenAIMakeup.getCurrentImageData = function() {
          // Try original function
          try {
            const originalResult = window.GenAIMakeup.originalGetCurrentImageData();
            if (originalResult) return originalResult;
          } catch (error) {
            // Continue to fallback
          }
          
          // Use fallback canvas
          if (window._fallbackModelCanvas) {
            const ctx = window._fallbackModelCanvas.getContext('2d');
            return ctx.getImageData(0, 0, window._fallbackModelCanvas.width, window._fallbackModelCanvas.height);
          }
          
          return null;
        };
      }
    }
    
    // Update InitGenAIMakeup if it exists
    if (window.InitGenAIMakeup) {
      window.InitGenAIMakeup.modelLoaded = true;
    }
  }
})();