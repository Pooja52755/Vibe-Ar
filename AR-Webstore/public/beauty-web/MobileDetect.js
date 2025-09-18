/**
 * MobileDetect.js - Mobile device detection and redirection for Beauty AR
 * 
 * This script detects if a user is on a mobile device and automatically
 * redirects them to the simplified mobile version of the Beauty AR experience.
 * This helps ensure the best experience on smaller screens.
 */

(function() {
  // Run immediately on page load
  window.addEventListener('load', function() {
    // Check if we're on a mobile device
    if (isMobileDevice()) {
      console.log('Mobile device detected');
      
      // Wait a moment to see if the standard version loads correctly
      setTimeout(function() {
        // Check if there are any visible layout issues
        if (detectLayoutIssues()) {
          console.log('Layout issues detected, redirecting to mobile version');
          
          // Show confirmation dialog before redirecting
          if (confirm('Would you like to use the simplified mobile version for a better experience?')) {
            // Redirect to simplified mobile version
            window.location.href = 'beauty-mobile-simplified.html';
          } else {
            // User chose to stay, apply maximum fixes
            applyMaximumFixes();
          }
        }
      }, 3000); // Wait 3 seconds to check layout
    }
  });
  
  // Function to detect mobile devices
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           (window.innerWidth <= 768);
  }
  
  // Function to detect layout issues
  function detectLayoutIssues() {
    // Check for elements extending beyond viewport
    let hasLayoutIssues = false;
    
    // Check sidebar elements
    const sidebar = document.querySelector('#sidebar-container, .bnb-layout__side');
    if (sidebar) {
      const rect = sidebar.getBoundingClientRect();
      
      // Check if sidebar extends beyond viewport or is too narrow
      if (rect.right > window.innerWidth + 5 || rect.width < 100) {
        hasLayoutIssues = true;
      }
    }
    
    // Check panel blocks
    const panels = document.querySelectorAll('.panel, .panel-block');
    panels.forEach(panel => {
      const rect = panel.getBoundingClientRect();
      if (rect.right > window.innerWidth + 5) {
        hasLayoutIssues = true;
      }
    });
    
    // Check if makeup features are visible
    const features = document.querySelectorAll('.panel-block, .feature-option');
    if (features.length > 0) {
      let visibleFeatures = 0;
      features.forEach(feature => {
        if (feature.offsetWidth > 0 && feature.offsetHeight > 0) {
          visibleFeatures++;
        }
      });
      
      // If less than half the features are visible, we have issues
      if (visibleFeatures < features.length / 2) {
        hasLayoutIssues = true;
      }
    }
    
    return hasLayoutIssues;
  }
  
  // Function to apply maximum fixes if user chooses to stay
  function applyMaximumFixes() {
    console.log('Applying maximum fixes for mobile');
    
    // Create and append emergency style fixes
    const style = document.createElement('style');
    style.textContent = `
      /* Emergency mobile fixes */
      html, body, .container, .columns, .column, .sidebar, .panel, 
      .bnb-layout__side, .bnb-settings, #sidebar-container, #camera-container {
        width: 100% !important;
        max-width: 100vw !important;
        overflow-x: hidden !important;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        position: relative !important;
        left: 0 !important;
        right: auto !important;
      }
      
      /* Force column layout */
      .columns {
        display: flex !important;
        flex-direction: column !important;
      }
      
      /* Set camera first, sidebar second */
      #camera-container, .bnb-layout__main, .column.is-9, .column.is-8 {
        order: 1 !important;
        width: 100% !important;
      }
      
      #sidebar-container, .bnb-layout__side, .column.is-3, .column.is-4 {
        order: 2 !important;
        width: 100% !important;
        margin-top: 10px !important;
      }
      
      /* Ensure all UI elements are properly sized */
      .panel-block, .feature-option, .navbar-item, button, .button {
        width: auto !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        padding: 10px !important;
      }
    `;
    
    document.head.appendChild(style);
    
    // Show helper button to switch to mobile version later
    const mobileButton = document.createElement('button');
    mobileButton.textContent = 'Switch to Mobile Version';
    mobileButton.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #ff4081;
      color: white;
      border: none;
      border-radius: 20px;
      padding: 10px 20px;
      font-weight: bold;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      z-index: 9999;
    `;
    
    mobileButton.addEventListener('click', function() {
      window.location.href = 'beauty-mobile-simplified.html';
    });
    
    document.body.appendChild(mobileButton);
  }
})();