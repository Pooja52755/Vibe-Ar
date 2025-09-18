/**
 * FeatureSelectionFix.js
 * This script fixes issues with feature selection in the Beauty AR app
 * Specifically addressing problems with selecting makeup features and navigation
 */

(function() {
  // Wait for DOM content to be loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Wait for all components to initialize
    setTimeout(fixFeatureSelection, 1000);
  });

  function fixFeatureSelection() {
    // Fix feature selection in all category panels
    fixMakeupCategories();
    fixFeatureClicks();
    fixNavigationBetweenCategories();
    fixBackButton();
    fixLooksAndPresets();
    
    // Keep checking for dynamically added elements
    setInterval(fixFeatureClicks, 2000);
  }

  // Fix navigation between makeup categories
  function fixMakeupCategories() {
    console.log("Fixing makeup category navigation");
    
    // Find all category navigation links
    const categoryLinks = document.querySelectorAll('[href^="#"]');
    
    categoryLinks.forEach(link => {
      // Preserve the original click handler
      const originalClick = link.onclick;
      
      // Add enhanced click handler
      link.onclick = function(e) {
        const categoryName = link.getAttribute('href').replace('#', '');
        console.log(`Category clicked: ${categoryName}`);
        
        // Call original handler if it exists
        if (originalClick) {
          originalClick.call(this, e);
        }
        
        // Ensure all features in this category are clickable
        setTimeout(() => {
          // Find all feature options in this category
          makeAllFeaturesClickable(categoryName);
        }, 200);
        
        // Update active class
        document.querySelectorAll('.is-active').forEach(el => {
          if (el !== this) {
            el.classList.remove('is-active');
          }
        });
        
        this.classList.add('is-active');
      };
    });
  }

  // Make all features in a category clickable
  function makeAllFeaturesClickable(categoryName) {
    console.log(`Making features clickable in: ${categoryName}`);
    
    // Find all feature containers
    const featureContainers = document.querySelectorAll('.panel');
    
    featureContainers.forEach(panel => {
      // Skip irrelevant panels
      if (panel.id && panel.id !== categoryName && !panel.classList.contains(categoryName)) {
        return;
      }
      
      // Find all feature options in this panel
      const features = panel.querySelectorAll('.panel-block, .feature-option');
      
      features.forEach(feature => {
        // Make sure it's visible and clickable
        feature.style.pointerEvents = 'auto';
        feature.style.opacity = '1';
        feature.style.display = 'block';
        
        // Remove click handler to prevent duplicates
        feature.removeEventListener('click', featureClickHandler);
        
        // Add enhanced click handler
        feature.addEventListener('click', featureClickHandler);
      });
    });
  }

  // Handler for feature clicks
  function featureClickHandler(e) {
    console.log(`Feature clicked: ${this.textContent.trim()}`);
    
    // Toggle active state
    this.classList.toggle('is-active');
    
    // Get feature name from data attribute or text content
    const featureName = this.dataset.feature || this.textContent.trim();
    
    // Apply the effect (if window.applyEffect is defined)
    if (window.applyEffect) {
      window.applyEffect(featureName);
    }
    
    // Manually trigger effect application for different types of features
    applyFeatureManually(this, featureName);
  }

  // Apply feature effect manually by simulating appropriate actions
  function applyFeatureManually(element, featureName) {
    // Try to find intensity slider if it exists
    const intensitySlider = document.querySelector('.slider, .range, input[type="range"]');
    if (intensitySlider) {
      // Trigger input event to apply effect with current intensity
      const event = new Event('input', { bubbles: true });
      intensitySlider.dispatchEvent(event);
    }
    
    // Try to find color picker if it exists
    const colorPicker = element.querySelector('.color-dot, .color-picker, .color-option');
    if (colorPicker) {
      // Simulate click on color
      colorPicker.click();
    }
    
    // If there's an apply button, click it
    const applyButton = document.querySelector('.apply-button, .button.is-primary');
    if (applyButton) {
      applyButton.click();
    }
  }

  // Fix clicking on feature options
  function fixFeatureClicks() {
    // Find all feature options
    const features = document.querySelectorAll('.panel-block, .feature-option');
    
    features.forEach(feature => {
      // Skip if already enhanced
      if (feature.dataset.enhanced) {
        return;
      }
      
      // Make sure it's visible and clickable
      feature.style.pointerEvents = 'auto';
      feature.style.opacity = '1';
      feature.style.cursor = 'pointer';
      
      // Add enhanced click handler
      feature.addEventListener('click', featureClickHandler);
      
      // Mark as enhanced
      feature.dataset.enhanced = 'true';
    });
    
    // Fix looks and presets section
    const looks = document.querySelectorAll('.look-item, .preset-item, [data-look], [data-preset]');
    looks.forEach(look => {
      // Skip if already enhanced
      if (look.dataset.enhanced) {
        return;
      }
      
      // Make sure it's visible and clickable
      look.style.pointerEvents = 'auto';
      look.style.opacity = '1';
      look.style.cursor = 'pointer';
      
      // Add click handler for looks
      look.addEventListener('click', function() {
        console.log(`Look clicked: ${this.textContent.trim()}`);
        
        // Add active class
        document.querySelectorAll('.look-item.is-active, .preset-item.is-active').forEach(el => {
          el.classList.remove('is-active');
        });
        
        this.classList.add('is-active');
      });
      
      // Mark as enhanced
      look.dataset.enhanced = 'true';
    });
  }

  // Fix navigation between categories
  function fixNavigationBetweenCategories() {
    // Find all panel tabs and tab navigation
    const tabs = document.querySelectorAll('.panel-tabs a, .tabs a');
    
    tabs.forEach(tab => {
      // Preserve original click handler
      const originalClick = tab.onclick;
      
      // Add enhanced click handler
      tab.onclick = function(e) {
        // Get tab name
        const tabName = this.textContent.trim().toLowerCase();
        console.log(`Tab clicked: ${tabName}`);
        
        // Call original handler if it exists
        if (originalClick) {
          originalClick.call(this, e);
        }
        
        // Update active class
        document.querySelectorAll('.is-active').forEach(el => {
          if (el !== this && el.parentNode === this.parentNode) {
            el.classList.remove('is-active');
          }
        });
        
        this.classList.add('is-active');
        
        // Make sure features in this tab are clickable
        setTimeout(() => {
          makeAllFeaturesClickable(tabName);
        }, 200);
      };
    });
  }

  // Fix back button functionality
  function fixBackButton() {
    // Find all back buttons
    const backButtons = document.querySelectorAll('.back-button, [data-action="back"]');
    
    backButtons.forEach(button => {
      // Preserve original click handler
      const originalClick = button.onclick;
      
      // Add enhanced click handler
      button.onclick = function(e) {
        console.log("Back button clicked");
        
        // Call original handler if it exists
        if (originalClick) {
          originalClick.call(this, e);
        }
        
        // Return to main category view
        setTimeout(() => {
          // Reset active states
          document.querySelectorAll('.is-active').forEach(el => {
            el.classList.remove('is-active');
          });
          
          // Make all category links clickable again
          const categoryLinks = document.querySelectorAll('[href^="#"]');
          categoryLinks.forEach(link => {
            link.style.pointerEvents = 'auto';
            link.style.opacity = '1';
          });
          
          // Show main categories, hide subcategories
          const mainCategories = document.querySelectorAll('.bnb-features, .main-category');
          mainCategories.forEach(category => {
            category.style.display = 'block';
          });
          
          const subCategories = document.querySelectorAll('.subcategory, .feature-details');
          subCategories.forEach(subCategory => {
            subCategory.style.display = 'none';
          });
        }, 200);
      };
    });
  }

  // Fix looks and presets section
  function fixLooksAndPresets() {
    // Find looks and presets sections
    const looksSection = document.querySelector('#looks, [data-section="looks"]');
    const presetsSection = document.querySelector('#presets, [data-section="presets"]');
    
    // Fix looks section if it exists
    if (looksSection) {
      enhanceLooksSection(looksSection, 'looks');
    }
    
    // Fix presets section if it exists
    if (presetsSection) {
      enhanceLooksSection(presetsSection, 'presets');
    }
  }

  // Enhance looks or presets section
  function enhanceLooksSection(section, type) {
    console.log(`Enhancing ${type} section`);
    
    // Find all items
    const items = section.querySelectorAll('.look-item, .preset-item, .panel-block');
    
    items.forEach(item => {
      // Make sure it's visible and clickable
      item.style.pointerEvents = 'auto';
      item.style.opacity = '1';
      item.style.cursor = 'pointer';
      
      // Add click handler
      item.addEventListener('click', function() {
        console.log(`${type} item clicked: ${this.textContent.trim()}`);
        
        // Toggle active state
        this.classList.toggle('is-active');
      });
    });
  }
})();