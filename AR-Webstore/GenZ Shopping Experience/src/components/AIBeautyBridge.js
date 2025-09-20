/**
 * AIBeautyBridge.js
 * 
 * This file provides integration between the GenZ Shopping Experience
 * and the Beauty Web's AI-powered makeup application.
 * 
 * It allows the GenZ application to trigger AI makeup application
 * based on user prompts and uploaded images.
 */

class AIBeautyBridge {
  constructor() {
    this.beautyWebFrame = null;
    this.isConnected = false;
    this.pendingRequests = [];
    
    // Initialize when the DOM is fully loaded
    if (document.readyState === 'complete') {
      this.initialize();
    } else {
      window.addEventListener('load', () => this.initialize());
    }
  }
  
  /**
   * Initialize the bridge between GenZ app and Beauty Web
   */
  initialize() {
    console.log('Initializing AI Beauty Bridge...');
    
    // Find the Beauty Web iframe if it exists
    this.beautyWebFrame = document.querySelector('iframe[src*="beauty-web"]');
    
    if (!this.beautyWebFrame) {
      console.warn('Beauty Web iframe not found. The bridge will connect when the iframe is loaded.');
      
      // Watch for iframe creation
      this.observeIframeCreation();
    } else {
      this.connectToBeautyWeb();
    }
    
    // Add event listener for AI makeup requests from the GenZ app
    document.addEventListener('genZAIMakeupRequest', (event) => {
      const { prompt, imageData } = event.detail || {};
      this.applyAIMakeup(prompt, imageData);
    });
  }
  
  /**
   * Watch for Beauty Web iframe creation
   */
  observeIframeCreation() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            if (node.tagName === 'IFRAME' && node.src && node.src.includes('beauty-web')) {
              this.beautyWebFrame = node;
              this.connectToBeautyWeb();
              observer.disconnect();
            }
          });
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  }
  
  /**
   * Connect to the Beauty Web application
   */
  connectToBeautyWeb() {
    if (!this.beautyWebFrame) return;
    
    console.log('Connecting to Beauty Web...');
    
    // Wait for iframe to load
    this.beautyWebFrame.addEventListener('load', () => {
      console.log('Beauty Web iframe loaded.');
      this.isConnected = true;
      
      // Process any pending requests
      if (this.pendingRequests.length > 0) {
        console.log(`Processing ${this.pendingRequests.length} pending AI makeup requests...`);
        this.pendingRequests.forEach(request => {
          this.sendRequestToBeautyWeb(request.prompt, request.imageData);
        });
        this.pendingRequests = [];
      }
    });
  }
  
  /**
   * Apply AI makeup with the given prompt and image data
   * @param {string} prompt - User's makeup request prompt (e.g., "wedding makeup")
   * @param {string} imageData - Base64-encoded image data (optional)
   */
  applyAIMakeup(prompt, imageData = null) {
    if (!this.isConnected || !this.beautyWebFrame) {
      // Store the request for later processing
      console.log('Beauty Web not connected yet. Storing makeup request for later processing.');
      this.pendingRequests.push({ prompt, imageData });
      return;
    }
    
    this.sendRequestToBeautyWeb(prompt, imageData);
  }
  
  /**
   * Send AI makeup request to Beauty Web
   * @param {string} prompt - User's makeup request prompt
   * @param {string} imageData - Base64-encoded image data (optional)
   */
  sendRequestToBeautyWeb(prompt, imageData) {
    try {
      console.log(`Sending AI makeup request to Beauty Web: ${prompt}`);
      
      // Create and dispatch event in the Beauty Web iframe
      const code = `
        const event = new CustomEvent('aiMakeupRequested', {
          detail: {
            prompt: ${JSON.stringify(prompt)},
            image: ${imageData ? JSON.stringify(imageData) : 'null'}
          }
        });
        document.dispatchEvent(event);
        
        // Also try direct function call if available
        if (window.applyAIMakeup) {
          window.applyAIMakeup(${JSON.stringify(prompt)}, ${imageData ? JSON.stringify(imageData) : 'null'});
        }
        
        // Notify GenZ app that request was received
        window.parent.postMessage({ type: 'aiMakeupRequestReceived' }, '*');
      `;
      
      // Execute the code in the iframe
      this.beautyWebFrame.contentWindow.postMessage({ type: 'executeCode', code }, '*');
      
      // Alternative method: inject a script into the iframe
      const script = document.createElement('script');
      script.textContent = code;
      this.beautyWebFrame.contentDocument.head.appendChild(script);
      this.beautyWebFrame.contentDocument.head.removeChild(script);
    } catch (error) {
      console.error('Error sending AI makeup request to Beauty Web:', error);
    }
  }
}

// Create and initialize the bridge
const aiBeautyBridge = new AIBeautyBridge();

// Expose to window for debugging and direct access
window.aiBeautyBridge = aiBeautyBridge;

// Export a simple function for React components to use
export function applyAIMakeup(prompt, imageData = null) {
  if (window.aiBeautyBridge) {
    window.aiBeautyBridge.applyAIMakeup(prompt, imageData);
    return true;
  }
  return false;
}