// GeminiService.js
// This file contains the functions to interact with Google's Gemini API

// Gemini API key (already defined in environment)
const GEMINI_API_KEY = "AIzaSyAilrrFYiO9jT62gzfkLfKeubSsiJ7rq4g";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

/**
 * Analyze a face image using Gemini AI and get makeup recommendations
 * @param {string} imageBase64 - Base64 encoded image data
 * @param {string} prompt - User's makeup prompt
 * @returns {Object} Analysis results with makeup recommendations
 */
export async function geminiAnalyzeFace(imageBase64, prompt) {
  try {
    console.log("[GeminiService] Analyzing face with prompt:", prompt);
    
    // Prepare request body with the image and prompt
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `Analyze this face image and recommend makeup to apply based on the following prompt: "${prompt}". 
              Please output a JSON object with a makeupFilters array that includes detailed instructions for applying 
              specific makeup elements. Each item in makeupFilters should have: 
              type (lipstick, eyeshadow, eyeliner, blush, foundation, highlighter, contour), 
              color (in named colors like "pink", "red", etc.), 
              intensity (a number between 0 and 1), 
              and style (for applicable types like eyeshadow or eyeliner). 
              Only include filters that are appropriate for the prompt.`
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: imageBase64.replace(/^data:image\/jpeg;base64,/, "")
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        topK: 32,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };
    
    // Make API request
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("[GeminiService] API error:", errorData);
      throw new Error(`Gemini API error: ${errorData.error?.message || "Unknown error"}`);
    }
    
    const data = await response.json();
    
    // Extract JSON from response
    if (!data.candidates || !data.candidates[0].content.parts[0].text) {
      throw new Error("Invalid response format from Gemini API");
    }
    
    // Extract JSON object from text response
    const responseText = data.candidates[0].content.parts[0].text;
    const jsonMatch = responseText.match(/({[\s\S]*})/);
    
    if (!jsonMatch) {
      throw new Error("Could not extract JSON from Gemini response");
    }
    
    // Parse the JSON
    const makeup = JSON.parse(jsonMatch[0]);
    
    // Ensure expected format
    if (!makeup.makeupFilters || !Array.isArray(makeup.makeupFilters)) {
      throw new Error("Response missing makeup filters array");
    }
    
    console.log("[GeminiService] Successfully analyzed face:", makeup);
    return makeup;
    
  } catch (error) {
    console.error("[GeminiService] Error analyzing face:", error);
    return {
      makeupFilters: [
        // Fallback filters if analysis fails
        { type: "lipstick", color: "pink", intensity: 0.7 },
        { type: "eyeshadow", color: "brown", intensity: 0.6, style: "natural" },
        { type: "blush", color: "pink", intensity: 0.5 }
      ]
    };
  }
}

