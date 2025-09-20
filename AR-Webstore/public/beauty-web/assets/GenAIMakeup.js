/**
 * GenAIMakeup.js - Automatically applies makeup filters using Gemini AI
 * 
 * This script:
 * 1. Analyzes uploaded face images using Gemini AI
 * 2. Determines optimal makeup colors based on skin tone
 * 3. Automatically applies the suggested filters
 * 4. Handles context-aware prompts (e.g., "getting ready for wedding")
 * 5. Shows product recommendations based on applied filters
 * 6. Integrates with the GenZ shopping experience
 */

class GenAIMakeup {
  constructor() {
    // Get the Gemini API key from the config file
    this.geminiApiKey = window.GEMINI_API_KEY || "AIzaSyDIZLGgaxV8kKTjWA9SASstL6gRkseKGkM";
    this.isAnalyzing = false;
    this.lastUploadedImage = null;
    this.productRecommender = null;
    
    // Initialize when DOM is ready
    if (document.readyState === 'complete') {
      this.initialize();
    } else {
      window.addEventListener('load', () => this.initialize());
    }
    
    // Listen for external AI makeup requests (from GenZ shopping experience)
    window.addEventListener('aiMakeupRequested', (event) => {
      console.log('AI Makeup requested from external application:', event.detail);
      
      // If we have a text prompt, process it directly
      if (event.detail && event.detail.prompt) {
        this.applyMakeupFromPrompt(event.detail.prompt);
      }
      const { image, prompt } = event.detail || {};
      if (image) {
        this.processAIMakeup(prompt || 'natural look', image);
      } else {
        // Use current image if none provided
        this.getCurrentImageData().then(imageData => {
          if (imageData) {
            this.processAIMakeup(prompt || 'natural look', imageData);
          } else {
            console.error('No image available for AI makeup application');
          }
        });
      }
    });
  }
  
  initialize() {
    console.log('[GenAIMakeup] Initializing...');
    
    // Wait for the initialization coordinator to signal app is ready
    this.waitForBanubaApp(() => {
      console.log('[GenAIMakeup] Banuba app detected, proceeding with initialization');
      
      // Create the AI Makeup button (more prominent)
      this.createAIMakeupButton();
      
      // Add event listener for image uploads
      this.setupImageUploadListener();
      
      // Fix issue with image detection - try to detect on initialization
      this.getCurrentImageData().then(imageData => {
        if (imageData) {
          this.lastUploadedImage = imageData;
          console.log('Image detected on initialization');
        }
      });
      
      // Initialize product recommender reference
      if (window.aiFilterSuggestion) {
        this.productRecommender = window.aiFilterSuggestion;
      } else {
        // Wait for AIFilterSuggestion to initialize
        const checkInterval = setInterval(() => {
          if (window.aiFilterSuggestion) {
            this.productRecommender = window.aiFilterSuggestion;
            clearInterval(checkInterval);
          }
        }, 500);
      }
    });
  }
  
  /**
   * Wait for Banuba app to be loaded through the initialization coordinator
   * @param {Function} callback - Function to call when app is loaded
   */
  waitForBanubaApp(callback) {
    // First check if the coordinator exists
    if (window.makeupInitCoordinator) {
      console.log('[GenAIMakeup] Using initialization coordinator');
      
      // Listen for the makeupAppReady event
      document.addEventListener('makeupAppReady', () => {
        console.log('[GenAIMakeup] Received makeupAppReady event');
        callback();
      }, { once: true });
      
      // Also check if app is already ready
      if (window.makeupInitCoordinator.isReady()) {
        console.log('[GenAIMakeup] App is already ready via coordinator');
        callback();
      }
      
      return;
    }
    
    // Fallback to direct app checking if no coordinator exists
    console.log('[GenAIMakeup] No coordinator found, falling back to direct app check');
    this.directAppCheck(callback);
  }
  
  /**
   * Directly check for the Banuba app without using the coordinator
   * @param {Function} callback - Function to call when app is found
   */
  directAppCheck(callback) {
    // Check if global App object exists
    if (typeof App !== 'undefined' && App.$children && App.$children[0]) {
      console.log('[GenAIMakeup] Global App object found');
      callback();
      return;
    }
    
    // Check if bnb-app element exists
    const appElement = document.querySelector('bnb-app');
    if (appElement && (appElement.__vue__ || appElement.__vue_app__)) {
      console.log('[GenAIMakeup] bnb-app element found');
      callback();
      return;
    }
    
    // Check for any Vue elements as fallback
    const anyVueElement = document.querySelector('[data-v-app]') || 
                          document.querySelector('.bnb-layout') || 
                          document.querySelector('.bnb-settings');
                          
    if (anyVueElement) {
      console.log('[GenAIMakeup] Vue elements found');
      callback();
      return;
    }
    
    console.log('[GenAIMakeup] App not found yet, waiting...');
    setTimeout(() => this.directAppCheck(callback), 500);
  }

