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

// Sample product data for the Gemini AI to search from - Updated with myntra images
const PRODUCT_DATA = [
  // SHIRTS AND TOPS
  {
    brand: "Louis Philippe",
    name: "Men's White Formal Shirt",
    img_url: "/beauty-web/png images/myntra_-main/white-button-down-shirt--formal-interview-minimal.webp",
    segmented_image_url: "/beauty-web/png images/myntra_-main/white-button-down-shirt--formal-interview-minimal.webp",
    price: "899",
    category: "men",
    rating: 4.5,
    no_of_rating: 120,
    sizes: ["S", "M", "L", "XL"],
    description: "Formal interview minimal white button-down shirt for men, perfect for professional settings.",
    color: "white",
    type: "shirt"
  },
  {
    brand: "Allen Solly",
    name: "Oversized White T-shirt",
    img_url: "/beauty-web/png images/myntra_-main/Oversized White T-shirt – casual, streetwear, college.webp",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Oversized White T-shirt – casual, streetwear, college.webp",
    price: "699",
    category: "unisex",
    rating: 4.3,
    no_of_rating: 85,
    sizes: ["S", "M", "L", "XL"],
    description: "Casual streetwear college style oversized white t-shirt, perfect for everyday wear.",
    color: "white",
    type: "shirt"
  },
  {
    brand: "H&M",
    name: "Striped Oversized Shirt",
    img_url: "/beauty-web/png images/myntra_-main/striped-oversized-shirt--college-casual-streetwear.webp",
    segmented_image_url: "/beauty-web/png images/myntra_-main/striped-oversized-shirt--college-casual-streetwear.webp",
    price: "1299",
    category: "unisex",
    rating: 4.4,
    no_of_rating: 78,
    sizes: ["S", "M", "L", "XL"],
    description: "College casual streetwear striped oversized shirt, perfect for trendy casual looks.",
    color: "striped",
    type: "shirt"
  },
  {
    brand: "Urban Outfitters",
    name: "Tie-dye T-shirt",
    img_url: "/beauty-web/png images/myntra_-main/Tie-dye T-shirt – aesthetic, streetwear, GenZ.webp",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Tie-dye T-shirt – aesthetic, streetwear, GenZ.webp",
    price: "899",
    category: "unisex",
    rating: 4.2,
    no_of_rating: 92,
    sizes: ["S", "M", "L", "XL"],
    description: "Aesthetic streetwear GenZ tie-dye t-shirt, perfect for expressing individual style.",
    color: "multicolor",
    type: "shirt"
  },
  {
    brand: "Forever 21",
    name: "Crisp White Blouse",
    img_url: "/beauty-web/png images/myntra_-main/crisp-white-blouse--formal-office-minimal.jpg",
    segmented_image_url: "/beauty-web/png images/myntra_-main/crisp-white-blouse--formal-office-minimal.jpg",
    price: "1199",
    category: "women",
    rating: 4.6,
    no_of_rating: 134,
    sizes: ["XS", "S", "M", "L"],
    description: "Formal office minimal crisp white blouse, perfect for professional women's attire.",
    color: "white",
    type: "blouse"
  },
  {
    brand: "Zara",
    name: "Pastel Blue Crop Top",
    img_url: "/beauty-web/png images/myntra_-main/Pastel Blue Crop Top – pastel, summer, chic.webp",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Pastel Blue Crop Top – pastel, summer, chic.webp",
    price: "999",
    category: "women",
    rating: 4.3,
    no_of_rating: 87,
    sizes: ["XS", "S", "M", "L"],
    description: "Pastel summer chic blue crop top, perfect for trendy casual summer outfits.",
    color: "pastel blue",
    type: "top"
  },
  {
    brand: "H&M",
    name: "Neon Green Tank Top",
    img_url: "/beauty-web/png images/myntra_-main/Neon Green Tank Top – party, gym, bold.webp",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Neon Green Tank Top – party, gym, bold.webp",
    price: "699",
    category: "women",
    rating: 4.1,
    no_of_rating: 65,
    sizes: ["XS", "S", "M", "L"],
    description: "Party gym bold neon green tank top, perfect for workouts and bold fashion statements.",
    color: "neon green",
    type: "top"
  },
  {
    brand: "AND",
    name: "Pastel Beige Peplum Top",
    img_url: "/beauty-web/png images/myntra_-main/pastel-beige-peplum-top--formal-office-minimal.jpg",
    segmented_image_url: "/beauty-web/png images/myntra_-main/pastel-beige-peplum-top--formal-office-minimal.jpg",
    price: "1499",
    category: "women",
    rating: 4.5,
    no_of_rating: 76,
    sizes: ["XS", "S", "M", "L"],
    description: "Formal office minimal pastel beige peplum top, perfect for professional elegance.",
    color: "pastel beige",
    type: "top"
  },
  {
    brand: "Vero Moda",
    name: "Pastel Mint Peplum Top",
    img_url: "/beauty-web/png images/myntra_-main/pastel-mint-peplum-top--pastel-chic-brunch.webp",
    segmented_image_url: "/beauty-web/png images/myntra_-main/pastel-mint-peplum-top--pastel-chic-brunch.webp",
    price: "1299",
    category: "women",
    rating: 4.4,
    no_of_rating: 68,
    sizes: ["XS", "S", "M", "L"],
    description: "Pastel chic brunch mint peplum top, perfect for elegant casual occasions.",
    color: "pastel mint",
    type: "top"
  },
  {
    brand: "Forever 21",
    name: "Sequin Tube Top",
    img_url: "/beauty-web/png images/myntra_-main/sequin-tube-top--party-nightout-bold.jpg",
    segmented_image_url: "/beauty-web/png images/myntra_-main/sequin-tube-top--party-nightout-bold.jpg",
    price: "1799",
    category: "women",
    rating: 4.2,
    no_of_rating: 89,
    sizes: ["XS", "S", "M", "L"],
    description: "Party night-out bold sequin tube top, perfect for glamorous evening events.",
    color: "gold",
    type: "top"
  },

  // DRESSES
  {
    brand: "H&M",
    name: "Black Satin Slip Dress",
    img_url: "/beauty-web/png images/myntra_-main/Black Satin Slip Dress – party, night-out, chic.jpg",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Black Satin Slip Dress – party, night-out, chic.jpg",
    price: "1499",
    category: "women",
    rating: 4.6,
    no_of_rating: 85,
    sizes: ["XS", "S", "M", "L"],
    description: "Party night-out chic black satin slip dress, perfect for elegant evening occasions.",
    color: "black",
    type: "dress"
  },
  {
    brand: "Zara",
    name: "Navy Blue Blazer Dress",
    img_url: "/beauty-web/png images/myntra_-main/navy-blue-blazer-dress--formal-office-interview.avif",
    segmented_image_url: "/beauty-web/png images/myntra_-main/navy-blue-blazer-dress--formal-office-interview.avif",
    price: "2299",
    category: "women",
    rating: 4.7,
    no_of_rating: 92,
    sizes: ["XS", "S", "M", "L"],
    description: "Formal office interview navy blue blazer dress, perfect for professional settings.",
    color: "navy blue",
    type: "dress"
  },
  {
    brand: "Forever 21",
    name: "Floral Print Maxi Dress",
    img_url: "/beauty-web/png images/myntra_-main/Floral Print Maxi Dress – vacation, aesthetic, flowy.jpeg",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Floral Print Maxi Dress – vacation, aesthetic, flowy.jpeg",
    price: "1899",
    category: "women",
    rating: 4.4,
    no_of_rating: 78,
    sizes: ["XS", "S", "M", "L"],
    description: "Vacation aesthetic flowy floral print maxi dress, perfect for summer holidays.",
    color: "floral",
    type: "dress"
  },
  {
    brand: "H&M",
    name: "White Summer Sundress",
    img_url: "/beauty-web/png images/myntra_-main/White Summer Sundress – summer, brunch, aesthetic.jpg",
    segmented_image_url: "/beauty-web/png images/myntra_-main/White Summer Sundress – summer, brunch, aesthetic.jpg",
    price: "1299",
    category: "women",
    rating: 4.3,
    no_of_rating: 87,
    sizes: ["XS", "S", "M", "L"],
    description: "Summer brunch aesthetic white sundress, perfect for casual summer occasions.",
    color: "white",
    type: "dress"
  },
  {
    brand: "Zara",
    name: "Velvet Mini Dress",
    img_url: "/beauty-web/png images/myntra_-main/Velvet Mini Dress – party, luxe, chic.webp",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Velvet Mini Dress – party, luxe, chic.webp",
    price: "2499",
    category: "women",
    rating: 4.8,
    no_of_rating: 56,
    sizes: ["XS", "S", "M", "L"],
    description: "Party luxe chic velvet mini dress, perfect for upscale evening events.",
    color: "burgundy",
    type: "dress"
  },

  // SAREES
  {
    brand: "Sabyasachi",
    name: "Black Sequin Saree",
    img_url: "/beauty-web/png images/myntra_-main/black-sequin-saree--party-nightout-bold.webp",
    segmented_image_url: "/beauty-web/png images/myntra_-main/black-sequin-saree--party-nightout-bold.webp",
    price: "9999",
    category: "women",
    rating: 4.9,
    no_of_rating: 85,
    sizes: ["Free Size"],
    description: "Party night-out bold black sequin saree, perfect for glamorous celebrations.",
    color: "black",
    type: "saree"
  },
  {
    brand: "FabIndia",
    name: "Pastel Pink Organza Saree",
    img_url: "/beauty-web/png images/myntra_-main/pastel-pink-organza-saree--pastel-festive-chic.webp",
    segmented_image_url: "/beauty-web/png images/myntra_-main/pastel-pink-organza-saree--pastel-festive-chic.webp",
    price: "7499",
    category: "women",
    rating: 4.8,
    no_of_rating: 65,
    sizes: ["Free Size"],
    description: "Pastel festive chic pink organza saree, perfect for elegant celebrations.",
    color: "pastel pink",
    type: "saree"
  },
  {
    brand: "Mysore Silk",
    name: "Yellow Cotton Saree",
    img_url: "/beauty-web/png images/myntra_-main/yellow-cotton-saree--summer-casual-ethnic.webp",
    segmented_image_url: "/beauty-web/png images/myntra_-main/yellow-cotton-saree--summer-casual-ethnic.webp",
    price: "2999",
    category: "women",
    rating: 4.6,
    no_of_rating: 95,
    sizes: ["Free Size"],
    description: "Summer casual ethnic yellow cotton saree, perfect for everyday traditional wear.",
    color: "yellow",
    type: "saree"
  },

  // ETHNIC WEAR
  {
    brand: "W for Woman",
    name: "Floral Printed Kurta Set",
    img_url: "/beauty-web/png images/myntra_-main/floral-printed-kurta-set--brunch-ethnic-casual.webp",
    segmented_image_url: "/beauty-web/png images/myntra_-main/floral-printed-kurta-set--brunch-ethnic-casual.webp",
    price: "1999",
    category: "women",
    rating: 4.5,
    no_of_rating: 123,
    sizes: ["S", "M", "L", "XL"],
    description: "Brunch ethnic casual floral printed kurta set, perfect for traditional casual occasions.",
    color: "floral",
    type: "kurti"
  },
  {
    brand: "Global Desi",
    name: "Indo-Western Fusion Kurti",
    img_url: "/beauty-web/png images/myntra_-main/Indo-Western Fusion Kurti – college, ethnic-modern, casual.webp",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Indo-Western Fusion Kurti – college, ethnic-modern, casual.webp",
    price: "1799",
    category: "women",
    rating: 4.4,
    no_of_rating: 89,
    sizes: ["S", "M", "L", "XL"],
    description: "College ethnic-modern casual Indo-Western fusion kurti, perfect for contemporary ethnic style.",
    color: "blue",
    type: "kurti"
  },
  {
    brand: "Biba",
    name: "Pastel Blue Kurta Set",
    img_url: "/beauty-web/png images/myntra_-main/pastel-blue-kurta-set--ethnic-office-formal.webp",
    segmented_image_url: "/beauty-web/png images/myntra_-main/pastel-blue-kurta-set--ethnic-office-formal.webp",
    price: "2199",
    category: "women",
    rating: 4.6,
    no_of_rating: 76,
    sizes: ["S", "M", "L", "XL"],
    description: "Ethnic office formal pastel blue kurta set, perfect for professional ethnic wear.",
    color: "pastel blue",
    type: "kurti"
  },
  {
    brand: "Kalini",
    name: "Pastel Green Anarkali",
    img_url: "/beauty-web/png images/myntra_-main/Pastel Green Anarkali – ethnic, festive, pastel.jpg",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Pastel Green Anarkali – ethnic, festive, pastel.jpg",
    price: "2999",
    category: "women",
    rating: 4.7,
    no_of_rating: 84,
    sizes: ["S", "M", "L", "XL"],
    description: "Ethnic festive pastel green Anarkali, perfect for traditional celebrations.",
    color: "pastel green",
    type: "kurti"
  },
  {
    brand: "H&M",
    name: "Modern Dhoti Pant Crop Top",
    img_url: "/beauty-web/png images/myntra_-main/modern-dhoti-pant-crop-top--fusion-festive-trendy.jpg",
    segmented_image_url: "/beauty-web/png images/myntra_-main/modern-dhoti-pant-crop-top--fusion-festive-trendy.jpg",
    price: "1699",
    category: "women",
    rating: 4.3,
    no_of_rating: 67,
    sizes: ["S", "M", "L", "XL"],
    description: "Fusion festive trendy modern dhoti pant crop top set, perfect for contemporary ethnic fusion.",
    color: "white",
    type: "set"
  }
];

