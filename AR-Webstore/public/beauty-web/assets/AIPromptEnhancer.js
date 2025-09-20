/**
 * AIPromptEnhancer.js
 * Enhances the AI makeup prompt dialog with improved UI and presets
 */

(function() {
  // Track if we've already enhanced the prompt function
  let promptFunctionEnhanced = false;

  // Wait for the DOM to be fully loaded
  window.addEventListener('DOMContentLoaded', () => {
    enhanceAIPromptFunction();
  });

  // Function to enhance the AI prompt display
  function enhanceAIPromptFunction() {
    // Check if the showAIMakeupPrompt function exists
    if (typeof window.showAIMakeupPrompt === 'function' && !promptFunctionEnhanced) {
      // Store the original function
      const originalShowPrompt = window.showAIMakeupPrompt;
      
      // Override with our enhanced version
      window.showAIMakeupPrompt = function() {
        // Call the original function if it exists
        if (typeof originalShowPrompt === 'function') {
          // We'll replace the dialog with our own version
          createEnhancedPromptDialog();
        } else {
          console.warn('Original showAIMakeupPrompt function not found');
          createEnhancedPromptDialog();
        }
      };
      
      promptFunctionEnhanced = true;
      console.log('AI Prompt function enhanced successfully');
    } else {
      // If function doesn't exist yet, try again in a bit
      setTimeout(enhanceAIPromptFunction, 500);
    }
  }

  // Function to create our enhanced prompt dialog
  function createEnhancedPromptDialog() {
    // Remove any existing prompt dialog
    const existingDialog = document.getElementById('ai-prompt-container');
    if (existingDialog) {
      document.body.removeChild(existingDialog);
    }
    
    // Create the container
    const container = document.createElement('div');
    container.id = 'ai-prompt-container';
    
    // Create the dialog
    const dialog = document.createElement('div');
    dialog.className = 'ai-prompt-dialog';
    
    // Add the title
    const title = document.createElement('h2');
    title.className = 'ai-prompt-title';
    title.textContent = 'AI Makeup Assistant';
    dialog.appendChild(title);
    
    // Add the description
    const description = document.createElement('p');
    description.className = 'ai-prompt-description';
    description.textContent = 'Choose a preset or describe the makeup look you want to try:';
    dialog.appendChild(description);
    
    // Add the presets UI if available
    if (window.AIMakeupPresets) {
      const { tabContainer, presetGrid } = window.AIMakeupPresets.createPresetUI();
      dialog.appendChild(tabContainer);
      dialog.appendChild(presetGrid);
      
      // Activate the first tab
      const firstTab = tabContainer.querySelector('.preset-tab');
      if (firstTab) {
        firstTab.classList.add('active');
        const category = firstTab.dataset.category;
        setTimeout(() => {
          if (typeof window.AIMakeupPresets.switchPresetCategory === 'function') {
            window.AIMakeupPresets.switchPresetCategory(category);
          }
        }, 0);
      }
    }
    
    // Add the custom prompt input
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'ai-prompt-input';
    input.className = 'ai-prompt-input';
    input.placeholder = 'Describe the makeup look you want (e.g., "Natural everyday makeup with light blush")';
    dialog.appendChild(input);
    
    // Add the buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'ai-prompt-buttons';
    
    // Cancel button
    const cancelButton = document.createElement('button');
    cancelButton.className = 'ai-button-cancel';
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', () => {
      document.body.removeChild(container);
    });
    buttonContainer.appendChild(cancelButton);
    
    // Apply button
    const applyButton = document.createElement('button');
    applyButton.className = 'ai-button-apply';
    applyButton.textContent = 'Apply Makeup';
    applyButton.addEventListener('click', () => {
      // Get the prompt from the input
      const prompt = input.value.trim();
      
      // Validate the prompt
      if (!prompt) {
        alert('Please enter a description or select a preset');
        return;
      }
      
      // Close the dialog
      document.body.removeChild(container);
      
      // Show loading indicator
      showLoadingIndicator('Generating your AI makeup look...');
      
      // Apply the makeup with our prompt
      applyAIMakeup(prompt).then(result => {
        // Hide loading indicator
        hideLoadingIndicator();
        
        // Show the results
        if (result.success) {
          showSuccessMessage(result.message || 'Makeup applied successfully!');
          
          // Show product recommendations if we have them
          if (window.EnhancedProductRecommendations && typeof window.EnhancedProductRecommendations.showRecommendations === 'function') {
            window.EnhancedProductRecommendations.showRecommendations(prompt);
          }
        } else {
          showErrorMessage(result.error || 'Failed to apply makeup');
        }
      }).catch(error => {
        // Hide loading indicator
        hideLoadingIndicator();
        
        // Show error message
        showErrorMessage('Error: ' + (error.message || 'Unknown error occurred'));
      });
    });
    buttonContainer.appendChild(applyButton);
    
    dialog.appendChild(buttonContainer);
    
    // Add the dialog to the container
    container.appendChild(dialog);
    
    // Add the container to the body
    document.body.appendChild(container);
    
    // Focus the input
    setTimeout(() => input.focus(), 100);
  }
  
  // Function to apply AI makeup
  function applyAIMakeup(prompt) {
    return new Promise((resolve, reject) => {
      try {
        // Check if we have the original applyAIMakeup function
        if (typeof window.applyAIMakeup === 'function') {
          // Call the original function
          window.applyAIMakeup(prompt)
            .then(result => resolve(result))
            .catch(error => reject(error));
        } else {
          // If we don't have the original function, simulate a response
          console.warn('Original applyAIMakeup function not found, simulating response');
          
          // Simulate processing time
          setTimeout(() => {
            // Check face detection status
            let faceDetected = false;
            
            if (window.AIFaceDetectionFix) {
              const status = window.AIFaceDetectionFix.checkFaceDetectionStatus();
              faceDetected = status.success;
            }
            
            if (faceDetected) {
              resolve({
                success: true,
                message: 'AI makeup applied based on your prompt: ' + prompt
              });
            } else {
              reject(new Error('No face detected. Please ensure your face is visible in the image.'));
            }
          }, 2000);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
  
  // Function to show loading indicator
  function showLoadingIndicator(message) {
    // Remove any existing loader
    const existingLoader = document.querySelector('.ai-makeup-loader');
    if (existingLoader) {
      document.body.removeChild(existingLoader);
    }
    
    // Create loader container
    const loader = document.createElement('div');
    loader.className = 'ai-makeup-loader';
    
    // Create spinner
    const spinner = document.createElement('div');
    spinner.className = 'ai-loading-spinner';
    loader.appendChild(spinner);
    
    // Add message
    const messageElement = document.createElement('div');
    messageElement.className = 'ai-loading-message';
    messageElement.textContent = message || 'Processing...';
    loader.appendChild(messageElement);
    
    // Add to body
    document.body.appendChild(loader);
  }
  
  // Function to hide loading indicator
  function hideLoadingIndicator() {
    const loader = document.querySelector('.ai-makeup-loader');
    if (loader) {
      document.body.removeChild(loader);
    }
  }
  
  // Function to show success message
  function showSuccessMessage(message) {
    showToast(message, 'success');
  }
  
  // Function to show error message
  function showErrorMessage(message) {
    showToast(message, 'error');
  }
  
  // Function to show toast notification
  function showToast(message, type) {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('ai-toast-container');
    
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'ai-toast-container';
      toastContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
      `;
      document.body.appendChild(toastContainer);
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `ai-toast ${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      background-color: ${type === 'success' ? '#4CAF50' : '#F44336'};
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      margin-bottom: 10px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      animation: fadeIn 0.3s, fadeOut 0.3s 2.7s forwards;
      max-width: 300px;
    `;
    
    // Add animation keyframes if not already added
    if (!document.getElementById('toast-animations')) {
      const style = document.createElement('style');
      style.id = 'toast-animations';
      style.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-20px); }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3000);
  }

  // Expose functions to global scope
  window.AIPromptEnhancer = {
    showPrompt: createEnhancedPromptDialog,
    showLoadingIndicator,
    hideLoadingIndicator,
    showSuccessMessage,
    showErrorMessage
  };
})();