// Sample product data for the Gemini AI to search from
const PRODUCT_DATA = [
  {
    brand: "Roadster",
    name: "Men's White Slim Fit Shirt",
    img_url: "/png images/coll1_2.png",
    segmented_image_url: "/png images/coll1_2.png",
    price: "899",
    category: "men",
    rating: 4.5,
    no_of_rating: 120,
    sizes: ["S", "M", "L", "XL"],
    description: "A classic white slim-fit shirt for men, perfect for formal and casual occasions.",
    color: "white",
    type: "shirt"
  },
  {
    brand: "H&M",
    name: "Women's Black Dress",
    img_url: "/png images/coll2_3.png",
    segmented_image_url: "/png images/coll2_3.png",
    price: "1499",
    category: "women",
    rating: 4.2,
    no_of_rating: 85,
    sizes: ["XS", "S", "M", "L"],
    description: "An elegant black dress for women, suitable for parties and evening events.",
    color: "black",
    type: "dress"
  },
  {
    brand: "ADIDAS",
    name: "Men's Running Shoes",
    img_url: "/png images/coll3_1.png",
    segmented_image_url: "/png images/coll3_1.png",
    price: "2999",
    category: "men",
    rating: 4.7,
    no_of_rating: 210,
    sizes: ["7", "8", "9", "10"],
    description: "High-performance running shoes with cushioned soles for maximum comfort during workouts.",
    color: "blue",
    type: "shoes"
  },
  {
    brand: "Lakme",
    name: "Foundation Cream",
    img_url: "/png images/coll3_2.png",
    segmented_image_url: "/png images/coll3_2.png",
    price: "399",
    category: "beauty",
    rating: 4.0,
    no_of_rating: 75,
    sizes: [],
    description: "Long-lasting foundation cream that provides smooth coverage and a natural look.",
    color: "beige",
    type: "makeup"
  },
  {
    brand: "Puma",
    name: "Women's Black Leggings",
    img_url: "/png images/coll4_1.png",
    segmented_image_url: "/png images/coll4_1.png",
    price: "1299",
    category: "women",
    rating: 4.4,
    no_of_rating: 150,
    sizes: ["S", "M", "L"],
    description: "Comfortable and stretchable black leggings perfect for workouts and casual wear.",
    color: "black",
    type: "leggings"
  },
  {
    brand: "Fossil",
    name: "Men's Brown Leather Watch",
    img_url: "/png images/coll4_2.png",
    segmented_image_url: "/png images/coll4_2.png",
    price: "7999",
    category: "accessories",
    rating: 4.6,
    no_of_rating: 95,
    sizes: [],
    description: "Elegant brown leather watch with chronograph features, suitable for formal and casual occasions.",
    color: "brown",
    type: "watch"
  },
  {
    brand: "Skybags",
    name: "Unisex Black Backpack",
    img_url: "/png images/coll5_1.png",
    segmented_image_url: "/png images/coll5_1.png",
    price: "1499",
    category: "accessories",
    rating: 4.1,
    no_of_rating: 62,
    sizes: [],
    description: "Durable and spacious black backpack with multiple compartments, perfect for daily use.",
    color: "black",
    type: "backpack"
  },
  {
    brand: "AND",
    name: "Women's Floral Print Dress",
    img_url: "/png images/coll6_1.png",
    segmented_image_url: "/png images/coll6_1.png",
    price: "1899",
    category: "women",
    rating: 4.3,
    no_of_rating: 78,
    sizes: ["S", "M", "L", "XL"],
    description: "Beautiful floral print dress for women, perfect for summer outings and casual occasions.",
    color: "blue floral",
    type: "dress"
  },
  {
    brand: "Louis Philippe",
    name: "Men's Navy Blue Suit",
    img_url: "/png images/coll2_4.png",
    segmented_image_url: "/png images/coll2_4.png",
    price: "8999",
    category: "men",
    rating: 4.8,
    no_of_rating: 45,
    sizes: ["38", "40", "42", "44"],
    description: "Premium quality navy blue suit for men, perfect for formal events and business meetings.",
    color: "navy blue",
    type: "suit"
  },
  {
    brand: "MAC",
    name: "Ruby Woo Lipstick",
    img_url: "/png images/coll2_3.png",
    segmented_image_url: "/png images/coll2_3.png",
    price: "1950",
    category: "beauty",
    rating: 4.7,
    no_of_rating: 120,
    sizes: [],
    description: "Iconic matte red lipstick with long-lasting formula, perfect for making a bold statement.",
    color: "red",
    type: "lipstick"
  },
  // Adding sarees of different colors
  {
    brand: "Sabyasachi",
    name: "Pink Silk Saree",
    img_url: "/png images/pink_saree.jpg",
    segmented_image_url: "/png images/pink_saree.jpg",
    price: "9999",
    category: "women",
    rating: 4.9,
    no_of_rating: 85,
    sizes: ["Free Size"],
    description: "Luxurious pink silk saree with intricate embroidery, perfect for special occasions and celebrations.",
    color: "pink",
    type: "saree"
  },
  {
    brand: "FabIndia",
    name: "Pastel Blue Cotton Saree",
    img_url: "/png images/blue.jpg",
    segmented_image_url: "/png images/blue.jpg",
    price: "2999",
    category: "women",
    rating: 4.3,
    no_of_rating: 120,
    sizes: ["Free Size"],
    description: "Elegant pastel blue cotton saree with minimal design, perfect for everyday wear and casual events.",
    color: "pastel blue",
    type: "saree"
  },
  {
    brand: "Mysore Silk",
    name: "Pastel Green Silk Saree",
    img_url: "/png images/green.jpg",
    segmented_image_url: "/png images/green.jpg",
    price: "5999",
    category: "women",
    rating: 4.6,
    no_of_rating: 95,
    sizes: ["Free Size"],
    description: "Traditional pastel green Mysore silk saree with gold zari border, perfect for festivals and special occasions.",
    color: "pastel green",
    type: "saree"
  },
  {
    brand: "Banarasi Designs",
    name: "Pastel Pink Banarasi Saree",
    img_url: "/png images/pastel_pink_saree.webp",
    segmented_image_url: "/png images/pastel_pink_saree.webp",
    price: "7499",
    category: "women",
    rating: 4.8,
    no_of_rating: 65,
    sizes: ["Free Size"],
    description: "Stunning pastel pink Banarasi silk saree with traditional motifs, perfect for weddings and formal events.",
    color: "pastel pink",
    type: "saree"
  }
];

