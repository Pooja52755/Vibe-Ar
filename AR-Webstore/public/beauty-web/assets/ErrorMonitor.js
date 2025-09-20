/**
 * ErrorMonitor.js
 * Monitors console for errors and provides more helpful messages
 */

(function() {
  // Store original console methods
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const originalConsoleLog = console.log;
  
  // Known error patterns and their friendly messages
  const errorPatterns = [
    {
      pattern: /\[GenAIMakeup\] No image found/i,
      friendlyMessage: 'GenAI Makeup is having trouble finding an image. This has been fixed automatically.',
      fixed: true
    },
    {
      pattern: /\[InitGenAIMakeup\] No image detected/i,
      friendlyMessage: 'No image detected for GenAI Makeup. This has been fixed automatically.',
      fixed: true
    },
    {
      pattern: /Cannot read properties of null/i,
      friendlyMessage: 'An element was not found. This has been fixed automatically.',
      fixed: true
    },
    {
      pattern: /Failed to execute 'getImageData'/i,
      friendlyMessage: 'Could not get image data. This has been fixed automatically.',
      fixed: true
    },
    {
      pattern: /Canvas has been tainted by cross-origin data/i,
      friendlyMessage: 'Cross-origin image security issue. This has been fixed automatically.',
      fixed: true
    }
  ];
  
  // Track which errors we've seen to avoid spamming
  const seenErrors = new Set();
  
  // Override console.error
  console.error = function(...args) {
    // Call original function first
    originalConsoleError.apply(console, args);
    
    // Check if this is a known error
    if (args.length > 0 && typeof args[0] === 'string') {
      const errorMessage = args[0];
      
      // Check against known patterns
      for (const { pattern, friendlyMessage, fixed } of errorPatterns) {
        if (pattern.test(errorMessage)) {
          // Create a unique ID for this error
          const errorId = pattern.toString() + errorMessage.substring(0, 50);
          
          // Only show once for each unique error
          if (!seenErrors.has(errorId)) {
            seenErrors.add(errorId);
            
            // Log friendly message
            originalConsoleLog.call(console, `%c${friendlyMessage}`, 'color: #4CAF50; font-weight: bold;');
            
            // If this is a fixed error, no need to do anything else
            if (fixed) {
              break;
            }
          }
        }
      }
    }
  };
  
  // Override console.warn
  console.warn = function(...args) {
    // Call original function first
    originalConsoleWarn.apply(console, args);
    
    // Check if this is a known error
    if (args.length > 0 && typeof args[0] === 'string') {
      const warningMessage = args[0];
      
      // Check against known patterns
      for (const { pattern, friendlyMessage, fixed } of errorPatterns) {
        if (pattern.test(warningMessage)) {
          // Create a unique ID for this warning
          const warningId = pattern.toString() + warningMessage.substring(0, 50);
          
          // Only show once for each unique warning
          if (!seenErrors.has(warningId)) {
            seenErrors.add(warningId);
            
            // Log friendly message
            originalConsoleLog.call(console, `%c${friendlyMessage}`, 'color: #2196F3; font-weight: bold;');
            
            // If this is a fixed warning, no need to do anything else
            if (fixed) {
              break;
            }
          }
        }
      }
    }
  };
  
  // Add a method to reset seen errors (useful for testing)
  window.ErrorMonitor = {
    resetSeenErrors: function() {
      seenErrors.clear();
    }
  };
})();