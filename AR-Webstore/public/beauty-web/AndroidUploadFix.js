/**
 * AndroidUploadFix.js - Ensures upload buttons are visible on Android devices
 * 
 * This script specifically targets the upload functionality on Android devices
 * to make sure it's not cut off and fully accessible on mobile screens.
 */

(function() {
  // Run when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    // Fix for Android devices
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    if (isAndroid) {
      // Wait a bit for UI to fully render
      setTimeout(fixAndroidUpload, 500);
      // Also fix when window resizes
      window.addEventListener('resize', fixAndroidUpload);
    }
    
    function fixAndroidUpload() {
      // Target upload elements
      const uploadElements = document.querySelectorAll('.file, .file-label, .file-cta, .upload, .button');
      
      uploadElements.forEach(el => {
        // Make sure upload elements are properly sized and positioned
        el.style.maxWidth = '90vw';
        el.style.width = 'auto';
        el.style.position = 'relative';
        el.style.left = '0';
        el.style.whiteSpace = 'normal';
        el.style.wordBreak = 'break-word';
        
        // If it's a file upload button, apply additional fixes
        if (el.classList.contains('file') || el.classList.contains('file-label')) {
          // Check if we need to adjust button size
          const rect = el.getBoundingClientRect();
          if (rect.right > window.innerWidth) {
            // Element is extending beyond viewport, adjust it
            el.style.width = (window.innerWidth * 0.9) + 'px';
            el.style.left = '5vw';
            
            // Make sure any child spans use normal whitespace
            const spans = el.querySelectorAll('span');
            spans.forEach(span => {
              span.style.whiteSpace = 'normal';
              span.style.overflow = 'visible';
            });
            
            // Make sure icons stay visible
            const icons = el.querySelectorAll('.icon');
            icons.forEach(icon => {
              icon.style.marginRight = '5px';
              icon.style.flexShrink = '0';
            });
          }
        }
      });
      
      // Also fix sidebars and panels
      const sidebarElements = document.querySelectorAll('.sidebar, .sidebar-panel, .panel');
      sidebarElements.forEach(el => {
        el.style.width = '100%';
        el.style.maxWidth = '100vw';
        el.style.overflowX = 'hidden';
        el.style.position = 'relative';
        el.style.left = '0';
      });
    }
    
    // Monitor DOM changes to fix dynamically added upload elements
    const observer = new MutationObserver(function(mutations) {
      if (isAndroid) {
        fixAndroidUpload();
      }
    });
    
    // Start observing
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
  });
})();