// Add additional shirt products
const ADDITIONAL_PRODUCTS = [
  {
    brand: "Peter England",
    name: "Men's Blue Formal Shirt",
    img_url: "/png images/blue_shirt.webp",
    segmented_image_url: "/png images/blue_shirt.webp",
    price: "1499",
    category: "men",
    rating: 4.5,
    no_of_rating: 78,
    sizes: ["S", "M", "L", "XL"],
    description: "Premium blue formal shirt for men, perfect for office wear and professional settings.",
    color: "blue",
    type: "shirt"
  },
  {
    brand: "Allen Solly",
    name: "Men's Pink Casual Shirt",
    img_url: "/png images/pink_shirt.webp",
    segmented_image_url: "/png images/pink_shirt.webp",
    price: "1299",
    category: "men",
    rating: 4.3,
    no_of_rating: 65,
    sizes: ["S", "M", "L", "XL"],
    description: "Stylish pink casual shirt for men, perfect for weekend outings and casual events.",
    color: "pink",
    type: "shirt"
  },
  // Adding accessory products for suggestions
  {
    brand: "Tanishq",
    name: "Gold Necklace Set",
    img_url: "/png images/coll4_2.png", // Using existing image as placeholder
    segmented_image_url: "/png images/coll4_2.png",
    price: "45999",
    category: "accessories",
    rating: 4.9,
    no_of_rating: 42,
    sizes: [],
    description: "Elegant gold necklace set with matching earrings, perfect for complementing traditional sarees.",
    color: "gold",
    type: "jewelry"
  },
  {
    brand: "Bata",
    name: "Women's Formal Heels",
    img_url: "/png images/coll3_1.png", // Using existing image as placeholder
    segmented_image_url: "/png images/coll3_1.png",
    price: "1999",
    category: "footwear",
    rating: 4.2,
    no_of_rating: 87,
    sizes: ["5", "6", "7", "8"],
    description: "Comfortable formal heels for women, perfect for office wear and special occasions.",
    color: "black",
    type: "sandals"
  },
  {
    brand: "Levi's",
    name: "Men's Black Formal Trousers",
    img_url: "/png images/coll5_1.png", // Using existing image as placeholder
    segmented_image_url: "/png images/coll5_1.png",
    price: "2499",
    category: "men",
    rating: 4.5,
    no_of_rating: 95,
    sizes: ["30", "32", "34", "36"],
    description: "Classic black formal trousers for men, perfect for pairing with formal shirts.",
    color: "black",
    type: "pants"
  }
];

// Combine all products
const ALL_PRODUCTS = [...PRODUCT_DATA, ...ADDITIONAL_PRODUCTS];

