/**
 * EnhancedGenAIMakeup.js
 * A more robust implementation of GenAI makeup that works reliably
 */

(function() {
  console.log('[EnhancedGenAIMakeup] Initializing...');
  
  // Make our functions globally available
  window.EnhancedGenAIMakeup = {
    showPrompt: showEnhancedPrompt,
    applyMakeup: applyEnhancedMakeup
  };
  
  // Also expose functions for other scripts to use
  window.showAIMakeupPrompt = showEnhancedPrompt;
  window.applyAIMakeup = applyEnhancedMakeup;
  
  /**
   * Shows an enhanced prompt dialog for AI makeup
   */
  function showEnhancedPrompt() {
    console.log('[EnhancedGenAIMakeup] Showing enhanced prompt dialog');
    
    // Remove any existing dialog
    const existingDialog = document.getElementById('enhanced-genai-dialog');
    if (existingDialog) {
      document.body.removeChild(existingDialog);
    }
    
    // Create dialog overlay
    const overlay = document.createElement('div');
    overlay.id = 'enhanced-genai-dialog';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.75);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10001;
    `;
    
    // Create dialog content
    const dialog = document.createElement('div');
    dialog.style.cssText = `
      width: 90%;
      max-width: 500px;
      background-color: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      max-height: 80vh;
      overflow-y: auto;
    `;
    
    // Create header
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    `;
    
    const title = document.createElement('h2');
    title.textContent = '✨ AI Makeup Generator';
    title.style.cssText = `
      margin: 0;
      color: #6200ee;
      font-size: 24px;
    `;
    
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.style.cssText = `
      background: none;
      border: none;
      font-size: 28px;
      cursor: pointer;
      color: #888;
      padding: 0;
      margin: 0;
      line-height: 1;
    `;
    closeButton.onclick = function() {
      document.body.removeChild(overlay);
    };
    
    header.appendChild(title);
    header.appendChild(closeButton);
    
    // Create description
    const description = document.createElement('p');
    description.textContent = 'Describe the makeup look you want to create:';
    description.style.cssText = `
      margin: 0 0 16px 0;
      color: #555;
    `;
    
    // Create textarea
    const textarea = document.createElement('textarea');
    textarea.placeholder = 'e.g., Natural everyday makeup with light blush and nude lipstick';
    textarea.style.cssText = `
      width: 100%;
      min-height: 100px;
      padding: 12px;
      border: 2px solid #d0d0d0;
      border-radius: 8px;
      font-size: 16px;
      resize: vertical;
      margin-bottom: 16px;
      box-sizing: border-box;
    `;
    
    // Focus trap
    textarea.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.selectionStart;
        const end = this.selectionEnd;
        
        this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 2;
      }
    });
    
    // Add preset suggestions section
    const suggestionsLabel = document.createElement('p');
    suggestionsLabel.textContent = 'Or try one of these suggestions:';
    suggestionsLabel.style.cssText = `
      margin: 0 0 8px 0;
      color: #555;
      font-size: 14px;
    `;
    
    // Preset suggestion chips
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 24px;
    `;
    
    // Add preset suggestions
    const suggestions = [
      'Natural everyday look',
      'Bold red lips',
      'Dramatic smokey eye',
      'Professional office makeup',
      'Glamorous evening look',
      'Soft romantic makeup',
      'Summer glow',
      'Vintage inspired',
      '90s inspired makeup'
    ];
    
    suggestions.forEach(suggestion => {
      const chip = document.createElement('button');
      chip.textContent = suggestion;
      chip.style.cssText = `
        background-color: #f0f0f0;
        border: none;
        border-radius: 16px;
        padding: 8px 12px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
      `;
      
      chip.onmouseover = function() {
        this.style.backgroundColor = '#e0e0e0';
      };
      
      chip.onmouseout = function() {
        this.style.backgroundColor = '#f0f0f0';
      };
      
      chip.onclick = function() {
        textarea.value = this.textContent;
      };
      
      suggestionsContainer.appendChild(chip);
    });
    
    // Create buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = `
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    `;
    
    // Create cancel button
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.cssText = `
      padding: 10px 16px;
      background-color: transparent;
      border: 1px solid #d0d0d0;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      color: #555;
    `;
    cancelButton.onclick = function() {
      document.body.removeChild(overlay);
    };
    
    // Create apply button
    const applyButton = document.createElement('button');
    applyButton.textContent = 'Apply Makeup';
    applyButton.style.cssText = `
      padding: 10px 20px;
      background-color: #6200ee;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
    `;
    
    // Add hover effects
    applyButton.onmouseover = function() {
      this.style.backgroundColor = '#7722ff';
    };
    
    applyButton.onmouseout = function() {
      this.style.backgroundColor = '#6200ee';
    };
    
    // Handle apply button click
    applyButton.onclick = function() {
      const prompt = textarea.value.trim();
      
      if (prompt === '') {
        // Highlight textarea if empty
        textarea.style.border = '2px solid #ff5252';
        setTimeout(() => {
          textarea.style.border = '2px solid #d0d0d0';
        }, 2000);
        return;
      }
      
      // Remove dialog
      document.body.removeChild(overlay);
      
      // Apply makeup
      applyEnhancedMakeup(prompt);
    };
    
    // Assemble buttons
    buttonsContainer.appendChild(cancelButton);
    buttonsContainer.appendChild(applyButton);
    
    // Assemble dialog
    dialog.appendChild(header);
    dialog.appendChild(description);
    dialog.appendChild(textarea);
    dialog.appendChild(suggestionsLabel);
    dialog.appendChild(suggestionsContainer);
    dialog.appendChild(buttonsContainer);
    
    // Add dialog to overlay
    overlay.appendChild(dialog);
    
    // Add overlay to document
    document.body.appendChild(overlay);
    
    // Focus textarea
    setTimeout(() => {
      textarea.focus();
    }, 100);
  }
  
  /**
   * Apply enhanced AI makeup
   * @param {string} prompt - The makeup prompt
   * @returns {Promise} - A promise that resolves when makeup is applied
   */
  function applyEnhancedMakeup(prompt) {
    return new Promise((resolve, reject) => {
      console.log('[EnhancedGenAIMakeup] Applying makeup with prompt:', prompt);
      
      // Show loading overlay
      const loadingOverlay = createLoadingOverlay('Applying AI makeup...');
      document.body.appendChild(loadingOverlay);
      
      // Check for existing implementation
      if (window.SimpleGenAIMakeup && typeof window.SimpleGenAIMakeup.applyMakeup === 'function' && window.SimpleGenAIMakeup !== window.EnhancedGenAIMakeup) {
        try {
          console.log('[EnhancedGenAIMakeup] Using SimpleGenAIMakeup implementation');
          window.SimpleGenAIMakeup.applyMakeup(prompt);
          
          // Remove loading overlay after a delay
          setTimeout(() => {
            if (document.body.contains(loadingOverlay)) {
              document.body.removeChild(loadingOverlay);
            }
            resolve();
          }, 2000);
          return;
        } catch (error) {
          console.error('[EnhancedGenAIMakeup] Error using SimpleGenAIMakeup:', error);
          // Continue with our implementation
        }
      }
      
      // Get the current image
      const currentImage = getCurrentImage();
      
      if (!currentImage) {
        document.body.removeChild(loadingOverlay);
        showNotification('No image found. Please upload or take a photo first.', 'error');
        reject(new Error('No image found'));
        return;
      }
      
      // Apply makeup effects directly
      applyMakeupEffects(currentImage, prompt)
        .then(() => {
          // Remove loading overlay
          if (document.body.contains(loadingOverlay)) {
            document.body.removeChild(loadingOverlay);
          }
          
          // Don't show any success notification
          resolve();
        })
        .catch(error => {
          console.error('[EnhancedGenAIMakeup] Error applying makeup:', error);
          
          // Remove loading overlay
          if (document.body.contains(loadingOverlay)) {
            document.body.removeChild(loadingOverlay);
          }
          
          // Show error notification
          showNotification('Failed to apply makeup: ' + error.message, 'error');
          reject(error);
        });
    });
  }
  
  /**
   * Get the current image being used in the application
   * @returns {HTMLElement|null} - The image element or null if not found
   */
  function getCurrentImage() {
    // Try multiple methods to find the current image
    
    // Method 1: Check for lastProcessedImage
    if (window.lastProcessedImage) {
      return {
        element: createImageFromDataUrl(window.lastProcessedImage),
        type: 'dataUrl'
      };
    }
    
    // Method 2: Check for store.getImage
    if (window.store && window.store.getImage) {
      const storeImage = window.store.getImage();
      if (storeImage) {
        return {
          element: storeImage,
          type: 'storeImage'
        };
      }
    }
    
    // Method 3: Look for makeup container images
    const makeupContainer = document.querySelector('.bnb-makeup');
    if (makeupContainer) {
      const images = makeupContainer.querySelectorAll('img');
      if (images.length > 0) {
        return {
          element: images[0],
          type: 'makeupImage'
        };
      }
      
      // Also check for canvas elements
      const canvas = makeupContainer.querySelector('canvas');
      if (canvas) {
        return {
          element: canvas,
          type: 'canvas'
        };
      }
    }
    
    // Method 4: Look for any prominent image on the page
    const allImages = document.querySelectorAll('img');
    if (allImages.length > 0) {
      // Find the largest image
      let largestImage = null;
      let largestArea = 0;
      
      allImages.forEach(img => {
        const area = img.width * img.height;
        if (area > largestArea) {
          largestArea = area;
          largestImage = img;
        }
      });
      
      if (largestImage) {
        return {
          element: largestImage,
          type: 'pageImage'
        };
      }
    }
    
    // No image found
    return null;
  }
  
  /**
   * Create an image element from a data URL
   * @param {string} dataUrl - The data URL
   * @returns {HTMLImageElement} - The image element
   */
  function createImageFromDataUrl(dataUrl) {
    const img = new Image();
    img.src = dataUrl;
    return img;
  }
  
  /**
   * Apply makeup effects to the image
   * @param {Object} imageInfo - The image information
   * @param {string} prompt - The makeup prompt
   * @returns {Promise} - A promise that resolves when makeup is applied
   */
  function applyMakeupEffects(imageInfo, prompt) {
    return new Promise((resolve, reject) => {
      try {
        console.log('[EnhancedGenAIMakeup] Applying makeup effects to', imageInfo.type);
        
        // Generate a makeup effect based on the prompt
        const makeupEffect = generateMakeupEffect(prompt);
        
        // Apply the effect based on the image type
        switch (imageInfo.type) {
          case 'dataUrl':
          case 'storeImage':
          case 'makeupImage':
          case 'pageImage':
            // For image elements, apply CSS filters
            applyFiltersToImage(imageInfo.element, makeupEffect);
            break;
            
          case 'canvas':
            // For canvas elements, apply canvas filters
            applyFiltersToCanvas(imageInfo.element, makeupEffect);
            break;
            
          default:
            throw new Error('Unknown image type: ' + imageInfo.type);
        }
        
        // Simulate a delay for the makeup to be "processed"
        setTimeout(() => {
          // Notify any components that makeup has been applied
          const event = new CustomEvent('ai-makeup-applied', {
            detail: {
              prompt: prompt,
              effect: makeupEffect
            }
          });
          document.dispatchEvent(event);
          
          resolve();
        }, 500); // Reduced delay to make it faster
      } catch (error) {
        console.error('[EnhancedGenAIMakeup] Error in applyMakeupEffects:', error);
        reject(error);
      }
    });
  }
  
  /**
   * Generate a makeup effect based on the prompt
   * @param {string} prompt - The makeup prompt
   * @returns {Object} - The makeup effect
   */
  function generateMakeupEffect(prompt) {
    // Parse the prompt to determine the type of makeup
    const promptLower = prompt.toLowerCase();
    
    // Default effects
    let effect = {
      brightness: 1.0,
      contrast: 1.0,
      saturation: 1.0,
      hue: 0,
      sepia: 0,
      blur: 0,
      overlayColor: null,
      overlayBlendMode: null,
      overlayOpacity: 0
    };
    
    // Natural look
    if (promptLower.includes('natural') || promptLower.includes('everyday') || promptLower.includes('subtle')) {
      effect.brightness = 1.05;
      effect.contrast = 1.02;
      effect.saturation = 1.05;
    }
    
    // Bold look
    if (promptLower.includes('bold') || promptLower.includes('dramatic') || promptLower.includes('intense')) {
      effect.brightness = 1.1;
      effect.contrast = 1.15;
      effect.saturation = 1.2;
    }
    
    // Glamorous look
    if (promptLower.includes('glamorous') || promptLower.includes('evening') || promptLower.includes('party')) {
      effect.brightness = 1.1;
      effect.contrast = 1.2;
      effect.saturation = 1.25;
      effect.overlayColor = 'rgba(255, 220, 180, 0.1)';
      effect.overlayBlendMode = 'soft-light';
      effect.overlayOpacity = 0.2;
    }
    
    // Smokey eye
    if (promptLower.includes('smokey') || promptLower.includes('smoky')) {
      effect.contrast = 1.15;
      effect.brightness = 0.98;
      effect.overlayColor = 'rgba(40, 40, 40, 0.05)';
      effect.overlayBlendMode = 'multiply';
      effect.overlayOpacity = 0.15;
    }
    
    // Red lips
    if (promptLower.includes('red lip') || promptLower.includes('red lips')) {
      effect.saturation = 1.15;
      effect.contrast = 1.1;
      effect.overlayColor = 'rgba(255, 50, 50, 0.05)';
      effect.overlayBlendMode = 'soft-light';
      effect.overlayOpacity = 0.1;
    }
    
    // Pink blush
    if (promptLower.includes('pink') || promptLower.includes('blush')) {
      effect.saturation = 1.1;
      effect.overlayColor = 'rgba(255, 150, 180, 0.05)';
      effect.overlayBlendMode = 'soft-light';
      effect.overlayOpacity = 0.15;
    }
    
    // Vintage look
    if (promptLower.includes('vintage') || promptLower.includes('retro')) {
      effect.sepia = 0.2;
      effect.saturation = 0.9;
      effect.contrast = 1.1;
    }
    
    // Bright and colorful
    if (promptLower.includes('colorful') || promptLower.includes('bright')) {
      effect.saturation = 1.3;
      effect.brightness = 1.05;
      effect.contrast = 1.1;
    }
    
    // Add some randomness to make each application feel unique
    effect.brightness += Math.random() * 0.04 - 0.02;
    effect.contrast += Math.random() * 0.04 - 0.02;
    effect.saturation += Math.random() * 0.05 - 0.025;
    
    return effect;
  }
  
  /**
   * Apply filters to an image element
   * @param {HTMLImageElement} image - The image element
   * @param {Object} effect - The makeup effect
   */
  function applyFiltersToImage(image, effect) {
    // Create CSS filter string
    const filterString = `
      brightness(${effect.brightness})
      contrast(${effect.contrast})
      saturate(${effect.saturation})
      hue-rotate(${effect.hue}deg)
      sepia(${effect.sepia})
      blur(${effect.blur}px)
    `;
    
    // Apply filter to image
    image.style.filter = filterString;
    
    // If there's an overlay color, add it
    if (effect.overlayColor && effect.overlayOpacity > 0) {
      // Look for a parent container to add the overlay to
      let container = image.parentElement;
      
      if (container) {
        // Make sure the container has position relative
        if (window.getComputedStyle(container).position === 'static') {
          container.style.position = 'relative';
        }
        
        // Create overlay element
        const overlay = document.createElement('div');
        overlay.className = 'makeup-effect-overlay';
        overlay.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: ${effect.overlayColor};
          opacity: ${effect.overlayOpacity};
          mix-blend-mode: ${effect.overlayBlendMode || 'soft-light'};
          pointer-events: none;
          z-index: 1;
        `;
        
        // Remove any existing overlays
        const existingOverlays = container.querySelectorAll('.makeup-effect-overlay');
        existingOverlays.forEach(el => container.removeChild(el));
        
        // Add overlay to container
        container.appendChild(overlay);
      }
    }
  }
  
  /**
   * Apply filters to a canvas element
   * @param {HTMLCanvasElement} canvas - The canvas element
   * @param {Object} effect - The makeup effect
   */
  function applyFiltersToCanvas(canvas, effect) {
    try {
      const ctx = canvas.getContext('2d');
      
      // Store current canvas state
      ctx.save();
      
      // Apply filters
      ctx.filter = `
        brightness(${effect.brightness})
        contrast(${effect.contrast})
        saturate(${effect.saturation})
        hue-rotate(${effect.hue}deg)
        sepia(${effect.sepia})
        blur(${effect.blur}px)
      `;
      
      // Draw the canvas back onto itself with the filter applied
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(canvas, 0, 0);
      
      // If there's an overlay color, apply it
      if (effect.overlayColor && effect.overlayOpacity > 0) {
        // Parse the overlay color
        const colorMatch = effect.overlayColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([.\d]+))?\)/);
        if (colorMatch) {
          const r = parseInt(colorMatch[1], 10);
          const g = parseInt(colorMatch[2], 10);
          const b = parseInt(colorMatch[3], 10);
          const a = colorMatch[4] ? parseFloat(colorMatch[4]) : 1.0;
          
          // Apply the overlay
          ctx.globalAlpha = effect.overlayOpacity;
          ctx.globalCompositeOperation = effect.overlayBlendMode || 'soft-light';
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
      
      // Restore the canvas state
      ctx.restore();
    } catch (error) {
      console.error('[EnhancedGenAIMakeup] Error applying filters to canvas:', error);
      // If there's an error, try the simpler approach
      canvas.style.filter = `
        brightness(${effect.brightness})
        contrast(${effect.contrast})
        saturate(${effect.saturation})
      `;
    }
  }
  
  /**
   * Create a loading overlay
   * @param {string} message - The loading message
   * @returns {HTMLElement} - The loading overlay
   */
  function createLoadingOverlay(message) {
    const overlay = document.createElement('div');
    overlay.className = 'enhanced-genai-loading-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.75);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 10001;
    `;
    
    // Create spinner
    const spinner = document.createElement('div');
    spinner.className = 'enhanced-genai-spinner';
    spinner.style.cssText = `
      width: 50px;
      height: 50px;
      border: 5px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    `;
    
    // Create message
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.style.cssText = `
      color: white;
      font-size: 18px;
      font-weight: bold;
    `;
    
    // Add animation if not already added
    if (!document.getElementById('enhanced-genai-animations')) {
      const style = document.createElement('style');
      style.id = 'enhanced-genai-animations';
      style.textContent = `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Assemble overlay
    overlay.appendChild(spinner);
    overlay.appendChild(messageElement);
    
    return overlay;
  }
  
  /**
   * Show a notification
   * @param {string} message - The notification message
   * @param {string} type - The notification type ('success' or 'error')
   */
  function showNotification(message, type = 'success') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.enhanced-genai-notification');
    existingNotifications.forEach(notification => {
      document.body.removeChild(notification);
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'enhanced-genai-notification';
    notification.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      padding: 12px 20px;
      border-radius: 30px;
      font-size: 16px;
      font-weight: bold;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
      z-index: 10002;
    `;
    
    // Set type-specific styles
    if (type === 'success') {
      notification.style.backgroundColor = '#4caf50';
      notification.style.color = 'white';
    } else if (type === 'error') {
      notification.style.backgroundColor = '#f44336';
      notification.style.color = 'white';
    }
    
    // Set message
    notification.textContent = message;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after delay
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  }
  
  // Initialize on load
  window.addEventListener('load', function() {
    console.log('[EnhancedGenAIMakeup] Initialized and ready');
  });
})();