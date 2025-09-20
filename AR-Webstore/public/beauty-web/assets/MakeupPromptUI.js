/**
 * MakeupPromptUI.js - A simple prompt-based UI for applying makeup filters
 * 
 * This component creates a user-friendly interface for entering makeup prompts
 * like "wedding makeup" or "professional makeup" and sends them to the 
 * Gemini AI to automatically apply appropriate makeup filters.
 */

class MakeupPromptUI {
  constructor() {
    // Create references for DOM elements
    this.container = null;
    this.promptInput = null;
    this.applyButton = null;
    this.loadingIndicator = null;
    this.resultsContainer = null;
    
    // Initialize once DOM is loaded
    if (document.readyState === 'complete') {
      this.initialize();
    } else {
      window.addEventListener('load', () => this.initialize());
    }
  }
  
  /**
   * Initialize the UI component
   */
  initialize() {
    console.log('[MakeupPromptUI] Initializing prompt-based makeup UI');
    
    // Wait for both Banuba app and GenAIMakeup to be loaded before initializing
    this.waitForBanubaApp(() => {
      this.waitForGenAIMakeup(() => {
        // Create the container
        this.createUIElements();
        
        // Add event listeners
        this.addEventListeners();
        
        // Make the component globally accessible
        window.makeupPromptUI = this;
        
        // Notify the initialization coordinator that we're ready
        document.dispatchEvent(new CustomEvent('makeupPromptUIReady'));
        
        console.log('[MakeupPromptUI] Prompt UI initialized');
      });
    });
  }
  
  /**
   * Wait for GenAIMakeup to be loaded
   * @param {Function} callback - Function to call when GenAIMakeup is loaded
   */
  waitForGenAIMakeup(callback) {
    if (window.genAIMakeup) {
      console.log('[MakeupPromptUI] GenAIMakeup is already loaded');
      callback();
      return;
    }
    
    console.log('[MakeupPromptUI] Waiting for GenAIMakeup to load...');
    
    // Listen for the genAIMakeupReady event
    document.addEventListener('genAIMakeupReady', () => {
      console.log('[MakeupPromptUI] GenAIMakeup is now loaded');
      callback();
    }, { once: true });
    
    // Add a fallback timeout just in case the event doesn't fire
    setTimeout(() => {
      if (!window.genAIMakeup) {
        console.warn('[MakeupPromptUI] GenAIMakeup load timeout, continuing anyway');
        callback();
      }
    }, 5000);
  }
  
  /**
   * Wait for Banuba app to be loaded
   * @param {Function} callback - Function to call when app is loaded
   */
  waitForBanubaApp(callback) {
    // Check if global App object exists
    if (typeof App !== 'undefined' && App.$children && App.$children[0]) {
      console.log('[MakeupPromptUI] Banuba App is already loaded');
      callback();
      return;
    }
    
    // Check if bnb-app element exists
    const checkForApp = () => {
      const appElement = document.querySelector('bnb-app');
      
      if (appElement && (appElement.__vue__ || appElement.__vue_app__)) {
        console.log('[MakeupPromptUI] Banuba app found in DOM');
        callback();
        return;
      }
      
      // Check for any Vue elements as fallback
      const anyVueElement = document.querySelector('[data-v-app]') || 
                           document.querySelector('.bnb-layout') || 
                           document.querySelector('.bnb-settings');
                           
      if (anyVueElement) {
        console.log('[MakeupPromptUI] Vue elements found in DOM');
        callback();
        return;
      }
      
      console.log('[MakeupPromptUI] Waiting for Banuba app to load...');
      setTimeout(checkForApp, 500); // Check again in 500ms
    };
    
    // Start checking
    checkForApp();
  }
  
