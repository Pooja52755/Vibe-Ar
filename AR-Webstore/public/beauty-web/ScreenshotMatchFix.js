/**
 * ScreenshotMatchFix.js - Makes the Beauty AR interface match the shared screenshot
 * 
 * This script applies specific styling to match the UI shown in the screenshot
 * with light blue background, rounded blue menu items, and proper spacing.
 */

(function() {
  document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Add the exact styling from the screenshot
      const style = document.createElement('style');
      style.textContent = `
        body, html {
          background-color: #f0f4ff !important;
        }
        
        /* Selected Features section styling */
        .selected-features {
          background-color: white;
          border-radius: 10px;
          padding: 15px;
          margin: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        
        .selected-features-title {
          color: #4a6aed;
          font-weight: 600;
          font-size: 18px;
          text-align: center;
          margin-bottom: 10px;
        }
        
        .no-features-text {
          color: #999;
          text-align: center;
          padding: 10px;
          font-size: 14px;
        }
        
        /* Feature menu items styling */
        .panel-block {
          background-color: white !important;
          border: none !important;
          border-radius: 8px !important;
          margin: 6px 10px !important;
          padding: 15px !important;
          display: flex !important;
          align-items: center !important;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05) !important;
        }
        
        /* Feature icons styling */
        .panel-block .icon {
          color: #4a6aed !important;
          margin-right: 15px !important;
          width: 24px !important;
          height: 24px !important;
        }
        
        /* Feature text styling */
        .panel-block span {
          color: #4a6aed !important;
          font-weight: 500 !important;
          font-size: 16px !important;
        }
        
        /* Right arrow icon */
        .panel-block .icon.is-right {
          margin-left: auto !important;
          margin-right: 0 !important;
          color: #4a6aed !important;
          opacity: 0.5 !important;
        }
        
        /* Header styling */
        .navbar {
          background-color: white !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
        }
        
        /* Back button */
        .navbar-item.back-button {
          background-color: #ff4081 !important;
          color: white !important;
          border-radius: 20px !important;
          margin: 10px !important;
        }
        
        /* Menu button */
        .navbar-burger, .menu-button {
          background-color: #4a6aed !important;
          color: white !important;
          border-radius: 20px !important;
          margin: 10px !important;
        }
        
        /* Style containers */
        .sidebar, .sidebar-panel, .panel, .bnb-layout__side, .bnb-settings, .bnb-features {
          background-color: #f0f4ff !important;
          border: none !important;
          box-shadow: none !important;
        }
      `;
      
      document.head.appendChild(style);
      
      // Apply direct DOM changes to match screenshot
      setTimeout(function() {
        // Style panel headings
        const panelHeadings = document.querySelectorAll('.panel-heading');
        panelHeadings.forEach(heading => {
          heading.style.backgroundColor = 'transparent';
          heading.style.color = '#4a6aed';
          heading.style.fontWeight = '600';
          heading.style.fontSize = '18px';
          heading.style.textAlign = 'center';
          heading.style.padding = '15px 10px';
          heading.style.borderBottom = 'none';
        });
        
        // Style panel blocks (menu items)
        const panelBlocks = document.querySelectorAll('.panel-block');
        panelBlocks.forEach(block => {
          block.style.backgroundColor = 'white';
          block.style.border = 'none';
          block.style.borderRadius = '8px';
          block.style.margin = '6px 10px';
          block.style.padding = '15px';
          block.style.display = 'flex';
          block.style.alignItems = 'center';
          block.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
          
          // Style icons in panel blocks
          const icons = block.querySelectorAll('.icon');
          icons.forEach(icon => {
            icon.style.color = '#4a6aed';
            if (icon.classList.contains('is-right')) {
              icon.style.marginLeft = 'auto';
              icon.style.marginRight = '0';
              icon.style.opacity = '0.5';
            } else {
              icon.style.marginRight = '15px';
              icon.style.width = '24px';
              icon.style.height = '24px';
            }
          });
          
          // Style text in panel blocks
          const spans = block.querySelectorAll('span');
          spans.forEach(span => {
            span.style.color = '#4a6aed';
            span.style.fontWeight = '500';
            span.style.fontSize = '16px';
          });
        });
        
        // Style navbar
        const navbar = document.querySelector('.navbar');
        if (navbar) {
          navbar.style.backgroundColor = 'white';
          navbar.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          
          // Style back button
          const backButton = navbar.querySelector('.navbar-item.back-button');
          if (backButton) {
            backButton.style.backgroundColor = '#ff4081';
            backButton.style.color = 'white';
            backButton.style.borderRadius = '20px';
            backButton.style.margin = '10px';
            backButton.style.padding = '5px 15px';
          }
          
          // Style menu button
          const menuButton = navbar.querySelector('.navbar-burger');
          if (menuButton) {
            menuButton.style.backgroundColor = '#4a6aed';
            menuButton.style.color = 'white';
            menuButton.style.borderRadius = '20px';
            menuButton.style.margin = '10px';
          }
        }
        
        // Add padding to containers
        const containers = document.querySelectorAll('.sidebar, .sidebar-panel, .panel');
        containers.forEach(container => {
          container.style.padding = '10px';
        });
        
        // Make sure body background is light blue
        document.body.style.backgroundColor = '#f0f4ff';
        
        // Fix selected features application
        fixFeatureApplication();
      }, 500);
    }
    
    // Function to fix feature application
    function fixFeatureApplication() {
      // Monitor feature selection changes
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList' || mutation.type === 'attributes') {
            applySelectedFeatures();
          }
        });
      });
      
      // Start observing relevant containers
      const featureContainers = document.querySelectorAll('.panel, .panel-block, .sidebar-panel, .bnb-features');
      featureContainers.forEach(container => {
        observer.observe(container, { 
          attributes: true, 
          childList: true, 
          subtree: true 
        });
      });
      
      // Fix back button navigation
      fixBackNavigation();
      
      // Initially apply any selected features
      setTimeout(applySelectedFeatures, 1000);
    }
    
    // Function to apply selected features
    function applySelectedFeatures() {
      // Find all selected features
      const selectedFeatures = document.querySelectorAll('.is-active, .is-selected, [aria-selected="true"], .active');
      
      // Apply each selected feature
      selectedFeatures.forEach(feature => {
        // Trigger click to ensure it's applied
        if (!feature.dataset.applied) {
          // Store that we've applied this to avoid infinite loops
          feature.dataset.applied = 'true';
          
          // Simulate a click
          feature.click();
          
          // Clear the applied flag after a delay to allow re-application
          setTimeout(() => {
            feature.dataset.applied = '';
          }, 1000);
        }
      });
    }
    
    // Function to fix back navigation between makeup categories
    function fixBackNavigation() {
      // Find all back buttons
      const backButtons = document.querySelectorAll('.back-button, .navbar-item:contains("Back"), [aria-label="Back"], .mdi-arrow-left').forEach(button => {
        // Ensure original click handler is preserved while adding our functionality
        const originalOnClick = button.onclick;
        
        button.onclick = function(e) {
          // Call original handler if it exists
          if (originalOnClick) {
            originalOnClick.call(this, e);
          }
          
          // After going back, fix navigation state
          setTimeout(() => {
            // Enable all makeup category links
            document.querySelectorAll('.panel-block, .navbar-item, .tab, .tab-item').forEach(item => {
              item.style.pointerEvents = 'auto';
              item.style.opacity = '1';
            });
            
            // Ensure we can go to other makeup sections
            document.querySelectorAll('[href*="makeup"], [href*="retouch"], [href*="lipstick"], [href*="eyes"]').forEach(link => {
              link.style.pointerEvents = 'auto';
              link.addEventListener('click', function(e) {
                // Clear any "active" flags that might prevent navigation
                document.querySelectorAll('.is-active, .active').forEach(activeItem => {
                  if (activeItem !== this) {
                    activeItem.classList.remove('is-active', 'active');
                  }
                });
              });
            });
          }, 100);
          
          return true;
        };
      });
    }
  });
})();