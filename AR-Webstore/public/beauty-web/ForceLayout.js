/**
 * ForceLayout.js
 * Script to apply aggressive layout fixes after app is fully loaded
 */

// Wait for application to fully load
window.addEventListener('load', function() {
  setTimeout(forceLayoutCorrection, 1000);
  setTimeout(forceLayoutCorrection, 3000); // Run again after 3 seconds for dynamic content
});

function forceLayoutCorrection() {
  // Check if we're on mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (!isMobile) return;
  
  console.log('Applying forced layout correction for mobile');
  
  // Create and apply a style element with !important rules
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    /* Force the sidebar to fit within viewport - use full width */
    .bnb-layout__side, 
    .bnb-settings, 
    .bnb-features {
      width: 100% !important;
      max-width: 100% !important;
      position: absolute !important;
      left: 0 !important;
      overflow-x: hidden !important;
      box-sizing: border-box !important;
      padding-right: 20px !important;
    }
    
    /* Force main container to fit viewport */
    .bnb-app, 
    .bnb-layout {
      width: 100vw !important;
      max-width: 100vw !important;
      overflow-x: hidden !important;
    }
    
    /* Force panel blocks to fit within their container */
    .panel-block {
      width: 100% !important;
      max-width: 100% !important;
      padding: 8px !important;
      display: flex !important;
      align-items: center !important;
      overflow: hidden !important;
    }
    
    /* Fix specific panel block content */
    .panel-block span, 
    .panel-block a {
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      max-width: 70% !important;
    }
    
    /* Fix icons and arrows */
    .panel-block svg, 
    .panel-block i, 
    .panel-block .icon {
      flex-shrink: 0 !important;
      min-width: 20px !important;
      margin-right: 8px !important;
    }
    
    /* Fix camera UI */
    #webar, 
    #webar canvas {
      width: 100vw !important;
      max-width: 100vw !important;
    }
    
    /* Fix tab navigation for smaller screens */
    .tabs a {
      padding: 0.5em 0.75em !important;
      font-size: 14px !important;
    }
    
    /* Fix control panel layout */
    .control {
      margin-bottom: 8px !important;
      width: 100% !important;
    }
    
    /* Fix color picker overflow */
    .color-picker {
      max-width: 80vw !important;
    }
    
    /* Ensure all columns behave */
    .column {
      padding: 0.25rem !important;
      width: 100% !important;
    }
  `;
  
  // Add the style element to the document
  document.head.appendChild(styleEl);
  
  // Apply direct style modifications to elements
  document.querySelectorAll('.bnb-layout__side').forEach(el => {
    el.style.cssText = 'width: 100% !important; max-width: 100% !important; overflow-x: hidden !important; left: 0 !important; position: absolute !important; padding-right: 20px !important;';
  });
  
  document.querySelectorAll('.panel-block').forEach(el => {
    el.style.cssText = 'width: 100% !important; max-width: 100% !important; overflow: hidden !important; padding: 8px !important;';
  });
}