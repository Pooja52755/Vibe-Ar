/**
 * BackButtonFix.js - Ensures the back button is visible and working
 */

(function() {
  console.log('[BackButtonFix] Initializing...');

  // Wait for document to be ready
  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('load', init);
  
  // For immediate execution if already loaded
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  }

  /**
   * Initialize the back button fix
   */
  function init() {
    console.log('[BackButtonFix] Setting up...');
    
    // Fix back button immediately
    setTimeout(fixBackButton, 500);
    
    // Continue checking periodically
    setInterval(fixBackButton, 2000);
  }

  /**
   * Fix back button visibility and functionality
   */
  function fixBackButton() {
    // Look for the back button with various selectors
    const backButton = findBackButton();
    
    if (backButton) {
      // Ensure the button is visible and styled correctly
      enhanceBackButton(backButton);
    } else {
      // Create a back button if none exists
      createBackButton();
    }
    
    // Remove verification buttons
    removeVerificationButtons();
  }

  /**
   * Find back button in the page
   * @returns {HTMLElement|null} Back button element or null
   */
  function findBackButton() {
    // Try various selectors for back button
    return document.querySelector('.back-button') ||
           document.querySelector('[aria-label="Back"]') ||
           document.querySelector('[data-role="back"]') ||
           Array.from(document.querySelectorAll('button')).find(btn => 
             btn.textContent.includes('Back') || 
             btn.innerHTML.includes('&larr;') ||
             btn.innerHTML.includes('←')
           ) ||
           document.querySelector('.nav-back') ||
           document.querySelector('.navigation-back');
  }

  /**
   * Enhance back button styles and visibility
   * @param {HTMLElement} button - Back button element
   */
  function enhanceBackButton(button) {
    // Make sure button is visible
    button.style.display = 'block';
    button.style.visibility = 'visible';
    button.style.opacity = '1';
    
    // Enhance styles
    button.style.backgroundColor = '#485FC7';
    button.style.color = 'white';
    button.style.padding = '8px 16px';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.fontWeight = 'bold';
    button.style.cursor = 'pointer';
    button.style.zIndex = '9999';
    
    // Check if button is in a container
    const parent = button.parentElement;
    if (parent) {
      parent.style.display = 'block';
      parent.style.visibility = 'visible';
      parent.style.opacity = '1';
    }
    
    // Make sure button is not covered
    button.style.position = button.style.position === 'absolute' ? 'absolute' : 'relative';
    
    // Ensure it's clickable
    button.style.pointerEvents = 'auto';
    
    // Set aria attributes for accessibility
    button.setAttribute('aria-label', 'Back');
    button.setAttribute('role', 'button');
  }

  /**
   * Create a new back button if none exists
   */
  function createBackButton() {
    // Check if we already created a back button
    if (document.getElementById('enhanced-back-button')) {
      return;
    }
    
    // Create button
    const button = document.createElement('button');
    button.id = 'enhanced-back-button';
    button.className = 'back-button';
    button.textContent = '← Back';
    
    // Style button
    button.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      background-color: #485FC7;
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
      z-index: 9999;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;
    
    // Add click handler
    button.onclick = function() {
      // Try to navigate back
      if (window.history && window.history.length > 1) {
        window.history.back();
      } else {
        // Fallback to parent page
        window.location.href = '../index.html';
      }
    };
    
    // Add to document
    document.body.appendChild(button);
  }

  /**
   * Remove verification and mock buttons
   */
  function removeVerificationButtons() {
    // Remove test verification button
    const testButton = document.getElementById('test-verification-button');
    if (testButton) {
      testButton.style.display = 'none';
      // Try to remove completely
      if (testButton.parentElement) {
        testButton.parentElement.removeChild(testButton);
      }
    }
    
    // Remove show mock products button
    const mockButton = document.getElementById('show-mock-products-button');
    if (mockButton) {
      mockButton.style.display = 'none';
      // Try to remove completely
      if (mockButton.parentElement) {
        mockButton.parentElement.removeChild(mockButton);
      }
    }
    
    // Remove any other buttons with similar text
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(btn => {
      const text = btn.textContent.toLowerCase();
      if (text.includes('mock product') || 
          text.includes('verify') || 
          text.includes('test') || 
          text.includes('product behavior')) {
        btn.style.display = 'none';
        // Try to remove completely
        if (btn.parentElement) {
          btn.parentElement.removeChild(btn);
        }
      }
    });
  }
})();