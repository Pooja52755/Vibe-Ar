/**
 * MakeupGeminiHandler.js - Backend handler for Gemini API interactions
 * 
 * This component handles all Gemini API interactions for makeup suggestions:
 * 1. Processes text prompts like "wedding makeup" or "professional look"
 * 2. Converts Gemini's responses to Banuba-compatible filter parameters
 * 3. Implements robust error handling and fallbacks
 * 4. Caches common results for better performance
 */

class MakeupGeminiHandler {
  constructor() {
    // Get API key from config
    this.API_KEY = window.GEMINI_API_KEY || "AIzaSyDIZLGgaxV8kKTjWA9SASstL6gRkseKGkM";
    this.API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
    this.TEXT_MODEL = "gemini-pro";
    this.VISION_MODEL = "gemini-pro-vision";
    
    // Cache for storing previous results
    this.promptCache = new Map();
    
    // Banuba filter mapping (these are the filters Banuba supports)
    this.banubaFilters = {
      lipstick: ["color", "intensity", "glossiness"],
      eyeshadow: ["color", "intensity", "coverage"],
      eyeliner: ["color", "intensity", "width"],
      eyebrows: ["color", "intensity", "shape"],
      foundation: ["color", "intensity", "coverage"],
      blush: ["color", "intensity", "placement"],
      contour: ["intensity", "placement"],
      highlighter: ["color", "intensity", "placement"]
    };
    
    // Make the instance globally available
    window.makeupGeminiHandler = this;
    
    console.log('[MakeupGeminiHandler] Initialized');
    
    // Notify the initialization coordinator that we're ready
    document.dispatchEvent(new CustomEvent('makeupGeminiHandlerReady'));
  }
  
