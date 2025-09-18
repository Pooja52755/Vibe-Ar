/**
 * MobileViewportFix.js - Ensures proper viewport scaling on mobile devices
 * 
 * This script forces the correct viewport width and prevents the content from being
 * cut off on mobile devices. It should be included at the top of the head section.
 */

(function() {
  // Force the viewport to the correct width
  function fixViewport() {
    // Set meta viewport with maximum-scale to prevent zooming
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
      document.head.appendChild(meta);
    } else {
      viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    }
    
    // Set critical CSS for body and html
    const style = document.createElement('style');
    style.textContent = `
      html, body {
        width: 100% !important;
        max-width: 100vw !important;
        overflow-x: hidden !important;
        position: fixed !important;
        touch-action: none !important;
      }
      
      * {
        box-sizing: border-box !important;
      }
      
      /* Fix for iOS Safari's safe areas */
      @supports (padding: max(0px)) {
        body {
          padding-left: max(0px, env(safe-area-inset-left));
          padding-right: max(0px, env(safe-area-inset-right));
          padding-bottom: max(0px, env(safe-area-inset-bottom));
          padding-top: max(0px, env(safe-area-inset-top));
        }
      }
    `;
    document.head.appendChild(style);
    
    // Force the body and app container to correct width
    document.documentElement.style.width = '100%';
    document.documentElement.style.maxWidth = '100vw';
    document.body.style.width = '100%';
    document.body.style.maxWidth = '100vw';
    document.body.style.overflowX = 'hidden';
    
    // Find and fix app container if it exists
    const appContainer = document.getElementById('app') || 
                         document.getElementById('webar') || 
                         document.querySelector('.app') ||
                         document.querySelector('.container');
    
    if (appContainer) {
      appContainer.style.width = '100%';
      appContainer.style.maxWidth = '100vw';
      appContainer.style.overflowX = 'hidden';
    }
    
    // Fix for sidebar elements that might get cut off
    const sidebarElements = document.querySelectorAll('.sidebar, .panel, .menu, aside, [class*="sidebar"], [class*="panel"]');
    sidebarElements.forEach(el => {
      if (el.offsetWidth > window.innerWidth * 0.8) {
        el.style.width = '80vw';
        el.style.maxWidth = '80vw';
      }
    });
  }

  // Execute immediately to prevent any FOUC (Flash of Unstyled Content)
  fixViewport();
  
  // Also run when DOM is loaded and on resize
  document.addEventListener('DOMContentLoaded', fixViewport);
  window.addEventListener('resize', fixViewport);
  
  // Additional fix for when iframe contents load
  window.addEventListener('load', function() {
    fixViewport();
    
    // Handle orientation changes
    window.addEventListener('orientationchange', function() {
      setTimeout(fixViewport, 100); // Slight delay to allow orientation to complete
    });
  });
  
  // Fix for dynamic content that might be added later
  const observer = new MutationObserver(function(mutations) {
    let shouldFix = false;
    
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        shouldFix = true;
      }
    });
    
    if (shouldFix) {
      fixViewport();
    }
  });
  
  // Start observing once DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();