  /**
   * Creates the AI Makeup button to trigger automatic makeup application
   */
  createAIMakeupButton() {
    // Create button container
    const container = document.createElement('div');
    container.id = 'ai-makeup-button-container';
    container.style.cssText = `
      position: fixed;
      top: 15px;
      left: 15px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
    `;
    
    // Create the button
    const button = document.createElement('button');
    button.id = 'ai-makeup-button';
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
      </svg>
      <span>AI Makeup</span>
    `;
    
    button.style.cssText = `
      background-color: #8e44ad;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 10px 15px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(142, 68, 173, 0.3);
      transition: all 0.2s ease;
    `;
    
    // Add hover effect
    button.onmouseover = () => {
      button.style.backgroundColor = '#7d3c98';
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 6px 12px rgba(142, 68, 173, 0.4)';
    };
    
    button.onmouseout = () => {
      button.style.backgroundColor = '#8e44ad';
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '0 4px 10px rgba(142, 68, 173, 0.3)';
    };
    
    // Add pulse animation to make it more noticeable
    const keyframes = document.createElement('style');
    keyframes.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(keyframes);
    
    // Apply pulse animation
    button.style.animation = 'pulse 2s infinite';
    
    // Add click handler
    button.onclick = () => {
      this.showPromptInput();
    };
    
    // Add button to container
    container.appendChild(button);
    
    // Add label
    const label = document.createElement('div');
    label.textContent = 'Apply AI Makeup';
    label.style.cssText = `
      font-size: 12px;
      color: #666;
      margin-top: 5px;
    `;
    container.appendChild(label);
    
    // Add to document
    document.body.appendChild(container);
  }
  
  /**
   * Shows a prompt input dialog for users to enter makeup instructions
   */
  showPromptInput() {
    // Check if image is available (improved detection)
    this.getCurrentImageData().then(imageData => {
      if (!imageData) {
        alert('Please upload an image first before using AI Makeup');
        return;
      }
      
      // Store the current image for later use
      this.lastUploadedImage = imageData;
    
      // Create the prompt input container
      const container = document.createElement('div');
      container.id = 'ai-prompt-container';
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      `;
      
      // Create the prompt input dialog with better styling
      const dialog = document.createElement('div');
      dialog.style.cssText = `
        background-color: white;
        border-radius: 12px;
        padding: 25px;
        width: 90%;
        max-width: 550px;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.3);
        max-height: 80vh;
        overflow-y: auto;
      `;
      
      // Create the title with more prominence
      const title = document.createElement('h2');
      title.textContent = '✨ AI Makeup Application';
      title.style.cssText = `
        margin: 0 0 20px 0;
        font-size: 24px;
        color: #8e44ad;
        text-align: center;
        border-bottom: 2px solid #8e44ad;
        padding-bottom: 15px;
      `;
      dialog.appendChild(title);
      
      // Create description with clearer instructions
      const description = document.createElement('p');
      description.textContent = 'Describe the makeup look you want to apply, or choose a preset style below:';
      description.style.cssText = `
        margin: 0 0 20px 0;
        font-size: 16px;
        color: #333;
        text-align: center;
      `;
      dialog.appendChild(description);
      
      // Create preset buttons with better styling
      const presets = [
        { name: 'Natural', description: 'Subtle everyday makeup', prompt: 'Apply a natural makeup look with light foundation, subtle blush, neutral eyeshadow, and tinted lip balm' },
        { name: 'Evening', description: 'Glamorous night look', prompt: 'Apply glamorous evening makeup with full coverage foundation, contour, highlight, smokey eyes, and deep red lipstick' },
        { name: 'Wedding', description: 'Elegant bridal makeup', prompt: 'Apply elegant bridal makeup with flawless foundation, soft pink blush, romantic eyeshadow, and rose-toned lips' },
        { name: 'Bold', description: 'Vibrant statement look', prompt: 'Apply bold makeup with dramatic winged liner, vibrant eyeshadow, and a strong lip color' },
        { name: 'Professional', description: 'Office-appropriate makeup', prompt: 'Apply professional office makeup with neutral tones, subtle definition, and a polished finish' }
      ];
      
      // Create grid layout for presets
      const presetsContainer = document.createElement('div');
      presetsContainer.style.cssText = `
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        margin-bottom: 20px;
      `;
      
      presets.forEach(preset => {
        const presetButton = document.createElement('div');
        presetButton.innerHTML = `
          <strong style="display: block; margin-bottom: 5px;">${preset.name}</strong>
          <span style="font-size: 14px; color: #666;">${preset.description}</span>
        `;
        presetButton.style.cssText = `
          background-color: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
        `;
        presetButton.onmouseover = () => {
          presetButton.style.backgroundColor = '#e9e9e9';
          presetButton.style.borderColor = '#8e44ad';
          presetButton.style.transform = 'translateY(-2px)';
        };
        presetButton.onmouseout = () => {
          presetButton.style.backgroundColor = '#f5f5f5';
          presetButton.style.borderColor = '#ddd';
          presetButton.style.transform = 'translateY(0)';
        };
        presetButton.onclick = () => {
          this.processAIMakeup(preset.prompt);
          document.body.removeChild(container);
        };
        presetsContainer.appendChild(presetButton);
      });
      
      dialog.appendChild(presetsContainer);
      
      // Create input field with better styling
      const input = document.createElement('textarea');
      input.placeholder = 'e.g., "Natural makeup with pink lips" or "Bold evening look with smokey eyes"';
      input.style.cssText = `
        width: 100%;
        padding: 12px;
        border: 2px solid #ddd;
        border-radius: 8px;
        margin-bottom: 20px;
        box-sizing: border-box;
        min-height: 80px;
        font-size: 16px;
        resize: vertical;
      `;
      input.onfocus = () => {
        input.style.borderColor = '#8e44ad';
      };
      input.onblur = () => {
        input.style.borderColor = '#ddd';
      };
      dialog.appendChild(input);
      
      // Create buttons container
      const buttonsContainer = document.createElement('div');
      buttonsContainer.style.cssText = `
        display: flex;
        justify-content: flex-end;
        gap: 15px;
      `;
      
      // Create cancel button
      const cancelButton = document.createElement('button');
      cancelButton.textContent = 'Cancel';
      cancelButton.style.cssText = `
        background-color: #f5f5f5;
        color: #333;
        border: none;
        border-radius: 8px;
        padding: 12px 20px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.2s;
      `;
      cancelButton.onmouseover = () => {
        cancelButton.style.backgroundColor = '#e9e9e9';
      };
      cancelButton.onmouseout = () => {
        cancelButton.style.backgroundColor = '#f5f5f5';
      };
      cancelButton.onclick = () => {
        document.body.removeChild(container);
      };
      buttonsContainer.appendChild(cancelButton);
      
      // Create apply button with better styling
      const applyButton = document.createElement('button');
      applyButton.textContent = 'Apply AI Makeup';
      applyButton.style.cssText = `
        background-color: #8e44ad;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 12px 20px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        transition: all 0.2s;
      `;
      applyButton.onmouseover = () => {
        applyButton.style.backgroundColor = '#7d3c98';
        applyButton.style.transform = 'translateY(-2px)';
      };
      applyButton.onmouseout = () => {
        applyButton.style.backgroundColor = '#8e44ad';
        applyButton.style.transform = 'translateY(0)';
      };
      applyButton.onclick = () => {
        const promptText = input.value.trim();
        if (promptText) {
          this.processAIMakeup(promptText);
        } else {
          this.processAIMakeup("Apply natural makeup that suits my skin tone");
        }
        document.body.removeChild(container);
      };
      buttonsContainer.appendChild(applyButton);
      
      dialog.appendChild(buttonsContainer);
      
      // Add dialog to container
      container.appendChild(dialog);
      
      // Add container to document
      document.body.appendChild(container);
      
      // Focus the input field
      setTimeout(() => input.focus(), 100);
    });
  }
  
  /**
   * Process the AI makeup request with the given prompt
   * @param {string} prompt - User's prompt for makeup style
   * @param {string} [imageData=null] - Optional base64 image data
   */
  async processAIMakeup(prompt, imageData = null) {
    try {
      this.showLoadingIndicator("Analyzing your image...");
      
      // Get the current image if not provided
      if (!imageData) {
        imageData = await this.getCurrentImageData();
        if (!imageData) {
          this.hideLoadingIndicator();
          alert('No image found. Please upload an image first.');
          return;
        }
      }
      
      // Update loading message
      this.updateLoadingMessage("Analyzing your skin tone...");
      
      // Analyze the image with Gemini AI
      const makeupSuggestions = await this.analyzeImageWithGemini(imageData, prompt);
      
      if (!makeupSuggestions) {
        this.hideLoadingIndicator();
        alert('Could not analyze the image. Please try again.');
        return;
      }
      
      // Update loading message
      this.updateLoadingMessage("Applying makeup filters...");
      
      // Apply the suggested filters
      await this.applyMakeupFilters(makeupSuggestions);
      
      // Show product recommendations based on applied filters
      if (this.productRecommender) {
        this.productRecommender.displayProductCards(makeupSuggestions);
      } else if (window.aiFilterSuggestion) {
        window.aiFilterSuggestion.displayProductCards(makeupSuggestions);
      }
      
      // Display a success message with makeup details
      this.showMakeupResults(makeupSuggestions, prompt);
      
      this.hideLoadingIndicator();
      
    } catch (error) {
      console.error('Error in AI makeup process:', error);
      this.hideLoadingIndicator();
      alert('An error occurred while applying AI makeup. Please try again.');
    }
  }
  
  /**
   * Get image data from the current view
   */
  async getCurrentImageData() {
    // Try multiple methods to get the current image

    // Method 1: Try to get image from Banuba SDK directly
    if (window.effectPlayer && window.effectPlayer.videoSource && window.effectPlayer.videoSource.currentImage) {
      console.log("[GenAIMakeup] Found image in effectPlayer.videoSource");
      return window.effectPlayer.videoSource.currentImage;
    }
    
    // Method 2: Try to get image from canvas
    const bnbCanvas = document.querySelector('.bnb-canvas');
    if (bnbCanvas) {
      try {
        console.log("[GenAIMakeup] Found .bnb-canvas element");
        const context = bnbCanvas.getContext('2d');
        const imageData = context.getImageData(0, 0, bnbCanvas.width, bnbCanvas.height);
        
        // Check if the canvas has actual content
        let hasContent = false;
        for (let i = 0; i < imageData.data.length; i += 4) {
          if (imageData.data[i] !== 0 || imageData.data[i + 1] !== 0 || 
              imageData.data[i + 2] !== 0 || imageData.data[i + 3] !== 0) {
            hasContent = true;
            break;
          }
        }
        
        if (hasContent) {
          console.log("[GenAIMakeup] Canvas has content");
          return bnbCanvas.toDataURL('image/jpeg');
        }
      } catch (e) {
        console.error("[GenAIMakeup] Error getting image data from bnb-canvas:", e);
      }
    }
    
    // Method 3: Look for any image or canvas in the view
    const imageElements = document.querySelectorAll('.camera-view img, .camera-view canvas, .viewer-container img, .viewer-container canvas, .bnb-container img, .bnb-container canvas');
    
    if (imageElements.length > 0) {
      let imageData = null;
      console.log("[GenAIMakeup] Found image/canvas elements:", imageElements.length);
      
      for (const element of imageElements) {
        try {
          if (element instanceof HTMLCanvasElement) {
            imageData = element.toDataURL('image/jpeg');
          } else if (element instanceof HTMLImageElement) {
            // Create a canvas to get image data from the img element
            const canvas = document.createElement('canvas');
            const img = element;
            
            // Skip if image is not loaded
            if (!img.complete || !img.naturalWidth) {
              continue;
            }
            
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            imageData = canvas.toDataURL('image/jpeg');
          }
          
          if (imageData) {
            console.log("[GenAIMakeup] Successfully got image data");
            return imageData;
          }
        } catch (e) {
          console.error("[GenAIMakeup] Error processing image element:", e);
        }
      }
    }
    
    // Method 4: If we have a cached image, use that
    if (this.lastUploadedImage) {
      console.log("[GenAIMakeup] Using cached image");
      return this.lastUploadedImage;
    }
    
    console.log("[GenAIMakeup] No image found");
    return null;
  }
  
  /**
   * Analyze the image with Gemini AI to get makeup suggestions
   * @param {string} imageBase64 - Base64 encoded image data
   * @param {string} prompt - User's makeup style prompt
   * @returns {Object} Makeup color suggestions
   */
  async analyzeImageWithGemini(imageBase64, prompt) {
    try {
      // Use our new GeminiService for API calls
      if (window.GeminiService) {
        console.log('Using GeminiService to analyze face');
        // Prepare the prompt for Gemini based on user's context
        const analysisPrompt = this.generateContextAwarePrompt(prompt);
        
        // Use the GeminiService to analyze the face
        return await window.GeminiService.analyzeFace(imageBase64, analysisPrompt);
      } 
      
      // Fallback to direct API call if GeminiService is not available
      if (!this.geminiApiKey) {
        console.error('Invalid Gemini API key and GeminiService not available');
        return this.getFallbackMakeupSuggestions();
      }
      
      console.log('GeminiService not found, falling back to direct API call');
      
      // Prepare the prompt for Gemini based on user's context
      const analysisPrompt = this.generateContextAwarePrompt(prompt);
      
      // Call the Gemini API directly
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: analysisPrompt },
              { inline_data: { mime_type: "image/jpeg", data: imageBase64.split(',')[1] } }
            ]
          }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 2048
          }
        })
      });
      
      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        console.error('Invalid response from Gemini API:', data);
        return this.getFallbackMakeupSuggestions();
      }
      
      const textResponse = data.candidates[0].content.parts[0].text;
      
      // Try to parse the JSON response
      try {
        // Extract JSON from the response - it might have other text
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const jsonStr = jsonMatch[0];
          const parsedResponse = JSON.parse(jsonStr);
          console.log('AI makeup analysis results:', parsedResponse);
          
          // Add occasion information based on prompt
          parsedResponse.occasion = this.extractOccasionFromPrompt(prompt);
          
          return parsedResponse;
        } else {
          console.error('Could not extract JSON from response:', textResponse);
          return this.getFallbackMakeupSuggestions();
        }
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError, 'Response:', textResponse);
        return this.getFallbackMakeupSuggestions();
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return this.getFallbackMakeupSuggestions();
    }
  }
  
  /**
   * Generate a context-aware prompt based on user's request
   * @param {string} userPrompt - User's makeup request
   * @returns {string} Enhanced prompt for Gemini API
   */
  generateContextAwarePrompt(userPrompt) {
    // Detailed facial analysis prompt
    let basePrompt = `
      You are a professional makeup artist AI that analyzes face images to recommend the best makeup colors.
      
      TASK:
      1. Analyze this face image in detail
      2. Determine skin tone, undertone, face shape, and eye color
      3. Recommend optimal makeup colors based on these characteristics
      4. Consider the specific request: "${userPrompt}"
      
      DETAILED ANALYSIS REQUESTED:
      - Skin tone (fair, light, medium, tan, deep, etc.)
      - Skin undertone (cool, warm, neutral, olive)
      - Face shape (oval, round, square, heart, etc.)
      - Eye color and shape
      - Current facial features to enhance
      - Harmony between recommended colors
    `;
    
    // Check for special occasions in the prompt
    if (userPrompt.toLowerCase().includes('wedding')) {
      basePrompt += `
        SPECIFIC OCCASION GUIDANCE - WEDDING:
        - Focus on elegant, timeless wedding makeup that photographs well
        - Choose colors that enhance natural beauty with a touch of elegance
        - Aim for a look that will last all day and night
        - Consider traditional wedding palettes while respecting skin tone
        - Avoid makeup that's too trendy and may look dated in photos
        - Recommend colors that will look good in both indoor and outdoor lighting
      `;
    } else if (userPrompt.toLowerCase().includes('party') || userPrompt.toLowerCase().includes('night out')) {
      basePrompt += `
        SPECIFIC OCCASION GUIDANCE - PARTY/NIGHT OUT:
        - Create a bold, eye-catching look suitable for evening lighting
        - Recommend more dramatic colors and effects
        - Focus on creating a statement look that will stand out
        - Consider the longevity of the makeup for an extended evening
        - Suggest colors with higher intensity and pigmentation
        - Include shimmer/metallic options where appropriate
      `;
    } else if (userPrompt.toLowerCase().includes('natural') || userPrompt.toLowerCase().includes('everyday')) {
      basePrompt += `
        SPECIFIC OCCASION GUIDANCE - NATURAL/EVERYDAY:
        - Focus on enhancing natural features with subtle colors
        - Recommend a light, fresh look that appears effortless
        - Choose colors that blend well with the natural skin tone
        - Prioritize comfort and wearability for daily use
        - Suggest buildable products that can be applied lightly
        - Create a polished but minimal appearance
      `;
    } else if (userPrompt.toLowerCase().includes('office') || userPrompt.toLowerCase().includes('work') || userPrompt.toLowerCase().includes('professional')) {
      basePrompt += `
        SPECIFIC OCCASION GUIDANCE - PROFESSIONAL SETTING:
        - Create a polished, professional look appropriate for work settings
        - Focus on neutral colors that appear put-together but not distracting
        - Recommend makeup that will last through a full workday
        - Maintain an appropriate level of formality for business environments
        - Ensure the makeup appears intentional but not overpowering
        - Consider workplace norms while respecting individual style
      `;
    }
    
    // Add detailed return format instructions
    basePrompt += `
      RETURN FORMAT:
      Return your answer as JSON only, with no other text, in this exact format:
      {
        "skinTone": "Precise description of skin tone",
        "undertone": "Cool/Warm/Neutral/Olive",
        "faceShape": "Shape description",
        "eyeColor": "Color description",
        "lipstick": { 
          "name": "Descriptive color name", 
          "color": "#HEX_COLOR",
          "intensity": 70,
          "finish": "matte/glossy/satin" 
        },
        "eyeshadow": { 
          "name": "Descriptive color name", 
          "color": "#HEX_COLOR",
          "intensity": 65,
          "placement": "lid/crease/outer corner" 
        },
        "blush": { 
          "name": "Descriptive color name", 
          "color": "#HEX_COLOR",
          "intensity": 50,
          "placement": "apples/cheekbones" 
        },
        "lookDescription": "2-3 sentence description of the overall recommended look and why it works for this face"
      }
      
      For intensity values, use a scale of 0-100 where higher numbers mean more vibrant/visible application.
      
      IMPORTANT GUIDELINES:
      1. Colors must scientifically complement the person's exact skin tone and undertone
      2. All recommendations must perfectly match the style requested in the prompt
      3. The color palette must work cohesively together
      4. Only return the JSON object, nothing else
    `;
    
    return basePrompt;
  }
  
  /**
   * Extract occasion information from the user's prompt
   * @param {string} prompt - User's makeup request
   * @returns {string} Occasion description
   */
  extractOccasionFromPrompt(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    // Match specific occasions with detailed subcategories
    
    // Wedding occasions
    if (lowerPrompt.includes('wedding')) {
      if (lowerPrompt.includes('bride') || lowerPrompt.includes('my wedding')) {
        return 'Bridal Makeup';
      } else if (lowerPrompt.includes('bridesmaid')) {
        return 'Bridesmaid Makeup';
      } else if (lowerPrompt.includes('guest')) {
        return 'Wedding Guest Makeup';
      } else {
        return 'Wedding Makeup';
      }
    }
    
    // Party and nightlife occasions
    if (lowerPrompt.includes('party')) {
      if (lowerPrompt.includes('birthday')) {
        return 'Birthday Party';
      } else if (lowerPrompt.includes('cocktail')) {
        return 'Cocktail Party';
      } else if (lowerPrompt.includes('holiday') || lowerPrompt.includes('christmas') || lowerPrompt.includes('new year')) {
        return 'Holiday Party';
      } else {
        return 'Party Makeup';
      }
    }
    
    // Evening occasions
    if (lowerPrompt.includes('night out') || lowerPrompt.includes('evening')) {
      if (lowerPrompt.includes('club') || lowerPrompt.includes('dancing')) {
        return 'Nightclub Makeup';
      } else if (lowerPrompt.includes('dinner')) {
        return 'Dinner Makeup';
      } else if (lowerPrompt.includes('formal') || lowerPrompt.includes('gala')) {
        return 'Formal Evening Makeup';
      } else {
        return 'Evening Makeup';
      }
    }
    
    // Dating occasions
    if (lowerPrompt.includes('date')) {
      if (lowerPrompt.includes('first date')) {
        return 'First Date Makeup';
      } else if (lowerPrompt.includes('romantic')) {
        return 'Romantic Date Makeup';
      } else {
        return 'Date Night Makeup';
      }
    }
    
    // Professional occasions
    if (lowerPrompt.includes('office') || lowerPrompt.includes('work') || lowerPrompt.includes('professional') || lowerPrompt.includes('business')) {
      if (lowerPrompt.includes('interview')) {
        return 'Job Interview Makeup';
      } else if (lowerPrompt.includes('meeting') || lowerPrompt.includes('presentation')) {
        return 'Business Meeting Makeup';
      } else if (lowerPrompt.includes('corporate')) {
        return 'Corporate Event Makeup';
      } else {
        return 'Professional Makeup';
      }
    }
    
    // Casual and everyday looks
    if (lowerPrompt.includes('natural') || lowerPrompt.includes('everyday') || lowerPrompt.includes('daily')) {
      if (lowerPrompt.includes('no makeup') || lowerPrompt.includes('no-makeup')) {
        return 'No-Makeup Makeup Look';
      } else if (lowerPrompt.includes('fresh') || lowerPrompt.includes('dewy')) {
        return 'Fresh-Faced Makeup';
      } else {
        return 'Natural Everyday Makeup';
      }
    }
    
    // Bold and artistic looks
    if (lowerPrompt.includes('bold') || lowerPrompt.includes('dramatic') || lowerPrompt.includes('statement')) {
      if (lowerPrompt.includes('goth') || lowerPrompt.includes('gothic')) {
        return 'Gothic Makeup';
      } else if (lowerPrompt.includes('glamour') || lowerPrompt.includes('glam')) {
        return 'Glamour Makeup';
      } else if (lowerPrompt.includes('artistic') || lowerPrompt.includes('creative')) {
        return 'Creative Artistic Makeup';
      } else {
        return 'Bold Statement Makeup';
      }
    }
    
    // Seasonal looks
    if (lowerPrompt.includes('summer')) {
      return 'Summer Makeup';
    } else if (lowerPrompt.includes('winter')) {
      return 'Winter Makeup';
    } else if (lowerPrompt.includes('fall') || lowerPrompt.includes('autumn')) {
      return 'Fall Makeup';
    } else if (lowerPrompt.includes('spring')) {
      return 'Spring Makeup';
    }
    
    // Special events
    if (lowerPrompt.includes('festival') || lowerPrompt.includes('concert')) {
      return 'Festival Makeup';
    } else if (lowerPrompt.includes('photo') || lowerPrompt.includes('photoshoot')) {
      return 'Photography Makeup';
    } else if (lowerPrompt.includes('graduation')) {
      return 'Graduation Makeup';
    } else if (lowerPrompt.includes('prom')) {
      return 'Prom Makeup';
    }
    
    // If no specific occasion is detected, provide a custom label
    return 'Custom Makeup Look';
  }
  
  /**
   * Get fallback makeup suggestions when AI analysis fails
   * @returns {Object} Default makeup suggestions
   */
  getFallbackMakeupSuggestions() {
    // Return predefined suggestions based on common makeup palettes
    return {
      lipstick: { name: "Natural Pink", color: "#FF92A5", intensity: 70 },
      eyeshadow: { name: "Soft Brown", color: "#E0BFB8", intensity: 60 },
      blush: { name: "Warm Peach", color: "#FFAA99", intensity: 50 },
      skinTone: "Medium",
      lookDescription: "A natural everyday look with soft, neutral colors"
    };
  }
  
  /**
   * Apply the suggested makeup filters to the Banuba SDK
   * @param {Object} makeupSuggestions - AI-generated makeup suggestions
   */
  async applyMakeupFilters(makeupSuggestions) {
    try {
      // Access the Banuba SDK Vue instance
      const appElement = document.querySelector('#app');
      if (!appElement) {
        console.warn('App element not found');
        return;
      }
      
      // Get Vue instance safely
      let vueApp;
      try {
        vueApp = appElement.__vue__;
      } catch (e) {
        console.warn('Vue app not available:', e);
        return;
      }
      
      if (!vueApp) {
        console.warn('Vue app not found');
        return;
      }
      
      // Apply lipstick
      if (makeupSuggestions.lipstick) {
        const lipstickStore = this.findStoreInVueApp(vueApp, 'lipstick');
        if (lipstickStore) {
          // Convert hex to RGB
          const rgb = this.hexToRgb(makeupSuggestions.lipstick.color);
          if (rgb) {
            console.log('Applying lipstick color:', rgb);
            // Enable lipstick and set color
            lipstickStore.enabled = true;
            if (lipstickStore.color) {
              lipstickStore.color.r = rgb.r;
              lipstickStore.color.g = rgb.g;
              lipstickStore.color.b = rgb.b;
              
              // Set intensity if available
              if (makeupSuggestions.lipstick.intensity !== undefined && lipstickStore.opacity !== undefined) {
                lipstickStore.opacity = makeupSuggestions.lipstick.intensity / 100;
              }
            }
          }
        }
      }
      
      // Apply eyeshadow
      if (makeupSuggestions.eyeshadow) {
        const eyeshadowStore = this.findStoreInVueApp(vueApp, 'eyesMakeup');
        if (eyeshadowStore) {
          // Convert hex to RGB
          const rgb = this.hexToRgb(makeupSuggestions.eyeshadow.color);
          if (rgb) {
            console.log('Applying eyeshadow color:', rgb);
            // Enable eyeshadow and set color
            eyeshadowStore.enabled = true;
            if (eyeshadowStore.shadow && eyeshadowStore.shadow.color) {
              eyeshadowStore.shadow.color.r = rgb.r;
              eyeshadowStore.shadow.color.g = rgb.g;
              eyeshadowStore.shadow.color.b = rgb.b;
              
              // Set intensity if available
              if (makeupSuggestions.eyeshadow.intensity !== undefined && eyeshadowStore.shadow.opacity !== undefined) {
                eyeshadowStore.shadow.opacity = makeupSuggestions.eyeshadow.intensity / 100;
              }
            }
          }
        }
      }
      
      // Apply blush
      if (makeupSuggestions.blush) {
        const blushStore = this.findStoreInVueApp(vueApp, 'faceMakeup');
        if (blushStore) {
          // Convert hex to RGB
          const rgb = this.hexToRgb(makeupSuggestions.blush.color);
          if (rgb) {
            console.log('Applying blush color:', rgb);
            // Enable blush and set color
            if (blushStore.blush) {
              blushStore.blush.enabled = true;
              if (blushStore.blush.color) {
                blushStore.blush.color.r = rgb.r;
                blushStore.blush.color.g = rgb.g;
                blushStore.blush.color.b = rgb.b;
                
                // Set intensity if available
                if (makeupSuggestions.blush.intensity !== undefined && blushStore.blush.opacity !== undefined) {
                  blushStore.blush.opacity = makeupSuggestions.blush.intensity / 100;
                }
              }
            }
          }
        }
      }
      
      console.log('Makeup filters applied successfully');
      
      // Update the global selectedFeatures object for product display
      if (window.selectedFeatures) {
        window.selectedFeatures = {
          lips: makeupSuggestions.lipstick,
          eyes: makeupSuggestions.eyeshadow,
          cheeks: makeupSuggestions.blush,
          occasion: makeupSuggestions.occasion || 'Custom Look',
          skinTone: makeupSuggestions.skinTone || 'Medium'
        };
      }
      
      // Store the applied makeup for reference
      this.lastAppliedMakeup = makeupSuggestions;
      
      // Trigger a product display event
      const makeupEvent = new CustomEvent('makeupApplied', {
        detail: makeupSuggestions
      });
      document.dispatchEvent(makeupEvent);
      
    } catch (error) {
      console.error('Error applying filters to SDK:', error);
    }
  }
  
  /**
   * Find a store in the Vue app
   */
  findStoreInVueApp(vueApp, storeName) {
    // Recursively search through Vue component tree to find the store
    if (!vueApp) return null;
    
    if (vueApp[storeName]) return vueApp[storeName];
    
    // Direct path to common stores
    if (vueApp.$children && vueApp.$children.length > 0) {
      // Try first child's stores (common pattern in Banuba SDK)
      if (vueApp.$children[0][storeName]) {
        return vueApp.$children[0][storeName];
      }
      
      // Check if features is available in the first child
      if (vueApp.$children[0].features) {
        const featuresComponent = vueApp.$children[0].features;
        if (featuresComponent[storeName]) {
          return featuresComponent[storeName];
        }
      }
      
      // Check in settings if available
      if (vueApp.$children[0].settings && vueApp.$children[0].settings[storeName]) {
        return vueApp.$children[0].settings[storeName];
      }
      
      // Check in viewer if available
      if (vueApp.$children[0].viewer && vueApp.$children[0].viewer[storeName]) {
        return vueApp.$children[0].viewer[storeName];
      }
      
      // Search all children recursively
      for (const child of vueApp.$children) {
        const result = this.findStoreInVueApp(child, storeName);
        if (result) return result;
      }
    }
    
    // Alternative approach: look for properties that might contain the store
    const possibleContainers = ['features', 'settings', 'viewer', 'stores', 'makeup'];
    for (const container of possibleContainers) {
      if (vueApp[container] && vueApp[container][storeName]) {
        return vueApp[container][storeName];
      }
    }
    
    // Try accessing common Banuba store structure
    if (storeName === 'lipstick' && vueApp.lips && vueApp.lips.color) {
      return vueApp.lips;
    }
    
    if (storeName === 'eyesMakeup' && vueApp.eyes) {
      return vueApp.eyes;
    }
    
    if (storeName === 'faceMakeup' && vueApp.face) {
      return vueApp.face;
    }
    
    return null;
  }
  
  /**
   * Convert hex color to RGB
   */
  hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse hex values
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    
    return { r, g, b };
  }
  
  /**
   * Setup listener for image uploads to capture the image
   */
  setupImageUploadListener() {
    // Watch for image changes in the viewer
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          const imageElements = document.querySelectorAll('.camera-view img, .camera-view canvas, .viewer-container img, .viewer-container canvas');
          imageElements.forEach(img => {
            if (!img.dataset.aiTracked) {
              img.dataset.aiTracked = 'true';
              // Store reference to the latest image
              this.getCurrentImageData().then(imageData => {
                this.lastUploadedImage = imageData;
              });
            }
          });
        }
      });
    });
    
    // Start observing document for changes
    observer.observe(document.body, { childList: true, subtree: true });
  }
  
  /**
   * Show loading indicator
   */
  showLoadingIndicator(message = "Analyzing...") {
    // Create and show loading indicator
    if (!document.getElementById('ai-loading-indicator')) {
      const loader = document.createElement('div');
      loader.id = 'ai-loading-indicator';
      loader.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(0,0,0,0.7);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: center;
      `;
      
      loader.innerHTML = `
        <div style="width: 30px; height: 30px; border: 3px solid #fff; border-radius: 50%; border-top-color: transparent; animation: spin 1s linear infinite;"></div>
        <div id="ai-loading-message" style="margin-top: 10px;">${message}</div>
      `;
      
      const style = document.createElement('style');
      style.textContent = `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
      document.body.appendChild(loader);
    } else {
      const messageElement = document.getElementById('ai-loading-message');
      if (messageElement) {
        messageElement.textContent = message;
      }
      document.getElementById('ai-loading-indicator').style.display = 'flex';
    }
  }
  
  /**
   * Update loading message
   */
  updateLoadingMessage(message) {
    const messageElement = document.getElementById('ai-loading-message');
    if (messageElement) {
      messageElement.textContent = message;
    }
  }
  
  /**
   * Hide loading indicator
   */
  hideLoadingIndicator() {
    // Hide loading indicator
    const loader = document.getElementById('ai-loading-indicator');
    if (loader) {
      loader.style.display = 'none';
    }
  }
  
  /**
   * Apply makeup directly from a text prompt without requiring an image
   * @param {string} prompt - The makeup style prompt (e.g., "wedding makeup")
   * @returns {Object} Result object with success status and applied filters
   */
  async applyMakeupFromPrompt(prompt) {
    console.log('[GenAIMakeup] Applying makeup from prompt:', prompt);
    
    // Show loading indicator
    this.showMessage('Analyzing makeup style: ' + prompt);
    
    try {
      // Make sure MakeupGeminiHandler is ready
      if (!window.makeupGeminiHandler) {
        console.log('[GenAIMakeup] Waiting for MakeupGeminiHandler to be available');
        
        // Wait for handler with timeout
        const handlerReady = await Promise.race([
          new Promise(resolve => {
            document.addEventListener('makeupGeminiHandlerReady', () => resolve(true), { once: true });
          }),
          new Promise(resolve => setTimeout(() => resolve(false), 3000))
        ]);
        
        if (!handlerReady && !window.makeupGeminiHandler) {
          console.warn('[GenAIMakeup] MakeupGeminiHandler not available after waiting');
        }
      }
      
      let filters;
      
      // Use MakeupGeminiHandler if available
      if (window.makeupGeminiHandler) {
        console.log('[GenAIMakeup] Using MakeupGeminiHandler to process prompt');
        filters = await window.makeupGeminiHandler.processMakeupPrompt(prompt);
      } else {
        // Fallback to direct API call if handler not available
        console.log('[GenAIMakeup] MakeupGeminiHandler not found, using fallback');
        filters = await this.getFiltersFromPrompt(prompt);
      }
      
      console.log('[GenAIMakeup] Filters generated:', filters);
      
      // Apply the filters to the Banuba SDK
      const result = await this.applyFiltersToBanuba(filters);
      
      // Show success message
      this.showMessage(`${filters.style || 'Custom'} makeup applied successfully!`);
      
      return {
        success: true,
        description: filters.description || 'Makeup applied based on your request',
        filters: filters.filters,
        style: filters.style
      };
    } catch (error) {
      console.error('[GenAIMakeup] Error applying makeup from prompt:', error);
      
      // Show error message
      this.showMessage('Could not apply makeup. Please try again.');
      
      return {
        success: false,
        error: error.message || 'Unknown error occurred'
      };
    }
  }
  
  /**
   * Apply filters to Banuba SDK
   * @param {Object} filters - The filter settings to apply
   * @returns {Promise} Promise that resolves when filters are applied
   */
  async applyFiltersToBanuba(filters) {
    try {
      // First check if we have an initialization coordinator
      if (window.makeupInitCoordinator) {
        // Make sure the app is ready
        if (!window.makeupInitCoordinator.isReady()) {
          console.log('[GenAIMakeup] Waiting for app to be ready before applying filters');
          
          // Wait for app to be ready with a timeout
          const appReady = await Promise.race([
            new Promise(resolve => {
              document.addEventListener('makeupAppReady', () => resolve(true), { once: true });
            }),
            new Promise(resolve => setTimeout(() => resolve(false), 5000))
          ]);
          
          if (!appReady) {
            console.warn('[GenAIMakeup] Timed out waiting for app ready event');
          }
        }
      }
      
      // First try to access the global App object which is more reliable
      if (typeof App !== 'undefined' && App.$children && App.$children[0]) {
        console.log('[GenAIMakeup] Using global App object to apply filters');
        const vueApp = App.$children[0];
        
        // Process each filter and apply to Banuba
        if (filters.filters && Array.isArray(filters.filters)) {
          for (const filter of filters.filters) {
            await this.applyFilterToVueApp(vueApp, filter);
          }
        }
        
        console.log('[GenAIMakeup] Successfully applied all filters using global App');
        
        // Display product recommendations if available
        if (this.productRecommender && filters.filters) {
          this.productRecommender.displayProductCards(filters);
        }
        
        return true;
      }
      
      // Fallback to DOM-based approach
      // Try to find the bnb-app element first
      const appElement = document.querySelector('bnb-app');
      if (!appElement) {
        console.error('[GenAIMakeup] Could not find bnb-app element');
        
        // Try one more fallback approach
        const anyVueElement = document.querySelector('[data-v-app]') || 
                            document.querySelector('.bnb-layout') || 
                            document.querySelector('.bnb-settings');
                            
        if (!anyVueElement) {
          throw new Error('Could not find any Banuba app elements in the DOM');
        }
        
        console.log('[GenAIMakeup] Using fallback element:', anyVueElement);
        
        // At this point, we found some Vue element but can't properly apply filters
        // We'll show a message to the user
        this.showMessage('Makeup system detected but cannot apply filters directly. Please try again in a moment.');
        return false;
      }
      
      // Get Vue instance
      let vueApp;
      try {
        vueApp = appElement.__vue__;
        if (!vueApp || !vueApp.$store) {
          // Try to find app through __vue_app__ (Vue 3)
          vueApp = appElement.__vue_app__;
          if (!vueApp) {
            throw new Error('Vue app instance not available');
          }
        }
      } catch (e) {
        console.warn('[GenAIMakeup] Could not get Vue instance:', e);
        this.showMessage('Unable to access makeup system. Please refresh the page and try again.');
        return false;
      }
      
      // Process each filter and apply to Banuba
      if (filters.filters && Array.isArray(filters.filters)) {
        for (const filter of filters.filters) {
          await this.applyFilterToVueApp(vueApp, filter);
        }
      }
      
      console.log('[GenAIMakeup] Successfully applied all filters');
      
      // Display product recommendations if available
      if (this.productRecommender && filters.filters) {
        this.productRecommender.displayProductCards(filters);
      }
      
      return true;
    } catch (error) {
      console.error('[GenAIMakeup] Error applying filters to Banuba:', error);
      
      // Show friendly message to user
      this.showMessage('Could not apply makeup filters. Please try again later.');
      
      throw error;
    }
  }
  
  /**
   * Apply a single filter to the Vue app
   * @param {Object} vueApp - The Vue app instance
   * @param {Object} filter - The filter to apply
   */
  async applyFilterToVueApp(vueApp, filter) {
    try {
      console.log('[GenAIMakeup] Applying filter:', filter);
      
      // Get appropriate action based on filter type
      switch (filter.type) {
        case 'lipstick':
          await this.applyLipstick(vueApp, filter);
          break;
        case 'eyeshadow':
          await this.applyEyeshadow(vueApp, filter);
          break;
        case 'eyeliner':
          await this.applyEyeliner(vueApp, filter);
          break;
        case 'blush':
          await this.applyBlush(vueApp, filter);
          break;
        case 'foundation':
          await this.applyFoundation(vueApp, filter);
          break;
        case 'highlighter':
          await this.applyHighlighter(vueApp, filter);
          break;
        case 'contour':
          await this.applyContour(vueApp, filter);
          break;
        default:
          console.warn(`[GenAIMakeup] Unknown filter type: ${filter.type}`);
      }
    } catch (error) {
      console.error(`[GenAIMakeup] Error applying ${filter.type}:`, error);
    }
  }
  
  /**
   * Apply lipstick filter
   */
  async applyLipstick(vueApp, filter) {
    try {
      // Convert hex to RGB
      const rgb = this.hexToRgb(filter.hex);
      
      // Find the lip makeup feature
      const feature = vueApp.$store.state.features.find(f => 
        f.name.toLowerCase().includes('lip') || f.localizedName.toLowerCase().includes('lip')
      );
      
      if (!feature) {
        throw new Error('Lipstick feature not found');
      }
      
      // Set feature as active
      vueApp.$store.commit('setActiveFeature', feature);
      
      // Find the color effect
      const colorEffect = feature.effects.find(e => 
        e.name.toLowerCase().includes('color') || e.effectType === 'color'
      );
      
      if (colorEffect) {
        // Set the color
        vueApp.$store.dispatch('changeEffectColor', {
          effect: colorEffect,
          value: { r: rgb.r, g: rgb.g, b: rgb.b, a: 1 }
        });
        
        // Set intensity
        if (typeof filter.intensity === 'number') {
          const intensityEffect = feature.effects.find(e => 
            e.name.toLowerCase().includes('strength') || e.name.toLowerCase().includes('intensity')
          );
          
          if (intensityEffect) {
            vueApp.$store.dispatch('changeEffectParam', {
              effect: intensityEffect,
              param: intensityEffect.params[0],
              value: filter.intensity
            });
          }
        }
        
        // Set glossiness if available
        if (typeof filter.glossiness === 'number') {
          const glossEffect = feature.effects.find(e => 
            e.name.toLowerCase().includes('gloss') || e.name.toLowerCase().includes('shine')
          );
          
          if (glossEffect) {
            vueApp.$store.dispatch('changeEffectParam', {
              effect: glossEffect,
              param: glossEffect.params[0],
              value: filter.glossiness
            });
          }
        }
      }
    } catch (error) {
      console.error('[GenAIMakeup] Error applying lipstick:', error);
    }
  }
  
  /**
   * Apply eyeshadow filter
   */
  async applyEyeshadow(vueApp, filter) {
    try {
      const rgb = this.hexToRgb(filter.hex);
      
      const feature = vueApp.$store.state.features.find(f => 
        f.name.toLowerCase().includes('eye') && 
        (f.name.toLowerCase().includes('shadow') || f.localizedName.toLowerCase().includes('shadow'))
      );
      
      if (!feature) {
        throw new Error('Eyeshadow feature not found');
      }
      
      vueApp.$store.commit('setActiveFeature', feature);
      
      const colorEffect = feature.effects.find(e => 
        e.name.toLowerCase().includes('color') || e.effectType === 'color'
      );
      
      if (colorEffect) {
        vueApp.$store.dispatch('changeEffectColor', {
          effect: colorEffect,
          value: { r: rgb.r, g: rgb.g, b: rgb.b, a: 1 }
        });
        
        if (typeof filter.intensity === 'number') {
          const intensityEffect = feature.effects.find(e => 
            e.name.toLowerCase().includes('strength') || e.name.toLowerCase().includes('intensity')
          );
          
          if (intensityEffect) {
            vueApp.$store.dispatch('changeEffectParam', {
              effect: intensityEffect,
              param: intensityEffect.params[0],
              value: filter.intensity
            });
          }
        }
      }
    } catch (error) {
      console.error('[GenAIMakeup] Error applying eyeshadow:', error);
    }
  }
  
  /**
   * Apply blush filter
   */
  async applyBlush(vueApp, filter) {
    try {
      const rgb = this.hexToRgb(filter.hex);
      
      const feature = vueApp.$store.state.features.find(f => 
        f.name.toLowerCase().includes('blush') || f.localizedName.toLowerCase().includes('blush')
      );
      
      if (!feature) {
        throw new Error('Blush feature not found');
      }
      
      vueApp.$store.commit('setActiveFeature', feature);
      
      const colorEffect = feature.effects.find(e => 
        e.name.toLowerCase().includes('color') || e.effectType === 'color'
      );
      
      if (colorEffect) {
        vueApp.$store.dispatch('changeEffectColor', {
          effect: colorEffect,
          value: { r: rgb.r, g: rgb.g, b: rgb.b, a: 1 }
        });
        
        if (typeof filter.intensity === 'number') {
          const intensityEffect = feature.effects.find(e => 
            e.name.toLowerCase().includes('strength') || e.name.toLowerCase().includes('intensity')
          );
          
          if (intensityEffect) {
            vueApp.$store.dispatch('changeEffectParam', {
              effect: intensityEffect,
              param: intensityEffect.params[0],
              value: filter.intensity
            });
          }
        }
      }
    } catch (error) {
      console.error('[GenAIMakeup] Error applying blush:', error);
    }
  }
  
  /**
   * Apply eyeliner filter
   */
  async applyEyeliner(vueApp, filter) {
    try {
      const rgb = this.hexToRgb(filter.hex);
      
      const feature = vueApp.$store.state.features.find(f => 
        f.name.toLowerCase().includes('liner') || f.localizedName.toLowerCase().includes('liner')
      );
      
      if (!feature) {
        throw new Error('Eyeliner feature not found');
      }
      
      vueApp.$store.commit('setActiveFeature', feature);
      
      const colorEffect = feature.effects.find(e => 
        e.name.toLowerCase().includes('color') || e.effectType === 'color'
      );
      
      if (colorEffect) {
        vueApp.$store.dispatch('changeEffectColor', {
          effect: colorEffect,
          value: { r: rgb.r, g: rgb.g, b: rgb.b, a: 1 }
        });
        
        if (typeof filter.intensity === 'number') {
          const intensityEffect = feature.effects.find(e => 
            e.name.toLowerCase().includes('strength') || e.name.toLowerCase().includes('intensity')
          );
          
          if (intensityEffect) {
            vueApp.$store.dispatch('changeEffectParam', {
              effect: intensityEffect,
              param: intensityEffect.params[0],
              value: filter.intensity
            });
          }
        }
      }
    } catch (error) {
      console.error('[GenAIMakeup] Error applying eyeliner:', error);
    }
  }
  
  /**
   * Apply foundation filter
   */
  async applyFoundation(vueApp, filter) {
    // Implementation similar to other filters
    try {
      const rgb = this.hexToRgb(filter.hex);
      
      const feature = vueApp.$store.state.features.find(f => 
        f.name.toLowerCase().includes('foundation') || f.localizedName.toLowerCase().includes('foundation')
      );
      
      if (!feature) {
        throw new Error('Foundation feature not found');
      }
      
      vueApp.$store.commit('setActiveFeature', feature);
      
      const colorEffect = feature.effects.find(e => 
        e.name.toLowerCase().includes('color') || e.effectType === 'color'
      );
      
      if (colorEffect) {
        vueApp.$store.dispatch('changeEffectColor', {
          effect: colorEffect,
          value: { r: rgb.r, g: rgb.g, b: rgb.b, a: 1 }
        });
        
        if (typeof filter.intensity === 'number') {
          const intensityEffect = feature.effects.find(e => 
            e.name.toLowerCase().includes('strength') || e.name.toLowerCase().includes('intensity')
          );
          
          if (intensityEffect) {
            vueApp.$store.dispatch('changeEffectParam', {
              effect: intensityEffect,
              param: intensityEffect.params[0],
              value: filter.intensity
            });
          }
        }
      }
    } catch (error) {
      console.error('[GenAIMakeup] Error applying foundation:', error);
    }
  }
  
  /**
   * Apply highlighter filter
   */
  async applyHighlighter(vueApp, filter) {
    // Implementation similar to other filters
    try {
      const rgb = this.hexToRgb(filter.hex);
      
      const feature = vueApp.$store.state.features.find(f => 
        f.name.toLowerCase().includes('highlight') || f.localizedName.toLowerCase().includes('highlight')
      );
      
      if (!feature) {
        throw new Error('Highlighter feature not found');
      }
      
      vueApp.$store.commit('setActiveFeature', feature);
      
      if (typeof filter.intensity === 'number') {
        const intensityEffect = feature.effects.find(e => 
          e.name.toLowerCase().includes('strength') || e.name.toLowerCase().includes('intensity')
        );
        
        if (intensityEffect) {
          vueApp.$store.dispatch('changeEffectParam', {
            effect: intensityEffect,
            param: intensityEffect.params[0],
            value: filter.intensity
          });
        }
      }
    } catch (error) {
      console.error('[GenAIMakeup] Error applying highlighter:', error);
    }
  }
  
  /**
   * Apply contour filter
   */
  async applyContour(vueApp, filter) {
    // Implementation similar to other filters
    try {
      const feature = vueApp.$store.state.features.find(f => 
        f.name.toLowerCase().includes('contour') || f.localizedName.toLowerCase().includes('contour')
      );
      
      if (!feature) {
        throw new Error('Contour feature not found');
      }
      
      vueApp.$store.commit('setActiveFeature', feature);
      
      if (typeof filter.intensity === 'number') {
        const intensityEffect = feature.effects.find(e => 
          e.name.toLowerCase().includes('strength') || e.name.toLowerCase().includes('intensity')
        );
        
        if (intensityEffect) {
          vueApp.$store.dispatch('changeEffectParam', {
            effect: intensityEffect,
            param: intensityEffect.params[0],
            value: filter.intensity
          });
        }
      }
    } catch (error) {
      console.error('[GenAIMakeup] Error applying contour:', error);
    }
  }
  
  /**
   * Convert hex color to RGB
   * @param {string} hex - Hex color code
   * @returns {Object} RGB color object
   */
  hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse hex values
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    
    return { r, g, b };
  }
  
  /**
   * Get filters directly from a text prompt using Gemini API
   * @param {string} prompt - The makeup style prompt
   * @returns {Object} Filter settings to apply
   */
  async getFiltersFromPrompt(prompt) {
    try {
      if (!this.geminiApiKey) {
        throw new Error('Gemini API key not available');
      }
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a makeup artist AI. Analyze this makeup request: "${prompt}"
              Provide JSON output with specific makeup filter settings that would work well for this style.
              Include these fields for each filter:
              - type (lipstick, eyeshadow, eyeliner, blush, etc.)
              - name (descriptive name of the color/product)
              - hex (hex color code)
              - intensity (number between 0 and 1)
              
              Also include:
              - style (overall style name)
              - description (1-2 sentence description)
              
              Format your response as a valid JSON object only, with no other text.`
            }]
          }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024
          }
        })
      });
      
      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid API response format');
      }
      
      const textResponse = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from response
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not extract JSON from response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('[GenAIMakeup] Error getting filters from prompt:', error);
      return this.getFallbackMakeupSuggestions();
    }
  }
  
  /**
   * Show a message to the user
   * @param {string} message - The message to show
   */
  showMessage(message) {
    // Try to find an existing message container
    let messageContainer = document.getElementById('genai-makeup-message');
    
    if (!messageContainer) {
      // Create a new message container
      messageContainer = document.createElement('div');
      messageContainer.id = 'genai-makeup-message';
      messageContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #485FC7;
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        z-index: 10000;
        font-family: sans-serif;
        font-size: 14px;
        text-align: center;
        max-width: 80%;
      `;
      document.body.appendChild(messageContainer);
    }
    
    // Set the message text
    messageContainer.textContent = message;
    
    // Show the message
    messageContainer.style.display = 'block';
    
    // Hide after 4 seconds
    setTimeout(() => {
      messageContainer.style.display = 'none';
    }, 4000);
  }
}

// Initialize the GenAI Makeup component
document.addEventListener('DOMContentLoaded', () => {
  window.genAIMakeup = new GenAIMakeup();
  
  // Notify the initialization coordinator that we're ready
  document.dispatchEvent(new CustomEvent('genAIMakeupReady'));
  
  // Expose public API for integration with GenZ shopping experience
  window.applyAIMakeup = (prompt, imageData) => {
    if (window.genAIMakeup) {
      window.genAIMakeup.processAIMakeup(prompt, imageData);
      return true;
    }
    return false;
  };
});