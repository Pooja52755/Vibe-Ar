/**
 * BackButtonFix.js - Specifically fixes the back button functionality
 * 
 * This script ensures that clicking the back button in any category properly
 * returns to the main view, addressing the issue where users couldn't navigate
 * back from makeup products.
 */

(function() {
  // Run when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Wait for app to initialize
    setTimeout(fixBackButton, 1500);
    
    // Run again after more time to catch any late-loaded buttons
    setTimeout(fixBackButton, 3000);
  });
  
  function fixBackButton() {
    console.log("Fixing back button functionality");
    
    // Find all back buttons
    const backButtons = document.querySelectorAll('.back-button, button:contains("Back"), .navbar-item:contains("Back")');
    
    if (backButtons.length === 0) {
      console.log("No back buttons found, creating one");
      createBackButton();
    } else {
      console.log(`Found ${backButtons.length} back buttons, enhancing them`);
      backButtons.forEach(enhanceBackButton);
    }
    
    // Also add global back button handler
    addGlobalBackHandler();
  }
  
  function enhanceBackButton(button) {
    // Skip if already enhanced
    if (button.dataset.backEnhanced) {
      return;
    }
    
    console.log("Enhancing back button:", button.textContent);
    
    // Store original click handler
    const originalClick = button.onclick;
    
    // Replace with enhanced handler
    button.onclick = function(e) {
      console.log("Back button clicked");
      
      // Call original handler if it exists
      if (typeof originalClick === 'function') {
        originalClick.call(this, e);
      }
      
      // Apply our back navigation logic
      performBackNavigation();
      
      // Prevent default behavior
      e.preventDefault();
      return false;
    };
    
    // Make sure button is visible and clickable
    button.style.display = 'flex';
    button.style.opacity = '1';
    button.style.pointerEvents = 'auto';
    
    // Add special styling to make it stand out
    button.style.backgroundColor = '#ff4081';
    button.style.color = 'white';
    button.style.fontWeight = 'bold';
    button.style.padding = '8px 15px';
    button.style.borderRadius = '20px';
    button.style.margin = '5px';
    
    // Mark as enhanced
    button.dataset.backEnhanced = 'true';
  }
  
  function createBackButton() {
    // Find navbar to add back button to
    const navbar = document.querySelector('.navbar, .navbar-brand, header');
    
    if (navbar) {
      // Create back button
      const backButton = document.createElement('a');
      backButton.className = 'navbar-item back-button';
      backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Back';
      
      // Style the button
      backButton.style.backgroundColor = '#ff4081';
      backButton.style.color = 'white';
      backButton.style.fontWeight = 'bold';
      backButton.style.padding = '8px 15px';
      backButton.style.borderRadius = '20px';
      backButton.style.margin = '5px';
      backButton.style.cursor = 'pointer';
      
      // Add click handler
      backButton.addEventListener('click', function(e) {
        console.log("Created back button clicked");
        performBackNavigation();
        e.preventDefault();
        return false;
      });
      
      // Add to navbar
      navbar.insertBefore(backButton, navbar.firstChild);
      
      console.log("Created and added back button to navbar");
    }
  }
  
  function addGlobalBackHandler() {
    // Add global click handler for anything that looks like a back button
    document.addEventListener('click', function(e) {
      // Check if the clicked element is a back button or contains back text
      const target = e.target;
      
      if (target.classList.contains('back-button') || 
          target.textContent.includes('Back') ||
          (target.parentElement && target.parentElement.classList.contains('back-button'))) {
        
        console.log("Back element clicked via global handler");
        performBackNavigation();
      }
    });
  }
  
  function performBackNavigation() {
    console.log("Performing back navigation");
    
    // Reset active states
    document.querySelectorAll('.is-active').forEach(el => {
      // Don't remove from navbar items
      if (!el.classList.contains('navbar-item')) {
        el.classList.remove('is-active');
      }
    });
    
    // Find main categories container
    const mainContainer = document.querySelector('.bnb-features, .main-categories');
    
    if (mainContainer) {
      // Show main container
      mainContainer.style.display = 'block';
      
      // Hide any subcategory panels
      const subPanels = document.querySelectorAll('.subcategory, .feature-details, .panel:not(.main-panel)');
      subPanels.forEach(panel => {
        panel.style.display = 'none';
      });
    } else {
      // If main container not found, show all category panels
      showAllCategoryPanels();
    }
    
    // Make all category links clickable again
    const categoryLinks = document.querySelectorAll('.navbar-item[href^="#"]');
    categoryLinks.forEach(link => {
      link.style.pointerEvents = 'auto';
      link.style.opacity = '1';
    });
    
    // If no specific main container exists, try to create a main view
    createMainView();
  }
  
  function showAllCategoryPanels() {
    // Find all main category panels
    const mainPanels = document.querySelectorAll('.panel');
    
    mainPanels.forEach(panel => {
      // Show panel
      panel.style.display = 'block';
      
      // Make all blocks clickable
      const blocks = panel.querySelectorAll('.panel-block');
      blocks.forEach(block => {
        block.style.pointerEvents = 'auto';
        block.style.opacity = '1';
      });
    });
  }
  
  function createMainView() {
    // Check if main view already exists
    if (document.querySelector('.main-view')) {
      return;
    }
    
    // Find sidebar container
    const sidebar = document.querySelector('.bnb-layout__side, #sidebar-container');
    
    if (!sidebar) {
      return;
    }
    
    // Create main view container
    const mainView = document.createElement('div');
    mainView.className = 'main-view panel';
    
    // Add category buttons
    const categories = [
      { name: 'Makeup', icon: 'fa-magic', href: '#makeup' },
      { name: 'Eyes', icon: 'fa-eye', href: '#eyes' },
      { name: 'Lips', icon: 'fa-tint', href: '#lipstick' },
      { name: 'Retouch', icon: 'fa-sliders-h', href: '#retouch' },
      { name: 'Looks', icon: 'fa-heart', href: '#looks' },
      { name: 'Presets', icon: 'fa-star', href: '#presets' }
    ];
    
    // Add heading
    const heading = document.createElement('div');
    heading.className = 'panel-heading';
    heading.textContent = 'Beauty AR';
    mainView.appendChild(heading);
    
    // Add category buttons
    categories.forEach(category => {
      const button = document.createElement('a');
      button.className = 'panel-block';
      button.href = category.href;
      
      // Add icon if Font Awesome is available
      if (document.querySelector('link[href*="font-awesome"]')) {
        button.innerHTML = `<span class="panel-icon"><i class="fas ${category.icon}"></i></span>${category.name}`;
      } else {
        button.textContent = category.name;
      }
      
      // Add click handler
      button.addEventListener('click', function(e) {
        // Hide main view
        mainView.style.display = 'none';
        
        // Show target category
        const targetId = category.href.replace('#', '');
        const targetPanel = document.getElementById(targetId);
        
        if (targetPanel) {
          targetPanel.style.display = 'block';
        }
        
        e.preventDefault();
        return false;
      });
      
      mainView.appendChild(button);
    });
    
    // Add to sidebar
    sidebar.appendChild(mainView);
  }
})();