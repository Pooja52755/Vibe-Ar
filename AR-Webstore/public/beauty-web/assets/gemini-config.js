/**
 * Gemini API Configuration
 * 
 * This file configures the Gemini API key and settings for various AI-powered features:
 * - AIFilterSuggestion.js: For image analysis
 */

// Your Gemini API key - Updated with user's key for better functionality
const GEMINI_API_KEY = "AIzaSyDIZLGgaxV8kKTjWA9SASstL6gRkseKGkM";

// Gemini configuration object
const GEMINI_CONFIG = {
  API_KEY: GEMINI_API_KEY,
  MODEL: "gemini-pro", // The model to use
  VISION_MODEL: "gemini-pro-vision", // The vision model
  MAX_TOKENS: 2048,     // Maximum tokens to generate
  TEMPERATURE: 0.4,     // Lower temperature for more consistent makeup suggestions
  USE_MOCK: false       // Set to true to use mock responses instead of API calls
};

// For development/testing without API calls
const USE_MOCK_RESPONSES = false;

// Export the configuration
if (typeof window !== 'undefined') {
  window.GEMINI_API_KEY = GEMINI_API_KEY;
  window.GEMINI_CONFIG = GEMINI_CONFIG;
  window.USE_MOCK_RESPONSES = USE_MOCK_RESPONSES;
}