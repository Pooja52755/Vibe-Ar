/**
 * genai-makeup-integration.js
 * 
 * This module integrates natural language processing with Banuba AR makeup filters.
 * It allows users to describe makeup styles in plain English and automatically
 * applies the appropriate filters.
 */

(function() {
  console.log('[GenAIMakeupIntegration] Initializing...');
  
  // Expose public methods
  window.GenAIMakeupIntegration = {
    processPrompt: processNaturalLanguagePrompt,
    applyRecommendedFilters: applyRecommendedFilters,
    displayRecommendedProducts: displayRecommendedProducts
  };
  
  /**
   * Process a natural language prompt and get makeup filter recommendations
   * @param {string} prompt - The natural language prompt (e.g., "Make me ready for wedding")
   * @returns {Promise<Object>} - Promise resolving to recommendations
   */
  function processNaturalLanguagePrompt(prompt) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(`[GenAIMakeupIntegration] Processing prompt: "${prompt}"`);
        
        // Show processing indicator
        showProcessingIndicator(`Analyzing your request: "${prompt}"`);
        
        // Call the GenAI API (Gemini)
        const recommendations = await callGenAIAPI(prompt);
        
        // Hide processing indicator
        hideProcessingIndicator();
        
        console.log('[GenAIMakeupIntegration] Received recommendations:', recommendations);
        resolve(recommendations);
      } catch (error) {
        console.error('[GenAIMakeupIntegration] Error processing prompt:', error);
        hideProcessingIndicator();
        reject(error);
      }
    });
  }
  
  /**
   * Call the GenAI API with the prompt
   * @param {string} prompt - The natural language prompt
   * @returns {Promise<Object>} - Promise resolving to recommendations
   */
  async function callGenAIAPI(prompt) {
    try {
      // Check if we should use mock data for testing
      if (window.USE_MOCK_GENAI_RESPONSES) {
        return getMockResponse(prompt);
      }
      
      // Get API key from config
      const apiKey = getGeminiAPIKey();
      if (!apiKey) {
        throw new Error("No Gemini API key found. Please check gemini-config.js");
      }
      
      // Create the request to Gemini API
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: constructGenAIPrompt(prompt)
            }]
          }]
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Parse the response to extract the JSON part
      return parseGenAIResponse(data);
    } catch (error) {
      console.error('[GenAIMakeupIntegration] API call error:', error);
      
      // Fallback to mock data in case of error
      return getMockResponse(prompt);
    }
  }
  
  /**
   * Get the Gemini API key from config
   * @returns {string|null} - The API key or null if not found
   */
  function getGeminiAPIKey() {
    if (window.GEMINI_CONFIG && window.GEMINI_CONFIG.API_KEY) {
      return window.GEMINI_CONFIG.API_KEY;
    }
    return null;
  }
  
  /**
   * Construct the prompt to send to GenAI
   * @param {string} userPrompt - The user's natural language prompt
   * @returns {string} - The formatted prompt for the AI
   */
  function constructGenAIPrompt(userPrompt) {
    return `
You are an AI makeup expert tasked with interpreting natural language makeup requests and mapping them to specific Banuba AR makeup filters.

USER REQUEST: "${userPrompt}"

Based on this request, provide a JSON response with:
1. A list of Banuba filters to apply
2. Recommended makeup products

Available Banuba Filter IDs and their effects:
- "Makeup_001": Natural everyday look
- "Makeup_002": Light blush and subtle lips
- "Makeup_003": Dramatic smokey eye
- "Makeup_004": Bold red lips
- "Makeup_005": Professional office makeup
- "Makeup_006": Wedding/bridal makeup
- "Makeup_007": Evening glam with shimmer
- "Makeup_008": Soft romantic pink tones
- "Makeup_009": Summer bronze glow
- "Makeup_010": Vintage inspired makeup
- "Makeup_011": Bold colorful eyeshadow
- "Makeup_012": Matte neutral tones
- "Makeup_013": Korean glass skin
- "Makeup_014": Gothic dark lips
- "Makeup_015": Festival makeup with glitter

Respond with ONLY a valid JSON object in the following format:
{
  "filters": ["Makeup_XXX", "Makeup_YYY"],
  "products": [
    {
      "name": "Product Name",
      "brand": "Brand Name",
      "description": "Short description",
      "category": "Category (e.g., Lipstick, Eyeshadow)",
      "imageUrl": "product_placeholder.jpg"
    }
  ],
  "lookDescription": "Brief description of the suggested look"
}

Do not include any explanation or text outside the JSON. Ensure the JSON is valid.
`;
  }
  
  /**
   * Parse the GenAI response to extract the JSON part
   * @param {Object} response - The raw response from the API
   * @returns {Object} - The parsed recommendations
   */
  function parseGenAIResponse(response) {
    try {
      // Extract text from Gemini response
      let text = "";
      if (response.candidates && response.candidates.length > 0 &&
          response.candidates[0].content && response.candidates[0].content.parts &&
          response.candidates[0].content.parts.length > 0) {
        text = response.candidates[0].content.parts[0].text;
      }
      
      // Find JSON in the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        return JSON.parse(jsonStr);
      }
      
      throw new Error("Could not extract JSON from response");
    } catch (error) {
      console.error('[GenAIMakeupIntegration] Error parsing response:', error);
      throw error;
    }
  }
  
  /**
   * Get mock response for testing or when API is not available
   * @param {string} prompt - The user prompt
   * @returns {Object} - Mock recommendations
   */
  function getMockResponse(prompt) {
    console.log('[GenAIMakeupIntegration] Using mock response for prompt:', prompt);
    
    // Create different responses based on the prompt keywords
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes('wedding') || promptLower.includes('bride')) {
      return {
        "filters": ["Makeup_006", "Makeup_008"],
        "products": [
          {
            "name": "Forever Luminous Foundation",
            "brand": "Glow Cosmetics",
            "description": "Long-lasting dewy foundation perfect for special occasions",
            "category": "Foundation",
            "imageUrl": "product_placeholder.jpg"
          },
          {
            "name": "Bridal Blush Palette",
            "brand": "Wedding Day",
            "description": "Soft pink and peach tones for a romantic flush",
            "category": "Blush",
            "imageUrl": "product_placeholder.jpg"
          },
          {
            "name": "Waterproof Mascara",
            "brand": "Tearproof",
            "description": "Emotional moment-proof mascara for your special day",
            "category": "Mascara",
            "imageUrl": "product_placeholder.jpg"
          }
        ],
        "lookDescription": "Elegant bridal makeup with soft pink tones, highlighted cheekbones, and subtle shimmer for a radiant glow that looks beautiful in photographs."
      };
    } else if (promptLower.includes('evening') || promptLower.includes('night') || promptLower.includes('party')) {
      return {
        "filters": ["Makeup_007", "Makeup_003"],
        "products": [
          {
            "name": "Midnight Smokey Eye Palette",
            "brand": "Nightlife",
            "description": "Dramatic shades for the perfect evening look",
            "category": "Eyeshadow",
            "imageUrl": "product_placeholder.jpg"
          },
          {
            "name": "Shimmer Highlight Stick",
            "brand": "Glow Up",
            "description": "Creamy highlighter for an intense glow",
            "category": "Highlighter",
            "imageUrl": "product_placeholder.jpg"
          },
          {
            "name": "Long-Wear Matte Lipstick",
            "brand": "Stay Put",
            "description": "Rich color that lasts all night",
            "category": "Lipstick",
            "imageUrl": "product_placeholder.jpg"
          }
        ],
        "lookDescription": "Glamorous evening makeup with dramatic smokey eyes, shimmer highlights, and long-lasting lip color perfect for parties and night events."
      };
    } else if (promptLower.includes('natural') || promptLower.includes('everyday') || promptLower.includes('work')) {
      return {
        "filters": ["Makeup_001", "Makeup_002"],
        "products": [
          {
            "name": "No-Makeup Makeup BB Cream",
            "brand": "Naturally You",
            "description": "Light coverage with skincare benefits",
            "category": "BB Cream",
            "imageUrl": "product_placeholder.jpg"
          },
          {
            "name": "Neutral Eyeshadow Quad",
            "brand": "Daily Basics",
            "description": "Versatile matte shades for everyday wear",
            "category": "Eyeshadow",
            "imageUrl": "product_placeholder.jpg"
          },
          {
            "name": "Tinted Lip Balm",
            "brand": "Moisture Plus",
            "description": "Subtle color with hydrating benefits",
            "category": "Lip Balm",
            "imageUrl": "product_placeholder.jpg"
          }
        ],
        "lookDescription": "Fresh, natural-looking makeup with subtle definition, light coverage, and a hint of color that enhances your features without looking overdone."
      };
    } else if (promptLower.includes('bold') || promptLower.includes('dramatic')) {
      return {
        "filters": ["Makeup_004", "Makeup_011", "Makeup_014"],
        "products": [
          {
            "name": "Full Coverage Matte Foundation",
            "brand": "Flawless Face",
            "description": "High-pigment foundation for a perfect canvas",
            "category": "Foundation",
            "imageUrl": "product_placeholder.jpg"
          },
          {
            "name": "Vibrant Eyeshadow Palette",
            "brand": "Color Pop",
            "description": "Highly pigmented bold colors",
            "category": "Eyeshadow",
            "imageUrl": "product_placeholder.jpg"
          },
          {
            "name": "Classic Red Lipstick",
            "brand": "Signature",
            "description": "The perfect bold red for any occasion",
            "category": "Lipstick",
            "imageUrl": "product_placeholder.jpg"
          }
        ],
        "lookDescription": "Statement-making bold makeup with vibrant colors, defined features, and high-impact finishes that demand attention."
      };
    } else if (promptLower.includes('summer') || promptLower.includes('glow') || promptLower.includes('bronze')) {
      return {
        "filters": ["Makeup_009", "Makeup_013"],
        "products": [
          {
            "name": "Bronzing Drops",
            "brand": "Sun Kissed",
            "description": "Liquid bronzer for a natural tan look",
            "category": "Bronzer",
            "imageUrl": "product_placeholder.jpg"
          },
          {
            "name": "Dewy Highlighter",
            "brand": "Radiance",
            "description": "For a natural glowing finish",
            "category": "Highlighter",
            "imageUrl": "product_placeholder.jpg"
          },
          {
            "name": "Waterproof Cream Eyeshadow",
            "brand": "Beach Day",
            "description": "Long-lasting shimmery bronze shade",
            "category": "Eyeshadow",
            "imageUrl": "product_placeholder.jpg"
          }
        ],
        "lookDescription": "Sun-kissed summer glow with bronzed skin, dewy highlights, and warm tones that mimic a day at the beach."
      };
    } else if (promptLower.includes('festival') || promptLower.includes('glitter')) {
      return {
        "filters": ["Makeup_015", "Makeup_011"],
        "products": [
          {
            "name": "Biodegradable Glitter Gel",
            "brand": "Festival Ready",
            "description": "Eco-friendly sparkle for face and body",
            "category": "Glitter",
            "imageUrl": "product_placeholder.jpg"
          },
          {
            "name": "Neon Pigment Palette",
            "brand": "Electric",
            "description": "Ultra-bright colors for creative looks",
            "category": "Eyeshadow",
            "imageUrl": "product_placeholder.jpg"
          },
          {
            "name": "Setting Spray Extra Strong",
            "brand": "All Day All Night",
            "description": "Extreme hold for festival conditions",
            "category": "Setting Spray",
            "imageUrl": "product_placeholder.jpg"
          }
        ],
        "lookDescription": "Fun and expressive festival makeup with glitter accents, bold colors, and creative placement for a look that stands out in the crowd."
      };
    } else {
      // Default response for other prompts
      return {
        "filters": ["Makeup_001", "Makeup_005"],
        "products": [
          {
            "name": "Versatile Makeup Palette",
            "brand": "Essentials",
            "description": "All-in-one palette for any look",
            "category": "Palette",
            "imageUrl": "product_placeholder.jpg"
          },
          {
            "name": "Long-Lasting Lipstick",
            "brand": "All Day",
            "description": "Comfortable formula with staying power",
            "category": "Lipstick",
            "imageUrl": "product_placeholder.jpg"
          },
          {
            "name": "Defining Mascara",
            "brand": "Lash Love",
            "description": "Volumizing and lengthening formula",
            "category": "Mascara",
            "imageUrl": "product_placeholder.jpg"
          }
        ],
        "lookDescription": "Versatile, polished makeup that enhances your features with balanced color and definition for any occasion."
      };
    }
  }
  
  /**
   * Apply the recommended filters using Banuba SDK
   * @param {Array<string>} filters - Array of filter IDs to apply
   * @returns {Promise<boolean>} - Promise resolving to success status
   */
  function applyRecommendedFilters(filters) {
    return new Promise((resolve, reject) => {
      try {
        console.log('[GenAIMakeupIntegration] Applying filters:', filters);
        
        if (!filters || filters.length === 0) {
          throw new Error("No filters to apply");
        }
        
        // Apply component-specific makeup if available
        if (window.MakeupComponentEnforcer && window.MakeupComponentEnforcer.applyMakeupComponents) {
          // Let the component enforcer process these filters
          setTimeout(() => {
            window.MakeupComponentEnforcer.applyMakeupComponents()
              .then(() => {
                console.log('[GenAIMakeupIntegration] Component-specific makeup applied successfully');
              })
              .catch(error => {
                console.warn('[GenAIMakeupIntegration] Error applying component-specific makeup:', error);
              });
          }, 300);
        }
        
        // Try to access Banuba SDK
        if (window.bnbMakeupInstance) {
          // Apply each filter in sequence
          let appliedCount = 0;
          
          // Apply the first filter immediately
          applyFilterById(filters[0]);
          appliedCount++;
          
          // Apply additional filters with a slight delay between each
          if (filters.length > 1) {
            const applyRemainingFilters = () => {
              setTimeout(() => {
                if (appliedCount < filters.length) {
                  applyFilterById(filters[appliedCount]);
                  appliedCount++;
                  
                  if (appliedCount < filters.length) {
                    applyRemainingFilters();
                  } else {
                    resolve(true);
                  }
                } else {
                  resolve(true);
                }
              }, 300);
            };
            
            applyRemainingFilters();
          } else {
            resolve(true);
          }
        } else if (window.store && window.store.applyLook) {
          // Alternative method if bnbMakeupInstance is not available
          try {
            filters.forEach(filterId => {
              window.store.applyLook(filterId);
            });
            resolve(true);
          } catch (error) {
            console.error('[GenAIMakeupIntegration] Error applying look via store:', error);
            reject(error);
          }
        } else {
          // Apply CSS filters as a fallback
          applyFallbackCSSFilters(filters);
          resolve(true);
        }
      } catch (error) {
        console.error('[GenAIMakeupIntegration] Error applying filters:', error);
        reject(error);
      }
    });
  }
  
  /**
   * Apply a specific filter by ID using Banuba SDK
   * @param {string} filterId - The filter ID to apply
   */
  function applyFilterById(filterId) {
    try {
      console.log(`[GenAIMakeupIntegration] Attempting to apply filter: ${filterId}`);
      
      // Ensure components are applied for this filter
      if (window.MakeupComponentEnforcer && window.MakeupComponentEnforcer.ensureAllComponentsApplied) {
        // Schedule component application check after main filter is applied
        setTimeout(() => {
          window.MakeupComponentEnforcer.ensureAllComponentsApplied();
        }, 500);
      }
      
      // Try to use Banuba's API to apply the filter
      if (window.bnbMakeupInstance && window.bnbMakeupInstance.applyMakeup) {
        console.log('[GenAIMakeupIntegration] Using bnbMakeupInstance.applyMakeup');
        window.bnbMakeupInstance.applyMakeup(filterId);
      } else if (window.banubaMakeup && window.banubaMakeup.applyLook) {
        console.log('[GenAIMakeupIntegration] Using banubaMakeup.applyLook');
        window.banubaMakeup.applyLook(filterId);
      } else if (window.store && window.store.applyLook) {
        console.log('[GenAIMakeupIntegration] Using store.applyLook');
        window.store.applyLook(filterId);
      } else if (window.bnb && window.bnb.makeup) {
        console.log('[GenAIMakeupIntegration] Using bnb.makeup');
        window.bnb.makeup.applyLook(filterId);
      } else {
        console.warn('[GenAIMakeupIntegration] Could not find Banuba API, using CSS fallback');
        applyFallbackCSSFilters([filterId]);
      }
      
      // Try to find and click the actual makeup filter in the UI as a backup approach
      tryClickMakeupFilterInUI(filterId);
      
    } catch (error) {
      console.error(`[GenAIMakeupIntegration] Error applying filter ${filterId}:`, error);
      // Apply fallback CSS filters if Banuba SDK fails
      applyFallbackCSSFilters([filterId]);
    }
  }
  
  /**
   * Try to find and click a makeup filter in the UI by its ID
   * @param {string} filterId - The filter ID to find and click
   */
  function tryClickMakeupFilterInUI(filterId) {
    try {
      // Try to find the filter in various UI elements
      const filterSelectors = [
        `[data-id="${filterId}"]`,
        `[data-filter-id="${filterId}"]`,
        `[data-look-id="${filterId}"]`,
        `[data-makeup-id="${filterId}"]`,
        `.makeup-filter[data-id="${filterId}"]`,
        `.bnb-makeup-option[data-id="${filterId}"]`
      ];
      
      // Try each selector
      for (const selector of filterSelectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          console.log(`[GenAIMakeupIntegration] Found filter element: ${selector}`);
          // Click the first matching element
          elements[0].click();
          return;
        }
      }
      
      // If not found by ID, try looking for elements by text content
      const lookupName = filterId.replace('Makeup_', '');
      const allFilterElements = document.querySelectorAll('.panel-block, .bnb-makeup-option, .makeup-filter, .look-item');
      
      for (const element of allFilterElements) {
        if (element.textContent.includes(lookupName) || 
            element.getAttribute('title')?.includes(lookupName) ||
            element.getAttribute('data-title')?.includes(lookupName)) {
          console.log(`[GenAIMakeupIntegration] Found filter element by text: ${element.textContent}`);
          element.click();
          return;
        }
      }
      
      console.log('[GenAIMakeupIntegration] Could not find filter element in UI');
    } catch (error) {
      console.error('[GenAIMakeupIntegration] Error trying to click makeup filter:', error);
    }
  }
  
  /**
   * Apply CSS filters as a fallback when Banuba SDK is not available
   * @param {Array<string>} filters - Array of filter IDs to apply
   */
  function applyFallbackCSSFilters(filters) {
    console.log('[GenAIMakeupIntegration] Applying fallback CSS filters:', filters);
    
    // Try multiple container selectors
    const containerSelectors = [
      '.bnb-makeup',
      '.makeup-container',
      '.bnb-container',
      '.makeup-preview',
      '#makeup-container',
      '.banuba-container'
    ];
    
    let makeupContainer = null;
    
    // Try each container selector
    for (const selector of containerSelectors) {
      const container = document.querySelector(selector);
      if (container) {
        makeupContainer = container;
        console.log(`[GenAIMakeupIntegration] Found makeup container: ${selector}`);
        break;
      }
    }
    
    // If no container was found, try to find the main image or canvas
    if (!makeupContainer) {
      console.log('[GenAIMakeupIntegration] No makeup container found, looking for main image');
      
      // Find the main preview image if it exists
      const mainImage = findMainPreviewImage();
      if (mainImage) {
        console.log('[GenAIMakeupIntegration] Found main preview image');
        applyFilterToElement(mainImage, filters);
        return;
      }
      
      console.warn('[GenAIMakeupIntegration] Could not find any image to apply filters to');
      return;
    }
    
    // Get all images in the makeup container
    const images = makeupContainer.querySelectorAll('img');
    if (images.length === 0) {
      console.log('[GenAIMakeupIntegration] No images found in container, looking for canvas');
      
      // Try to find canvas elements
      const canvases = makeupContainer.querySelectorAll('canvas');
      if (canvases.length > 0) {
        console.log(`[GenAIMakeupIntegration] Found ${canvases.length} canvas elements`);
        // Apply filter to all canvases
        canvases.forEach(canvas => {
          applyFilterToElement(canvas, filters);
        });
        return;
      }
      
      // If no images or canvases, apply to the container itself
      console.log('[GenAIMakeupIntegration] No images or canvases found, applying to container');
      applyFilterToElement(makeupContainer, filters);
      return;
    }
    
    console.log(`[GenAIMakeupIntegration] Found ${images.length} images in container`);
    
    // Apply the filter to all images
    images.forEach(img => {
      applyFilterToElement(img, filters);
    });
    
    // Also try to find and apply to any video elements
    const videos = makeupContainer.querySelectorAll('video');
    if (videos.length > 0) {
      console.log(`[GenAIMakeupIntegration] Found ${videos.length} video elements`);
      videos.forEach(video => {
        applyFilterToElement(video, filters);
      });
    }
  }
  
  /**
   * Apply filter to a specific element
   * @param {HTMLElement} element - The element to apply the filter to
   * @param {Array<string>} filters - Array of filter IDs
   */
  function applyFilterToElement(element, filters) {
    // Map filter IDs to CSS filters
    const filterMap = {
      "Makeup_001": "brightness(1.05) contrast(1.02) saturate(1.05)",
      "Makeup_002": "brightness(1.05) contrast(1.0) saturate(1.1)",
      "Makeup_003": "brightness(0.98) contrast(1.15) saturate(1.1)",
      "Makeup_004": "brightness(1.0) contrast(1.15) saturate(1.2)",
      "Makeup_005": "brightness(1.05) contrast(1.05) saturate(1.0)",
      "Makeup_006": "brightness(1.1) contrast(1.02) saturate(1.05)",
      "Makeup_007": "brightness(1.1) contrast(1.2) saturate(1.2)",
      "Makeup_008": "brightness(1.05) contrast(1.0) saturate(1.15)",
      "Makeup_009": "brightness(1.15) contrast(1.1) saturate(1.2) sepia(0.1)",
      "Makeup_010": "brightness(1.0) contrast(1.1) saturate(0.9) sepia(0.2)",
      "Makeup_011": "brightness(1.05) contrast(1.2) saturate(1.3)",
      "Makeup_012": "brightness(1.0) contrast(1.1) saturate(0.95)",
      "Makeup_013": "brightness(1.1) contrast(1.0) saturate(1.0)",
      "Makeup_014": "brightness(0.95) contrast(1.2) saturate(1.0)",
      "Makeup_015": "brightness(1.1) contrast(1.15) saturate(1.3)"
    };
    
    // Apply the first filter found
    let appliedFilter = null;
    
    for (const filterId of filters) {
      if (filterMap[filterId]) {
        appliedFilter = filterMap[filterId];
        break;
      }
    }
    
    if (!appliedFilter) {
      // Use default filter if none found
      appliedFilter = "brightness(1.05) contrast(1.05) saturate(1.1)";
    }
    
    console.log(`[GenAIMakeupIntegration] Applying CSS filter: ${appliedFilter}`);
    
    // Apply the filter and ensure it's visible
    element.style.filter = appliedFilter;
    
    // Make sure element is visible
    element.style.opacity = '1';
    element.style.visibility = 'visible';
    element.style.display = element.tagName.toLowerCase() === 'img' ? 'inline-block' : 'block';
    
    // Remove any "hidden" classes
    if (element.classList.contains('hidden')) {
      element.classList.remove('hidden');
    }
    
    // Set a data attribute to indicate filter has been applied
    element.setAttribute('data-genai-filter-applied', 'true');
    
    // Log success
    console.log('[GenAIMakeupIntegration] Successfully applied CSS filter to element:', element);
  }
  
  /**
   * Find the main preview image in the document
   * @returns {HTMLElement|null} - The main preview image or null if not found
   */
  function findMainPreviewImage() {
    // Try different methods to find the main image
    
    // 1. Check for lastProcessedImage
    if (window.lastProcessedImage) {
      const img = document.createElement('img');
      img.src = window.lastProcessedImage;
      document.body.appendChild(img);
      img.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 90%;
        max-height: 90%;
        z-index: 9000;
      `;
      return img;
    }
    
    // 2. Look for largest visible image
    const allImages = Array.from(document.querySelectorAll('img')).filter(img => {
      const style = window.getComputedStyle(img);
      return style.display !== 'none' && style.visibility !== 'hidden' && img.width > 50 && img.height > 50;
    });
    
    if (allImages.length > 0) {
      // Sort by area (largest first)
      allImages.sort((a, b) => {
        const areaA = a.width * a.height;
        const areaB = b.width * b.height;
        return areaB - areaA;
      });
      
      return allImages[0];
    }
    
    // 3. Look for canvas elements
    const canvases = Array.from(document.querySelectorAll('canvas')).filter(canvas => {
      const style = window.getComputedStyle(canvas);
      return style.display !== 'none' && style.visibility !== 'hidden' && canvas.width > 50 && canvas.height > 50;
    });
    
    if (canvases.length > 0) {
      // Sort by area (largest first)
      canvases.sort((a, b) => {
        const areaA = a.width * a.height;
        const areaB = b.width * b.height;
        return areaB - areaA;
      });
      
      return canvases[0];
    }
    
    return null;
  }
  
  /**
   * Display recommended products below the AR preview
   * @param {Array<Object>} products - Array of product objects
   * @param {string} lookDescription - Description of the makeup look
   */
  function displayRecommendedProducts(products, lookDescription) {
    // Remove any existing product recommendations
    const existingRecommendations = document.getElementById('genai-product-recommendations');
    if (existingRecommendations) {
      existingRecommendations.remove();
    }
    
    // Create recommendations container
    const container = document.createElement('div');
    container.id = 'genai-product-recommendations';
    container.style.cssText = `
      margin-top: 20px;
      padding: 16px;
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    `;
    
    // Add look description
    if (lookDescription) {
      const descriptionEl = document.createElement('div');
      descriptionEl.className = 'look-description';
      descriptionEl.innerHTML = `<h3>AI Recommended Look</h3><p>${lookDescription}</p>`;
      descriptionEl.style.cssText = `
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid #eee;
      `;
      container.appendChild(descriptionEl);
    }
    
    // Add heading
    const heading = document.createElement('h3');
    heading.textContent = 'Recommended Products';
    heading.style.cssText = `
      margin-top: 0;
      margin-bottom: 16px;
      color: #333;
      font-size: 18px;
    `;
    container.appendChild(heading);
    
    // Create products grid
    const productsGrid = document.createElement('div');
    productsGrid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    `;
    
    // Add products
    if (products && products.length > 0) {
      products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
      });
    } else {
      // No products message
      const noProducts = document.createElement('p');
      noProducts.textContent = 'No product recommendations available.';
      noProducts.style.cssText = `
        grid-column: 1 / -1;
        text-align: center;
        color: #666;
      `;
      productsGrid.appendChild(noProducts);
    }
    
    container.appendChild(productsGrid);
    
    // Find where to insert the recommendations
    const makeupContainer = document.querySelector('.bnb-makeup');
    if (makeupContainer) {
      // Insert after the makeup container
      if (makeupContainer.nextSibling) {
        makeupContainer.parentNode.insertBefore(container, makeupContainer.nextSibling);
      } else {
        makeupContainer.parentNode.appendChild(container);
      }
    } else {
      // Fallback - append to body
      document.body.appendChild(container);
    }
  }
  
  /**
   * Create a product card element
   * @param {Object} product - The product object
   * @returns {HTMLElement} - The product card element
   */
  function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.cssText = `
      background-color: #f9f9f9;
      border-radius: 8px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    `;
    
    // Add hover effect
    card.onmouseenter = function() {
      this.style.transform = 'translateY(-5px)';
      this.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
    };
    
    card.onmouseleave = function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = 'none';
    };
    
    // Add image
    const image = document.createElement('img');
    image.src = product.imageUrl || 'assets/product_placeholder.jpg';
    image.alt = product.name;
    image.style.cssText = `
      width: 100%;
      height: 120px;
      object-fit: cover;
      border-radius: 6px;
      margin-bottom: 8px;
    `;
    card.appendChild(image);
    
    // Add product name
    const name = document.createElement('h4');
    name.textContent = product.name;
    name.style.cssText = `
      margin: 0 0 4px 0;
      font-size: 16px;
      color: #333;
    `;
    card.appendChild(name);
    
    // Add brand
    const brand = document.createElement('p');
    brand.textContent = product.brand;
    brand.style.cssText = `
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #666;
      font-weight: bold;
    `;
    card.appendChild(brand);
    
    // Add category
    const category = document.createElement('span');
    category.textContent = product.category;
    category.style.cssText = `
      background-color: #e0e0e0;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12px;
      margin-bottom: 8px;
      display: inline-block;
    `;
    card.appendChild(category);
    
    // Add description
    const description = document.createElement('p');
    description.textContent = product.description;
    description.style.cssText = `
      margin: 8px 0 0 0;
      font-size: 14px;
      color: #333;
      flex-grow: 1;
    `;
    card.appendChild(description);
    
    return card;
  }
  
  /**
   * Show processing indicator
   * @param {string} message - The message to show
   */
  function showProcessingIndicator(message) {
    // Remove any existing indicators
    hideProcessingIndicator();
    
    // Create indicator
    const indicator = document.createElement('div');
    indicator.id = 'genai-processing-indicator';
    indicator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 10002;
    `;
    
    // Add spinner
    const spinner = document.createElement('div');
    spinner.className = 'processing-spinner';
    spinner.style.cssText = `
      width: 50px;
      height: 50px;
      border: 5px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
      margin-bottom: 20px;
    `;
    
    // Add message
    const messageElement = document.createElement('p');
    messageElement.textContent = message || 'Processing...';
    messageElement.style.cssText = `
      color: white;
      font-size: 18px;
      margin: 0;
      max-width: 80%;
      text-align: center;
    `;
    
    // Add animation style
    if (!document.getElementById('genai-animations')) {
      const style = document.createElement('style');
      style.id = 'genai-animations';
      style.textContent = `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Assemble and add to body
    indicator.appendChild(spinner);
    indicator.appendChild(messageElement);
    document.body.appendChild(indicator);
  }
  
  /**
   * Hide processing indicator
   */
  function hideProcessingIndicator() {
    const indicator = document.getElementById('genai-processing-indicator');
    if (indicator) {
      document.body.removeChild(indicator);
    }
  }
  
  // Initialize on load
  window.addEventListener('load', function() {
    console.log('[GenAIMakeupIntegration] Module loaded and ready');
    
    // Create a placeholder image for products
    createPlaceholderImage();
  });
  
  /**
   * Create a placeholder image for products if needed
   */
  function createPlaceholderImage() {
    // Check if the placeholder already exists
    if (document.querySelector('img[src="assets/product_placeholder.jpg"]')) {
      return;
    }
    
    // Create a simple colored rectangle as placeholder
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f5f5f5');
    gradient.addColorStop(1, '#e0e0e0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add a simple icon
    ctx.fillStyle = '#999';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2 - 20, 40, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillRect(canvas.width / 2 - 30, canvas.height / 2 + 30, 60, 40);
    
    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/jpeg');
    
    // Create and add the image to the page (but hidden)
    const img = document.createElement('img');
    img.src = dataUrl;
    img.style.display = 'none';
    img.id = 'product-placeholder';
    document.body.appendChild(img);
    
    // Store the data URL for later use
    window.productPlaceholderUrl = dataUrl;
  }
})();