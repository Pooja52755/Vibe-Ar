/**
 * GenAIMakeup.js
 * Enhanced AI-powered makeup application for Beauty Web
 * Connects with Google Gemini API for face analysis and makeup recommendations
 */

// Import required dependencies
import { geminiAnalyzeFace } from '../../src/services/GeminiService.js';

class GenAIMakeup {
  constructor() {
    this.isInitialized = false;
    this.hasUploadedImage = false;
    this.currentPrompt = "";
    this.presets = {
      natural: [
        { name: "Fresh Faced", description: "Light, natural makeup for everyday wear", prompt: "Apply a natural makeup look with light foundation, subtle blush, neutral eyeshadow, and tinted lip balm" },
        { name: "No Makeup Look", description: "Enhances features without looking made up", prompt: "Apply a no-makeup makeup look with tinted moisturizer, clear brow gel, curled lashes, and a hint of lip color" }
      ],
      glamorous: [
        { name: "Night Out", description: "Bold, evening-ready makeup", prompt: "Apply glamorous evening makeup with full coverage foundation, contour, highlight, smokey eyes, and deep red lipstick" },
        { name: "Red Carpet", description: "High-impact, photo-ready look", prompt: "Apply red carpet makeup with flawless foundation, sharp contour, dramatic winged liner, false lashes, and a bold lip" }
      ],
      creative: [
        { name: "Festival Ready", description: "Colorful, expressive makeup", prompt: "Apply festival makeup with colorful eyeshadow, glitter, face gems, and a bold lip color" },
        { name: "Artistic Expression", description: "Unique, artistic makeup", prompt: "Apply artistic makeup with graphic liner, color blocking eyeshadow, and an ombré lip" }
      ]
    };
    this.activePresetTab = "natural";
    this.init();
  }

  /**
   * Initialize the GenAI Makeup feature
   */
  init() {
    if (this.isInitialized) return;
    
    console.log("[GenAIMakeup] Initializing GenAI Makeup features");
    
    // Create main button for accessing AI Makeup
    this.createAIMakeupButton();
    
    // Add event listeners for image changes
    this.setupImageChangeListeners();
    
    // Include custom styles
    this.loadStyles();
    
    // Check for image immediately
    setTimeout(() => this.checkForImage(), 1000);
    
    this.isInitialized = true;
  }
  
  /**
   * Load the custom styles for AI Makeup interface
   */
  loadStyles() {
    const scriptElement = document.createElement('script');
    scriptElement.src = './assets/AIPromptStyles.css.js';
    document.head.appendChild(scriptElement);
  }
  
  /**
   * Create the AI Makeup button and append it to the page
   */
  createAIMakeupButton() {
    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'ai-makeup-button-container';
    
    // Create button
    const button = document.createElement('button');
    button.id = 'ai-makeup-button';
    button.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" stroke-width="2"/><path d="M12 16V16.01M12 8V12" stroke="white" stroke-width="2" stroke-linecap="round"/></svg> AI Makeup';
    button.addEventListener('click', () => this.showPromptInput());
    
    // Append button to container
    buttonContainer.appendChild(button);
    
    // Append container to body
    document.body.appendChild(buttonContainer);
  }
  
  /**
   * Setup listeners for image changes
   */
  setupImageChangeListeners() {
    // Listen for custom event from Banuba when image is loaded
    window.addEventListener('banubaImageLoaded', () => {
      this.hasUploadedImage = true;
      this.updateButtonState();
    });
    
    // Listen for custom event from Beauty Web app when image is uploaded
    window.addEventListener('beautyWebImageUploaded', () => {
      this.hasUploadedImage = true;
      this.updateButtonState();
    });
  }
  
  /**
   * Update button state based on image availability
   */
  updateButtonState() {
    const button = document.getElementById('ai-makeup-button');
    if (!button) return;
    
    if (this.hasUploadedImage) {
      button.removeAttribute('disabled');
      button.style.opacity = '1';
    } else {
      button.setAttribute('disabled', 'true');
      button.style.opacity = '0.6';
    }
  }
  
