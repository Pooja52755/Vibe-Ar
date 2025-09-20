/**
 * GenAIButton.js
 * 
 * This script creates a prominent GenAI makeup button that will always appear
 * on the page, ensuring users can access the AI makeup features easily.
 */

(function() {
  console.log('GenAI Button initialization started');

  // Create and add the button as soon as possible
  document.addEventListener('DOMContentLoaded', addGenAIButton);
  
  // Also try on window load (as a backup)
  window.addEventListener('load', addGenAIButton);
  
  // For immediate execution
  if (document.readyState !== 'loading') {
    addGenAIButton();
  }
  
  // Function to add the GenAI button
  function addGenAIButton() {
    // Only create once
    if (document.getElementById('genai-makeup-button')) {
      return;
    }
    
    console.log('Creating GenAI Makeup button');
    
    // Create button container
    const container = document.createElement('div');
    container.id = 'genai-makeup-button-container';
    container.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 10000;
    `;
    
    // Create the button with strong visual presence
    const button = document.createElement('button');
    button.id = 'genai-makeup-button';
    button.innerHTML = '✨ GenAI Makeup';
    button.style.cssText = `
      background: linear-gradient(135deg, #8e44ad, #3498db);
      color: white;
      border: none;
      border-radius: 20px;
      padding: 10px 15px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      gap: 5px;
      animation: pulse 2s infinite;
    `;
    
    // Add pulsing animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
        50% { transform: scale(1.05); box-shadow: 0 6px 12px rgba(0,0,0,0.3); }
        100% { transform: scale(1); box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
      }
    `;
    document.head.appendChild(style);
    
    // Add click event
    button.onclick = function() {
      showGenAIMakeupPrompt();
    };
    
    // Add button to container
    container.appendChild(button);
    
    // Add container to document
    document.body.appendChild(container);
    
    console.log('GenAI Makeup button added to page');
  }
  
  // Simple prompt dialog function
  function showGenAIMakeupPrompt() {
    // Try to use the existing function if available
    if (window.AIPromptEnhancer && typeof window.AIPromptEnhancer.showPrompt === 'function') {
      window.AIPromptEnhancer.showPrompt();
      return;
    }
    
    if (window.showAIMakeupPrompt && typeof window.showAIMakeupPrompt === 'function') {
      window.showAIMakeupPrompt();
      return;
    }
    
    // Fallback to a simple prompt
    const userPrompt = prompt("Enter makeup description (e.g., 'Natural everyday makeup with light blush'):");
    
    if (userPrompt && userPrompt.trim() !== '') {
      alert("Applying makeup: " + userPrompt + "\n\nPlease note that this is a fallback message. The full AI makeup functionality will be available soon.");
    }
  }
  
  // Make sure to periodically check and add the button
  // in case it gets removed by other scripts
  setInterval(function() {
    if (!document.getElementById('genai-makeup-button')) {
      addGenAIButton();
    }
  }, 2000);
})();