  /**
   * Process a makeup prompt and return appropriate filter settings
   * @param {string} prompt - The user's makeup prompt (e.g., "wedding makeup")
   * @returns {Object} Makeup filter settings in Banuba-compatible format
   */
  async processMakeupPrompt(prompt) {
    console.log('[MakeupGeminiHandler] Processing makeup prompt:', prompt);
    
    // Check cache first
    if (this.promptCache.has(prompt)) {
      console.log('[MakeupGeminiHandler] Using cached result for prompt:', prompt);
      return this.promptCache.get(prompt);
    }
    
    try {
      const endpoint = `${this.API_BASE_URL}/${this.TEXT_MODEL}:generateContent?key=${this.API_KEY}`;
      
      const promptEngineering = `
You are a professional makeup artist AI. Analyze the following makeup request and suggest appropriate makeup filters.

Request: "${prompt}"

Based on this request, provide JSON output with specific makeup filter settings that would look good for this style.
The output should be in this exact format:

{
  "filters": [
    {
      "type": "lipstick",
      "name": "specific descriptive name",
      "hex": "#HEX_COLOR",
      "intensity": 0.X (float between 0.1 and 1.0),
      "glossiness": 0.X (optional, float between 0 and 1.0)
    },
    {
      "type": "eyeshadow",
      "name": "specific descriptive name",
      "hex": "#HEX_COLOR",
      "intensity": 0.X,
      "coverage": 0.X (optional)
    },
    {
      "type": "eyeliner",
      "name": "specific descriptive name",
      "hex": "#HEX_COLOR",
      "intensity": 0.X,
      "width": 0.X (optional)
    },
    {
      "type": "blush",
      "name": "specific descriptive name",
      "hex": "#HEX_COLOR",
      "intensity": 0.X
    }
  ],
  "style": "descriptive style name",
  "description": "Brief 1-2 sentence description of this makeup look"
}

Include at least lipstick, eyeshadow, and blush. Only include valid JSON, nothing else.
`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: promptEngineering }]
          }],
          generationConfig: {
            temperature: 0.2,
            topK: 32,
            topP: 0.95,
            maxOutputTokens: 1024
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid API response format');
      }
      
      const textResponse = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from response text
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not extract JSON from response');
      }
      
      const makeupFilters = JSON.parse(jsonMatch[0]);
      console.log('[MakeupGeminiHandler] Makeup filters generated:', makeupFilters);
      
      // Convert to Banuba-compatible format
      const banubaFilters = this.convertToBanubaFormat(makeupFilters);
      
      // Cache the result
      this.promptCache.set(prompt, banubaFilters);
      
      return banubaFilters;
    } catch (error) {
      console.error('[MakeupGeminiHandler] Error processing makeup prompt:', error);
      console.log('[MakeupGeminiHandler] Using API key:', this.API_KEY.slice(0, 5) + '...');
      console.log('[MakeupGeminiHandler] Will return fallback filters instead');
      
      // Return fallback filters
      return this.getFallbackFilters(prompt);
    }
  }
  
  /**
   * Convert Gemini output to Banuba-compatible format
   * @param {Object} geminiOutput - The raw output from Gemini API
   * @returns {Object} Banuba-compatible filter settings
   */
  convertToBanubaFormat(geminiOutput) {
    const banubaFormatted = {
      filters: [],
      style: geminiOutput.style || "Custom Style",
      description: geminiOutput.description || "Custom makeup look based on your request",
      success: true
    };
    
    // Process each filter from Gemini
    if (geminiOutput.filters && Array.isArray(geminiOutput.filters)) {
      geminiOutput.filters.forEach(filter => {
        // Check if this is a valid filter type that Banuba supports
        if (filter.type && this.banubaFilters[filter.type]) {
          const banubaFilter = {
            type: filter.type,
            name: filter.name || `Custom ${filter.type}`,
            hex: filter.hex || this.getDefaultColorForType(filter.type),
            intensity: this.normalizeValue(filter.intensity, 0.7), // Default to 0.7 if not provided
            // Add any additional parameters based on filter type
            ...this.getAdditionalParams(filter)
          };
          
          banubaFormatted.filters.push(banubaFilter);
        }
      });
    }
    
    // Ensure we have at least some basic filters
    if (banubaFormatted.filters.length === 0) {
      banubaFormatted.filters = this.getBasicFilters();
    }
    
    return banubaFormatted;
  }
  
  /**
   * Get additional parameters based on filter type
   * @param {Object} filter - The filter object from Gemini
   * @returns {Object} Additional parameters specific to this filter type
   */
  getAdditionalParams(filter) {
    const additionalParams = {};
    
    switch (filter.type) {
      case 'lipstick':
        additionalParams.glossiness = this.normalizeValue(filter.glossiness, 0.5);
        break;
      case 'eyeshadow':
        additionalParams.coverage = this.normalizeValue(filter.coverage, 0.6);
        break;
      case 'eyeliner':
        additionalParams.width = this.normalizeValue(filter.width, 0.5);
        break;
      case 'eyebrows':
        additionalParams.shape = filter.shape || "natural";
        break;
      case 'blush':
      case 'contour':
      case 'highlighter':
        additionalParams.placement = filter.placement || "natural";
        break;
    }
    
    return additionalParams;
  }
  
  /**
   * Normalize a value to be between 0 and 1
   * @param {number} value - The input value
   * @param {number} defaultValue - Default value if input is invalid
   * @returns {number} Normalized value between 0 and 1
   */
  normalizeValue(value, defaultValue) {
    if (typeof value !== 'number' || isNaN(value)) {
      return defaultValue;
    }
    
    return Math.max(0, Math.min(1, value));
  }
  
  /**
   * Get default color for a filter type
   * @param {string} filterType - The type of filter
   * @returns {string} Default hex color
   */
  getDefaultColorForType(filterType) {
    const defaults = {
      lipstick: "#FF6B6B",
      eyeshadow: "#D8BFD8",
      eyeliner: "#4A4A4A",
      eyebrows: "#8B4513",
      blush: "#FFB6C1",
      highlighter: "#FFF0DB",
      foundation: "#F5DEB3"
    };
    
    return defaults[filterType] || "#CCCCCC";
  }
  
  /**
   * Get basic filters when Gemini fails
   * @returns {Array} Basic filter array
   */
  getBasicFilters() {
    return [
      {
        type: "lipstick",
        name: "Natural Rose",
        hex: "#FF6B6B",
        intensity: 0.7,
        glossiness: 0.5
      },
      {
        type: "eyeshadow",
        name: "Soft Taupe",
        hex: "#D2B48C",
        intensity: 0.6,
        coverage: 0.5
      },
      {
        type: "blush",
        name: "Warm Peach",
        hex: "#FFAA99",
        intensity: 0.5,
        placement: "natural"
      }
    ];
  }
  
  /**
   * Get fallback filters based on prompt keywords
   * @param {string} prompt - The user's makeup prompt
   * @returns {Object} Fallback filter settings
   */
  getFallbackFilters(prompt) {
    console.log('[MakeupGeminiHandler] Using fallback filters for prompt:', prompt);
    
    const promptLower = prompt.toLowerCase();
    let style = "natural";
    let description = "Natural everyday makeup look";
    
    // Detect style from prompt keywords
    if (promptLower.includes('wedding') || promptLower.includes('bride')) {
      return {
        filters: [
          {
            type: "lipstick",
            name: "Soft Pink",
            hex: "#E8A9A9",
            intensity: 0.7,
            glossiness: 0.6
          },
          {
            type: "eyeshadow",
            name: "Champagne Shimmer",
            hex: "#E6D2B5",
            intensity: 0.6,
            coverage: 0.5
          },
          {
            type: "blush",
            name: "Delicate Rose",
            hex: "#E8B4B8",
            intensity: 0.5,
            placement: "natural"
          },
          {
            type: "eyeliner",
            name: "Soft Brown",
            hex: "#614E3E",
            intensity: 0.6,
            width: 0.4
          }
        ],
        style: "Bridal",
        description: "Elegant bridal makeup with soft pink tones and subtle shimmer",
        success: true
      };
    } else if (promptLower.includes('professional') || promptLower.includes('office') || promptLower.includes('work')) {
      return {
        filters: [
          {
            type: "lipstick",
            name: "Muted Mauve",
            hex: "#C8A2C8",
            intensity: 0.6,
            glossiness: 0.3
          },
          {
            type: "eyeshadow",
            name: "Taupe Matte",
            hex: "#BEA99F",
            intensity: 0.5,
            coverage: 0.5
          },
          {
            type: "blush",
            name: "Subtle Rose",
            hex: "#DCAEA9",
            intensity: 0.4,
            placement: "natural"
          }
        ],
        style: "Professional",
        description: "Subtle, workplace-appropriate makeup with neutral tones",
        success: true
      };
    } else if (promptLower.includes('evening') || promptLower.includes('night') || promptLower.includes('party') || promptLower.includes('glamorous')) {
      return {
        filters: [
          {
            type: "lipstick",
            name: "Bold Red",
            hex: "#D81E5B",
            intensity: 0.8,
            glossiness: 0.4
          },
          {
            type: "eyeshadow",
            name: "Smoky Charcoal",
            hex: "#444444",
            intensity: 0.7,
            coverage: 0.7
          },
          {
            type: "blush",
            name: "Deep Rose",
            hex: "#C27C88",
            intensity: 0.6,
            placement: "angular"
          },
          {
            type: "highlighter",
            name: "Golden Glow",
            hex: "#FFF3E0",
            intensity: 0.7,
            placement: "prominent"
          }
        ],
        style: "Evening Glamour",
        description: "Dramatic evening makeup with bold eyes and statement lip",
        success: true
      };
    } else {
      // Default natural look
      return {
        filters: [
          {
            type: "lipstick",
            name: "Natural Rose",
            hex: "#FF6B6B",
            intensity: 0.6,
            glossiness: 0.5
          },
          {
            type: "eyeshadow",
            name: "Soft Taupe",
            hex: "#D2B48C",
            intensity: 0.5,
            coverage: 0.4
          },
          {
            type: "blush",
            name: "Warm Peach",
            hex: "#FFAA99",
            intensity: 0.4,
            placement: "natural"
          }
        ],
        style: "Natural",
        description: "Fresh, natural makeup that enhances your features",
        success: true
      };
    }
  }
}

// Initialize the handler
new MakeupGeminiHandler();