  /**
   * Check if an image is currently loaded in the viewer
   */
  checkForImage() {
    // Get current image using the SDK method
    const imageData = this.getCurrentImageData();
    if (imageData) {
      console.log("[GenAIMakeup] Image detected");
      this.hasUploadedImage = true;
    } else {
      console.log("[GenAIMakeup] No image detected");
      this.hasUploadedImage = false;
    }
    
    this.updateButtonState();
  }
  
  /**
   * Get current image data from Banuba SDK
   * @returns {Object|null} Image data or null if no image
   */
  getCurrentImageData() {
    if (window.effectPlayer && window.effectPlayer.videoSource) {
      return window.effectPlayer.videoSource.currentImage || null;
    }
    
    // Fallback to check canvas
    const canvas = document.querySelector('.bnb-canvas');
    if (canvas) {
      try {
        const context = canvas.getContext('2d');
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        // Check if image has actual content (not just a blank canvas)
        let hasContent = false;
        for (let i = 0; i < imageData.data.length; i += 4) {
          if (imageData.data[i] !== 0 || imageData.data[i + 1] !== 0 || 
              imageData.data[i + 2] !== 0 || imageData.data[i + 3] !== 0) {
            hasContent = true;
            break;
          }
        }
        
        return hasContent ? imageData : null;
      } catch (e) {
        console.error("[GenAIMakeup] Error getting image data from canvas:", e);
        return null;
      }
    }
    
    return null;
  }
  
