/**
 * MockProductData.js - Provides mock product data for the Beauty Web application
 * 
 * This script contains mock product data that can be used when 
 * the actual product data isn't available or when testing.
 */

const MOCK_PRODUCT_DATA = {
  lipsticks: [
    { name: "Rosy Blush Lipstick", color: "#FF5C7A", image: "https://m.media-amazon.com/images/I/61zekvd0aEL._SL1500_.jpg", price: "$18.99" },
    { name: "Coral Sunset Lipstick", color: "#FF7F50", image: "https://m.media-amazon.com/images/I/51DI76nj6mL._SL1200_.jpg", price: "$19.99" },
    { name: "Berry Crush Matte", color: "#C23B22", image: "https://m.media-amazon.com/images/I/71lz65KIDfL._SL1500_.jpg", price: "$22.99" },
    { name: "Pink Petal Gloss", color: "#FFB6C1", image: "https://m.media-amazon.com/images/I/616zFrciDnL._SL1500_.jpg", price: "$17.99" },
    { name: "Mauve Dream Lipstick", color: "#C67D95", image: "https://m.media-amazon.com/images/I/71KilVDzz8L._SL1500_.jpg", price: "$20.99" }
  ],
  eyeshadows: [
    { name: "Smoky Quartz Palette", color: "#555555", image: "https://m.media-amazon.com/images/I/71U-Yq3eYBL._SL1500_.jpg", price: "$32.99" },
    { name: "Golden Hour Shadow", color: "#FFDC73", image: "https://m.media-amazon.com/images/I/81yFDnAU+XL._SL1500_.jpg", price: "$28.99" },
    { name: "Rose Gold Shimmer", color: "#E0BFB8", image: "https://m.media-amazon.com/images/I/71bIZdXVPQL._SL1500_.jpg", price: "$29.99" },
    { name: "Emerald Gleam Shadow", color: "#50C878", image: "https://m.media-amazon.com/images/I/81CmOzABSJL._SL1500_.jpg", price: "$27.99" },
    { name: "Lavender Mist Palette", color: "#E6E6FA", image: "https://m.media-amazon.com/images/I/71bcS-8cVUL._SL1500_.jpg", price: "$31.99" }
  ],
  blush: [
    { name: "Peach Glow Blush", color: "#FFAA99", image: "https://m.media-amazon.com/images/I/61ZiXBtUUkL._SL1500_.jpg", price: "$21.99" },
    { name: "Rose Petal Blush", color: "#FF92A5", image: "https://m.media-amazon.com/images/I/71X9HkmIsoL._SL1500_.jpg", price: "$22.99" },
    { name: "Coral Reef Cheek Tint", color: "#FF6F61", image: "https://m.media-amazon.com/images/I/71hC+yO8gfL._SL1500_.jpg", price: "$23.99" },
    { name: "Berry Flush Blush", color: "#C24270", image: "https://m.media-amazon.com/images/I/71SBrfOoufL._SL1500_.jpg", price: "$20.99" },
    { name: "Soft Mauve Blush", color: "#C8A2C8", image: "https://m.media-amazon.com/images/I/71Lr-n3ywuL._SL1500_.jpg", price: "$19.99" }
  ]
};

// Helper function to get random products from each category
function getRandomMockProducts(count = 1) {
  const result = [];
  
  // Get random lipsticks
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * MOCK_PRODUCT_DATA.lipsticks.length);
    const product = MOCK_PRODUCT_DATA.lipsticks[randomIndex];
    product.type = 'Lipstick';
    result.push(product);
  }
  
  // Get random eyeshadows
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * MOCK_PRODUCT_DATA.eyeshadows.length);
    const product = MOCK_PRODUCT_DATA.eyeshadows[randomIndex];
    product.type = 'Eyeshadow';
    result.push(product);
  }
  
  // Get random blush
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * MOCK_PRODUCT_DATA.blush.length);
    const product = MOCK_PRODUCT_DATA.blush[randomIndex];
    product.type = 'Blush';
    result.push(product);
  }
  
  return result;
}

// Export the data to window for global access
if (typeof window !== 'undefined') {
  window.MOCK_PRODUCT_DATA = MOCK_PRODUCT_DATA;
  window.getRandomMockProducts = getRandomMockProducts;
}