/**
 * ProductRecommendationsDebugger.js - Debug tool for product recommendations
 */

(function() {
  console.log('[ProductRecommendationsDebugger] Initializing...');
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', init);
  
  // For immediate execution if already loaded
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  }
  
  /**
   * Initialize the debugger
   */
  function init() {
    console.log('[ProductRecommendationsDebugger] Setting up...');
    
    // Check if in debug mode
    const urlParams = new URLSearchParams(window.location.search);
    const debugMode = urlParams.get('debug') === 'true';
    
    if (!debugMode) {
      return;
    }
    
    // Create debugger UI
    createDebuggerUI();
    
    // Set up event listeners
    setupEventListeners();
  }
  
  /**
   * Create the debugger UI
   */
  function createDebuggerUI() {
    // Create debugger container
    const container = document.createElement('div');
    container.id = 'product-debugger';
    container.style.cssText = `
      position: fixed;
      top: 70px;
      right: 10px;
      background-color: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px;
      border-radius: 5px;
      font-size: 12px;
      z-index: 2000;
      max-width: 300px;
      max-height: 400px;
      overflow-y: auto;
    `;
    
    // Create title
    const title = document.createElement('h3');
    title.textContent = 'Product Recommendations Debug';
    title.style.cssText = `
      margin: 0 0 10px 0;
      padding: 0;
      font-size: 14px;
      color: #ff4081;
    `;
    container.appendChild(title);
    
    // Create content container
    const content = document.createElement('div');
    content.id = 'debug-content';
    container.appendChild(content);
    
    // Create test controls
    const controls = document.createElement('div');
    controls.style.cssText = `
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #666;
    `;
    
    const testLipstickBtn = createButton('Test Lipstick', () => {
      simulateFilterEvent('lipstick', '#FF0000');
    });
    const testEyeshadowBtn = createButton('Test Eyeshadow', () => {
      simulateFilterEvent('eyeshadow', '#663399');
    });
    const testBlushBtn = createButton('Test Blush', () => {
      simulateFilterEvent('blush', '#FF6B6B');
    });
    const testAllBtn = createButton('Test Full Look', () => {
      simulateFullLook();
    });
    
    controls.appendChild(testLipstickBtn);
    controls.appendChild(testEyeshadowBtn);
    controls.appendChild(testBlushBtn);
    controls.appendChild(testAllBtn);
    
    container.appendChild(controls);
    
    // Add to document
    document.body.appendChild(container);
    
    // Log initial state
    logDebugInfo('Debugger initialized');
  }
  
  /**
   * Create a debug button
   * @param {string} text - Button text
   * @param {function} onClick - Click handler
   * @returns {HTMLElement} Button element
   */
  function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.cssText = `
      background-color: #333;
      color: white;
      border: 1px solid #555;
      border-radius: 3px;
      padding: 5px;
      margin: 3px;
      font-size: 11px;
      cursor: pointer;
    `;
    button.addEventListener('click', onClick);
    return button;
  }
  
  /**
   * Set up event listeners
   */
  function setupEventListeners() {
    // Listen for filter applied events
    document.addEventListener('filterApplied', (event) => {
      if (event.detail) {
        logDebugInfo(`Filter applied: ${event.detail.type}, Color: ${event.detail.color}`);
      }
    });
    
    // Listen for makeup applied events
    document.addEventListener('makeupApplied', (event) => {
      if (event.detail && event.detail.filters) {
        logDebugInfo(`Makeup applied with ${event.detail.filters.length} filters`);
        event.detail.filters.forEach((filter, index) => {
          logDebugInfo(`Filter ${index + 1}: ${filter.type}, Color: ${filter.color}`);
        });
      }
    });
  }
  
  /**
   * Log debug information
   * @param {string} message - Debug message
   */
  function logDebugInfo(message) {
    console.log(`[ProductRecommendationsDebugger] ${message}`);
    
    const debugContent = document.getElementById('debug-content');
    if (debugContent) {
      const entry = document.createElement('div');
      entry.style.cssText = `
        margin-bottom: 5px;
        border-bottom: 1px dotted #444;
        padding-bottom: 5px;
      `;
      
      const timestamp = new Date().toLocaleTimeString();
      entry.innerHTML = `<span style="color: #999;">[${timestamp}]</span> ${message}`;
      
      debugContent.appendChild(entry);
      
      // Auto-scroll to bottom
      debugContent.scrollTop = debugContent.scrollHeight;
      
      // Keep only the last 20 entries
      while (debugContent.children.length > 20) {
        debugContent.removeChild(debugContent.firstChild);
      }
    }
  }
  
  /**
   * Simulate a filter event
   * @param {string} type - Filter type
   * @param {string} color - Color hex code
   */
  function simulateFilterEvent(type, color) {
    const event = new CustomEvent('filterApplied', {
      detail: {
        type: type,
        color: color,
        intensity: 1.0
      }
    });
    
    document.dispatchEvent(event);
    logDebugInfo(`Simulated ${type} filter with color ${color}`);
  }
  
  /**
   * Simulate a full makeup look
   */
  function simulateFullLook() {
    const filters = [
      { type: 'lipstick', color: '#CC0000', intensity: 1.0 },
      { type: 'eyeshadow', color: '#663399', intensity: 0.8 },
      { type: 'blush', color: '#FF6B6B', intensity: 0.7 },
      { type: 'eyeliner', color: '#000000', intensity: 1.0 }
    ];
    
    const event = new CustomEvent('makeupApplied', {
      detail: {
        filters: filters
      }
    });
    
    document.dispatchEvent(event);
    logDebugInfo('Simulated full makeup look with 4 filters');
  }
})();