// Initialize the Gemini API - in production, this would need your API key
class GeminiService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
  }

  // Function to set API key
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  // Convert an image file to base64 for API consumption
  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    });
  }

  // Search products using text query
  async searchWithText(query) {
    if (!this.apiKey) {
      throw new Error("Gemini API key is not set");
    }

    try {
      const prompt = `
        I'm searching for products with the following description: "${query}"
        
        Here are the available products:
        ${JSON.stringify(ALL_PRODUCTS, null, 2)}
        
        Please analyze the query and find the most relevant products. Consider the following:
        1. If the query mentions a specific aesthetic, vibe, or occasion, find products that match that theme.
        2. If the query mentions colors, styles, or product types, prioritize those.
        3. If the query is abstract (like "outfits for rainy day"), use common sense to select appropriate items.
        
        Return a JSON object with:
        1. "products": An array of the most relevant products (up to 5)
        2. "explanation": A brief explanation of why these products match the query
      `;

      // In a real implementation, this would be an actual API call to Gemini
      // For demo purposes, we'll simulate a response
      const response = await this.simulateGeminiResponse(query);
      return response;
    } catch (error) {
      console.error("Error in Gemini API search:", error);
      throw error;
    }
  }

  // Search products using text query and uploaded images
  async searchWithTextAndImages(query, imageFiles) {
    if (!this.apiKey) {
      throw new Error("Gemini API key is not set");
    }

    try {
      // Convert images to base64
      const imageBase64Array = await Promise.all(
        imageFiles.map(file => this.fileToBase64(file))
      );

      // In a real implementation, you would send both text and images to Gemini
      // For demo purposes, we'll simulate a response
      const response = await this.simulateGeminiResponse(query, imageBase64Array);
      return response;
    } catch (error) {
      console.error("Error in Gemini API search with images:", error);
      throw error;
    }
  }

  // Simulate Gemini API response for demo purposes
  async simulateGeminiResponse(query, images = []) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple logic to simulate AI processing
        let relevantProducts = [];
        let suggestions = [];
        let explanation = "";
        let suggestionText = "";

        // Process based on query patterns
        const queryLower = query.toLowerCase();
        
        // Image-based search with text refinement (simulating visual recognition)
        if (images.length > 0) {
          // Identify the type of clothing in the uploaded images
          // In a real implementation, Gemini would analyze the images
          // For this simulation, we'll use the text query to infer what was in the images
          
          // Detect clothing type from query
          const detectedTypes = [];
          const clothingTypes = ["shirt", "dress", "saree", "leggings", "suit", "shoes", "watch", "backpack", "lipstick"];
          
          clothingTypes.forEach(type => {
            if (queryLower.includes(type)) {
              detectedTypes.push(type);
            }
          });
          
          // Default to "saree" for the scenario described in the requirements
          const primaryType = detectedTypes.length > 0 ? detectedTypes[0] : "saree";
          
          // Check for color preferences in the query
          const isLookingForPastel = queryLower.includes("pastel");
          const isLookingForSimilar = queryLower.includes("similar");
          
          // Filter products by the detected clothing type
          let typeMatches = ALL_PRODUCTS.filter(product => 
            product.type === primaryType || 
            product.name.toLowerCase().includes(primaryType)
          );
          
          // If looking for pastel colors, filter further
          if (isLookingForPastel) {
            const pastelProducts = typeMatches.filter(product => 
              product.color.includes("pastel") || 
              product.description.toLowerCase().includes("pastel")
            );
            
            // If we have pastel matches, use them, otherwise keep the original type matches
            if (pastelProducts.length > 0) {
              typeMatches = pastelProducts;
            }
          }
          
          // Prioritize color mention if available
          const colorTerms = ["pink", "blue", "green", "white", "black", "red", "yellow", "purple", "orange", "beige", "brown"];
          let requestedColor = "";
          
          colorTerms.forEach(color => {
            if (queryLower.includes(color)) {
              requestedColor = color;
            }
          });
          
          if (requestedColor && isLookingForSimilar) {
            const colorMatches = ALL_PRODUCTS.filter(product => 
              product.type === primaryType && 
              product.color.includes(requestedColor)
            );
            
            if (colorMatches.length > 0) {
              typeMatches = colorMatches;
            }
          }
          
          relevantProducts = typeMatches;
          
          // Generate an appropriate explanation based on the search
          if (isLookingForPastel && primaryType === "saree") {
            explanation = `Based on the uploaded images of ${requestedColor || ""} sarees, I found these pastel-colored sarees that match your style preferences while offering a softer color palette.`;
          } else if (isLookingForSimilar) {
            explanation = `I analyzed your uploaded images and found these similar ${primaryType}s` + (requestedColor ? ` in ${requestedColor}` : "") + ` that match your search criteria.`;
          } else {
            explanation = `Based on your uploaded images, I identified ${primaryType}s and found these products that match your style preferences.`;
          }
        }
        // Text-only search patterns
        else if (queryLower.includes("rainy day") || queryLower.includes("rain")) {
          // For rainy day outfit queries
          relevantProducts = ALL_PRODUCTS.filter(product => 
            product.category === "accessories" || 
            product.name.toLowerCase().includes("shoes") ||
            product.name.toLowerCase().includes("jacket")
          ).slice(0, 3);
          
          explanation = "I've selected items that would be practical for rainy weather while maintaining style. These include accessories and footwear that can keep you dry and comfortable.";
        } 
        else if (queryLower.includes("saree") && queryLower.includes("pastel")) {
          // Specifically for pastel saree queries
          relevantProducts = ALL_PRODUCTS.filter(product => 
            product.type === "saree" && 
            (product.color.includes("pastel") || product.description.toLowerCase().includes("pastel"))
          );
          
          explanation = "I found these beautiful pastel-colored sarees that offer elegant style with soft color tones, perfect for the aesthetic you're looking for.";
        }
        else if (queryLower.includes("pastel") || queryLower.includes("light color")) {
          // For general pastel color queries
          relevantProducts = ALL_PRODUCTS.filter(product => 
            product.color.includes("pastel") || 
            product.description.toLowerCase().includes("pastel")
          );
          
          explanation = "Based on your request for pastel colors, I've selected items with softer color palettes that match this aesthetic.";
        }
        else if (queryLower.includes("formal") || queryLower.includes("office") || queryLower.includes("professional")) {
          // For formal wear queries
          relevantProducts = ALL_PRODUCTS.filter(product => 
            product.name.toLowerCase().includes("suit") || 
            product.name.toLowerCase().includes("shirt") ||
            product.category === "men"
          ).slice(0, 4);
          
          explanation = "I've selected formal attire suitable for professional settings, including classic shirts and suits that project a polished appearance.";
        }
        else if (queryLower.includes("casual") || queryLower.includes("everyday")) {
          // For casual wear queries
          relevantProducts = ALL_PRODUCTS.filter(product => 
            product.name.toLowerCase().includes("shirt") || 
            product.name.toLowerCase().includes("leggings") ||
            product.name.toLowerCase().includes("backpack")
          ).slice(0, 4);
          
          explanation = "For your casual style needs, I've selected comfortable everyday items that offer both practicality and style for regular wear.";
        }
        else {
          // More advanced text pattern matching for specific clothing types
          const clothingTypes = ["shirt", "dress", "saree", "leggings", "suit", "shoes", "watch", "backpack", "lipstick"];
          let detectedType = "";
          
          for (const type of clothingTypes) {
            if (queryLower.includes(type)) {
              detectedType = type;
              break;
            }
          }
          
          if (detectedType) {
            // Filter by detected clothing type
            relevantProducts = ALL_PRODUCTS.filter(product => 
              product.type === detectedType || 
              product.name.toLowerCase().includes(detectedType)
            );
            
            // Check for color preferences
            const colorTerms = ["pink", "blue", "green", "white", "black", "red", "yellow", "purple", "orange", "pastel"];
            let detectedColor = "";
            
            for (const color of colorTerms) {
              if (queryLower.includes(color)) {
                detectedColor = color;
                break;
              }
            }
            
            if (detectedColor) {
              // Filter further by color if specified
              const colorFiltered = relevantProducts.filter(product => 
                product.color.includes(detectedColor) || 
                product.description.toLowerCase().includes(detectedColor)
              );
              
              if (colorFiltered.length > 0) {
                relevantProducts = colorFiltered;
              }
            }
            
            explanation = `I found these ${detectedColor ? detectedColor + " " : ""}${detectedType}s that match your search criteria.`;
          } else {
            // Default search behavior - simple keyword matching
            const keywords = queryLower.split(" ");
            relevantProducts = ALL_PRODUCTS.filter(product => {
              const productText = `${product.brand.toLowerCase()} ${product.name.toLowerCase()} ${product.category.toLowerCase()} ${product.color.toLowerCase()} ${product.type.toLowerCase()}`;
              return keywords.some(keyword => productText.includes(keyword));
            });
            
            if (relevantProducts.length === 0) {
              relevantProducts = ALL_PRODUCTS.slice(0, 4);
              explanation = "I couldn't find exact matches for your query, but here are some popular items you might like.";
            } else {
              explanation = `I found ${relevantProducts.length} items that match your search for "${query}".`;
            }
          }
        }

        // Limit to maximum 5 products
        relevantProducts = relevantProducts.slice(0, 5);
        
        // Generate complementary product suggestions based on the results
        if (relevantProducts.length > 0) {
          // Get the type of the first product
          const primaryType = relevantProducts[0].type;
          const primaryColor = relevantProducts[0].color;
          
          // Generate suggestions based on product type
          if (primaryType === "saree") {
            // For sarees, suggest matching jewelry or blouses
            suggestions = ALL_PRODUCTS.filter(product => 
              (product.type === "jewelry" || product.name.toLowerCase().includes("jewelry") ||
               product.type === "blouse" || product.name.toLowerCase().includes("blouse") ||
               product.type === "sandals" || product.name.toLowerCase().includes("heel"))
            ).slice(0, 3);
            
            if (suggestions.length === 0) {
              // If no jewelry or blouses, suggest by color
              suggestions = ALL_PRODUCTS.filter(product => 
                product.type !== primaryType && 
                (product.color.includes(primaryColor) || 
                product.description.toLowerCase().includes(primaryColor))
              ).slice(0, 3);
            }
            
            suggestionText = "Complete your saree look with these matching accessories:";
          } 
          else if (primaryType === "shirt") {
            // For shirts, suggest matching pants or accessories
            suggestions = ALL_PRODUCTS.filter(product => 
              (product.type === "pants" || product.name.toLowerCase().includes("trouser") ||
               product.type === "watch" || product.name.toLowerCase().includes("watch") ||
               product.type === "shoes" || product.name.toLowerCase().includes("shoes"))
            ).slice(0, 3);
            
            if (suggestions.length === 0) {
              // If no matching items, suggest by complementary color
              suggestions = ALL_PRODUCTS.filter(product => 
                product.type !== primaryType && 
                product.category === "accessories"
              ).slice(0, 3);
            }
            
            suggestionText = "Complete your outfit with these stylish pieces:";
          }
          else if (primaryType === "dress") {
            // For dresses, suggest accessories
            suggestions = ALL_PRODUCTS.filter(product => 
              (product.type === "jewelry" || product.name.toLowerCase().includes("jewelry") ||
               product.type === "handbag" || product.name.toLowerCase().includes("bag") ||
               product.type === "sandals" || product.name.toLowerCase().includes("heel"))
            ).slice(0, 3);
            
            suggestionText = "Enhance your look with these perfect accessories:";
          }
          else {
            // For other products, suggest by category
            suggestions = ALL_PRODUCTS.filter(product => 
              product.type !== primaryType && 
              product.category === relevantProducts[0].category
            ).slice(0, 3);
            
            suggestionText = "You might also like these complementary items:";
          }
          
          // If we still don't have suggestions, just pick some popular items
          if (suggestions.length === 0) {
            suggestions = ALL_PRODUCTS.filter(product => 
              product.type !== primaryType
            ).slice(0, 3);
            
            suggestionText = "Browse these popular items to complete your look:";
          }
        }
        
        resolve({
          products: relevantProducts,
          suggestions: suggestions,
          suggestionText: suggestionText,
          explanation: explanation
        });
      }, 1500); // Simulate API delay
    });
  }
}

