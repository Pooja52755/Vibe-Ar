/**
 * This script modifies the Vue components to fix back button functionality
 * and make selected features visible in the beauty-web app.
 */

(function() {
  // Wait for app to initialize
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(applyFixes, 1000);
  });
  
  function applyFixes() {
    // Fix back button navigation in UI
    fixBackNavigation();
    
    // Make sure feature selections work
    fixFeatureSelection();
    
    // Add selected features panel
    addSelectedFeaturesPanel();
    
    // Run periodically to ensure fixes remain
    setInterval(function() {
      fixBackNavigation();
      fixFeatureSelection();
      updateSelectedFeaturesPanel();
    }, 3000);
  }
  
  function fixBackNavigation() {
    // Find all back buttons
    const backButtons = document.querySelectorAll('.back-button, a[href="#back"], button:contains("Back")');
    
    backButtons.forEach(button => {
      // Skip if already fixed
      if (button.dataset.backFixed) {
        return;
      }
      
      // Enhance click behavior
      button.addEventListener('click', function(e) {
        console.log("Back button clicked");
        
        // Show main categories
        const mainCategories = document.querySelectorAll('.panel');
        mainCategories.forEach(panel => {
          panel.style.display = 'block';
          panel.style.opacity = '1';
        });
        
        // Reset active states
        document.querySelectorAll('.is-active:not(.navbar-item)').forEach(el => {
          el.classList.remove('is-active');
        });
        
        // Prevent default
        e.preventDefault();
        return false;
      });
      
      // Mark as fixed
      button.dataset.backFixed = 'true';
    });
    
    // If no back buttons found, create one
    if (backButtons.length === 0) {
      createBackButton();
    }
  }
  
  function createBackButton() {
    const navbar = document.querySelector('.navbar, .navbar-brand');
    
    if (navbar) {
      // Create back button
      const backButton = document.createElement('a');
      backButton.className = 'navbar-item back-button';
      backButton.href = '#back';
      backButton.innerHTML = '← Back';
      
      // Style it
      backButton.style.cssText = `
        color: white;
        background-color: #485FC7;
        border-radius: 4px;
        font-weight: bold;
        margin-right: 10px;
      `;
      
      // Add click handler
      backButton.addEventListener('click', function(e) {
        // Show main categories
        const mainCategories = document.querySelectorAll('.panel');
        mainCategories.forEach(panel => {
          panel.style.display = 'block';
          panel.style.opacity = '1';
        });
        
        // Reset active states
        document.querySelectorAll('.is-active:not(.navbar-item)').forEach(el => {
          el.classList.remove('is-active');
        });
        
        // Prevent default
        e.preventDefault();
        return false;
      });
      
      // Add to navbar
      navbar.insertBefore(backButton, navbar.firstChild);
    }
  }
  
  function fixFeatureSelection() {
    // Find all feature options
    const features = document.querySelectorAll('.panel-block');
    
    features.forEach(feature => {
      // Skip if already fixed
      if (feature.dataset.featureFixed) {
        return;
      }
      
      // Make sure feature is selectable
      feature.style.pointerEvents = 'auto';
      feature.style.opacity = '1';
      feature.style.cursor = 'pointer';
      
      // Enhance click behavior
      feature.addEventListener('click', function() {
        // Toggle active state
        this.classList.toggle('is-active');
        
        // Update selected features panel
        updateSelectedFeaturesPanel();
      });
      
      // Mark as fixed
      feature.dataset.featureFixed = 'true';
    });
  }
  
  function addSelectedFeaturesPanel() {
    // Check if panel already exists
    if (document.getElementById('selected-features-panel')) {
      return;
    }
    
    // Find sidebar
    const sidebar = document.querySelector('.bnb-layout__side, .sidebar');
    
    if (sidebar) {
      // Create selected features panel
      const panel = document.createElement('div');
      panel.id = 'selected-features-panel';
      panel.className = 'panel';
      panel.style.marginTop = '20px';
      
      // Add heading
      const heading = document.createElement('p');
      heading.className = 'panel-heading';
      heading.textContent = 'Selected Features';
      panel.appendChild(heading);
      
      // Create empty content
      const content = document.createElement('div');
      content.id = 'selected-features-content';
      content.className = 'panel-blocks';
      panel.appendChild(content);
      
      // Add to sidebar
      sidebar.appendChild(panel);
      
      // Initial update
      updateSelectedFeaturesPanel();
    }
  }
  
  function updateSelectedFeaturesPanel() {
    // Find the content container
    const content = document.getElementById('selected-features-content');
    
    if (!content) {
      return;
    }
    
    // Clear current content
    content.innerHTML = '';
    
    // Find all active features
    const activeFeatures = document.querySelectorAll('.panel-block.is-active');
    
    if (activeFeatures.length === 0) {
      // No active features
      const noFeatures = document.createElement('div');
      noFeatures.className = 'panel-block';
      noFeatures.textContent = 'No features selected';
      noFeatures.style.fontStyle = 'italic';
      content.appendChild(noFeatures);
    } else {
      // Add each active feature
      activeFeatures.forEach(feature => {
        const featureItem = document.createElement('div');
        featureItem.className = 'panel-block';
        featureItem.textContent = feature.textContent.trim();
        
        // Add remove button
        const removeButton = document.createElement('button');
        removeButton.className = 'delete is-small';
        removeButton.style.marginLeft = 'auto';
        removeButton.addEventListener('click', function() {
          // Remove active class from original feature
          feature.classList.remove('is-active');
          // Update panel
          updateSelectedFeaturesPanel();
        });
        
        featureItem.appendChild(removeButton);
        content.appendChild(featureItem);
      });
    }
  }
})();