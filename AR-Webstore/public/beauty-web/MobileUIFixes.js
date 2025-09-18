/**
 * MobileUIFixes.js
 * Specific fixes for mobile UI issues with panels and layout
 */

(function() {
  // Execute when DOM is fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!isMobile) return; // Only apply fixes on mobile devices
    
    // Apply fixes after a short delay to ensure all components are loaded
    setTimeout(applyMobileFixes, 500);
    // And apply again after a longer delay to catch dynamically added elements
    setTimeout(applyMobileFixes, 2000);
    
    // Function to fix specific UI issues
    function applyMobileFixes() {
      console.log('Applying mobile UI fixes');
      
      // Fix for settings panels (shown in screenshot) - use full width
      const settingsPanels = document.querySelectorAll('.bnb-settings');
      settingsPanels.forEach(panel => {
        panel.style.maxWidth = '100%';
        panel.style.width = '100%';
        panel.style.overflowX = 'hidden';
        panel.style.left = '0';
        panel.style.margin = '0';
        panel.style.paddingRight = '20px';
        panel.style.boxSizing = 'border-box';
      });
      
      // Fix list items in settings that are too wide
      const listItems = document.querySelectorAll('.panel-block');
      listItems.forEach(item => {
        item.style.width = '100%';
        item.style.maxWidth = '100%';
        item.style.padding = '10px 8px';
        item.style.fontSize = '14px';
        item.style.overflowX = 'hidden';
        
        // Find and adjust arrow icons that might be causing overflow
        const icons = item.querySelectorAll('svg, i, .icon');
        icons.forEach(icon => {
          icon.style.minWidth = '20px';
          icon.style.marginRight = '8px';
        });
      });
      
      // Fix the layout container
      const layoutContainer = document.querySelector('.bnb-layout');
      if (layoutContainer) {
        layoutContainer.style.width = '100vw';
        layoutContainer.style.maxWidth = '100vw';
        layoutContainer.style.overflowX = 'hidden';
      }
      
      // Fix any panels with fixed positioning
      const fixedPanels = document.querySelectorAll('.is-fixed');
      fixedPanels.forEach(panel => {
        panel.style.maxWidth = '85%';
        panel.style.width = '85%';
        panel.style.overflowX = 'hidden';
      });
      
      // Force the sidebar to be positioned correctly and not overflow - use full width
      const sidePanels = document.querySelectorAll('.bnb-layout__side');
      sidePanels.forEach(panel => {
        panel.style.maxWidth = '100%';
        panel.style.width = '100%';
        panel.style.overflowX = 'hidden';
        panel.style.position = 'absolute';
        panel.style.left = '0';
        panel.style.paddingRight = '20px';
        panel.style.boxSizing = 'border-box';
      });
      
      // Add a specific style tag for additional fixes
      const styleTag = document.createElement('style');
      styleTag.textContent = `
        @media (max-width: 768px) {
          /* Ensure text doesn't overflow */
          .panel-block span, .panel-block a {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 70%;
          }
          
          /* Fix icon alignment */
          .panel-block svg,
          .panel-block .icon {
            flex-shrink: 0;
          }
          
          /* Fix panel containers - use full width */
          .bnb-settings, .bnb-features {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            left: 0 !important;
            padding-right: 20px !important;
            box-sizing: border-box !important;
          }
        }
      `;
      document.head.appendChild(styleTag);
    }
    
    // Create a mutation observer to apply fixes when the DOM changes
    const observer = new MutationObserver(function(mutations) {
      applyMobileFixes();
    });
    
    // Start observing the document
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
  });
})();