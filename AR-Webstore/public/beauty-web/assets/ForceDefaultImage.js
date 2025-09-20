/**
 * ForceDefaultImage.js
 * Forces the default image to be loaded immediately
 */

(function() {
  console.log('[ForceDefaultImage] Starting immediate image loading');
  
  // Function to force load the default image
  function forceLoadDefaultImage() {
    console.log('[ForceDefaultImage] Forcing default image to load');
    
    // If AutoImageProvider is available, use it
    if (window.AutoImageProvider && typeof window.AutoImageProvider.loadDefaultImage === 'function') {
      window.AutoImageProvider.loadDefaultImage();
      return;
    }
    
    // If not available yet, wait and retry
    setTimeout(() => {
      if (window.AutoImageProvider && typeof window.AutoImageProvider.loadDefaultImage === 'function') {
        window.AutoImageProvider.loadDefaultImage();
      } else {
        console.warn('[ForceDefaultImage] AutoImageProvider not available after waiting');
      }
    }, 1000);
  }
  
  // Call immediately
  forceLoadDefaultImage();
  
  // Also call on DOMContentLoaded and load for good measure
  document.addEventListener('DOMContentLoaded', forceLoadDefaultImage);
  window.addEventListener('load', forceLoadDefaultImage);
  
  // Add a function to the window to manually trigger it
  window.forceLoadDefaultImage = forceLoadDefaultImage;
})();