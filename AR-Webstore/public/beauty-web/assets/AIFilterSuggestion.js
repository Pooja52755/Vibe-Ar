/**
 * AIFilterSuggestion.js - Automatically applies makeup filters using Gemini AI
 * 
 * This component:
 * 1. Analyzes uploaded face images using Gemini AI
 * 2. Determines optimal makeup colors based on face color palette
 * 3. Automatically applies the suggested filters to the Banuba SDK
 * 4. Displays matching product cards for the applied filters
 */

class AIFilterSuggestion {
  constructor() {
    // Get the Gemini API key from the config file
    this.geminiApiKey = window.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY"; // Replace with your actual key
    this.isAnalyzing = false;
    
    // Use mock product data if available, otherwise use default data
    this.productData = window.MOCK_PRODUCT_DATA || {
      lipsticks: [
        { name: "Rosy Blush Lipstick", color: "#FF5C7A", image: "https://i.imgur.com/Ry8nTYa.png", price: "$18.99" },
        { name: "Coral Sunset Lipstick", color: "#FF7F50", image: "https://i.imgur.com/tNF8vRk.png", price: "$19.99" },
        { name: "Berry Crush Matte", color: "#C23B22", image: "https://i.imgur.com/1YRGUPe.png", price: "$22.99" },
        { name: "Pink Petal Gloss", color: "#FFB6C1", image: "https://i.imgur.com/LiTInQF.png", price: "$17.99" },
        { name: "Mauve Dream Lipstick", color: "#C67D95", image: "https://i.imgur.com/mDCgJaV.png", price: "$20.99" }
      ],
      eyeshadows: [
        { name: "Smoky Quartz Palette", color: "#555555", image: "https://i.imgur.com/9A6oAK8.png", price: "$32.99" },
        { name: "Golden Hour Shadow", color: "#FFDC73", image: "https://i.imgur.com/c4hRUTq.png", price: "$28.99" },
        { name: "Rose Gold Shimmer", color: "#E0BFB8", image: "https://i.imgur.com/dCM2eGK.png", price: "$29.99" },
        { name: "Emerald Gleam Shadow", color: "#50C878", image: "https://i.imgur.com/AqQX8J2.png", price: "$27.99" },
        { name: "Lavender Mist Palette", color: "#E6E6FA", image: "https://i.imgur.com/FNGZQXl.png", price: "$31.99" }
      ],
      blush: [
        { name: "Peach Glow Blush", color: "#FFAA99", image: "https://i.imgur.com/O3LQFXh.png", price: "$21.99" },
        { name: "Rose Petal Blush", color: "#FF92A5", image: "https://i.imgur.com/7k0QK1R.png", price: "$22.99" },
        { name: "Coral Reef Cheek Tint", color: "#FF6F61", image: "https://i.imgur.com/p5JK8FG.png", price: "$23.99" },
        { name: "Berry Flush Blush", color: "#C24270", image: "https://i.imgur.com/mN6iiQC.png", price: "$20.99" },
        { name: "Soft Mauve Blush", color: "#C8A2C8", image: "https://i.imgur.com/xLHkGcz.png", price: "$19.99" }
      ]
    };
    
    this.init();
  }

  init() {
    // Initialize when document is ready
    if (document.readyState === 'complete') {
      this.setupEventListeners();
      // No automatic trigger - wait for manual filter selection
    } else {
      window.addEventListener('load', () => {
        this.setupEventListeners();
        // No automatic trigger - wait for manual filter selection
      });
    }
  }

  setupEventListeners() {
    // Watch for image uploads to trigger AI analysis
    this.observeImageUpload();
    
    // Create product display container
    this.createProductContainer();
  }

  observeImageUpload() {
    // No need to observe for automatic triggering, just wait for manual filter selection
    
    // Find buttons with text containing "Upload"
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(button => {
      if (button.textContent.toLowerCase().includes('upload')) {
        button.addEventListener('click', () => {
          // No automatic analysis - just handle the upload
          console.log('Upload button clicked - manual filter selection will be detected');
        });
      }
    });
  }

  async triggerAIAnalysis() {
    if (this.isAnalyzing) return;
    this.isAnalyzing = true;
    
    try {
      // No automatic analysis or filter application
      // Instead we'll wait for manual filter selection
      console.log('Ready for manual filter selection');
    } catch (error) {
      console.error('Error in AI analysis:', error);
    } finally {
      this.isAnalyzing = false;
    }
  }

  async processNewImage(imageElement) {
    try {
      // No automatic analysis or filter application
      // Instead, wait for manual filter selection which will trigger displayProductCards
      console.log('Image uploaded - waiting for manual filter selection');
    } catch (error) {
      console.error('Error processing image:', error);
    }
  }

