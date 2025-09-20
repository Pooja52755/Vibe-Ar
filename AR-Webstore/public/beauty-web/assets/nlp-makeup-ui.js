/**
 * nlp-makeup-ui.js
 * 
 * This module provides a user interface for entering natural language
 * makeup prompts and handles the interaction with the GenAI makeup integration.
 */

(function() {
  console.log('[NLPMakeupUI] Initializing...');
  
  // Create the UI on page load
  window.addEventListener('DOMContentLoaded', initializeUI);
  window.addEventListener('load', initializeUI);
  
  // Also try immediate initialization
  if (document.readyState !== 'loading') {
    initializeUI();
  }
  
  /**
   * Initialize the natural language makeup UI
   */
  function initializeUI() {
    // Remove any existing buttons first to prevent duplicates
    const existingButtons = document.querySelectorAll('#nlp-makeup-button');
    existingButtons.forEach(button => {
      button.parentNode.removeChild(button);
    });
    
    console.log('[NLPMakeupUI] Creating UI elements');
    
    // Create the main button
    createMainButton();
    
    // Set up periodic check to ensure only one button is visible
    setInterval(ensureSingleButtonVisible, 3000);
  }
  
  /**
   * Create the main NLP makeup button
   */
  function createMainButton() {
    const button = document.createElement('button');
    button.id = 'nlp-makeup-button';
    button.innerHTML = '✨ AI Makeup Stylist';
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      background-color: #6200ee;
      color: white;
      border: none;
      border-radius: 25px;
      padding: 12px 20px;
      font-size: 16px;
      font-weight: bold;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      z-index: 9999;
      display: flex;
      align-items: center;
      transition: all 0.3s ease;
    `;
    
    // Add hover effects
    button.onmouseenter = function() {
      this.style.transform = 'scale(1.05)';
      this.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
    };
    
    button.onmouseleave = function() {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    };
    
    // Add click handler
    button.onclick = showPromptDialog;
    
    // Add to document
    document.body.appendChild(button);
    
    // Add button animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); }
        50% { transform: scale(1.05); box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); }
        100% { transform: scale(1); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); }
      }
      
      #nlp-makeup-button {
        animation: pulse 3s infinite;
      }
    `;
    document.head.appendChild(style);
  }
  
  /**
   * Ensure only a single button is visible
   */
  function ensureSingleButtonVisible() {
    const buttons = document.querySelectorAll('#nlp-makeup-button');
    if (buttons.length > 1) {
      // Remove all except the first one
      for (let i = 1; i < buttons.length; i++) {
        buttons[i].parentNode.removeChild(buttons[i]);
      }
    } else if (buttons.length === 0) {
      // Create a new button if none exists
      createMainButton();
    }
    
    // Check if we need to apply any pending makeup components
    if (window.MakeupComponentEnforcer && window.MakeupComponentEnforcer.ensureAllComponentsApplied) {
      window.MakeupComponentEnforcer.ensureAllComponentsApplied();
    }
  }
  
  /**
   * Show the prompt dialog for entering natural language makeup requests
   */
  function showPromptDialog() {
    // Check if an image is loaded
    if (!hasImage()) {
      showToast('Please upload or take a photo first');
      return;
    }
    
    // Create dialog overlay
    const overlay = document.createElement('div');
    overlay.id = 'nlp-makeup-dialog';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.75);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10001;
    `;
    
    // Create dialog content
    const dialog = document.createElement('div');
    dialog.style.cssText = `
      width: 90%;
      max-width: 500px;
      background-color: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      max-height: 80vh;
      overflow-y: auto;
    `;
    
    // Create header
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    `;
    
    const title = document.createElement('h2');
    title.textContent = '✨ AI Makeup Stylist';
    title.style.cssText = `
      margin: 0;
      color: #6200ee;
      font-size: 24px;
    `;
    
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.style.cssText = `
      background: none;
      border: none;
      font-size: 28px;
      cursor: pointer;
      color: #888;
      padding: 0;
      margin: 0;
      line-height: 1;
    `;
    closeButton.onclick = function() {
      document.body.removeChild(overlay);
    };
    
    header.appendChild(title);
    header.appendChild(closeButton);
    
    // Create description
    const description = document.createElement('p');
    description.textContent = 'Describe the makeup look you want in plain English:';
    description.style.cssText = `
      margin: 0 0 16px 0;
      color: #555;
    `;
    
    // Create input field
    const input = document.createElement('textarea');
    input.placeholder = 'e.g., "Make me ready for a wedding" or "Apply natural everyday makeup"';
    input.style.cssText = `
      width: 100%;
      min-height: 100px;
      padding: 12px;
      border: 2px solid #d0d0d0;
      border-radius: 8px;
      font-size: 16px;
      resize: vertical;
      margin-bottom: 16px;
      box-sizing: border-box;
    `;
    
    // Add suggestion section
    const suggestionsLabel = document.createElement('p');
    suggestionsLabel.textContent = 'Try one of these:';
    suggestionsLabel.style.cssText = `
      margin: 0 0 8px 0;
      color: #555;
      font-size: 14px;
    `;
    
    // Suggestions container
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 24px;
    `;
    
    // Add suggestion chips
    const suggestions = [
      'Make me ready for a wedding',
      'Apply natural everyday makeup',
      'Give me a glamorous evening look',
      'Make me look professional for a job interview',
      'Create a summer beach makeup look',
      'Apply bold makeup for a party',
      'Give me a soft romantic look'
    ];
    
    suggestions.forEach(suggestion => {
      const chip = document.createElement('button');
      chip.textContent = suggestion;
      chip.style.cssText = `
        background-color: #f0f0f0;
        border: none;
        border-radius: 16px;
        padding: 8px 12px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
      `;
      
      chip.onmouseover = function() {
        this.style.backgroundColor = '#e0e0e0';
      };
      
      chip.onmouseout = function() {
        this.style.backgroundColor = '#f0f0f0';
      };
      
      chip.onclick = function() {
        input.value = this.textContent;
      };
      
      suggestionsContainer.appendChild(chip);
    });
    
    // Create buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = `
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    `;
    
    // Create cancel button
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.cssText = `
      padding: 10px 16px;
      background-color: transparent;
      border: 1px solid #d0d0d0;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      color: #555;
    `;
    cancelButton.onclick = function() {
      document.body.removeChild(overlay);
    };
    
    // Create apply button
    const applyButton = document.createElement('button');
    applyButton.textContent = 'Apply Makeup';
    applyButton.style.cssText = `
      padding: 10px 20px;
      background-color: #6200ee;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
    `;
    
    // Add hover effects
    applyButton.onmouseover = function() {
      this.style.backgroundColor = '#7722ff';
    };
    
    applyButton.onmouseout = function() {
      this.style.backgroundColor = '#6200ee';
    };
    
    // Handle apply button click
    applyButton.onclick = function() {
      const prompt = input.value.trim();
      
      if (prompt === '') {
        // Highlight input if empty
        input.style.border = '2px solid #ff5252';
        setTimeout(() => {
          input.style.border = '2px solid #d0d0d0';
        }, 2000);
        return;
      }
      
      // Remove dialog
      document.body.removeChild(overlay);
      
      // Process the prompt
      processNLPrompt(prompt);
    };
    
    // Assemble buttons
    buttonsContainer.appendChild(cancelButton);
    buttonsContainer.appendChild(applyButton);
    
    // Assemble dialog
    dialog.appendChild(header);
    dialog.appendChild(description);
    dialog.appendChild(input);
    dialog.appendChild(suggestionsLabel);
    dialog.appendChild(suggestionsContainer);
    dialog.appendChild(buttonsContainer);
    
    // Add dialog to overlay
    overlay.appendChild(dialog);
    
    // Add overlay to document
    document.body.appendChild(overlay);
    
    // Focus input
    setTimeout(() => {
      input.focus();
    }, 100);
  }
  
  /**
   * Process a natural language prompt
   * @param {string} prompt - The user's prompt
   */
  async function processNLPrompt(prompt) {
    try {
      // Check if GenAI integration is available
      if (!window.GenAIMakeupIntegration) {
        throw new Error('GenAI makeup integration is not available');
      }
      
      // Check for specific component requests
      const componentRequests = extractComponentRequests(prompt);
      console.log('[NLPMakeupUI] Detected component requests:', componentRequests);
      
      // Process the prompt
      const recommendations = await window.GenAIMakeupIntegration.processPrompt(prompt);
      
      // Apply the recommended filters
      if (recommendations.filters && recommendations.filters.length > 0) {
        await window.GenAIMakeupIntegration.applyRecommendedFilters(recommendations.filters);
        
        // Apply any specific component requests that were detected
        if (Object.keys(componentRequests).length > 0 && 
            window.MakeupComponentEnforcer && window.MakeupComponentEnforcer.enforceComponentApplication) {
          
          // Wait a bit for the main filters to apply
          setTimeout(() => {
            // Apply each requested component
            Object.keys(componentRequests).forEach(component => {
              window.MakeupComponentEnforcer.enforceComponentApplication(component, componentRequests[component]);
            });
            
            // Show a message about specific components
            const componentNames = Object.keys(componentRequests).map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ');
            showToast(`Applied specific components: ${componentNames}`);
          }, 500);
        }
      }
      
      // Display product recommendations
      window.GenAIMakeupIntegration.displayRecommendedProducts(
        recommendations.products, 
        recommendations.lookDescription
      );
    } catch (error) {
      console.error('[NLPMakeupUI] Error processing prompt:', error);
      showToast('Error: ' + error.message);
    }
  }
  
  /**
   * Check if an image is loaded in the app
   * @returns {boolean} - True if an image is loaded
   */
  function hasImage() {
    // Check lastProcessedImage
    if (window.lastProcessedImage) {
      return true;
    }
    
    // Check if store has image
    if (window.store && window.store.hasImage && window.store.hasImage()) {
      return true;
    }
    
    // Check for visible images in the makeup area
    const makeupImages = document.querySelectorAll('.bnb-makeup img');
    if (makeupImages.length > 0) {
      return true;
    }
    
    // Check for canvas elements
    const makeupCanvas = document.querySelectorAll('.bnb-makeup canvas');
    if (makeupCanvas.length > 0) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Show a toast message
   * @param {string} message - The message to show
   */
  function showToast(message) {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.nlp-toast-message');
    existingToasts.forEach(toast => {
      document.body.removeChild(toast);
    });
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = 'nlp-toast-message';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 12px 24px;
      border-radius: 24px;
      z-index: 10001;
      font-size: 16px;
      animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
      pointer-events: none;
    `;
    
    // Add animation if not already added
    if (!document.getElementById('nlp-animations')) {
      const style = document.createElement('style');
      style.id = 'nlp-animations';
      style.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; transform: translate(-50%, 0); }
          to { opacity: 0; transform: translate(-50%, -20px); }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Add to document
    document.body.appendChild(toast);
    
    // Remove after delay
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3000);
  }
})();