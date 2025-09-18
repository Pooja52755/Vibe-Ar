/**
 * EmergencyFix.js
 * This script applies immediate fixes to layout issues on mobile
 */

// Run immediately
(function() {
  // Create a style element
  const style = document.createElement('style');
  
  // Add critical CSS rules to fix the cutting issue
  style.textContent = `
    /* Emergency fix for sidebar width */
    .bnb-layout__side,
    .bnb-settings,
    .bnb-features {
      width: 100% !important;
      max-width: 100% !important;
      left: 0 !important;
      position: absolute !important;
      padding-right: 20px !important;
      box-sizing: border-box !important;
      overflow-x: hidden !important;
    }
    
    /* Fix panel blocks */
    .panel-block {
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      padding: 8px !important;
    }
    
    /* Fix text within panels */
    .panel-block span,
    .panel-block a {
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      max-width: 80% !important;
    }
    
    /* Fix main layout */
    .bnb-layout {
      width: 100vw !important;
      max-width: 100vw !important;
      overflow-x: hidden !important;
    }
    
    /* Fix body */
    body {
      width: 100vw !important;
      max-width: 100vw !important;
      overflow-x: hidden !important;
    }
    
    /* Ensure proper display */
    * {
      max-width: 100vw !important;
      box-sizing: border-box !important;
    }
  `;
  
  // Add the style to the document head
  document.head.appendChild(style);
  
  // Apply direct style fixes when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!isMobile) return;
    
    // Apply fixes to main elements
    setTimeout(function() {
      // Get all sidebar elements
      const sidebarElements = document.querySelectorAll('.bnb-layout__side, .bnb-settings, .bnb-features');
      
      // Apply fixes to each one
      sidebarElements.forEach(function(el) {
        el.style.cssText = `
          width: 100% !important;
          max-width: 100% !important;
          left: 0 !important;
          position: absolute !important;
          padding-right: 20px !important;
          box-sizing: border-box !important;
          overflow-x: hidden !important;
        `;
      });
      
      // Fix panel blocks
      const panelBlocks = document.querySelectorAll('.panel-block');
      panelBlocks.forEach(function(el) {
        el.style.cssText = `
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
          overflow: hidden !important;
          padding: 8px !important;
        `;
      });
    }, 500);
    
    // Apply fixes again after the app is fully loaded
    setTimeout(function() {
      // Get all sidebar elements
      const sidebarElements = document.querySelectorAll('.bnb-layout__side, .bnb-settings, .bnb-features');
      
      // Apply fixes to each one
      sidebarElements.forEach(function(el) {
        el.style.cssText = `
          width: 100% !important;
          max-width: 100% !important;
          left: 0 !important;
          position: absolute !important;
          padding-right: 20px !important;
          box-sizing: border-box !important;
          overflow-x: hidden !important;
        `;
      });
      
      // Fix file upload buttons specifically for Android
      const uploadButtons = document.querySelectorAll('.file, .file-label, .file-cta, .upload, .button');
      uploadButtons.forEach(function(el) {
        el.style.cssText = `
          max-width: 90vw !important;
          width: auto !important;
          white-space: normal !important;
          word-break: break-word !important;
          overflow: visible !important;
          position: relative !important;
          left: 0 !important;
          margin-left: auto !important;
          margin-right: auto !important;
        `;
        
        // Fix any spans inside buttons
        const spans = el.querySelectorAll('span');
        spans.forEach(function(span) {
          span.style.whiteSpace = 'normal';
          span.style.overflow = 'visible';
        });
      });
    }, 2000);
  });
})();