  async analyzeImageWithGemini(imageBase64) {
    try {
      // Prepare the API request to Gemini
      const prompt = `
        Analyze this face image and suggest optimal makeup colors based on the person's skin tone and features.
        Return the results in this exact JSON format:
        {
          "lipstick": {"color": "#HEX_COLOR", "name": "descriptive name"},
          "eyeshadow": {"color": "#HEX_COLOR", "name": "descriptive name"},
          "blush": {"color": "#HEX_COLOR", "name": "descriptive name"}
        }
        Only return the JSON, nothing else.
      `;
      
      // Check if we have a valid API key
      if (this.geminiApiKey && this.geminiApiKey !== "YOUR_GEMINI_API_KEY") {
        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${this.geminiApiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contents: [{
                parts: [
                  { text: prompt },
                  { inline_data: { mime_type: "image/jpeg", data: imageBase64.split(',')[1] } }
                ]
              }]
            })
          });
          
          const data = await response.json();
          if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            const textResponse = data.candidates[0].content.parts[0].text;
            
            // Parse the JSON response
            return JSON.parse(textResponse);
          }
        } catch (apiError) {
          console.error('Error calling Gemini API:', apiError);
          // Continue to fallback if API call fails
        }
      }
      
      // Fallback: Return mock data if API key is not set or call fails
      return {
        lipstick: { color: "#C67D95", name: "Mauve Dream" },
        eyeshadow: { color: "#E0BFB8", name: "Rose Gold Shimmer" },
        blush: { color: "#FF92A5", name: "Rose Petal" }
      };
    } catch (error) {
      console.error('Error analyzing with Gemini:', error);
      // Return fallback values if API fails
      return {
        lipstick: { color: "#FF5C7A", name: "Rosy Blush" },
        eyeshadow: { color: "#555555", name: "Smoky Quartz" },
        blush: { color: "#FFAA99", name: "Peach Glow" }
      };
    }
  }

  async applyFiltersToSDK(colorSuggestions) {
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
      if (colorSuggestions.lipstick) {
        const lipstickStore = this.findStoreInVueApp(vueApp, 'lipstick');
        if (lipstickStore) {
          // Convert hex to RGB
          const rgb = this.hexToRgb(colorSuggestions.lipstick.color);
          if (rgb) {
            console.log('Applying lipstick color:', rgb);
            // Enable lipstick and set color
            lipstickStore.enabled = true;
            lipstickStore.color = rgb;
          }
        } else {
          console.warn('Lipstick store not found');
        }
      }
      
      // Apply eyeshadow
      if (colorSuggestions.eyeshadow) {
        const eyesStore = this.findStoreInVueApp(vueApp, 'eyesMakeup');
        if (eyesStore && eyesStore.shadow) {
          const rgb = this.hexToRgb(colorSuggestions.eyeshadow.color);
          if (rgb) {
            console.log('Applying eyeshadow color:', rgb);
            eyesStore.shadow.enabled = true;
            eyesStore.shadow.color = rgb;
          }
        } else {
          console.warn('Eyes makeup store not found');
        }
      }
      
      // Apply blush
      if (colorSuggestions.blush) {
        const faceMakeupStore = this.findStoreInVueApp(vueApp, 'faceMakeup');
        if (faceMakeupStore && faceMakeupStore.blush) {
          const rgb = this.hexToRgb(colorSuggestions.blush.color);
          if (rgb) {
            console.log('Applying blush color:', rgb);
            faceMakeupStore.blush.enabled = true;
            faceMakeupStore.blush.color = rgb;
          }
        } else {
          console.warn('Face makeup store not found');
        }
      }
      
      // Force update all components
      if (vueApp.$forceUpdate) {
        vueApp.$forceUpdate();
      }
      
      // Update all child components too
      if (vueApp.$children) {
        vueApp.$children.forEach(child => {
          if (child.$forceUpdate) {
            child.$forceUpdate();
          }
        });
      }
      
      console.log('Makeup filters applied successfully');
    } catch (error) {
      console.error('Error applying filters to SDK:', error);
    }
  }

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
    
    // Try direct property access as last resort
    try {
      // This is a hack to find deeply nested properties
      const result = eval(`vueApp.${storeName}`);
      if (result) return result;
    } catch (e) {
      // Ignore errors from eval
    }
    
    return null;
  }

  hexToRgb(hex) {
    // Convert hex color to RGB
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  findClosestProductMatch(targetColor, productArray) {
    // Find products that most closely match the target color
    const targetRgb = this.hexToRgb(targetColor);
    if (!targetRgb) return productArray[0];
    
    // Calculate color distance to find closest match
    let closestProduct = productArray[0];
    let minDistance = Infinity;
    
    productArray.forEach(product => {
      const productRgb = this.hexToRgb(product.color);
      if (productRgb) {
        const distance = Math.sqrt(
          Math.pow(targetRgb.r - productRgb.r, 2) +
          Math.pow(targetRgb.g - productRgb.g, 2) +
          Math.pow(targetRgb.b - productRgb.b, 2)
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          closestProduct = product;
        }
      }
    });
    
    return closestProduct;
  }

  createProductContainer() {
    // Create container for product cards if it doesn't exist
    if (!document.getElementById('ai-product-container')) {
      const container = document.createElement('div');
      container.id = 'ai-product-container';
      container.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: white;
        padding: 10px;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
        display: flex;
        flex-direction: column;
        max-height: 40vh;
        overflow-y: auto;
      `;
      
      // Add header
      const header = document.createElement('div');
      header.innerHTML = '<h3 style="margin: 0 0 10px 0; text-align: center;">Suggested Products</h3>';
      container.appendChild(header);
      
      // Add product cards container
      const productsDiv = document.createElement('div');
      productsDiv.id = 'ai-product-cards';
      productsDiv.style.cssText = `
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;
        gap: 10px;
        padding: 5px 0;
      `;
      container.appendChild(productsDiv);
      
      // Add to document
      document.body.appendChild(container);
      
      // Add close button
      const closeBtn = document.createElement('button');
      closeBtn.textContent = '×';
      closeBtn.style.cssText = `
        position: absolute;
        top: 5px;
        right: 5px;
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
      `;
      closeBtn.onclick = () => { container.style.display = 'none'; };
      container.appendChild(closeBtn);
      
      // Initially hide the container
      container.style.display = 'none';
    }
  }

  displayProductCards(colorSuggestions) {
    // Get the product container
    const container = document.getElementById('ai-product-container');
    const cardsContainer = document.getElementById('ai-product-cards');
    if (!container || !cardsContainer) return;
    
    // Clear existing cards
    cardsContainer.innerHTML = '';
    
    // Find matching products for each suggestion
    const matchingProducts = [];
    
    if (colorSuggestions.lipstick) {
      const lipstick = this.findClosestProductMatch(colorSuggestions.lipstick.color, this.productData.lipsticks);
      lipstick.type = 'Lipstick';
      matchingProducts.push(lipstick);
    }
    
    if (colorSuggestions.eyeshadow) {
      const eyeshadow = this.findClosestProductMatch(colorSuggestions.eyeshadow.color, this.productData.eyeshadows);
      eyeshadow.type = 'Eyeshadow';
      matchingProducts.push(eyeshadow);
    }
    
    if (colorSuggestions.blush) {
      const blush = this.findClosestProductMatch(colorSuggestions.blush.color, this.productData.blush);
      blush.type = 'Blush';
      matchingProducts.push(blush);
    }
    
    // If no products matched, show some random products
    if (matchingProducts.length === 0) {
      this.showRandomProducts();
      return;
    }
    
    // Display the matching products
    this.displayProductCardsFromArray(matchingProducts);
  }
  
  displayProductCardsFromArray(products) {
    // Get the product container
    const container = document.getElementById('ai-product-container');
    const cardsContainer = document.getElementById('ai-product-cards');
    if (!container || !cardsContainer) return;
    
    // Clear existing cards
    cardsContainer.innerHTML = '';
    
    // Create product cards
    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.style.cssText = `
        min-width: 150px;
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        background-color: white;
      `;
      
      // Prepare fallback image (use static file from png images directory)
      const productType = product.type ? product.type.toLowerCase() : 'lipstick';
      let fallbackImage = '../png images/pink.jpg'; // Default fallback
      
      if (productType.includes('lipstick')) {
        fallbackImage = '../png images/pink.jpg';
      } else if (productType.includes('eyeshadow')) {
        fallbackImage = '../png images/blue.jpg';
      } else if (productType.includes('blush')) {
        fallbackImage = '../png images/pink_saree.jpg';
      }
      
      card.innerHTML = `
        <div style="width: 100px; height: 100px; background-color: #f5f5f5; border-radius: 4px; display: flex; align-items: center; justify-content: center; margin-bottom: 8px;">
          <img src="${product.image}" style="max-width: 100%; max-height: 100%; object-fit: contain;" alt="${product.name}" onerror="this.onerror=null; this.src='${fallbackImage}';">
        </div>
        <div style="font-weight: bold; margin-bottom: 2px;">${product.name}</div>
        <div style="color: #888; font-size: 12px; margin-bottom: 5px;">${product.type}</div>
        <div style="color: #e91e63; font-weight: bold;">${product.price}</div>
        <button style="margin-top: 8px; background-color: #e91e63; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Add to Cart</button>
      `;
      
      cardsContainer.appendChild(card);
    });
    
    // Show the container
    container.style.display = 'flex';
  }

  showLoadingIndicator() {
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
        <div style="margin-top: 10px;">Analyzing face...</div>
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
      document.getElementById('ai-loading-indicator').style.display = 'flex';
    }
  }

  hideLoadingIndicator() {
    // Hide loading indicator
    const loader = document.getElementById('ai-loading-indicator');
    if (loader) {
      loader.style.display = 'none';
    }
  }
}

// Initialize the AI filter suggestion component
document.addEventListener('DOMContentLoaded', () => {
  window.aiFilterSuggestion = new AIFilterSuggestion();
});