  /**
   * Show the AI prompt input dialog
   */
  showPromptInput() {
    // Check if image is available
    if (!this.hasUploadedImage) {
      alert("Please upload an image first before using AI Makeup");
      return;
    }
    
    // Create dialog container
    const container = document.createElement('div');
    container.id = 'ai-prompt-container';
    
    // Create dialog
    const dialog = document.createElement('div');
    dialog.className = 'ai-prompt-dialog';
    
    // Create title
    const title = document.createElement('h2');
    title.className = 'ai-prompt-title';
    title.textContent = '✨ AI Makeup Application';
    
    // Create description
    const description = document.createElement('p');
    description.className = 'ai-prompt-description';
    description.textContent = 'Describe the makeup look you want to apply, or choose from our presets below.';
    
    // Create preset tabs
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'preset-tabs';
    
    const tabs = [
      { id: 'natural', label: 'Natural' },
      { id: 'glamorous', label: 'Glamorous' },
      { id: 'creative', label: 'Creative' }
    ];
    
    tabs.forEach(tab => {
      const tabElement = document.createElement('div');
      tabElement.className = `preset-tab ${tab.id === this.activePresetTab ? 'active' : ''}`;
      tabElement.textContent = tab.label;
      tabElement.addEventListener('click', () => {
        document.querySelectorAll('.preset-tab').forEach(t => t.classList.remove('active'));
        tabElement.classList.add('active');
        this.activePresetTab = tab.id;
        this.updatePresetGrid(presetsGrid);
      });
      tabsContainer.appendChild(tabElement);
    });
    
    // Create preset grid
    const presetsGrid = document.createElement('div');
    presetsGrid.className = 'preset-grid';
    this.updatePresetGrid(presetsGrid);
    
    // Create custom prompt input
    const promptInput = document.createElement('textarea');
    promptInput.className = 'ai-prompt-input';
    promptInput.placeholder = 'Describe your desired makeup look in detail...';
    promptInput.rows = 3;
    
    // Create buttons
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'ai-prompt-buttons';
    
    const cancelButton = document.createElement('button');
    cancelButton.className = 'ai-button-cancel';
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', () => {
      document.body.removeChild(container);
    });
    
    const applyButton = document.createElement('button');
    applyButton.className = 'ai-button-apply';
    applyButton.textContent = 'Apply AI Makeup';
    applyButton.addEventListener('click', () => {
      const promptText = promptInput.value.trim();
      if (promptText) {
        this.currentPrompt = promptText;
        document.body.removeChild(container);
        this.processAIMakeup(promptText);
      } else {
        alert("Please enter a makeup description or select a preset.");
      }
    });
    
    // Assemble dialog
    buttonsContainer.appendChild(cancelButton);
    buttonsContainer.appendChild(applyButton);
    
    dialog.appendChild(title);
    dialog.appendChild(description);
    dialog.appendChild(tabsContainer);
    dialog.appendChild(presetsGrid);
    dialog.appendChild(promptInput);
    dialog.appendChild(buttonsContainer);
    
    container.appendChild(dialog);
    document.body.appendChild(container);
  }
  
  /**
   * Update the preset grid with options based on active tab
   * @param {HTMLElement} gridElement - The grid element to update
   */
  updatePresetGrid(gridElement) {
    // Clear existing content
    gridElement.innerHTML = '';
    
    // Add preset options
    if (this.presets[this.activePresetTab]) {
      this.presets[this.activePresetTab].forEach(preset => {
        const presetButton = document.createElement('div');
        presetButton.className = 'preset-button';
        
        const presetName = document.createElement('strong');
        presetName.textContent = preset.name;
        
        const presetDesc = document.createElement('span');
        presetDesc.textContent = preset.description;
        
        presetButton.appendChild(presetName);
        presetButton.appendChild(presetDesc);
        
        presetButton.addEventListener('click', () => {
          const promptInput = document.querySelector('.ai-prompt-input');
          if (promptInput) {
            promptInput.value = preset.prompt;
          }
        });
        
        gridElement.appendChild(presetButton);
      });
    }
  }
  
  /**
   * Show loading indicator while processing makeup
   * @param {string} message - Loading message to display
   * @returns {HTMLElement} The loader element
   */
  showLoading(message = "Analyzing your face and applying AI makeup...") {
    const loader = document.createElement('div');
    loader.className = 'ai-makeup-loader';
    
    const spinner = document.createElement('div');
    spinner.className = 'ai-loading-spinner';
    
    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'ai-loading-message';
    loadingMessage.textContent = message;
    
    loader.appendChild(spinner);
    loader.appendChild(loadingMessage);
    document.body.appendChild(loader);
    
    return loader;
  }
  
  /**
   * Hide loading indicator
   * @param {HTMLElement} loader - The loader element to hide
   */
  hideLoading(loader) {
    if (loader && document.body.contains(loader)) {
      document.body.removeChild(loader);
    }
  }
  
  /**
   * Process AI makeup application
   * @param {string} prompt - User's makeup prompt
   */
  async processAIMakeup(prompt) {
    try {
      // Show loading indicator
      const loader = this.showLoading();
      
      console.log("[GenAIMakeup] Processing makeup prompt:", prompt);
      
      // Capture current face image for analysis
      const faceImageData = this.captureCurrentFaceImage();
      
      if (!faceImageData) {
        this.hideLoading(loader);
        alert("Unable to capture face image. Please ensure your face is visible in the image.");
        return;
      }
      
      // Analyze face using Gemini API
      const analysis = await geminiAnalyzeFace(faceImageData, prompt);
      
      if (!analysis || !analysis.makeupFilters) {
        this.hideLoading(loader);
        alert("Unable to analyze face or determine appropriate makeup. Please try a different prompt.");
        return;
      }
      
      console.log("[GenAIMakeup] Face analysis:", analysis);
      
      // Apply makeup filters
      const appliedFilters = await this.applyMakeupFilters(analysis.makeupFilters);
      
      // Generate product recommendations
      this.generateProductRecommendations(analysis.makeupFilters);
      
      // Log completion
      console.log("[GenAIMakeup] Applied makeup filters:", appliedFilters);
      
      // Hide loading
      this.hideLoading(loader);
      
      // Show success message
      this.showSuccessMessage();
      
    } catch (error) {
      console.error("[GenAIMakeup] Error processing AI makeup:", error);
      const loader = document.querySelector('.ai-makeup-loader');
      if (loader) {
        this.hideLoading(loader);
      }
      alert("An error occurred while applying AI makeup. Please try again.");
    }
  }
  
  /**
   * Capture current face image for analysis
   * @returns {string|null} Base64 image data or null if unable to capture
   */
  captureCurrentFaceImage() {
    try {
      // Try to get image from canvas
      const canvas = document.querySelector('.bnb-canvas');
      if (canvas) {
        return canvas.toDataURL('image/jpeg', 0.9);
      }
      
      // Alternative method using current image data
      const imageData = this.getCurrentImageData();
      if (imageData) {
        // Convert image data to base64
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = imageData.width || 640;
        tempCanvas.height = imageData.height || 480;
        const ctx = tempCanvas.getContext('2d');
        ctx.putImageData(imageData, 0, 0);
        return tempCanvas.toDataURL('image/jpeg', 0.9);
      }
      
      return null;
    } catch (error) {
      console.error("[GenAIMakeup] Error capturing face image:", error);
      return null;
    }
  }
  
  /**
   * Apply makeup filters based on analysis
   * @param {Array} filters - Makeup filters to apply
   * @returns {Array} Applied filters
   */
  async applyMakeupFilters(filters) {
    const appliedFilters = [];
    
    // Check if Banuba SDK is available
    if (!window.bnb || !window.effectPlayer) {
      console.error("[GenAIMakeup] Banuba SDK not available");
      return appliedFilters;
    }
    
    try {
      // Process each filter type
      for (const filter of filters) {
        const { type, color, intensity, style } = filter;
        
        switch (type.toLowerCase()) {
          case 'lipstick':
            await this.applyLipstick(color, intensity);
            appliedFilters.push(`Lipstick: ${color}`);
            break;
            
          case 'eyeshadow':
            await this.applyEyeshadow(color, style, intensity);
            appliedFilters.push(`Eyeshadow: ${color} (${style})`);
            break;
            
          case 'eyeliner':
            await this.applyEyeliner(color, style, intensity);
            appliedFilters.push(`Eyeliner: ${color} (${style})`);
            break;
            
          case 'blush':
            await this.applyBlush(color, intensity);
            appliedFilters.push(`Blush: ${color}`);
            break;
            
          case 'foundation':
            await this.applyFoundation(color, intensity);
            appliedFilters.push(`Foundation: ${color}`);
            break;
            
          case 'highlighter':
            await this.applyHighlighter(intensity);
            appliedFilters.push(`Highlighter`);
            break;
            
          case 'contour':
            await this.applyContour(intensity);
            appliedFilters.push(`Contour`);
            break;
            
          default:
            console.log(`[GenAIMakeup] Unsupported filter type: ${type}`);
        }
      }
      
      // Dispatch event for external listeners
      const event = new CustomEvent('aiMakeupApplied', {
        detail: {
          filters: appliedFilters,
          prompt: this.currentPrompt
        }
      });
      window.dispatchEvent(event);
      
      return appliedFilters;
      
    } catch (error) {
      console.error("[GenAIMakeup] Error applying makeup filters:", error);
      return [];
    }
  }
  
  /**
   * Apply lipstick filter
   * @param {string} color - Lipstick color
   * @param {number} intensity - Intensity value (0-1)
   */
  async applyLipstick(color, intensity = 0.8) {
    try {
      // Convert color to RGB if it's a named color
      const rgbColor = this.convertColorToRGB(color);
      
      // Apply lipstick using Banuba SDK
      if (window.bnb && window.bnb.makeupLips) {
        await window.bnb.makeupLips({
          color: rgbColor,
          opacity: intensity
        });
        console.log(`[GenAIMakeup] Applied lipstick: ${color} (${intensity})`);
      }
    } catch (error) {
      console.error("[GenAIMakeup] Error applying lipstick:", error);
    }
  }
  
  /**
   * Apply eyeshadow filter
   * @param {string} color - Eyeshadow color
   * @param {string} style - Eyeshadow style
   * @param {number} intensity - Intensity value (0-1)
   */
  async applyEyeshadow(color, style = 'natural', intensity = 0.7) {
    try {
      // Convert color to RGB if it's a named color
      const rgbColor = this.convertColorToRGB(color);
      
      // Map style to Banuba eyeshadow style
      let eyeshadowStyle = 'smokey';
      switch (style.toLowerCase()) {
        case 'cat eye':
        case 'winged':
          eyeshadowStyle = 'cat';
          break;
          
        case 'smokey':
        case 'smoky':
          eyeshadowStyle = 'smokey';
          break;
          
        case 'natural':
        case 'subtle':
          eyeshadowStyle = 'natural';
          break;
          
        case 'dramatic':
        case 'bold':
          eyeshadowStyle = 'dramatic';
          break;
      }
      
      // Apply eyeshadow using Banuba SDK
      if (window.bnb && window.bnb.makeupEyes) {
        await window.bnb.makeupEyes({
          color: rgbColor,
          style: eyeshadowStyle,
          opacity: intensity
        });
        console.log(`[GenAIMakeup] Applied eyeshadow: ${color} (${style}, ${intensity})`);
      }
    } catch (error) {
      console.error("[GenAIMakeup] Error applying eyeshadow:", error);
    }
  }
  
  /**
   * Apply eyeliner filter
   * @param {string} color - Eyeliner color
   * @param {string} style - Eyeliner style
   * @param {number} intensity - Intensity value (0-1)
   */
  async applyEyeliner(color, style = 'classic', intensity = 0.8) {
    try {
      // Convert color to RGB if it's a named color
      const rgbColor = this.convertColorToRGB(color);
      
      // Map style to Banuba eyeliner style
      let eyelinerStyle = 'classic';
      switch (style.toLowerCase()) {
        case 'winged':
        case 'cat eye':
          eyelinerStyle = 'winged';
          break;
          
        case 'classic':
        case 'natural':
          eyelinerStyle = 'classic';
          break;
          
        case 'bold':
        case 'thick':
          eyelinerStyle = 'bold';
          break;
      }
      
      // Apply eyeliner using Banuba SDK
      if (window.bnb && window.bnb.makeupEyeliner) {
        await window.bnb.makeupEyeliner({
          color: rgbColor,
          style: eyelinerStyle,
          opacity: intensity
        });
        console.log(`[GenAIMakeup] Applied eyeliner: ${color} (${style}, ${intensity})`);
      }
    } catch (error) {
      console.error("[GenAIMakeup] Error applying eyeliner:", error);
    }
  }
  
  /**
   * Apply blush filter
   * @param {string} color - Blush color
   * @param {number} intensity - Intensity value (0-1)
   */
  async applyBlush(color, intensity = 0.6) {
    try {
      // Convert color to RGB if it's a named color
      const rgbColor = this.convertColorToRGB(color);
      
      // Apply blush using Banuba SDK
      if (window.bnb && window.bnb.makeupBlush) {
        await window.bnb.makeupBlush({
          color: rgbColor,
          opacity: intensity
        });
        console.log(`[GenAIMakeup] Applied blush: ${color} (${intensity})`);
      }
    } catch (error) {
      console.error("[GenAIMakeup] Error applying blush:", error);
    }
  }
  
  /**
   * Apply foundation filter
   * @param {string} color - Foundation color
   * @param {number} intensity - Intensity value (0-1)
   */
  async applyFoundation(color, intensity = 0.7) {
    try {
      // Convert color to RGB if it's a named color
      const rgbColor = this.convertColorToRGB(color);
      
      // Apply foundation using Banuba SDK
      if (window.bnb && window.bnb.makeupFoundation) {
        await window.bnb.makeupFoundation({
          color: rgbColor,
          opacity: intensity
        });
        console.log(`[GenAIMakeup] Applied foundation: ${color} (${intensity})`);
      }
    } catch (error) {
      console.error("[GenAIMakeup] Error applying foundation:", error);
    }
  }
  
  /**
   * Apply highlighter filter
   * @param {number} intensity - Intensity value (0-1)
   */
  async applyHighlighter(intensity = 0.6) {
    try {
      // Apply highlighter using Banuba SDK
      if (window.bnb && window.bnb.makeupHighlighter) {
        await window.bnb.makeupHighlighter({
          opacity: intensity
        });
        console.log(`[GenAIMakeup] Applied highlighter (${intensity})`);
      }
    } catch (error) {
      console.error("[GenAIMakeup] Error applying highlighter:", error);
    }
  }
  
  /**
   * Apply contour filter
   * @param {number} intensity - Intensity value (0-1)
   */
  async applyContour(intensity = 0.6) {
    try {
      // Apply contour using Banuba SDK
      if (window.bnb && window.bnb.makeupContour) {
        await window.bnb.makeupContour({
          opacity: intensity
        });
        console.log(`[GenAIMakeup] Applied contour (${intensity})`);
      }
    } catch (error) {
      console.error("[GenAIMakeup] Error applying contour:", error);
    }
  }
  
  /**
   * Convert color name to RGB values
   * @param {string} color - Color name or hex
   * @returns {Array} RGB values [r, g, b]
   */
  convertColorToRGB(color) {
    // If already RGB format, return as is
    if (Array.isArray(color) && color.length === 3) {
      return color;
    }
    
    // Create temporary element to parse color
    const tempElem = document.createElement('div');
    tempElem.style.color = color;
    document.body.appendChild(tempElem);
    
    // Get computed color
    const computedColor = getComputedStyle(tempElem).color;
    document.body.removeChild(tempElem);
    
    // Parse RGB values
    const match = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      return [
        parseInt(match[1], 10) / 255,
        parseInt(match[2], 10) / 255,
        parseInt(match[3], 10) / 255
      ];
    }
    
    // Default to black if parsing fails
    return [0, 0, 0];
  }
  
  /**
   * Generate product recommendations based on applied filters
   * @param {Array} filters - Applied makeup filters
   */
  generateProductRecommendations(filters) {
    if (!filters || !filters.length) return;
    
    try {
      // Extract key makeup products from filters
      const recommendedProducts = filters.map(filter => {
        const { type, color, style } = filter;
        
        // Create recommendation object
        return {
          type: type,
          color: color,
          style: style || 'standard',
          productName: this.generateProductName(type, color, style),
          productImage: this.getProductImageUrl(type, color)
        };
      });
      
      // Dispatch event with recommendations
      const event = new CustomEvent('productRecommendations', {
        detail: {
          products: recommendedProducts,
          prompt: this.currentPrompt
        }
      });
      window.dispatchEvent(event);
      
      console.log("[GenAIMakeup] Generated product recommendations:", recommendedProducts);
      
    } catch (error) {
      console.error("[GenAIMakeup] Error generating product recommendations:", error);
    }
  }
  
  /**
   * Generate a product name based on makeup type and color
   * @param {string} type - Makeup type
   * @param {string} color - Makeup color
   * @param {string} style - Makeup style
   * @returns {string} Generated product name
   */
  generateProductName(type, color, style) {
    const brandNames = [
      "Glamour", "Luxe Beauty", "Elegance", "Natural Glow", 
      "Divine", "Pure", "Radiant", "Stellar"
    ];
    
    const randomBrand = brandNames[Math.floor(Math.random() * brandNames.length)];
    const capitalizedColor = color.charAt(0).toUpperCase() + color.slice(1);
    const capitalizedStyle = style ? ` ${style.charAt(0).toUpperCase() + style.slice(1)}` : '';
    
    return `${randomBrand} ${capitalizedColor}${capitalizedStyle} ${type.charAt(0).toUpperCase() + type.slice(1)}`;
  }
  
  /**
   * Get product image URL based on makeup type and color
   * @param {string} type - Makeup type
   * @param {string} color - Makeup color
   * @returns {string} Product image URL
   */
  getProductImageUrl(type, color) {
    // This would ideally map to actual product images
    // For now, return placeholder based on type
    const placeholders = {
      lipstick: '/png images/pink.jpg',
      eyeshadow: '/png images/blue.jpg',
      eyeliner: '/png images/coll2_3.png',
      blush: '/png images/pink.jpg',
      foundation: '/png images/coll1_2.png',
      highlighter: '/png images/coll3_1.png',
      contour: '/png images/coll4_1.png'
    };
    
    return placeholders[type.toLowerCase()] || '/png images/coll5_1.png';
  }
  
  /**
   * Show success message after applying makeup
   */
  showSuccessMessage() {
    const message = document.createElement('div');
    message.style.position = 'fixed';
    message.style.bottom = '30px';
    message.style.right = '30px';
    message.style.backgroundColor = '#8e44ad';
    message.style.color = 'white';
    message.style.padding = '15px 20px';
    message.style.borderRadius = '8px';
    message.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
    message.style.zIndex = '9999';
    message.style.transition = 'opacity 0.5s ease';
    message.style.fontSize = '16px';
    message.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 10px; vertical-align: middle;"><path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="10" stroke="white" stroke-width="2"/></svg> AI Makeup applied successfully!';
    
    document.body.appendChild(message);
    
    // Remove after 3 seconds
    setTimeout(() => {
      message.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(message)) {
          document.body.removeChild(message);
        }
      }, 500);
    }, 3000);
  }
}

// Initialize GenAI Makeup
const genAIMakeup = new GenAIMakeup();

// Export for external use
export default genAIMakeup;