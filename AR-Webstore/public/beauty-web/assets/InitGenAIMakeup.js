/**
 * InitGenAIMakeup.js - Initializes the GenAI Makeup feature
 * Ensures that the AI Makeup button is prominently displayed
 * and properly detects images
 */

// Wait for page to load
document.addEventListener('DOMContentLoaded', () => {
  console.log('[InitGenAIMakeup] Initializing GenAI Makeup feature');
  
  // Load the AIPromptStyles.css.js first
  const styleScript = document.createElement('script');
  styleScript.src = './assets/AIPromptStyles.css.js';
  document.head.appendChild(styleScript);
  
  // Create a more prominent AI Makeup button
  setTimeout(createProminentButton, 1000);
  
  // Check for image every 2 seconds
  setInterval(checkForImage, 2000);
});

/**
 * Create a prominent AI Makeup button
 */
function createProminentButton() {
  // Check if button already exists
  if (document.getElementById('ai-makeup-button')) return;
  
  console.log('[InitGenAIMakeup] Creating prominent AI Makeup button');
  
  // Create button container
  const buttonContainer = document.createElement('div');
  buttonContainer.id = 'ai-makeup-button-container';
  
  // Create button
  const button = document.createElement('button');
  button.id = 'ai-makeup-button';
  button.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" stroke-width="2"/><path d="M12 16V16.01M12 8V12" stroke="white" stroke-width="2" stroke-linecap="round"/></svg> AI Makeup';
  
  // Add click handler
  button.addEventListener('click', () => {
    // Make sure GenAIMakeup is initialized
    if (window.genAIMakeup) {
      // Get current image and open prompt dialog
      window.genAIMakeup.getCurrentImageData().then(imageData => {
        if (imageData) {
          window.genAIMakeup.lastUploadedImage = imageData;
          window.genAIMakeup.showPromptInput();
        } else {
          alert("Please upload an image first before using AI Makeup");
        }
      });
    } else {
      alert("AI Makeup feature is initializing. Please try again in a moment.");
    }
  });
  
  // Append button to container
  buttonContainer.appendChild(button);
  
  // Append container to body
  document.body.appendChild(buttonContainer);
  
  // Set initial state (disabled)
  updateButtonState(false);
}

/**
 * Check if an image is currently loaded
 */
function checkForImage() {
  // Skip if GenAIMakeup isn't initialized yet
  if (!window.genAIMakeup) return;
  
  // Use the getCurrentImageData method to check for an image
  window.genAIMakeup.getCurrentImageData().then(imageData => {
    if (imageData) {
      console.log('[InitGenAIMakeup] Image detected');
      window.genAIMakeup.lastUploadedImage = imageData;
      updateButtonState(true);
    } else {
      console.log('[InitGenAIMakeup] No image detected');
      updateButtonState(false);
    }
  });
}

/**
 * Update button state based on image availability
 */
function updateButtonState(hasImage) {
  const button = document.getElementById('ai-makeup-button');
  if (!button) return;
  
  if (hasImage) {
    button.removeAttribute('disabled');
    button.style.opacity = '1';
    button.style.cursor = 'pointer';
    // Stop pulsing animation when active
    button.style.animation = 'none';
  } else {
    button.setAttribute('disabled', 'true');
    button.style.opacity = '0.6';
    button.style.cursor = 'not-allowed';
    // Restart pulsing animation when disabled
    button.style.animation = 'pulseBounce 2s infinite';
  }
}