  /**
   * Create UI elements
   */
  createUIElements() {
    // Check if container already exists
    if (document.getElementById('makeup-prompt-container')) {
      console.log('[MakeupPromptUI] UI elements already exist');
      return;
    }
    
    // Create the main container
    this.container = document.createElement('div');
    this.container.id = 'makeup-prompt-container';
    this.container.classList.add('makeup-prompt-container');
    
    // Create a heading
    const heading = document.createElement('h3');
    heading.textContent = 'AI Makeup Stylist';
    heading.classList.add('makeup-prompt-heading');
    
    // Create input field
    this.promptInput = document.createElement('input');
    this.promptInput.type = 'text';
    this.promptInput.id = 'makeup-prompt-input';
    this.promptInput.classList.add('makeup-prompt-input');
    this.promptInput.placeholder = 'Try "wedding makeup" or "professional look"';
    
    // Create apply button
    this.applyButton = document.createElement('button');
    this.applyButton.id = 'makeup-prompt-apply';
    this.applyButton.classList.add('makeup-prompt-apply');
    this.applyButton.textContent = 'Apply Makeup';
    
    // Create loading indicator (hidden by default)
    this.loadingIndicator = document.createElement('div');
    this.loadingIndicator.id = 'makeup-prompt-loading';
    this.loadingIndicator.classList.add('makeup-prompt-loading');
    this.loadingIndicator.innerHTML = '<div class="spinner"></div><span>Analyzing your request...</span>';
    this.loadingIndicator.style.display = 'none';
    
    // Create results container
    this.resultsContainer = document.createElement('div');
    this.resultsContainer.id = 'makeup-prompt-results';
    this.resultsContainer.classList.add('makeup-prompt-results');
    
    // Add example prompts
    const examplesContainer = document.createElement('div');
    examplesContainer.classList.add('makeup-prompt-examples');
    examplesContainer.innerHTML = `
      <span>Try these: </span>
      <button class="example-prompt">Wedding makeup</button>
      <button class="example-prompt">Professional look</button>
      <button class="example-prompt">Natural everyday</button>
      <button class="example-prompt">Glamorous evening</button>
    `;
    
    // Add elements to container
    this.container.appendChild(heading);
    this.container.appendChild(this.promptInput);
    this.container.appendChild(this.applyButton);
    this.container.appendChild(examplesContainer);
    this.container.appendChild(this.loadingIndicator);
    this.container.appendChild(this.resultsContainer);
    
    // Find the right location to insert the UI
    const targetLocation = this.findTargetLocation();
    if (targetLocation) {
      targetLocation.insertAdjacentElement('afterbegin', this.container);
    } else {
      console.warn('[MakeupPromptUI] Could not find target location for UI');
      document.body.appendChild(this.container);
    }
    
    // Add the stylesheet
    this.addStyles();
  }
  
  /**
   * Find the best location to insert the UI
   */
  findTargetLocation() {
    // Try to find the main controls or panel to insert our UI
    const possibleLocations = [
      document.querySelector('.bnb-controls'),
      document.querySelector('.bnb-layout__panel'),
      document.querySelector('.panel-block'),
      document.querySelector('.bnb-layout__side'),
      document.querySelector('bnb-app'),
      document.body
    ];
    
    // Try each location and return the first one that exists
    const targetElement = possibleLocations.find(el => el !== null);
    
    // Log what we found
    if (targetElement) {
      console.log('[MakeupPromptUI] Found target location:', targetElement.tagName || targetElement.className);
    } else {
      console.warn('[MakeupPromptUI] Could not find any suitable target location');
    }
    
    return targetElement;
  }
  
