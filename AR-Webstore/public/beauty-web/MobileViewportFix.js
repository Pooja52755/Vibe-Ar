/**
 * MobileViewportFix.js
 * A script to fix viewport issues on mobile devices
 */

(function() {
  // Helper function to check if device is mobile
  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  // Fix viewport height issues on mobile (especially iOS)
  function fixViewportHeight() {
    // First we get the viewport height and multiply it by 1% to get a value for a vh unit
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Set explicit height to body and html
    document.documentElement.style.height = `${window.innerHeight}px`;
    document.body.style.height = `${window.innerHeight}px`;
    
    // Fix for iOS Safari address bar
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      window.scrollTo(0, 0);
    }
  }
  
  // Apply fixes for mobile layout
  function applyMobileFixes() {
    if (!isMobile()) return;
    
    // Add mobile class to body
    document.body.classList.add('is-mobile');
    
    // Fix viewport height
    fixViewportHeight();
    
    // Update on resize and orientation change
    window.addEventListener('resize', fixViewportHeight);
    window.addEventListener('orientationchange', function() {
      // Slight delay to ensure orientation has fully changed
      setTimeout(fixViewportHeight, 100);
    });
    
    // Create a viewport meta tag if it doesn't exist
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      document.head.appendChild(viewportMeta);
    }
    
    // Set proper viewport settings for mobile
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    
    // Fix for notched devices
    const metaViewport = document.createElement('meta');
    metaViewport.name = 'viewport-fit';
    metaViewport.content = 'cover';
    document.head.appendChild(metaViewport);
  }
  
  // Run when DOM is loaded
  document.addEventListener('DOMContentLoaded', applyMobileFixes);
})();