/**
 * AIBeautyBridge.js - Bridge between GenZ Shopping Experience and Beauty Web
 * 
 * This script:
 * 1. Enables communication between the GenZ app and Beauty Web iframe
 * 2. Handles image uploads from the main app to Beauty Web
 * 3. Processes makeup requests
 * 4. Sends product recommendations back to the main app
 */

class AIBeautyBridge {
  constructor() {
    this.isInitialized = false;
    this.beautyWebFrame = null;
    this.pendingRequests = [];
    this.currentImage = null;
    
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => this.initialize());
  }
  
  /**
   * Initialize the bridge
   */
  initialize() {
    if (this.isInitialized) return;
    
    console.log('[AIBeautyBridge] Initializing...');
    
    // Find the Beauty Web iframe
    this.beautyWebFrame = document.querySelector('iframe[src*="beauty-web"]');
    
    if (!this.beautyWebFrame) {
      // If iframe doesn't exist yet, wait for it
      this.waitForBeautyWebFrame();
    } else {
      this.setupMessageListeners();
    }
    
    // Listen for message events from the parent window (if in iframe)
    window.addEventListener('message', (event) => this.handleExternalMessage(event));
    
    // Listen for makeup application events
    window.addEventListener('makeupApplied', (event) => {
      this.handleMakeupApplied(event.detail);
    });
    
    this.isInitialized = true;
  }
  
  /**
   * Wait for the Beauty Web iframe to be added to the DOM
   */
  waitForBeautyWebFrame() {
    console.log('[AIBeautyBridge] Waiting for Beauty Web iframe...');
    
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          const frame = document.querySelector('iframe[src*="beauty-web"]');
          if (frame) {
            console.log('[AIBeautyBridge] Beauty Web iframe found');
            this.beautyWebFrame = frame;
            this.setupMessageListeners();
            observer.disconnect();
            break;
          }
        }
      }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Timeout after 10 seconds
    setTimeout(() => {
      observer.disconnect();
      console.log('[AIBeautyBridge] Timeout waiting for Beauty Web iframe');
    }, 10000);
  }
  
  /**
   * Set up message listeners for the Beauty Web iframe
   */
  setupMessageListeners() {
    console.log('[AIBeautyBridge] Setting up message listeners');
    
    // Listen for messages from the Beauty Web iframe
    window.addEventListener('message', (event) => {
      if (event.source === this.beautyWebFrame.contentWindow) {
        this.handleBeautyWebMessage(event.data);
      }
    });
    
    // Process any pending requests
    if (this.pendingRequests.length > 0) {
      console.log(`[AIBeautyBridge] Processing ${this.pendingRequests.length} pending requests`);
      
      for (const request of this.pendingRequests) {
        this.sendMessageToBeautyWeb(request);
      }
      
      // Clear pending requests
      this.pendingRequests = [];
    }
  }
  
  /**
   * Handle messages from external sources (parent window)
   * @param {MessageEvent} event - The message event
   */
  handleExternalMessage(event) {
    // Skip messages without data or type
    if (!event.data || !event.data.type) return;
    
    const data = event.data;
    console.log('[AIBeautyBridge] Received external message:', data.type);
    
    switch (data.type) {
      case 'uploadImage':
        if (data.imageBase64) {
          this.handleImageUpload(data.imageBase64);
        }
        break;
        
      case 'makeupRequest':
        if (data.imageBase64) {
          this.handleImageUpload(data.imageBase64);
        }
        break;
        
      // Forward other relevant messages to the Beauty Web iframe
      case 'applyMakeupFilter':
      case 'selectMakeupProduct':
      case 'clearMakeup':
        this.sendMessageToBeautyWeb(data);
        break;
    }
  }
  
  /**
   * Handle messages from the Beauty Web iframe
   * @param {Object} data - The message data
   */
  handleBeautyWebMessage(data) {
    // Skip messages without type
    if (!data || !data.type) return;
    
    console.log('[AIBeautyBridge] Received Beauty Web message:', data.type);
    
    switch (data.type) {
      case 'makeupApplied':
        // Forward makeup applied event to parent window
        this.forwardToParent(data);
        break;
        
      case 'imageProcessed':
        // Forward image processed event to parent window
        this.forwardToParent(data);
        break;
        
      case 'beautyWebReady':
        console.log('[AIBeautyBridge] Beauty Web is ready');
        // Process any pending requests
        if (this.pendingRequests.length > 0) {
          for (const request of this.pendingRequests) {
            this.sendMessageToBeautyWeb(request);
          }
          this.pendingRequests = [];
        }
        break;
    }
  }
  
  /**
   * Send a message to the Beauty Web iframe
   * @param {Object} message - The message to send
   */
  sendMessageToBeautyWeb(message) {
    if (!this.beautyWebFrame) {
      console.log('[AIBeautyBridge] Beauty Web iframe not available, queueing message');
      this.pendingRequests.push(message);
      return;
    }
    
    try {
      this.beautyWebFrame.contentWindow.postMessage(message, '*');
      console.log('[AIBeautyBridge] Sent message to Beauty Web:', message.type);
    } catch (error) {
      console.error('[AIBeautyBridge] Error sending message to Beauty Web:', error);
    }
  }
  
  /**
   * Forward a message to the parent window
   * @param {Object} message - The message to forward
   */
  forwardToParent(message) {
    if (window.parent !== window) {
      try {
        window.parent.postMessage(message, '*');
        console.log('[AIBeautyBridge] Forwarded message to parent:', message.type);
      } catch (error) {
        console.error('[AIBeautyBridge] Error forwarding message to parent:', error);
      }
    }
  }
  
  /**
   * Handle image upload
   * @param {string} imageBase64 - The base64-encoded image data
   */
  handleImageUpload(imageBase64) {
    console.log('[AIBeautyBridge] Handling image upload');
    
    // Store the current image
    this.currentImage = imageBase64;
    
    // Send the image to Beauty Web
    this.sendMessageToBeautyWeb({
      type: 'uploadImage',
      imageBase64: imageBase64
    });
  }
  
  /**
   * Handle makeup applied event
   * @param {Object} detail - The event details
   */
  handleMakeupApplied(detail) {
    if (!detail) return;
    
    console.log('[AIBeautyBridge] Handling makeup applied event');
    
    // Forward to parent window
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'makeupApplied',
        filters: detail.filters
      }, '*');
    }
  }
  
  /**
   * Send product recommendations to the parent window
   */
  sendProductRecommendations() {
    // Basic product recommendations
    const products = [
      {
        id: 'lipstick-001',
        name: 'Classic Red Lipstick',
        category: 'lipstick',
        image: 'assets/products/lipstick/red.jpg'
      },
      {
        id: 'eyeshadow-001',
        name: 'Smoky Eye Palette',
        category: 'eyeshadow',
        image: 'assets/products/eyeshadow/smoky.jpg'
      }
    ];
    
    // Forward to parent window
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'productRecommendations',
        products: products
      }, '*');
    }
  }
}

// Initialize the bridge
window.aiBeautyBridge = new AIBeautyBridge();