  /**
   * Add event listeners
   */
  addEventListeners() {
    // Apply button click
    this.applyButton.addEventListener('click', () => this.handlePromptSubmit());
    
    // Enter key in input field
    this.promptInput.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        this.handlePromptSubmit();
      }
    });
    
    // Example prompt clicks
    const exampleButtons = this.container.querySelectorAll('.example-prompt');
    exampleButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.promptInput.value = button.textContent;
        this.handlePromptSubmit();
      });
    });
  }
  
  /**
   * Handle prompt submission
   */
  async handlePromptSubmit() {
    const prompt = this.promptInput.value.trim();
    
    if (!prompt) {
      this.showError('Please enter a makeup style prompt');
      return;
    }
    
    this.showLoading(true);
    this.clearResults();
    
    try {
      // Check if GenAIMakeup is available, if not wait for it
      if (!window.genAIMakeup) {
        console.log('[MakeupPromptUI] Waiting for GenAIMakeup to be available');
        await this.waitForGenAIMakeup();
      }
      
      // Send prompt to GenAIMakeup to process
      if (window.genAIMakeup) {
        console.log('[MakeupPromptUI] Sending prompt to GenAIMakeup:', prompt);
        const result = await window.genAIMakeup.applyMakeupFromPrompt(prompt);
        
        if (result) {
          this.showResults(result, prompt);
        } else {
          this.showError('Could not apply makeup. The system might not be fully loaded yet.');
        }
      } else {
        console.error('[MakeupPromptUI] GenAIMakeup not found after waiting');
        this.showError('Makeup processing system not available. Please refresh the page and try again.');
      }
    } catch (error) {
      console.error('[MakeupPromptUI] Error processing prompt:', error);
      this.showError(error.message || 'Error processing your request');
    } finally {
      this.showLoading(false);
    }
  }
  
  /**
   * Wait for GenAIMakeup to be available
   * @returns {Promise} Promise that resolves when GenAIMakeup is available
   */
  waitForGenAIMakeup(maxWaitTime = 5000) {
    return new Promise((resolve) => {
      // If GenAIMakeup is already available, resolve immediately
      if (window.genAIMakeup) {
        resolve();
        return;
      }
      
      let waitTime = 0;
      const interval = 200; // Check every 200ms
      
      const checkInterval = setInterval(() => {
        waitTime += interval;
        
        if (window.genAIMakeup) {
          clearInterval(checkInterval);
          resolve();
          return;
        }
        
        if (waitTime >= maxWaitTime) {
          clearInterval(checkInterval);
          console.error('[MakeupPromptUI] Timed out waiting for GenAIMakeup');
          resolve(); // Resolve anyway to continue the flow
        }
      }, interval);
    });
  }
  
  /**
   * Show loading indicator
   */
  showLoading(isLoading) {
    this.loadingIndicator.style.display = isLoading ? 'flex' : 'none';
    this.applyButton.disabled = isLoading;
    this.promptInput.disabled = isLoading;
  }
  
  /**
   * Clear results
   */
  clearResults() {
    this.resultsContainer.innerHTML = '';
  }
  
  /**
   * Show results
   */
  showResults(result, prompt) {
    this.resultsContainer.innerHTML = '';
    
    const resultElement = document.createElement('div');
    resultElement.classList.add('makeup-result');
    
    if (result && result.success) {
      resultElement.innerHTML = `
        <div class="success-message">
          <h4>✨ ${this.capitalizeFirstLetter(prompt)} applied!</h4>
          <p>${result.description || 'Your makeup has been applied based on your prompt.'}</p>
        </div>
      `;
      
      // If we have filter details, show them
      if (result.filters && result.filters.length > 0) {
        const filtersList = document.createElement('div');
        filtersList.classList.add('applied-filters');
        filtersList.innerHTML = '<h5>Applied Filters:</h5>';
        
        const list = document.createElement('ul');
        result.filters.forEach(filter => {
          const item = document.createElement('li');
          item.innerHTML = `<span style="color:${filter.hex || '#000'}">${filter.type}</span>: ${filter.name}`;
          list.appendChild(item);
        });
        
        filtersList.appendChild(list);
        resultElement.appendChild(filtersList);
      }
    } else {
      resultElement.innerHTML = `
        <div class="error-message">
          <h4>Could not apply makeup</h4>
          <p>${result?.error || 'There was an error processing your request.'}</p>
        </div>
      `;
    }
    
    this.resultsContainer.appendChild(resultElement);
  }
  
  /**
   * Show error message
   */
  showError(message) {
    this.clearResults();
    
    const errorElement = document.createElement('div');
    errorElement.classList.add('error-message');
    errorElement.textContent = message;
    
    this.resultsContainer.appendChild(errorElement);
  }
  
  /**
   * Add styles to the document
   */
  addStyles() {
    // Check if styles already exist
    if (document.getElementById('makeup-prompt-styles')) {
      return;
    }
    
    const styleElement = document.createElement('style');
    styleElement.id = 'makeup-prompt-styles';
    styleElement.textContent = `
      .makeup-prompt-container {
        background-color: #f8f9fa;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        max-width: 100%;
        box-sizing: border-box;
      }
      
      .makeup-prompt-heading {
        color: #485FC7;
        margin-top: 0;
        margin-bottom: 12px;
        font-size: 18px;
      }
      
      .makeup-prompt-input {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #ced4da;
        border-radius: 4px;
        font-size: 16px;
        box-sizing: border-box;
        margin-bottom: 12px;
      }
      
      .makeup-prompt-apply {
        background-color: #485FC7;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 10px 16px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.2s;
        margin-bottom: 12px;
        width: 100%;
      }
      
      .makeup-prompt-apply:hover {
        background-color: #3e51ac;
      }
      
      .makeup-prompt-apply:disabled {
        background-color: #94a3e3;
        cursor: not-allowed;
      }
      
      .makeup-prompt-examples {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 12px;
        align-items: center;
      }
      
      .example-prompt {
        background-color: #e9ecef;
        border: 1px solid #ced4da;
        border-radius: 20px;
        padding: 4px 12px;
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      
      .example-prompt:hover {
        background-color: #dde2e6;
      }
      
      .makeup-prompt-loading {
        display: flex;
        align-items: center;
        margin: 12px 0;
      }
      
      .spinner {
        width: 20px;
        height: 20px;
        border: 3px solid rgba(72, 95, 199, 0.3);
        border-radius: 50%;
        border-top-color: #485FC7;
        animation: spin 1s ease-in-out infinite;
        margin-right: 10px;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      .makeup-prompt-results {
        margin-top: 12px;
      }
      
      .success-message {
        background-color: #d4edda;
        color: #155724;
        padding: 12px;
        border-radius: 4px;
        margin-bottom: 12px;
      }
      
      .success-message h4 {
        margin-top: 0;
        margin-bottom: 8px;
      }
      
      .error-message {
        background-color: #f8d7da;
        color: #721c24;
        padding: 12px;
        border-radius: 4px;
      }
      
      .applied-filters {
        background-color: #e9ecef;
        padding: 12px;
        border-radius: 4px;
        margin-top: 12px;
      }
      
      .applied-filters h5 {
        margin-top: 0;
        margin-bottom: 8px;
      }
      
      .applied-filters ul {
        margin: 0;
        padding-left: 20px;
      }
    `;
    
    document.head.appendChild(styleElement);
  }
  
  /**
   * Utility function to capitalize first letter
   */
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

// Initialize the component
new MakeupPromptUI();