// Additional products with comprehensive myntra image coverage
const ADDITIONAL_PRODUCTS = [
  // PANTS AND TROUSERS
  {
    brand: "Allen Solly",
    name: "Beige Formal Trousers",
    img_url: "/beauty-web/png images/myntra_-main/beige-formal-trousers--interview-work-minimal.webp",
    segmented_image_url: "/beauty-web/png images/myntra_-main/beige-formal-trousers--interview-work-minimal.webp",
    price: "1499",
    category: "men",
    rating: 4.5,
    no_of_rating: 78,
    sizes: ["30", "32", "34", "36"],
    description: "Interview work minimal beige formal trousers, perfect for professional settings.",
    color: "beige",
    type: "pants"
  },
  {
    brand: "Urbano Fashion",
    name: "Black Cargo Pants",
    img_url: "/beauty-web/png images/myntra_-main/Black Cargo Pants – streetwear, utility, edgy.jpg",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Black Cargo Pants – streetwear, utility, edgy.jpg",
    price: "1299",
    category: "unisex",
    rating: 4.3,
    no_of_rating: 89,
    sizes: ["28", "30", "32", "34"],
    description: "Streetwear utility edgy black cargo pants, perfect for urban casual style.",
    color: "black",
    type: "pants"
  },
  {
    brand: "Louis Philippe",
    name: "Black Highwaist Trousers",
    img_url: "/beauty-web/png images/myntra_-main/black-highwaist-trousers--formal-office-interview.avif",
    segmented_image_url: "/beauty-web/png images/myntra_-main/black-highwaist-trousers--formal-office-interview.avif",
    price: "1799",
    category: "women",
    rating: 4.6,
    no_of_rating: 92,
    sizes: ["26", "28", "30", "32"],
    description: "Formal office interview black highwaist trousers, perfect for professional women.",
    color: "black",
    type: "pants"
  },
  {
    brand: "W for Woman",
    name: "Black Palazzo Pants",
    img_url: "/beauty-web/png images/myntra_-main/black-palazzo-pants--ethnic-casual-comfy.webp",
    segmented_image_url: "/beauty-web/png images/myntra_-main/black-palazzo-pants--ethnic-casual-comfy.webp",
    price: "999",
    category: "women",
    rating: 4.4,
    no_of_rating: 156,
    sizes: ["S", "M", "L", "XL"],
    description: "Ethnic casual comfy black palazzo pants, perfect for relaxed ethnic wear.",
    color: "black",
    type: "pants"
  },
  {
    brand: "Puma",
    name: "Grey Joggers",
    img_url: "/beauty-web/png images/myntra_-main/Grey Joggers – cozy, sporty, casual.jpg",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Grey Joggers – cozy, sporty, casual.jpg",
    price: "1199",
    category: "unisex",
    rating: 4.2,
    no_of_rating: 134,
    sizes: ["S", "M", "L", "XL"],
    description: "Cozy sporty casual grey joggers, perfect for workouts and leisure wear.",
    color: "grey",
    type: "pants"
  },
  {
    brand: "Zara",
    name: "Pastel Pink Wide-leg Pants",
    img_url: "/beauty-web/png images/myntra_-main/Pastel Pink Wide-leg Pants – pastel, aesthetic, chic.jpg",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Pastel Pink Wide-leg Pants – pastel, aesthetic, chic.jpg",
    price: "1699",
    category: "women",
    rating: 4.5,
    no_of_rating: 87,
    sizes: ["26", "28", "30", "32"],
    description: "Pastel aesthetic chic pink wide-leg pants, perfect for trendy casual wear.",
    color: "pastel pink",
    type: "pants"
  },

  // JEANS
  {
    brand: "Levi's",
    name: "High-waist Ripped Jeans",
    img_url: "/beauty-web/png images/myntra_-main/High-waist Ripped Jeans – streetwear, casual, college.jpg",
    segmented_image_url: "/beauty-web/png images/myntra_-main/High-waist Ripped Jeans – streetwear, casual, college.jpg",
    price: "2499",
    category: "women",
    rating: 4.7,
    no_of_rating: 198,
    sizes: ["26", "28", "30", "32"],
    description: "Streetwear casual college high-waist ripped jeans, perfect for trendy casual looks.",
    color: "blue",
    type: "jeans"
  },
  {
    brand: "Wrangler",
    name: "Retro Flared Jeans",
    img_url: "/beauty-web/png images/myntra_-main/Retro Flared Jeans – vintage, 90s, aesthetic.avif",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Retro Flared Jeans – vintage, 90s, aesthetic.avif",
    price: "2199",
    category: "women",
    rating: 4.4,
    no_of_rating: 156,
    sizes: ["26", "28", "30", "32"],
    description: "Vintage 90s aesthetic retro flared jeans, perfect for nostalgic fashion statements.",
    color: "blue",
    type: "jeans"
  },

  // SKIRTS
  {
    brand: "Forever 21",
    name: "Floral Midi Skirt",
    img_url: "/beauty-web/png images/myntra_-main/Floral Midi Skirt – summer, aesthetic, brunch.jpg",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Floral Midi Skirt – summer, aesthetic, brunch.jpg",
    price: "1299",
    category: "women",
    rating: 4.3,
    no_of_rating: 89,
    sizes: ["XS", "S", "M", "L"],
    description: "Summer aesthetic brunch floral midi skirt, perfect for casual feminine style.",
    color: "floral",
    type: "skirt"
  },
  {
    brand: "H&M",
    name: "Grey Pencil Skirt",
    img_url: "/beauty-web/png images/myntra_-main/grey-pencil-skirt--formal-office-chic.jpg",
    segmented_image_url: "/beauty-web/png images/myntra_-main/grey-pencil-skirt--formal-office-chic.jpg",
    price: "999",
    category: "women",
    rating: 4.5,
    no_of_rating: 124,
    sizes: ["XS", "S", "M", "L"],
    description: "Formal office chic grey pencil skirt, perfect for professional elegance.",
    color: "grey",
    type: "skirt"
  },
  {
    brand: "Zara",
    name: "Metallic Mini Skirt",
    img_url: "/beauty-web/png images/myntra_-main/metallic-mini-skirt--party-edgy-trendy.webp",
    segmented_image_url: "/beauty-web/png images/myntra_-main/metallic-mini-skirt--party-edgy-trendy.webp",
    price: "1599",
    category: "women",
    rating: 4.2,
    no_of_rating: 67,
    sizes: ["XS", "S", "M", "L"],
    description: "Party edgy trendy metallic mini skirt, perfect for bold night-out looks.",
    color: "metallic",
    type: "skirt"
  },
  {
    brand: "Forever 21",
    name: "Pastel Blue Pleated Skirt",
    img_url: "/beauty-web/png images/myntra_-main/pastel-blue-pleated-skirt--pastel-aesthetic-chic.jpg",
    segmented_image_url: "/beauty-web/png images/myntra_-main/pastel-blue-pleated-skirt--pastel-aesthetic-chic.jpg",
    price: "1199",
    category: "women",
    rating: 4.4,
    no_of_rating: 78,
    sizes: ["XS", "S", "M", "L"],
    description: "Pastel aesthetic chic blue pleated skirt, perfect for sweet feminine style.",
    color: "pastel blue",
    type: "skirt"
  },

  // JACKETS AND OUTERWEAR
  {
    brand: "Levi's",
    name: "Denim Jacket",
    img_url: "/beauty-web/png images/myntra_-main/Denim Jacket – college, casual, timeless.jpeg",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Denim Jacket – college, casual, timeless.jpeg",
    price: "2999",
    category: "unisex",
    rating: 4.6,
    no_of_rating: 187,
    sizes: ["S", "M", "L", "XL"],
    description: "College casual timeless denim jacket, perfect for layering and casual style.",
    color: "blue",
    type: "jacket"
  },
  {
    brand: "Zara",
    name: "Leather Biker Jacket",
    img_url: "/beauty-web/png images/myntra_-main/Leather Biker Jacket – edgy, party, streetwear.jpg",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Leather Biker Jacket – edgy, party, streetwear.jpg",
    price: "4999",
    category: "unisex",
    rating: 4.8,
    no_of_rating: 145,
    sizes: ["S", "M", "L", "XL"],
    description: "Edgy party streetwear leather biker jacket, perfect for bold fashion statements.",
    color: "black",
    type: "jacket"
  },
  {
    brand: "H&M",
    name: "Oversized Blazer",
    img_url: "/beauty-web/png images/myntra_-main/Oversized Blazer – formal, chic, streetwear mix.jpg",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Oversized Blazer – formal, chic, streetwear mix.jpg",
    price: "2499",
    category: "women",
    rating: 4.5,
    no_of_rating: 134,
    sizes: ["S", "M", "L", "XL"],
    description: "Formal chic streetwear mix oversized blazer, perfect for contemporary professional style.",
    color: "beige",
    type: "jacket"
  },
  {
    brand: "Uniqlo",
    name: "Pastel Lavender Puffer Jacket",
    img_url: "/beauty-web/png images/myntra_-main/Pastel Lavender Puffer Jacket – winter, pastel, cozy.webp",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Pastel Lavender Puffer Jacket – winter, pastel, cozy.webp",
    price: "3999",
    category: "women",
    rating: 4.7,
    no_of_rating: 89,
    sizes: ["S", "M", "L", "XL"],
    description: "Winter pastel cozy lavender puffer jacket, perfect for cold weather fashion.",
    color: "pastel lavender",
    type: "jacket"
  },
  {
    brand: "Nike",
    name: "Pastel Gradient Windbreaker",
    img_url: "/beauty-web/png images/myntra_-main/Pastel Gradient Windbreaker – pastel, streetwear, rainy.webp",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Pastel Gradient Windbreaker – pastel, streetwear, rainy.webp",
    price: "2799",
    category: "unisex",
    rating: 4.4,
    no_of_rating: 123,
    sizes: ["S", "M", "L", "XL"],
    description: "Pastel streetwear rainy gradient windbreaker, perfect for stylish weather protection.",
    color: "pastel gradient",
    type: "jacket"
  },
  {
    brand: "Zara",
    name: "Sequin Jacket",
    img_url: "/beauty-web/png images/myntra_-main/Sequin Jacket – party, night-out, bold.jpg",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Sequin Jacket – party, night-out, bold.jpg",
    price: "3499",
    category: "women",
    rating: 4.3,
    no_of_rating: 67,
    sizes: ["S", "M", "L", "XL"],
    description: "Party night-out bold sequin jacket, perfect for glamorous evening events.",
    color: "gold",
    type: "jacket"
  },

  // RAINY DAY WEAR
  {
    brand: "Rains",
    name: "Transparent Raincoat",
    img_url: "/beauty-web/png images/myntra_-main/Transparent Raincoat – rainy, monsoon, utility.webp",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Transparent Raincoat – rainy, monsoon, utility.webp",
    price: "1299",
    category: "unisex",
    rating: 4.2,
    no_of_rating: 156,
    sizes: ["S", "M", "L", "XL"],
    description: "Rainy monsoon utility transparent raincoat, perfect for staying dry in style.",
    color: "transparent",
    type: "rainwear"
  },
  {
    brand: "Hunter",
    name: "Black Combat Boots",
    img_url: "/beauty-web/png images/myntra_-main/Black Combat Boots – edgy, winter, rainy.webp",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Black Combat Boots – edgy, winter, rainy.webp",
    price: "3999",
    category: "unisex",
    rating: 4.6,
    no_of_rating: 134,
    sizes: ["6", "7", "8", "9", "10"],
    description: "Edgy winter rainy black combat boots, perfect for wet weather and bold style.",
    color: "black",
    type: "boots"
  },
  {
    brand: "Wildcraft",
    name: "Waterproof Backpack",
    img_url: "/beauty-web/png images/myntra_-main/Waterproof Backpack – rainy, college, sporty.webp",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Waterproof Backpack – rainy, college, sporty.webp",
    price: "1999",
    category: "unisex",
    rating: 4.5,
    no_of_rating: 187,
    sizes: [],
    description: "Rainy college sporty waterproof backpack, perfect for weather protection and daily use.",
    color: "black",
    type: "bag"
  },

  // SWEATERS AND HOODIES
  {
    brand: "H&M",
    name: "Beige Knit Sweater",
    img_url: "/beauty-web/png images/myntra_-main/Beige Knit Sweater – cozy, autumn, minimal.jpg",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Beige Knit Sweater – cozy, autumn, minimal.jpg",
    price: "1999",
    category: "women",
    rating: 4.4,
    no_of_rating: 89,
    sizes: ["S", "M", "L", "XL"],
    description: "Cozy autumn minimal beige knit sweater, perfect for comfortable seasonal style.",
    color: "beige",
    type: "sweater"
  },
  {
    brand: "Uniqlo",
    name: "Black Turtleneck",
    img_url: "/beauty-web/png images/myntra_-main/black-turtleneck--winter-minimal-classy.jpg",
    segmented_image_url: "/beauty-web/png images/myntra_-main/black-turtleneck--winter-minimal-classy.jpg",
    price: "1299",
    category: "unisex",
    rating: 4.6,
    no_of_rating: 145,
    sizes: ["S", "M", "L", "XL"],
    description: "Winter minimal classy black turtleneck, perfect for sophisticated layering.",
    color: "black",
    type: "sweater"
  },
  {
    brand: "Nike",
    name: "Black Graphic Hoodie",
    img_url: "/beauty-web/png images/myntra_-main/Black Graphic Hoodie – streetwear, winter, rainy, cozy.webp",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Black Graphic Hoodie – streetwear, winter, rainy, cozy.webp",
    price: "2499",
    category: "unisex",
    rating: 4.3,
    no_of_rating: 167,
    sizes: ["S", "M", "L", "XL"],
    description: "Streetwear winter rainy cozy black graphic hoodie, perfect for urban casual comfort.",
    color: "black",
    type: "hoodie"
  },
  {
    brand: "Urban Outfitters",
    name: "Oversized Blanket Hoodie",
    img_url: "/beauty-web/png images/myntra_-main/Oversized Blanket Hoodie – winter, cozy, indoor.jpg",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Oversized Blanket Hoodie – winter, cozy, indoor.jpg",
    price: "1799",
    category: "unisex",
    rating: 4.7,
    no_of_rating: 234,
    sizes: ["S", "M", "L", "XL"],
    description: "Winter cozy indoor oversized blanket hoodie, perfect for ultimate comfort.",
    color: "grey",
    type: "hoodie"
  },
  {
    brand: "H&M",
    name: "Oversized Plaid Shirt",
    img_url: "/beauty-web/png images/myntra_-main/Oversized Plaid Shirt – casual, cozy, college.jpg",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Oversized Plaid Shirt – casual, cozy, college.jpg",
    price: "1499",
    category: "unisex",
    rating: 4.2,
    no_of_rating: 123,
    sizes: ["S", "M", "L", "XL"],
    description: "Casual cozy college oversized plaid shirt, perfect for relaxed layering.",
    color: "plaid",
    type: "shirt"
  },
  {
    brand: "Forever 21",
    name: "Cropped Sweatshirt",
    img_url: "/beauty-web/png images/myntra_-main/Cropped Sweatshirt – casual, sporty, cozy.webp",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Cropped Sweatshirt – casual, sporty, cozy.webp",
    price: "999",
    category: "women",
    rating: 4.1,
    no_of_rating: 98,
    sizes: ["S", "M", "L", "XL"],
    description: "Casual sporty cozy cropped sweatshirt, perfect for trendy athletic wear.",
    color: "grey",
    type: "sweatshirt"
  },

  // SHOES AND FOOTWEAR
  {
    brand: "Puma",
    name: "Black Canvas Sneakers",
    img_url: "/beauty-web/png images/myntra_-main/Black Canvas Sneakers – casual, streetwear, college.jpg",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Black Canvas Sneakers – casual, streetwear, college.jpg",
    price: "2499",
    category: "unisex",
    rating: 4.5,
    no_of_rating: 178,
    sizes: ["6", "7", "8", "9", "10"],
    description: "Casual streetwear college black canvas sneakers, perfect for everyday comfort.",
    color: "black",
    type: "sneakers"
  },
  {
    brand: "Adidas",
    name: "White Chunky Sneakers",
    img_url: "/beauty-web/png images/myntra_-main/white-chunky-sneakers--trendy-aesthetic-comfy.jpg",
    segmented_image_url: "/beauty-web/png images/myntra_-main/white-chunky-sneakers--trendy-aesthetic-comfy.jpg",
    price: "3999",
    category: "unisex",
    rating: 4.6,
    no_of_rating: 145,
    sizes: ["6", "7", "8", "9", "10"],
    description: "Trendy aesthetic comfy white chunky sneakers, perfect for modern street style.",
    color: "white",
    type: "sneakers"
  },
  {
    brand: "Clarks",
    name: "Formal Black Oxford Shoes",
    img_url: "/beauty-web/png images/myntra_-main/formal-black-oxford-shoes--office-interview-classy.webp",
    segmented_image_url: "/beauty-web/png images/myntra_-main/formal-black-oxford-shoes--office-interview-classy.webp",
    price: "4999",
    category: "men",
    rating: 4.8,
    no_of_rating: 123,
    sizes: ["7", "8", "9", "10", "11"],
    description: "Office interview classy formal black oxford shoes, perfect for professional settings.",
    color: "black",
    type: "formal shoes"
  },
  {
    brand: "Steve Madden",
    name: "Platform Ankle Boots",
    img_url: "/beauty-web/png images/myntra_-main/Platform Ankle Boots – Y2K, trendy, edgy.jpg",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Platform Ankle Boots – Y2K, trendy, edgy.jpg",
    price: "3499",
    category: "women",
    rating: 4.4,
    no_of_rating: 89,
    sizes: ["5", "6", "7", "8", "9"],
    description: "Y2K trendy edgy platform ankle boots, perfect for bold fashion statements.",
    color: "black",
    type: "boots"
  },
  {
    brand: "Crocs",
    name: "Pastel Pink Clogs",
    img_url: "/beauty-web/png images/myntra_-main/Pastel Pink Clogs – pastel, aesthetic, comfy.jpg",
    segmented_image_url: "/beauty-web/png images/myntra_-main/Pastel Pink Clogs – pastel, aesthetic, comfy.jpg",
    price: "2999",
    category: "unisex",
    rating: 4.2,
    no_of_rating: 167,
    sizes: ["6", "7", "8", "9", "10"],
    description: "Pastel aesthetic comfy pink clogs, perfect for casual comfort and trendy style.",
    color: "pastel pink",
    type: "clogs"
  },
  {
    brand: "Bata",
    name: "Brown Formal Loafers",
    img_url: "/beauty-web/png images/myntra_-main/brown-formal-loafers--office-business-classic.jpg",
    segmented_image_url: "/beauty-web/png images/myntra_-main/brown-formal-loafers--office-business-classic.jpg",
    price: "2799",
    category: "men",
    rating: 4.3,
    no_of_rating: 134,
    sizes: ["7", "8", "9", "10", "11"],
    description: "Office business classic brown formal loafers, perfect for sophisticated professional style.",
    color: "brown",
    type: "loafers"
  },

  // TRADITIONAL WEAR - EXTENDED
  {
    brand: "Biba",
    name: "Navy Blue Kurti",
    img_url: "/beauty-web/png images/myntra_-main/navy-blue-kurti--ethnic-casual-office.webp",
    segmented_image_url: "/beauty-web/png images/myntra_-main/navy-blue-kurti--ethnic-casual-office.webp",
    price: "1299",
    category: "women",
    rating: 4.5,
    no_of_rating: 156,
    sizes: ["S", "M", "L", "XL"],
    description: "Ethnic casual office navy blue kurti, perfect for modern traditional style.",
    color: "navy blue",
    type: "kurti"
  },
  {
    brand: "W for Woman",
    name: "Pastel Pink Palazzo Set",
    img_url: "/beauty-web/png images/myntra_-main/pastel-pink-palazzo-set--ethnic-pastel-comfy.jpg",
    segmented_image_url: "/beauty-web/png images/myntra_-main/pastel-pink-palazzo-set--ethnic-pastel-comfy.jpg",
    price: "1999",
    category: "women",
    rating: 4.4,
    no_of_rating: 123,
    sizes: ["S", "M", "L", "XL"],
    description: "Ethnic pastel comfy pink palazzo set, perfect for relaxed traditional wear.",
    color: "pastel pink",
    type: "palazzo set"
  },

  // LEGACY PRODUCTS (maintaining existing items)
  {
    brand: "Bata",
    name: "Women's Formal Heels",
    img_url: "/png images/coll3_1.png",
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
    img_url: "/png images/coll5_1.png",
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