/**
 * GeminiService.js - Service for integrating with Google's Gemini AI
 * 
 * This service provides:
 * - Makeup suggestions based on text prompts
 * - Face analysis for skin tone matching
 * - Product recommendations based on makeup styles
 * - Context-aware makeup suggestions based on occasions
 */

class GeminiService {
  constructor() {
    this.API_KEY = window.GEMINI_API_KEY || "AIzaSyDIZLGgaxV8kKTjWA9SASstL6gRkseKGkM";
    this.API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
    this.TEXT_MODEL = "gemini-pro";
    this.VISION_MODEL = "gemini-pro-vision";
    
    console.log('[GeminiService] Initialized');
  }
  
  /**
   * Get makeup suggestions based on a text prompt
   * @param {string} prompt - User's makeup style prompt
   * @returns {Object} Makeup suggestions
   */
  async getMakeupSuggestions(prompt) {
    try {
      console.log('[GeminiService] Getting makeup suggestions for prompt:', prompt);
      
      const endpoint = `${this.API_BASE_URL}/${this.TEXT_MODEL}:generateContent?key=${this.API_KEY}`;
      
      const requestBody = {
        contents: [{
          parts: [{
            text: `Generate makeup filter recommendations based on this description: "${prompt}".
            Output a JSON object with a makeupFilters array where each item has:
            - type (string): lipstick, eyeshadow, eyeliner, blush, foundation, highlighter, or contour
            - color (string): descriptive color name (like "ruby red")
            - hex (string): hex color code (like "#FF0000")
            - intensity (number): between 0.0 and 1.0
            - description (string): brief explanation of why this works for the look
            
            For example:
            {
              "makeupFilters": [
                {
                  "type": "lipstick",
                  "color": "berry red",
                  "hex": "#8E2323",
                  "intensity": 0.8,
                  "description": "A deep berry red that complements evening looks"
                },
                {
                  "type": "eyeshadow",
                  "color": "smoky gray",
                  "hex": "#696969",
                  "intensity": 0.7,
                  "description": "A sultry gray that creates depth and drama"
                }
              ],
              "occasion": "evening party",
              "style": "dramatic"
            }
            
            Make sure to include appropriate filters for the ${prompt} style.`
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 1024
        }
      };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
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
      
      const suggestions = JSON.parse(jsonMatch[0]);
      console.log('[GeminiService] Makeup suggestions:', suggestions);
      
      return suggestions;
    } catch (error) {
      console.error('[GeminiService] Error getting makeup suggestions:', error);
      console.log('[GeminiService] Using API key:', this.API_KEY.slice(0, 5) + '...');
      console.log('[GeminiService] Will return fallback suggestions instead');
      
      // Return fallback suggestions
      return this.getFallbackSuggestions(prompt);
    }
  }
  
  /**
   * Analyze a face image to get makeup recommendations
   * @param {string} imageBase64 - Base64 encoded image data
   * @param {string} prompt - User's makeup style prompt
   * @returns {Object} Makeup recommendations
   */
  async analyzeFace(imageBase64, prompt) {
    try {
      console.log('[GeminiService] Analyzing face with prompt:', prompt);
      
      const endpoint = `${this.API_BASE_URL}/${this.VISION_MODEL}:generateContent?key=${this.API_KEY}`;
      
      // Process image base64 (remove data URL prefix if present)
      const imageData = imageBase64.includes('data:image')
        ? imageBase64.split(',')[1]
        : imageBase64;
      
      const requestBody = {
        contents: [{
          parts: [
            {
              text: `Analyze this face image and suggest makeup that would look good for: "${prompt}".
              Consider the person's skin tone, face shape, and features.
              
              Output a JSON object with a makeupFilters array where each item has:
              - type (string): lipstick, eyeshadow, eyeliner, blush, foundation, highlighter, or contour
              - color (string): descriptive color name (like "ruby red")
              - hex (string): hex color code (like "#FF0000")
              - intensity (number): between 0.0 and 1.0
              - description (string): brief explanation of why this works for their features
              
              Also include:
              - skinTone (string): description of the person's skin tone
              - occasion (string): the occasion this makeup is for, based on the prompt
              - style (string): the overall style (natural, dramatic, etc.)
              
              Make sure color suggestions flatter the person's natural coloring.`
            },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: imageData
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 1024
        }
      };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
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
      
      const analysis = JSON.parse(jsonMatch[0]);
      console.log('[GeminiService] Face analysis results:', analysis);
      
      return analysis;
    } catch (error) {
      console.error('[GeminiService] Error analyzing face:', error);
      console.log('[GeminiService] Using API key:', this.API_KEY.slice(0, 5) + '...');
      console.log('[GeminiService] Will return fallback suggestions instead');
      
      // Return fallback suggestions
      return this.getFallbackSuggestions(prompt);
    }
  }
  
  /**
   * Generate fallback makeup suggestions when API fails
   * @param {string} prompt - User's makeup style prompt
   * @returns {Object} Fallback makeup suggestions
   */
  getFallbackSuggestions(prompt) {
    console.log('[GeminiService] Using fallback suggestions for prompt:', prompt);
    
    const promptLower = prompt.toLowerCase();
    let occasion = 'everyday';
    let style = 'natural';
    
    // Detect occasion and style from prompt
    if (promptLower.includes('wedding') || promptLower.includes('bride')) {
      occasion = 'wedding';
      style = 'elegant';
    } else if (promptLower.includes('evening') || promptLower.includes('party') || promptLower.includes('night')) {
      occasion = 'evening';
      style = 'glamorous';
    } else if (promptLower.includes('office') || promptLower.includes('work') || promptLower.includes('professional')) {
      occasion = 'office';
      style = 'professional';
    } else if (promptLower.includes('natural') || promptLower.includes('everyday')) {
      occasion = 'everyday';
      style = 'natural';
    } else if (promptLower.includes('bold') || promptLower.includes('dramatic')) {
      style = 'bold';
    }
    
    // Build fallback filters based on occasion and style
    const filters = [];
    
    if (occasion === 'wedding') {
      filters.push({
        type: 'lipstick',
        color: 'soft pink',
        hex: '#E8A9A9',
        intensity: 0.7,
        description: 'A soft pink shade perfect for bridal makeup'
      });
      
      filters.push({
        type: 'eyeshadow',
        color: 'champagne shimmer',
        hex: '#E6D2B5',
        intensity: 0.6,
        description: 'A subtle shimmer that catches the light beautifully'
      });
      
      filters.push({
        type: 'blush',
        color: 'rosy pink',
        hex: '#E8B4B8',
        intensity: 0.5,
        description: 'A gentle flush that photographs well'
      });
    } else if (style === 'bold' || style === 'glamorous') {
      filters.push({
        type: 'lipstick',
        color: 'bold red',
        hex: '#C0392B',
        intensity: 0.9,
        description: 'A statement red lip that commands attention'
      });
      
      filters.push({
        type: 'eyeshadow',
        color: 'smoky gray',
        hex: '#555555',
        intensity: 0.7,
        description: 'A dramatic smoky eye to enhance intensity'
      });
      
      filters.push({
        type: 'eyeliner',
        color: 'black',
        hex: '#000000',
        intensity: 1.0,
        description: 'Sharp black liner for definition'
      });
    } else {
      // Natural/everyday look
      filters.push({
        type: 'lipstick',
        color: 'nude pink',
        hex: '#C68E8E',
        intensity: 0.6,
        description: 'A your-lips-but-better natural shade'
      });
      
      filters.push({
        type: 'eyeshadow',
        color: 'soft taupe',
        hex: '#BFB0A0',
        intensity: 0.5,
        description: 'A subtle neutral tone for a natural look'
      });
      
      filters.push({
        type: 'blush',
        color: 'peachy pink',
        hex: '#FFBCBC',
        intensity: 0.4,
        description: 'A natural flush that brightens the complexion'
      });
    }
    
    return {
      makeupFilters: filters,
      occasion: occasion,
      style: style,
      note: "This is a fallback suggestion. Please check your internet connection or API key."
    };
  }
}

// Initialize and add to window
window.GeminiService = new GeminiService();