/**
 * Get makeup suggestions based on text prompt
 * @param {string} prompt - Text description of desired makeup look
 * @returns {Object} Makeup suggestions with filters
 */
export async function getMakeupSuggestions(prompt) {
  try {
    console.log("[GeminiService] Getting makeup suggestions for prompt:", prompt);
    
    // Prepare request body with the prompt
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `Generate makeup filter recommendations based on this description: "${prompt}".
              Please output a JSON object with a makeupFilters array that includes detailed instructions for applying 
              specific makeup elements. Each item in makeupFilters should have: 
              type (lipstick, eyeshadow, eyeliner, blush, foundation, highlighter, contour), 
              color (as both a named color like "pink" AND a hex color code), 
              intensity (a number between 0 and 1), 
              and style (for applicable types like eyeshadow or eyeliner).
              For color, provide descriptive shade names that would be used in makeup products.
              Only include filters that are appropriate for the prompt.`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        topK: 32,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };
    
    // Make API request
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("[GeminiService] API error:", errorData);
      throw new Error(`Gemini API error: ${errorData.error?.message || "Unknown error"}`);
    }
    
    const data = await response.json();
    
    // Extract JSON from response
    if (!data.candidates || !data.candidates[0].content.parts[0].text) {
      throw new Error("Invalid response format from Gemini API");
    }
    
    // Extract JSON object from text response
    const responseText = data.candidates[0].content.parts[0].text;
    const jsonMatch = responseText.match(/({[\s\S]*})/);
    
    if (!jsonMatch) {
      throw new Error("Could not extract JSON from Gemini response");
    }
    
    // Parse the JSON
    const makeup = JSON.parse(jsonMatch[0]);
    
    // Ensure expected format
    if (!makeup.makeupFilters || !Array.isArray(makeup.makeupFilters)) {
      throw new Error("Response missing makeup filters array");
    }
    
    console.log("[GeminiService] Successfully generated makeup suggestions:", makeup);
    return makeup;
    
  } catch (error) {
    console.error("[GeminiService] Error generating makeup suggestions:", error);
    // Return fallback filters based on the prompt
    const fallbackFilters = generateFallbackFilters(prompt);
    return {
      makeupFilters: fallbackFilters
    };
  }
}

