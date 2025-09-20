/**
 * InitializationCoordinator.js - Ensures proper loading sequence of components
 * 
 * This script coordinates the loading and initialization of the makeup 
 * application components to ensure they're available when needed.
 */

(function() {
  // Track initialization status
  const status = {
    appReady: false,
    geminiHandlerReady: false,
    genAIMakeupReady: false,
    promptUIReady: false
  };
  
  // Log initialization status
  function logStatus(component, isReady) {
    status[component] = isReady;
    console.log(`[InitCoordinator] ${component} ready: ${isReady}. Status:`, {...status});
  }
  
  // Create a global initialization coordinator
  window.makeupInitCoordinator = {
    // Check if all components are ready
    isReady() {
      return status.appReady && status.geminiHandlerReady && status.genAIMakeupReady;
    },
    
    // Get component status
    getStatus() {
      return {...status};
    },
    
    // Register a component as ready
    registerReady(component) {
      logStatus(component + 'Ready', true);
      
      // When all essential components are ready, dispatch an event
      if (this.isReady()) {
        document.dispatchEvent(new CustomEvent('makeupAppReady'));
        console.log('[InitCoordinator] All components are ready!');
      }
    },
    
    // Force all components to be marked as ready (emergency fallback)
    forceAllReady() {
      console.warn('[InitCoordinator] Forcing all components to ready state');
      Object.keys(status).forEach(key => {
        status[key] = true;
      });
      document.dispatchEvent(new CustomEvent('makeupAppReady'));
    },
    
    // Wait for a specific component to be ready
    waitForComponent(component, maxWaitTime = 5000) {
      return new Promise((resolve) => {
        // If component is already ready, resolve immediately
        if (status[component + 'Ready']) {
          resolve(true);
          return;
        }
        
        // Setup listener for component ready event
        const readyHandler = () => {
          if (status[component + 'Ready']) {
            document.removeEventListener('makeupAppReady', readyHandler);
            resolve(true);
          }
        };
        
        // Listen for the ready event
        document.addEventListener('makeupAppReady', readyHandler);
        
        // Also set a timeout in case the component never becomes ready
        setTimeout(() => {
          document.removeEventListener('makeupAppReady', readyHandler);
          console.warn(`[InitCoordinator] Timed out waiting for ${component}`);
          resolve(false);
        }, maxWaitTime);
      });
    }
  };
  
  // Event listeners for component initialization
  document.addEventListener('DOMContentLoaded', () => {
    // Check for App global variable
    const checkAppInterval = setInterval(() => {
      // Try multiple ways to detect if the Banuba app is ready
      if (typeof App !== 'undefined' && App.$children && App.$children[0]) {
        clearInterval(checkAppInterval);
        window.makeupInitCoordinator.registerReady('app');
        return;
      }
      
      // Also check for the bnb-app element
      const appElement = document.querySelector('bnb-app');
      if (appElement && (appElement.__vue__ || appElement.__vue_app__)) {
        clearInterval(checkAppInterval);
        window.makeupInitCoordinator.registerReady('app');
        return;
      }
      
      // Check for any Vue elements as fallback
      const anyVueElement = document.querySelector('[data-v-app]') || 
                           document.querySelector('.bnb-layout') || 
                           document.querySelector('.bnb-settings');
                           
      if (anyVueElement) {
        clearInterval(checkAppInterval);
        window.makeupInitCoordinator.registerReady('app');
        return;
      }
    }, 200);
    
    // After 5 seconds, stop checking for App
    setTimeout(() => {
      clearInterval(checkAppInterval);
      // Force app to be ready after timeout to avoid blocking other components
      if (!status.appReady) {
        console.warn('[InitCoordinator] Forcing app ready status after timeout');
        window.makeupInitCoordinator.registerReady('app');
      }
    }, 5000);
    
    // Fallback: If after 10 seconds, not all components are ready, force them all ready
    setTimeout(() => {
      if (!window.makeupInitCoordinator.isReady()) {
        console.warn('[InitCoordinator] Not all components ready after 10 seconds, forcing all ready');
        window.makeupInitCoordinator.forceAllReady();
      }
    }, 10000);
  });
  
  // Listen for MakeupGeminiHandler initialization
  document.addEventListener('makeupGeminiHandlerReady', () => {
    window.makeupInitCoordinator.registerReady('geminiHandler');
  });
  
  // Listen for GenAIMakeup initialization
  document.addEventListener('genAIMakeupReady', () => {
    window.makeupInitCoordinator.registerReady('genAIMakeup');
  });
  
  // Listen for MakeupPromptUI initialization
  document.addEventListener('makeupPromptUIReady', () => {
    window.makeupInitCoordinator.registerReady('promptUI');
  });
  
  console.log('[InitCoordinator] Initialization coordinator loaded');
})();
})();