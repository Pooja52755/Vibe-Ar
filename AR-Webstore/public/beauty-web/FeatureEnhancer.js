/**
 * FeatureEnhancer.js - Ensures all makeup features are selectable and visible
 * 
 * This script fixes issues with feature selection, ensuring all makeup 
 * features are visible and clickable, and that the correct effect is applied
 * when a feature is selected.
 */

(function() {
  // Run after page load
  window.addEventListener('load', function() {
    // Wait for beauty app to fully initialize
    setTimeout(enhanceFeatures, 2000);
  });
  
  function enhanceFeatures() {
    console.log("Enhancing makeup features");
    
    // Make all features selectable
    makeAllFeaturesSelectable();
    
    // Fix event handlers for feature application
    fixFeatureEvents();
    
    // Run periodically to ensure fixes remain applied
    setInterval(function() {
      makeAllFeaturesSelectable();
      fixFeatureEvents();
      ensureAllPanelsAreVisible();
    }, 3000);
  }
  
  function makeAllFeaturesSelectable() {
    // Find all feature options across all panels
    const features = document.querySelectorAll('.panel-block, .feature-option, .feature-item');
    
    features.forEach(feature => {
      // Skip if already enhanced
      if (feature.dataset.featureEnhanced) {
        return;
      }
      
      // Make feature selectable
      feature.style.pointerEvents = 'auto';
      feature.style.opacity = '1';
      feature.style.display = 'block';
      feature.style.cursor = 'pointer';
      
      // Make sure it's not disabled
      feature.removeAttribute('disabled');
      feature.classList.remove('is-disabled');
      
      // Add click handler with appropriate effect application
      feature.addEventListener('click', function(e) {
        // Get feature name
        const featureName = feature.dataset.feature || feature.textContent.trim();
        console.log(`Feature selected: ${featureName}`);
        
        // Toggle active state
        feature.classList.toggle('is-active');
        
        // Apply feature effect
        applyFeatureEffect(feature, featureName);
        
        // Prevent default if it's a link
        e.preventDefault();
        return false;
      });
      
      // Mark as enhanced
      feature.dataset.featureEnhanced = 'true';
    });
  }
  
  function fixFeatureEvents() {
    // Find all slider controls
    const sliders = document.querySelectorAll('input[type="range"], .slider');
    
    sliders.forEach(slider => {
      // Skip if already enhanced
      if (slider.dataset.sliderEnhanced) {
        return;
      }
      
      // Make sure slider is enabled
      slider.removeAttribute('disabled');
      slider.style.pointerEvents = 'auto';
      slider.style.opacity = '1';
      
      // Add input event handler
      slider.addEventListener('input', function() {
        // Find active feature
        const activeFeature = document.querySelector('.panel-block.is-active, .feature-option.is-active');
        if (activeFeature) {
          const featureName = activeFeature.dataset.feature || activeFeature.textContent.trim();
          applyFeatureEffect(activeFeature, featureName, slider.value);
        }
      });
      
      // Mark as enhanced
      slider.dataset.sliderEnhanced = 'true';
    });
    
    // Find all color pickers
    const colorPickers = document.querySelectorAll('.color-picker, .color-selector');
    
    colorPickers.forEach(picker => {
      // Skip if already enhanced
      if (picker.dataset.pickerEnhanced) {
        return;
      }
      
      // Find all color options
      const colors = picker.querySelectorAll('.color-option, .color-dot');
      
      colors.forEach(color => {
        // Make color selectable
        color.style.pointerEvents = 'auto';
        color.style.cursor = 'pointer';
        
        // Add click handler
        color.addEventListener('click', function() {
          // Update selected color
          colors.forEach(c => c.classList.remove('is-selected'));
          color.classList.add('is-selected');
          
          // Find active feature
          const activeFeature = document.querySelector('.panel-block.is-active, .feature-option.is-active');
          if (activeFeature) {
            const featureName = activeFeature.dataset.feature || activeFeature.textContent.trim();
            const colorValue = color.dataset.color || window.getComputedStyle(color).backgroundColor;
            applyFeatureEffect(activeFeature, featureName, null, colorValue);
          }
        });
      });
      
      // Mark as enhanced
      picker.dataset.pickerEnhanced = 'true';
    });
  }
  
  function applyFeatureEffect(featureElement, featureName, intensity, color) {
    // Try multiple approaches to apply the feature effect
    
    // Approach 1: Use global applyEffect function if available
    if (typeof window.applyEffect === 'function') {
      window.applyEffect(featureName, intensity, color);
      return;
    }
    
    // Approach 2: Use feature-specific function if available
    const featureTypeMatch = featureName.match(/(lipstick|blush|eyeshadow|foundation|eyeliner|mascara|eyebrow|contour|highlight)/i);
    if (featureTypeMatch) {
      const featureType = featureTypeMatch[0].toLowerCase();
      const applyFunctionName = `apply${featureType.charAt(0).toUpperCase() + featureType.slice(1)}`;
      
      if (typeof window[applyFunctionName] === 'function') {
        window[applyFunctionName](featureName, intensity, color);
        return;
      }
    }
    
    // Approach 3: Try to find and click an apply button
    const applyButton = document.querySelector('.apply-button, .button.is-primary:contains("Apply")');
    if (applyButton) {
      applyButton.click();
      return;
    }
    
    // Approach 4: Trigger a custom event that the app might be listening for
    const event = new CustomEvent('featureApplied', {
      detail: {
        feature: featureName,
        element: featureElement,
        intensity: intensity,
        color: color
      },
      bubbles: true
    });
    featureElement.dispatchEvent(event);
  }
  
  function ensureAllPanelsAreVisible() {
    // Find all panels
    const panels = document.querySelectorAll('.panel');
    
    panels.forEach(panel => {
      // Make panel visible and full width
      panel.style.display = 'block';
      panel.style.width = '100%';
      panel.style.maxWidth = '100%';
      panel.style.overflowX = 'hidden';
      
      // Ensure panel is not hidden by other styles
      panel.style.visibility = 'visible';
      panel.style.opacity = '1';
      panel.style.pointerEvents = 'auto';
    });
  }
})();