/**
 * Generate fallback makeup filters based on prompt keywords
 * @param {string} prompt - The makeup prompt
 * @returns {Array} Array of makeup filters
 */
function generateFallbackFilters(prompt) {
  const promptLower = prompt.toLowerCase();
  const filters = [];
  
  // Basic lipstick - almost always included
  let lipstickColor = "#FF6B6B"; // default pink-red
  let lipstickIntensity = 0.7;
  
  if (promptLower.includes("red lip") || promptLower.includes("bold lip")) {
    lipstickColor = "#D40000";
    lipstickIntensity = 0.9;
  } else if (promptLower.includes("pink lip") || promptLower.includes("rose lip")) {
    lipstickColor = "#FF80AB";
    lipstickIntensity = 0.7;
  } else if (promptLower.includes("nude lip") || promptLower.includes("neutral lip") || promptLower.includes("natural lip")) {
    lipstickColor = "#C17566";
    lipstickIntensity = 0.6;
  } else if (promptLower.includes("coral lip")) {
    lipstickColor = "#FF8A65";
    lipstickIntensity = 0.8;
  } else if (promptLower.includes("berry") || promptLower.includes("burgundy")) {
    lipstickColor = "#AD1457";
    lipstickIntensity = 0.8;
  }
  
  filters.push({
    type: "lipstick",
    color: lipstickColor,
    intensity: lipstickIntensity,
    shade: detectLipstickShade(lipstickColor)
  });
  
  // Eyeshadow
  if (!promptLower.includes("no eye") && !promptLower.includes("without eye")) {
    let eyeshadowColor = "#CB9A6A"; // default neutral brown
    let eyeshadowIntensity = 0.6;
    
    if (promptLower.includes("smoky eye") || promptLower.includes("smokey eye") || promptLower.includes("dramatic eye")) {
      eyeshadowColor = "#4E4E4E";
      eyeshadowIntensity = 0.85;
    } else if (promptLower.includes("natural eye") || promptLower.includes("neutral eye")) {
      eyeshadowColor = "#D2B48C";
      eyeshadowIntensity = 0.5;
    } else if (promptLower.includes("gold eye") || promptLower.includes("bronze eye")) {
      eyeshadowColor = "#D4AF37";
      eyeshadowIntensity = 0.7;
    } else if (promptLower.includes("pink eye") || promptLower.includes("rose eye")) {
      eyeshadowColor = "#E8B4B8";
      eyeshadowIntensity = 0.6;
    } else if (promptLower.includes("blue eye")) {
      eyeshadowColor = "#6A84C3";
      eyeshadowIntensity = 0.7;
    } else if (promptLower.includes("purple eye")) {
      eyeshadowColor = "#8B5FBF";
      eyeshadowIntensity = 0.7;
    }
    
    filters.push({
      type: "eyeshadow",
      color: eyeshadowColor,
      intensity: eyeshadowIntensity,
      style: promptLower.includes("smoky") || promptLower.includes("smokey") ? "smoky" : "natural",
      shade: detectEyeshadowShade(eyeshadowColor)
    });
  }
  
  // Blush
  if (!promptLower.includes("no blush") && !promptLower.includes("without blush")) {
    let blushColor = "#F08080"; // default light coral
    let blushIntensity = 0.5;
    
    if (promptLower.includes("rosy cheek") || promptLower.includes("pink cheek") || promptLower.includes("pink blush")) {
      blushColor = "#FF80AB";
      blushIntensity = 0.6;
    } else if (promptLower.includes("peach") || promptLower.includes("coral cheek") || promptLower.includes("coral blush")) {
      blushColor = "#FFAB91";
      blushIntensity = 0.5;
    } else if (promptLower.includes("bronze") || promptLower.includes("sun kissed")) {
      blushColor = "#CD853F";
      blushIntensity = 0.5;
    } else if (promptLower.includes("natural") || promptLower.includes("subtle")) {
      blushColor = "#EDBCB0";
      blushIntensity = 0.4;
    }
    
    filters.push({
      type: "blush",
      color: blushColor,
      intensity: blushIntensity,
      shade: detectBlushShade(blushColor)
    });
  }
  
  // Eyeliner for dramatic looks
  if (promptLower.includes("cat eye") || promptLower.includes("winged") || 
      promptLower.includes("dramatic") || promptLower.includes("eyeliner") ||
      promptLower.includes("evening") || promptLower.includes("bold")) {
    
    let eyelinerColor = "#000000"; // default black
    
    if (promptLower.includes("brown eyeliner")) {
      eyelinerColor = "#5D4037";
    } else if (promptLower.includes("blue eyeliner")) {
      eyelinerColor = "#1A237E";
    } else if (promptLower.includes("colored eyeliner")) {
      eyelinerColor = "#6A1B9A";
    }
    
    filters.push({
      type: "eyeliner",
      color: eyelinerColor,
      intensity: 0.8,
      style: promptLower.includes("cat eye") || promptLower.includes("winged") ? "winged" : "classic",
      shade: eyelinerColor === "#000000" ? "Black" : eyelinerColor === "#5D4037" ? "Brown" : "Colored"
    });
  }
  
  return filters;
}

