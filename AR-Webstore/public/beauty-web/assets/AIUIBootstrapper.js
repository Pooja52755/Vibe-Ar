/**
 * AIUIBootstrapper.js
 * Bootstraps the AI Makeup UI components as soon as the app loads
 * 
 * This script ensures that the AI makeup interface is properly initialized
 * and that the button for launching the AI features is prominently displayed
 * in the UI right from the start.
 */

(function() {
  console.log('AI Makeup UI Bootstrapper started');
  
  // Configuration
  const config = {
    buttonDelay: 800,        // Delay before showing the button (ms)
    maxInitAttempts: 10,     // Maximum number of initialization attempts
    attemptInterval: 500,    // Interval between attempts (ms)
    checkFaceInterval: 2000, // Interval to check for face detection (ms)
    autoPrompt: false        // Whether to auto-show the prompt on startup
  };
  
  // State tracking
  let initAttempts = 0;
  let appInitialized = false;
  let aiButtonCreated = false;
  let faceCheckInterval = null;
  
  // Wait for DOM content to be loaded
  window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded, starting AI UI initialization');
    initAIUI();
  });
  
  // Also try on window load (as a backup)
  window.addEventListener('load', () => {
    if (!appInitialized) {
      console.log('Window loaded, starting AI UI initialization');
      initAIUI();
    }
  });
  
  /**
   * Initialize the AI UI components
   */
  function initAIUI() {
    // If already initialized, do nothing
    if (appInitialized) return;
    
    console.log(`AI UI initialization attempt ${initAttempts + 1}/${config.maxInitAttempts}`);
    
    // Check if the app object is available
    if (window.app && typeof window.app === 'object') {
      console.log('App object found, proceeding with initialization');
      onAppAvailable(window.app);
    } else {
      // Increment attempts counter
      initAttempts++;
      
      // If we haven't exceeded max attempts, try again
      if (initAttempts < config.maxInitAttempts) {
        setTimeout(initAIUI, config.attemptInterval);
      } else {
        console.warn('Failed to initialize AI UI after maximum attempts');
      }
    }
  }
  
  /**
   * Called when the app object becomes available
   */
  function onAppAvailable(app) {
    console.log('App is available, creating AI UI components');
    appInitialized = true;
    
    // Create the AI makeup button
    setTimeout(createAIMakeupButton, config.buttonDelay);
    
    // Start periodic face detection check
    startFaceDetectionCheck();
    
    // Apply our enhanced face detection methods
    if (window.AIFaceDetectionFix) {
      window.AIFaceDetectionFix.enhanceFaceDetection(app);
    }
    
    // Auto-show the prompt if configured
    if (config.autoPrompt) {
      setTimeout(() => {
        if (typeof showAIMakeupPrompt === 'function') {
          showAIMakeupPrompt();
        }
      }, config.buttonDelay + 1000);
    }
  }
  
  /**
   * Creates the AI Makeup button in the UI
   */
  function createAIMakeupButton() {
    // If button already created, do nothing
    if (aiButtonCreated) return;
    
    console.log('Creating AI Makeup button');
    
    // Create button container
    const container = document.createElement('div');
    container.id = 'ai-makeup-button-container';
    
    // Create the button
    const button = document.createElement('button');
    button.id = 'ai-makeup-button';
    button.innerHTML = '<span>✨</span> AI Makeup';
    
    // Add event listener to show the AI prompt
    button.addEventListener('click', () => {
      if (typeof showAIMakeupPrompt === 'function') {
        showAIMakeupPrompt();
      } else {
        alert('AI Makeup feature is still initializing. Please try again in a moment.');
      }
    });
    
    // Add tooltip explaining the feature
    const tooltip = document.createElement('div');
    tooltip.className = 'ai-button-tooltip';
    tooltip.textContent = 'Try AI-powered makeup styles';
    tooltip.style.cssText = `
      position: absolute;
      bottom: -30px;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s;
    `;
    
    // Show tooltip on hover
    button.addEventListener('mouseenter', () => {
      tooltip.style.opacity = '1';
    });
    
    button.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });
    
    // Add button and tooltip to container
    container.appendChild(button);
    container.appendChild(tooltip);
    
    // Add container to document
    document.body.appendChild(container);
    
    // Mark button as created
    aiButtonCreated = true;
    
    console.log('AI Makeup button created successfully');
  }
  
  /**
   * Starts periodic checks for face detection status
   */
  function startFaceDetectionCheck() {
    if (faceCheckInterval) return;
    
    console.log('Starting periodic face detection checks');
    
    faceCheckInterval = setInterval(() => {
      if (window.AIFaceDetectionFix) {
        const status = window.AIFaceDetectionFix.checkFaceDetectionStatus();
        
        // If a face is detected, update the button state
        updateAIButtonState(status.success);
        
        // Log face detection status (debug only)
        // console.log('Face detection status:', status.message);
      }
    }, config.checkFaceInterval);
  }
  
  /**
   * Updates the AI button state based on face detection
   */
  function updateAIButtonState(faceDetected) {
    const button = document.getElementById('ai-makeup-button');
    if (!button) return;
    
    if (faceDetected) {
      // Face detected - make button more prominent
      button.classList.add('face-detected');
      button.style.animation = 'pulseBounce 1s infinite';
    } else {
      // No face detected - return to normal state
      button.classList.remove('face-detected');
      button.style.animation = '';
    }
  }
  
  // Expose functions to global scope
  window.AIUIBootstrapper = {
    createAIMakeupButton,
    checkFaceDetection: function() {
      if (window.AIFaceDetectionFix) {
        return window.AIFaceDetectionFix.checkFaceDetectionStatus();
      }
      return { success: false, message: 'Face detection not available' };
    }
  };
})();