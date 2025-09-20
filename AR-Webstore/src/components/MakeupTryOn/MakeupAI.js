import React, { useState, useEffect, useRef } from 'react';
import './MakeupAI.css';
import { geminiAnalyzeFace, getMakeupSuggestions } from '../../services/GeminiService';
import makeupProducts from '../../data/MakeupProducts';

/**
 * MakeupAI Component - Integrates AI-driven makeup suggestions with Banuba SDK
 * This component provides an interface for users to get AI-powered makeup suggestions
 * based on text prompts and applies them to the virtual makeup try-on experience.
 */
const MakeupAI = ({ onApplyMakeup, banubaInstance }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [error, setError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [snapshot, setSnapshot] = useState(null);
  const videoRef = useRef(null);
  
  // Example makeup looks that users can select with one click
  const exampleLooks = [
    'Natural everyday look',
    'Evening glamour',
    'Bold red lips',
    'Summer glow',
    'Wedding makeup',
    'No-makeup makeup'
  ];

  /**
   * Capture a snapshot of the current video stream for analysis
   */
  const captureSnapshot = () => {
    if (!videoRef.current) return null;
    
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL('image/jpeg');
  };

  /**
   * Handle AI makeup generation based on user prompt
   */
  const handleGenerateMakeup = async () => {
    if (!prompt.trim()) {
      setError('Please enter a makeup description');
      return;
    }
    
    try {
      setError(null);
      setIsLoading(true);
      
      // Capture current face image if video is available
      const imageData = captureSnapshot();
      
      let makeupData;
      if (imageData) {
        // If we have image data, use the face analysis function
        makeupData = await geminiAnalyzeFace(imageData, prompt);
      } else {
        // Otherwise, fall back to text-only makeup suggestions
        makeupData = await getMakeupSuggestions(prompt);
      }
      
      setSuggestions(makeupData);
      setShowSuggestions(true);
      
      // Apply the makeup if we have a callback
      if (onApplyMakeup && makeupData.makeupFilters) {
        onApplyMakeup(makeupData.makeupFilters);
      }
      
    } catch (err) {
      console.error('Error generating makeup:', err);
      setError('Failed to generate makeup suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Apply a predefined example look
   */
  const applyExampleLook = (lookName) => {
    setPrompt(lookName);
    handleGenerateMakeup();
  };
  
  /**
   * Handle product selection and apply the corresponding makeup
   */
  const handleSelectProduct = (product) => {
    if (onApplyMakeup && product.makeupFilter) {
      onApplyMakeup([product.makeupFilter]);
    }
  };

  /**
   * Find matching products from our catalog based on makeup suggestions
   */
  const getMatchingProducts = () => {
    if (!suggestions || !suggestions.makeupFilters) return [];
    
    // Match suggested filters with product catalog
    return suggestions.makeupFilters.map(filter => {
      // Find products matching this filter type
      const matchingProducts = makeupProducts.filter(
        product => product.type === filter.type
      );
      
      if (matchingProducts.length === 0) return null;
      
      // Find best color match if possible
      let bestMatch = matchingProducts[0];
      if (filter.color) {
        const colorMatch = matchingProducts.find(
          p => p.color.toLowerCase() === filter.color.toLowerCase()
        );
        if (colorMatch) bestMatch = colorMatch;
      }
      
      // Add the filter to the product so we can apply it directly
      return {
        ...bestMatch,
        makeupFilter: filter
      };
    }).filter(Boolean); // Remove nulls
  };

  return (
    <div className="makeup-ai-container">
      <h3 className="makeup-ai-title">✨ AI Makeup Assistant</h3>
      
      {/* Video reference (usually hidden, just for capturing) */}
      {banubaInstance && (
        <video 
          ref={videoRef} 
          width="300" 
          height="200" 
          style={{ display: 'none' }}
        />
      )}
      
      <div className="makeup-ai-input-container">
        <label htmlFor="makeup-prompt">Describe your desired makeup look:</label>
        <div className="makeup-ai-input-group">
          <input
            id="makeup-prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'natural everyday makeup'"
            disabled={isLoading}
            onKeyPress={(e) => e.key === 'Enter' && handleGenerateMakeup()}
          />
          <button 
            className="makeup-ai-generate-btn"
            onClick={handleGenerateMakeup}
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Apply'}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="makeup-ai-error">
          {error}
        </div>
      )}
      
      <div className="makeup-ai-example-looks">
        <p>Try these looks:</p>
        <div className="makeup-ai-example-tags">
          {exampleLooks.map((look, index) => (
            <div 
              key={index} 
              className="makeup-ai-example-tag"
              onClick={() => applyExampleLook(look)}
            >
              {look}
            </div>
          ))}
        </div>
      </div>
      
      {showSuggestions && suggestions && (
        <div className="makeup-ai-suggestions">
          <h4>AI Recommended Products</h4>
          <div className="makeup-ai-product-grid">
            {getMatchingProducts().map((product, index) => (
              <div 
                key={index} 
                className="makeup-ai-product-card"
                onClick={() => handleSelectProduct(product)}
              >
                <div 
                  className="makeup-ai-product-color" 
                  style={{ 
                    backgroundColor: product.makeupFilter.color || '#f0f0f0',
                  }}
                />
                <div className="makeup-ai-product-info">
                  <h5>{product.name}</h5>
                  <p>{product.brand}</p>
                  <p className="makeup-ai-product-price">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MakeupAI;
