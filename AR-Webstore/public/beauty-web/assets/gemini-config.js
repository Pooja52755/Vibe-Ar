/**
 * Update your Gemini API key here
 * 
 * This file is loaded by the AIFilterSuggestion.js script
 * to access the Gemini API for image analysis
 */
const GEMINI_API_KEY = "AIzaSyAilrrFYiO9jT62gzfkLfKeubSsiJ7rq4g";

// Export the API key
if (typeof window !== 'undefined') {
  window.GEMINI_API_KEY = GEMINI_API_KEY;
}