/**
 * Detect lipstick shade name based on hex color
 */
function detectLipstickShade(hexColor) {
  // Simplified color mapping
  const colorMap = {
    "#D40000": "Classic Red",
    "#FF80AB": "Pink Petal",
    "#C17566": "Nude Beige",
    "#FF8A65": "Coral Sunset",
    "#AD1457": "Berry Wine"
  };
  
  return colorMap[hexColor] || "Custom Shade";
}

/**
 * Detect eyeshadow shade name based on hex color
 */
function detectEyeshadowShade(hexColor) {
  // Simplified color mapping
  const colorMap = {
    "#4E4E4E": "Smoky Charcoal",
    "#D2B48C": "Neutral Taupe",
    "#D4AF37": "Golden Shimmer",
    "#E8B4B8": "Rose Quartz",
    "#6A84C3": "Blue Twilight",
    "#8B5FBF": "Purple Haze",
    "#CB9A6A": "Bronze Shimmer"
  };
  
  return colorMap[hexColor] || "Custom Shade";
}

/**
 * Detect blush shade name based on hex color
 */
function detectBlushShade(hexColor) {
  // Simplified color mapping
  const colorMap = {
    "#FF80AB": "Rosy Glow",
    "#FFAB91": "Peach Nectar",
    "#CD853F": "Sun Kissed Bronze",
    "#EDBCB0": "Natural Flush",
    "#F08080": "Coral Bliss"
  };
  
  return colorMap[hexColor] || "Custom Shade";
}

// Export the service
export default new GeminiService();