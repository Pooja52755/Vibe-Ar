/**
 * AutoImageProvider.js
 * Automatically provides a default image for the AI makeup when no image is uploaded
 */

(function() {
  console.log('[AutoImageProvider] Starting auto image provider');
  
  // Wait for DOM to be loaded
  document.addEventListener('DOMContentLoaded', initialize);
  window.addEventListener('load', initialize);
  
  // For immediate execution
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initialize, 100);
  }
  
  // Track initialization
  let isInitialized = false;
  let defaultImageLoaded = false;
  
  /**
   * Initialize the auto image provider
   */
  function initialize() {
    if (isInitialized) return;
    isInitialized = true;
    
    console.log('[AutoImageProvider] Initializing auto image provider');
    
    // Set up event listeners for upload buttons
    setupUploadButtonEvents();
    
    // Start checking for image presence
    checkForImageAndLoadIfNeeded();
    
    // Add a global helper
    window.AutoImageProvider = {
      loadDefaultImage,
      isDefaultImageLoaded: () => defaultImageLoaded
    };
  }
  
  /**
   * Set up event listeners for upload buttons
   */
  function setupUploadButtonEvents() {
    // We'll check periodically for upload buttons
    const interval = setInterval(() => {
      const uploadButtons = document.querySelectorAll('button');
      
      let foundButton = false;
      
      // Look for upload buttons
      uploadButtons.forEach(button => {
        const buttonText = button.textContent || button.innerText || '';
        if (buttonText.toLowerCase().includes('upload') || 
            button.className.toLowerCase().includes('upload') ||
            button.id.toLowerCase().includes('upload')) {
          
          foundButton = true;
          
          // Add our event listener if not already added
          if (!button.dataset.autoImageHandlerAdded) {
            button.dataset.autoImageHandlerAdded = 'true';
            
            // Listen for clicks
            button.addEventListener('click', () => {
              console.log('[AutoImageProvider] Upload button clicked');
              
              // Give the upload process time to complete
              setTimeout(() => {
                // Check if we need to load default image
                checkForImageAndLoadIfNeeded();
              }, 3000);
            });
            
            console.log('[AutoImageProvider] Added handler to upload button:', buttonText);
          }
        }
      });
      
      // If we found buttons, stop checking
      if (foundButton) {
        clearInterval(interval);
      }
    }, 1000);
  }
  
  /**
   * Check if an image is present, and load a default one if not
   */
  function checkForImageAndLoadIfNeeded() {
    console.log('[AutoImageProvider] Checking for image presence');
    
    // First check if there's already an image
    if (isImagePresent()) {
      console.log('[AutoImageProvider] Image already present, no need to load default');
      return;
    }
    
    // Wait a bit to make sure the app is fully loaded
    setTimeout(() => {
      // Check again before loading
      if (!isImagePresent()) {
        console.log('[AutoImageProvider] No image found, loading default image');
        loadDefaultImage();
      }
    }, 2000);
  }
  
  /**
   * Check if an image is already present
   */
  function isImagePresent() {
    // Check various ways to detect an image
    
    // 1. Look for canvas elements with content
    const canvases = document.querySelectorAll('canvas');
    for (const canvas of canvases) {
      if (canvas.width > 100 && canvas.height > 100) {
        try {
          const ctx = canvas.getContext('2d');
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Check if the canvas has non-empty content
          let hasContent = false;
          for (let i = 3; i < data.length; i += 4) {
            if (data[i] > 0) { // Check alpha channel
              hasContent = true;
              break;
            }
          }
          
          if (hasContent) {
            return true;
          }
        } catch (e) {
          // Ignore errors and continue checking
        }
      }
    }
    
    // 2. Check if there's a video element playing
    const videos = document.querySelectorAll('video');
    for (const video of videos) {
      if (!video.paused && video.videoWidth > 0 && video.videoHeight > 0) {
        return true;
      }
    }
    
    // 3. Check for app-specific image indicators
    if (window.GenAIMakeup && window.GenAIMakeup.hasImage) {
      return true;
    }
    
    // 4. Check our global indicator
    if (window._hasValidImageData) {
      return true;
    }
    
    // 5. Look for image elements
    const images = document.querySelectorAll('img');
    for (const img of images) {
      if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0 && isElementVisible(img)) {
        // Only count visible images that aren't icons/UI elements
        if (img.width > 100 && img.height > 100) {
          return true;
        }
      }
    }
    
    // If we reach here, no image was found
    return false;
  }
  
  /**
   * Load a default image into the app
   */
  function loadDefaultImage() {
    console.log('[AutoImageProvider] Loading default image');
    
    // Create default image element
    const defaultImage = new Image();
    defaultImage.crossOrigin = 'anonymous';
    
    // When the image loads, add it to the canvas
    defaultImage.onload = () => {
      console.log('[AutoImageProvider] Default image loaded successfully');
      
      // Try multiple methods to add the image to the app
      
      // 1. Try to find any upload input elements
      const fileInputs = document.querySelectorAll('input[type="file"]');
      let uploadHandled = false;
      
      for (const input of fileInputs) {
        try {
          // Try to create a File object
          const imgBlob = createBlobFromImage(defaultImage);
          if (imgBlob) {
            // Create a File object
            const imgFile = new File([imgBlob], 'default_model.jpg', { type: 'image/jpeg' });
            
            // Create a FileList-like object
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(imgFile);
            
            // Set the file input's files
            input.files = dataTransfer.files;
            
            // Trigger change event
            const event = new Event('change', { bubbles: true });
            input.dispatchEvent(event);
            
            console.log('[AutoImageProvider] Triggered file input with default image');
            uploadHandled = true;
            break;
          }
        } catch (e) {
          console.warn('[AutoImageProvider] Failed to set file input:', e);
        }
      }
      
      // 2. If no upload was handled, try to find the canvas and draw on it directly
      if (!uploadHandled) {
        const canvases = document.querySelectorAll('canvas');
        for (const canvas of canvases) {
          if (canvas.width > 100 && canvas.height > 100) {
            try {
              const ctx = canvas.getContext('2d');
              
              // Draw the image centered on the canvas
              const scale = Math.min(canvas.width / defaultImage.width, canvas.height / defaultImage.height);
              const x = (canvas.width - defaultImage.width * scale) / 2;
              const y = (canvas.height - defaultImage.height * scale) / 2;
              
              // Clear the canvas first
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              
              // Draw the image
              ctx.drawImage(defaultImage, x, y, defaultImage.width * scale, defaultImage.height * scale);
              
              console.log('[AutoImageProvider] Drew default image on canvas');
              uploadHandled = true;
              
              // Trigger a fake resize event to make sure the app updates
              window.dispatchEvent(new Event('resize'));
              break;
            } catch (e) {
              console.warn('[AutoImageProvider] Failed to draw on canvas:', e);
            }
          }
        }
      }
      
      // 3. If still no upload was handled, create a new image element and add it to the DOM
      if (!uploadHandled) {
        const container = document.createElement('div');
        container.id = 'default-image-container';
        container.style.cssText = `
          position: absolute;
          top: -9999px;
          left: -9999px;
          width: 1px;
          height: 1px;
          overflow: hidden;
        `;
        
        // Copy the default image into a new element
        const imgElement = new Image();
        imgElement.id = 'default-source-image';
        imgElement.crossOrigin = 'anonymous';
        imgElement.src = defaultImage.src;
        imgElement.width = defaultImage.width;
        imgElement.height = defaultImage.height;
        
        // Add to the container
        container.appendChild(imgElement);
        
        // Add to the DOM
        document.body.appendChild(container);
        
        console.log('[AutoImageProvider] Added hidden default image to DOM');
      }
      
      // Update state
      defaultImageLoaded = true;
      window._hasValidImageData = true;
      
      // Trigger any app-specific updates
      updateAppState();
    };
    
    // Handle load errors
    defaultImage.onerror = (error) => {
      console.error('[AutoImageProvider] Failed to load default image:', error);
      
      // Try with a different image
      tryAlternateImage();
    };
    
    // Set the source - use a model face image that's commonly available
    defaultImage.src = getDefaultImageUrl();
  }
  
  /**
   * Get the URL for the default image
   */
  function getDefaultImageUrl() {
    // Check if we have any model images in the app
    const modelImages = [
      './assets/looks/model.png',
      './assets/model.jpg',
      './assets/model.png',
      './assets/default_model.jpg'
    ];
    
    // Try to find one of these images
    for (const src of modelImages) {
      const img = document.querySelector(`img[src="${src}"]`);
      if (img && img.complete && img.naturalWidth > 0) {
        return src;
      }
    }
    
    // Default to a hard-coded data URI of a simple face shape
    // This is a very small, neutral gray image with face-like oval
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QBoRXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAAExAAIAAAARAAAATgAAAAAAAABgAAAAAQAAAGAAAAABcGFpbnQubmV0IDQuMi4xNQAA/9sAQwACAQECAQECAgICAgICAgMFAwMDAwMGBAQDBQcGBwcHBgcHCAkLCQgICggHBwoNCgoLDAwMDAcJDg8NDA4LDAwM/9sAQwECAgIDAwMGAwMGDAgHCAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgAgACAAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/9k=';
  }
  
  /**
   * Try an alternate image if the first one fails
   */
  function tryAlternateImage() {
    // Create a simple canvas-based image
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    
    const ctx = canvas.getContext('2d');
    
    // Fill with skin tone background
    ctx.fillStyle = '#F5D5C4';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw a face-like oval
    ctx.fillStyle = '#F0C9B4';
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, canvas.height / 2, 150, 200, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/jpeg');
    
    // Create new image
    const img = new Image();
    img.onload = () => {
      // Find canvases and draw this image
      const canvases = document.querySelectorAll('canvas');
      let handled = false;
      
      for (const canvas of canvases) {
        if (canvas.width > 100 && canvas.height > 100) {
          try {
            const ctx = canvas.getContext('2d');
            
            // Draw the image centered
            const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width - img.width * scale) / 2;
            const y = (canvas.height - img.height * scale) / 2;
            
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            handled = true;
            
            console.log('[AutoImageProvider] Drew alternate image on canvas');
            break;
          } catch (e) {
            console.warn('[AutoImageProvider] Failed to draw alternate image:', e);
          }
        }
      }
      
      // If we couldn't draw on a canvas, add to DOM
      if (!handled) {
        const container = document.createElement('div');
        container.id = 'alternate-image-container';
        container.style.cssText = `
          position: absolute;
          top: -9999px;
          left: -9999px;
          width: 1px;
          height: 1px;
          overflow: hidden;
        `;
        
        img.id = 'alternate-source-image';
        container.appendChild(img);
        document.body.appendChild(container);
        
        console.log('[AutoImageProvider] Added hidden alternate image to DOM');
      }
      
      // Update state
      defaultImageLoaded = true;
      window._hasValidImageData = true;
      
      // Trigger any app-specific updates
      updateAppState();
    };
    
    img.src = dataUrl;
  }
  
  /**
   * Create a blob from an image element
   */
  function createBlobFromImage(imgElement) {
    try {
      // Create a canvas to draw the image
      const canvas = document.createElement('canvas');
      canvas.width = imgElement.width || imgElement.naturalWidth;
      canvas.height = imgElement.height || imgElement.naturalHeight;
      
      // Draw the image to the canvas
      const ctx = canvas.getContext('2d');
      ctx.drawImage(imgElement, 0, 0);
      
      // Convert the canvas to a blob
      return new Promise(resolve => {
        canvas.toBlob(blob => {
          resolve(blob);
        }, 'image/jpeg', 0.95);
      });
    } catch (e) {
      console.warn('[AutoImageProvider] Failed to create blob from image:', e);
      return null;
    }
  }
  
  /**
   * Update app state after loading default image
   */
  function updateAppState() {
    // Update GenAIMakeup if it exists
    if (window.GenAIMakeup) {
      window.GenAIMakeup.hasImage = true;
      
      // If there's a function to check for image, override it
      if (typeof window.GenAIMakeup.checkForImage === 'function') {
        const originalCheckForImage = window.GenAIMakeup.checkForImage;
        window.GenAIMakeup.checkForImage = function() {
          return defaultImageLoaded || originalCheckForImage();
        };
      }
    }
    
    // Update InitGenAIMakeup if it exists
    if (window.InitGenAIMakeup) {
      window.InitGenAIMakeup.hasImage = true;
      
      // If there's a function to check for image, override it
      if (typeof window.InitGenAIMakeup.checkForImage === 'function') {
        const originalCheckForImage = window.InitGenAIMakeup.checkForImage;
        window.InitGenAIMakeup.checkForImage = function() {
          return defaultImageLoaded || originalCheckForImage();
        };
      }
    }
    
    // Trigger a resize event to update any UI
    window.dispatchEvent(new Event('resize'));
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
})();