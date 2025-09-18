/**
 * CategoryNavigationFix.js
 * This script fixes navigation between categories and improves the back button functionality
 * to ensure users can properly navigate between different makeup features.
 */

(function() {
  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Wait for app components to initialize
    setTimeout(initCategoryFixes, 1500);
  });
  
  function initCategoryFixes() {
    // Fix category navigation
    fixCategoryNavigation();
    
    // Enhance back button functionality
    enhanceBackButton();
    
    // Make panels fully visible
    fixPanelVisibility();
    
    // Run checks periodically to catch any dynamic changes
    setInterval(ensureFixesApplied, 3000);
  }
  
  function fixCategoryNavigation() {
    console.log("Fixing category navigation");
    
    // Find all category navigation links
    const categoryLinks = document.querySelectorAll('.navbar-item[href^="#"], [data-category]');
    
    categoryLinks.forEach(link => {
      // Extract category name
      const categoryName = link.getAttribute('href')?.replace('#', '') || 
                          link.dataset.category || 
                          link.textContent.trim().toLowerCase();
      
      // Skip if already processed
      if (link.dataset.navigationFixed) {
        return;
      }
      
      // Store original click handler if exists
      const originalClick = link.onclick;
      
      // Replace with enhanced handler
      link.onclick = function(e) {
        console.log(`Navigating to category: ${categoryName}`);
        
        // Call original handler if exists
        if (typeof originalClick === 'function') {
          originalClick.call(this, e);
        }
        
        // Show the category's panel and hide others
        showCategoryPanel(categoryName);
        
        // Mark link as active
        document.querySelectorAll('.navbar-item.is-active').forEach(item => {
          item.classList.remove('is-active');
        });
        this.classList.add('is-active');
        
        // Ensure features in this category are clickable
        setTimeout(() => {
          ensureFeaturesClickable(categoryName);
        }, 300);
        
        // Return false to prevent default behavior if needed
        return false;
      };
      
      // Mark as processed
      link.dataset.navigationFixed = 'true';
    });
  }
  
  function showCategoryPanel(categoryName) {
    // Find all panels
    const panels = document.querySelectorAll('.panel, .bnb-features');
    
    // Hide all panels first
    panels.forEach(panel => {
      panel.style.display = 'none';
    });
    
    // Find and show the target panel
    let targetPanel = document.getElementById(categoryName);
    
    // If not found by ID, try finding by class or data attribute
    if (!targetPanel) {
      targetPanel = document.querySelector(`.${categoryName}, [data-category="${categoryName}"]`);
    }
    
    // If still not found, look for panel with matching heading
    if (!targetPanel) {
      panels.forEach(panel => {
        const heading = panel.querySelector('.panel-heading');
        if (heading && heading.textContent.trim().toLowerCase() === categoryName) {
          targetPanel = panel;
        }
      });
    }
    
    // Show the target panel if found
    if (targetPanel) {
      targetPanel.style.display = 'block';
      targetPanel.style.width = '100%';
      targetPanel.style.maxWidth = '100%';
      targetPanel.style.overflowX = 'hidden';
    } else {
      console.warn(`Panel for category ${categoryName} not found`);
    }
  }
  
  function ensureFeaturesClickable(categoryName) {
    // Find all feature options in the current category panel
    let panel = document.getElementById(categoryName);
    
    // If not found by ID, try finding by class or data attribute
    if (!panel) {
      panel = document.querySelector(`.${categoryName}, [data-category="${categoryName}"]`);
    }
    
    // If panel found, make all features in it clickable
    if (panel) {
      const features = panel.querySelectorAll('.panel-block, .feature-option');
      
      features.forEach(feature => {
        // Make clickable
        feature.style.pointerEvents = 'auto';
        feature.style.opacity = '1';
        feature.style.cursor = 'pointer';
        
        // Add click handler if not already present
        if (!feature.dataset.clickFixed) {
          feature.addEventListener('click', function() {
            console.log(`Feature clicked: ${this.textContent.trim()}`);
            
            // Toggle active state
            this.classList.toggle('is-active');
            
            // Get feature name
            const featureName = this.dataset.feature || this.textContent.trim();
            
            // Try to apply the effect
            if (window.applyEffect) {
              window.applyEffect(featureName);
            }
            
            // Try other methods to apply effect
            tryApplyEffect(this, featureName);
          });
          
          // Mark as fixed
          feature.dataset.clickFixed = 'true';
        }
      });
    }
  }
  
  function tryApplyEffect(element, featureName) {
    // Try clicking color dots if present
    const colorDots = element.querySelectorAll('.color-dot, .color-picker');
    if (colorDots.length > 0) {
      colorDots.forEach(dot => dot.click());
    }
    
    // Try adjusting intensity slider if present
    const slider = document.querySelector('input[type="range"], .slider');
    if (slider) {
      // Trigger input event
      const event = new Event('input', { bubbles: true });
      slider.dispatchEvent(event);
    }
    
    // Try clicking apply button if present
    const applyButton = document.querySelector('.apply-button, .button.is-primary');
    if (applyButton) {
      applyButton.click();
    }
  }
  
  function enhanceBackButton() {
    // Find all back buttons
    const backButtons = document.querySelectorAll('.back-button, [data-action="back"]');
    
    backButtons.forEach(button => {
      // Skip if already processed
      if (button.dataset.backFixed) {
        return;
      }
      
      // Store original click handler
      const originalClick = button.onclick;
      
      // Replace with enhanced handler
      button.onclick = function(e) {
        console.log("Back button clicked");
        
        // Call original handler if exists
        if (typeof originalClick === 'function') {
          originalClick.call(this, e);
        }
        
        // Show main categories, ensure they're clickable
        setTimeout(() => {
          // Reset active states
          document.querySelectorAll('.is-active').forEach(el => {
            if (!el.classList.contains('navbar-item')) {
              el.classList.remove('is-active');
            }
          });
          
          // Show main category panels
          showMainCategories();
          
          // Ensure all category links are clickable
          const categoryLinks = document.querySelectorAll('.navbar-item[href^="#"]');
          categoryLinks.forEach(link => {
            link.style.pointerEvents = 'auto';
            link.style.opacity = '1';
          });
        }, 200);
        
        return false;
      };
      
      // Mark as processed
      button.dataset.backFixed = 'true';
    });
  }
  
  function showMainCategories() {
    // Find main category elements
    const mainCategories = document.querySelectorAll('.bnb-features, .main-category');
    
    // Show main categories
    mainCategories.forEach(category => {
      category.style.display = 'block';
    });
    
    // Hide subcategories/detail panels
    const subCategories = document.querySelectorAll('.subcategory, .feature-details');
    subCategories.forEach(sub => {
      sub.style.display = 'none';
    });
  }
  
  function fixPanelVisibility() {
    // Find all panels
    const panels = document.querySelectorAll('.panel');
    
    panels.forEach(panel => {
      // Ensure panel is visible and sized correctly
      panel.style.display = 'block';
      panel.style.width = '100%';
      panel.style.maxWidth = '100%';
      panel.style.overflowX = 'hidden';
      
      // Make all panel blocks visible and clickable
      const blocks = panel.querySelectorAll('.panel-block');
      blocks.forEach(block => {
        block.style.display = 'block';
        block.style.pointerEvents = 'auto';
        block.style.opacity = '1';
        block.style.cursor = 'pointer';
      });
    });
  }
  
  function ensureFixesApplied() {
    // Re-apply navigation fixes to catch dynamically added elements
    fixCategoryNavigation();
    
    // Make sure all panels are visible
    fixPanelVisibility();
    
    // Fix any broken back buttons
    enhanceBackButton();
    
    // Ensure all feature options are clickable in the active category
    const activeCategory = document.querySelector('.navbar-item.is-active');
    if (activeCategory) {
      const categoryName = activeCategory.getAttribute('href')?.replace('#', '') || 
                           activeCategory.dataset.category || 
                           activeCategory.textContent.trim().toLowerCase();
      
      ensureFeaturesClickable(categoryName);
    }
  }
})();