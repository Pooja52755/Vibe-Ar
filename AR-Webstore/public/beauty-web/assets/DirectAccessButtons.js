/**
 * DirectAccessButtons.js
 * 
 * This script adds reliable, always-visible buttons for taking photos and
 * uploading images.
 */

(function() {
  console.log('[DirectAccessButtons] Initializing...');
  
  // Add buttons when DOM is ready
  document.addEventListener('DOMContentLoaded', addDirectAccessButtons);
  
  // Also try when window loads
  window.addEventListener('load', addDirectAccessButtons);
  
  // For immediate execution if already loaded
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    addDirectAccessButtons();
  }
  
  /**
   * Add direct access buttons to the page
   */
  function addDirectAccessButtons() {
    // Only add once
    if (document.getElementById('direct-access-container')) {
      return;
    }
    
    console.log('[DirectAccessButtons] Adding direct access buttons');
    
    // Create container
    const container = document.createElement('div');
    container.id = 'direct-access-container';
    container.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 9999;
      pointer-events: none;
    `;
    
    // Create take photo button
    const takePhotoButton = createButton('📷', '#2196F3', 'Take Photo');
    takePhotoButton.onclick = handleTakePhoto;
    takePhotoButton.style.pointerEvents = 'auto';
    
    // Create upload button
    const uploadButton = createButton('📁', '#4CAF50', 'Upload Image');
    uploadButton.onclick = handleUploadImage;
    uploadButton.style.pointerEvents = 'auto';
    
    // Create hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'direct-access-file-input';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', handleFileSelected);
    
    // Add elements to container
    container.appendChild(takePhotoButton);
    container.appendChild(uploadButton);
    container.appendChild(fileInput);
    
    // Add container to document
    document.body.appendChild(container);
    
    // Add styles
    addStyles();
    
    console.log('[DirectAccessButtons] Direct access buttons added');
  }
  
  /**
   * Create a button
   * @param {string} icon - The button icon
   * @param {string} color - The button color
   * @param {string} tooltip - The tooltip text
   * @returns {HTMLElement} - The button element
   */
  function createButton(icon, color, tooltip) {
    const button = document.createElement('button');
    button.className = 'direct-access-button';
    button.innerHTML = icon;
    button.title = tooltip;
    button.setAttribute('aria-label', tooltip);
    button.style.cssText = `
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-color: ${color};
      border: none;
      color: white;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
      position: relative;
    `;
    
    // Add tooltip
    const tooltipElement = document.createElement('span');
    tooltipElement.className = 'direct-access-tooltip';
    tooltipElement.textContent = tooltip;
    tooltipElement.style.cssText = `
      position: absolute;
      left: 70px;
      top: 50%;
      transform: translateY(-50%);
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 14px;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
    `;
    
    button.appendChild(tooltipElement);
    
    // Show tooltip on hover
    button.addEventListener('mouseenter', function() {
      tooltipElement.style.opacity = '1';
    });
    
    button.addEventListener('mouseleave', function() {
      tooltipElement.style.opacity = '0';
    });
    
    return button;
  }
  
  /**
   * Add styles
   */
  function addStyles() {
    // Only add once
    if (document.getElementById('direct-access-styles')) {
      return;
    }
    
    // Create style element
    const style = document.createElement('style');
    style.id = 'direct-access-styles';
    style.textContent = `
      .direct-access-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
      }
      
      .direct-access-button:active {
        transform: scale(0.95);
      }
      
      @keyframes pulse {
        0% { transform: scale(1); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); }
        50% { transform: scale(1.05); box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); }
        100% { transform: scale(1); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); }
      }
      
      .pulse-animation {
        animation: pulse 1.5s infinite;
      }
    `;
    
    // Add to document
    document.head.appendChild(style);
  }
  
  /**
   * Handle take photo
   */
  function handleTakePhoto() {
    console.log('[DirectAccessButtons] Take photo clicked');
    
    // Show toast message
    showToast('Opening camera...');
    
    // Check if camera is supported
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Create camera UI
      const cameraContainer = document.createElement('div');
      cameraContainer.className = 'direct-access-camera-container';
      cameraContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      `;
      
      // Create video element
      const video = document.createElement('video');
      video.autoplay = true;
      video.style.cssText = `
        max-width: 100%;
        max-height: 70%;
        border-radius: 8px;
        border: 2px solid white;
      `;
      
      // Create buttons container
      const buttonsContainer = document.createElement('div');
      buttonsContainer.style.cssText = `
        display: flex;
        gap: 20px;
        margin-top: 20px;
      `;
      
      // Create capture button
      const captureButton = document.createElement('button');
      captureButton.innerHTML = '📸 Capture';
      captureButton.style.cssText = `
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 30px;
        padding: 12px 24px;
        font-size: 18px;
        cursor: pointer;
      `;
      
      // Create close button
      const closeButton = document.createElement('button');
      closeButton.innerHTML = '✖ Close';
      closeButton.style.cssText = `
        background-color: #F44336;
        color: white;
        border: none;
        border-radius: 30px;
        padding: 12px 24px;
        font-size: 18px;
        cursor: pointer;
      `;
      
      // Add buttons to container
      buttonsContainer.appendChild(captureButton);
      buttonsContainer.appendChild(closeButton);
      
      // Add elements to camera container
      cameraContainer.appendChild(video);
      cameraContainer.appendChild(buttonsContainer);
      
      // Add container to document
      document.body.appendChild(cameraContainer);
      
      // Access camera
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
          video.srcObject = stream;
          
          // Handle capture button click
          captureButton.addEventListener('click', function() {
            // Create canvas for capturing
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // Draw video frame to canvas
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Get image data
            const imageData = canvas.toDataURL('image/png');
            
            // Stop camera stream
            stream.getTracks().forEach(track => track.stop());
            
            // Remove camera UI
            document.body.removeChild(cameraContainer);
            
            // Process the captured image
            processImage(imageData);
          });
          
          // Handle close button click
          closeButton.addEventListener('click', function() {
            // Stop camera stream
            stream.getTracks().forEach(track => track.stop());
            
            // Remove camera UI
            document.body.removeChild(cameraContainer);
          });
        })
        .catch(function(error) {
          console.error('[DirectAccessButtons] Camera error:', error);
          
          // Remove camera UI
          if (document.body.contains(cameraContainer)) {
            document.body.removeChild(cameraContainer);
          }
          
          // Show error toast
          showToast('Could not access camera. Please try uploading an image instead.');
        });
    } else {
      showToast('Camera not supported on this device. Please try uploading an image instead.');
    }
  }
  
  /**
   * Handle upload image
   */
  function handleUploadImage() {
    console.log('[DirectAccessButtons] Upload image clicked');
    
    // Click the hidden file input
    const fileInput = document.getElementById('direct-access-file-input');
    if (fileInput) {
      fileInput.click();
    }
  }
  
  /**
   * Handle file selected
   */
  function handleFileSelected(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      console.log('[DirectAccessButtons] File selected:', file.name);
      showToast('Processing image: ' + file.name);
      
      // Read file as data URL
      const reader = new FileReader();
      reader.onload = function(e) {
        processImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }
  
  /**
   * Process the image
   * @param {string} imageData - The image data URL
   */
  function processImage(imageData) {
    console.log('[DirectAccessButtons] Processing image');
    
    // Store the image for later use
    window.lastProcessedImage = imageData;
    
    // Create image element
    const img = new Image();
    img.onload = function() {
      // Try to set the image to the store
      if (window.store && window.store.setImage) {
        console.log('[DirectAccessButtons] Setting image to store');
        window.store.setImage(img);
        
        // Show success toast
        showToast('Image processed successfully');
        
        // Highlight the GenAI button
        highlightGenAIButton();
        return;
      }
      
      // Try other methods
      const makeupContainer = document.querySelector('.bnb-makeup');
      if (makeupContainer) {
        // Look for existing images
        const images = makeupContainer.querySelectorAll('img');
        if (images.length > 0) {
          console.log('[DirectAccessButtons] Updating existing images');
          
          // Update all images
          images.forEach(image => {
            image.src = imageData;
          });
          
          // Show success toast
          showToast('Image processed successfully');
          
          // Highlight the GenAI button
          highlightGenAIButton();
          return;
        }
        
        // Look for canvas elements
        const canvas = makeupContainer.querySelector('canvas');
        if (canvas) {
          console.log('[DirectAccessButtons] Updating canvas');
          
          // Draw image to canvas
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Preserve aspect ratio
          const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
          const x = (canvas.width - img.width * scale) / 2;
          const y = (canvas.height - img.height * scale) / 2;
          
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
          
          // Show success toast
          showToast('Image processed successfully');
          
          // Highlight the GenAI button
          highlightGenAIButton();
          return;
        }
      }
      
      // If we get here, we couldn't find a good place to put the image
      console.log('[DirectAccessButtons] Could not find suitable container for image');
      
      // Create a fallback container
      const fallbackContainer = document.createElement('div');
      fallbackContainer.id = 'direct-access-image-container';
      fallbackContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 90%;
        max-height: 70%;
        z-index: 1000;
        border: 2px solid #333;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        background-color: white;
      `;
      
      // Remove any existing fallback container
      const existingContainer = document.getElementById('direct-access-image-container');
      if (existingContainer) {
        document.body.removeChild(existingContainer);
      }
      
      // Create the image element
      const displayImg = new Image();
      displayImg.src = imageData;
      displayImg.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        display: block;
      `;
      
      // Add the image to the container
      fallbackContainer.appendChild(displayImg);
      
      // Add the container to the document
      document.body.appendChild(fallbackContainer);
      
      // Show success toast
      showToast('Image processed successfully');
    };
    
    img.src = imageData;
  }
  

  

  

  
  /**
   * Check if an image is available
   * @returns {boolean} - True if an image is available
   */
  function hasImage() {
    // Check store
    if (window.store && window.store.hasImage && window.store.hasImage()) {
      return true;
    }
    
    // Check makeup container
    const makeupContainer = document.querySelector('.bnb-makeup');
    if (makeupContainer) {
      const images = makeupContainer.querySelectorAll('img');
      if (images.length > 0) {
        return true;
      }
      
      const canvas = makeupContainer.querySelector('canvas');
      if (canvas) {
        return true;
      }
    }
    
    // Check fallback container
    const fallbackContainer = document.getElementById('direct-access-image-container');
    if (fallbackContainer && fallbackContainer.querySelector('img')) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Show a toast message
   * @param {string} message - The message to show
   */
  function showToast(message) {
    // Remove any existing toasts
    const existingToasts = document.querySelectorAll('.direct-access-toast');
    existingToasts.forEach(toast => {
      document.body.removeChild(toast);
    });
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = 'direct-access-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 12px 24px;
      border-radius: 30px;
      font-size: 16px;
      z-index: 10001;
    `;
    
    // Add to document
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (document.body.contains(toast)) {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast);
          }
        }, 500);
      }
    }, 3000);
  }
  
  // Make sure the buttons are always visible
  setInterval(function() {
    if (!document.getElementById('direct-access-container')) {
      addDirectAccessButtons();
    }
  }, 3000);
})();