import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUpload, faTimes, faStar, faStarHalfAlt, faMicrophone, faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";
import GeminiService from "../../services/GeminiService";
import "./AISearch.css";
import useTypingEffect from "./useTypingEffect";
import TrendingNowSection from "./TrendingNowSection";

const AISearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionText, setSuggestionText] = useState("");
  const [aiExplanation, setAiExplanation] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Gemini API key would normally be stored securely
  // For demo purposes, we'll set it directly (in production, use environment variables)
  const GEMINI_API_KEY = "AIzaSyAilrrFYiO9jT62gzfkLfKeubSsiJ7rq4g";

  const typingPlaceholder = useTypingEffect([
    "What's the vibe you're going for?",
    "Drop your search"
  ], 60, 1200);

  // Initialize voice recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setVoiceSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onstart = () => {
          setIsListening(true);
          showVoiceNotification('Listening... Speak now!', 'listening');
        };
        
        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setSearchQuery(transcript);
          showVoiceNotification(`Voice input: "${transcript}"`, 'success');
          // Auto-trigger search after a short delay
          setTimeout(() => {
            handleSearch();
          }, 500);
        };
        
        recognitionRef.current.onerror = (event) => {
          setIsListening(false);
          let errorMessage = 'Voice recognition error occurred.';
          switch(event.error) {
            case 'no-speech':
              errorMessage = 'No speech detected. Please try again.';
              break;
            case 'audio-capture':
              errorMessage = 'Microphone not accessible. Please check permissions.';
              break;
            case 'not-allowed':
              errorMessage = 'Microphone access denied. Please allow microphone access and try again.';
              break;
            default:
              errorMessage = `Voice recognition error: ${event.error}`;
          }
          showVoiceNotification(errorMessage, 'error');
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  // Voice search functionality
  const startVoiceSearch = () => {
    if (!voiceSupported) {
      showVoiceNotification('Voice search is not supported in this browser. Please try Chrome, Edge, or Safari.', 'error');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    try {
      recognitionRef.current?.start();
    } catch (error) {
      showVoiceNotification('Could not start voice recognition. Please try again.', 'error');
    }
  };

  // Show voice notifications
  const showVoiceNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'error' ? '#ff5252' : type === 'success' ? '#4caf50' : type === 'listening' ? '#ff9800' : '#2196f3'};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 10000;
      font-family: Arial, sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      max-width: 300px;
      word-wrap: break-word;
      animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;

    // Add animation styles if not already present
    if (!document.getElementById('voice-notification-styles')) {
      const style = document.createElement('style');
      style.id = 'voice-notification-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      notification.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }, 4000);
  };

  const handleSearch = async () => {
    if (!searchQuery && uploadedImages.length === 0) return;

    setIsSearching(true);
    
    try {
      // Set the API key for the Gemini service
      GeminiService.setApiKey(GEMINI_API_KEY);
      
      let response;
      if (uploadedImages.length > 0) {
        // If images are uploaded, use them in the search
        const imageFiles = uploadedImages.map(img => img.file);
        response = await GeminiService.searchWithTextAndImages(searchQuery, imageFiles);
      } else {
        // Text-only search
        response = await GeminiService.searchWithText(searchQuery);
      }
      
      setSearchResults(response.products);
      setAiExplanation(response.explanation);
      setSuggestions(response.suggestions || []);
      setSuggestionText(response.suggestionText || "");
    } catch (error) {
      console.error("Error searching with Gemini:", error);
      setAiExplanation("Sorry, there was an error processing your search. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (indexToRemove) => {
    setUploadedImages(prev => 
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Select an example search prompt
  const selectExamplePrompt = (prompt) => {
    setSearchQuery(prompt);
  };

  // Helper function to render star ratings
  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={`star-${i}`} icon={faStar} />);
    }
    
    if (hasHalfStar) {
      stars.push(<FontAwesomeIcon key="half-star" icon={faStarHalfAlt} />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesomeIcon key={`empty-star-${i}`} icon={faStar} style={{ opacity: 0.3 }} />);
    }
    
    return stars;
  };

  return (
    <div className="ai-search-container">
      <div className="ai-search-header">
        <h1>Hunt</h1>
        {/* Removed marketing/feature text as requested */}
      </div>

      <div className="search-box">
        <div className="search-input-container">
          <div className="search-text-input">
            <input
              type="text"
              placeholder={typingPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <div className="search-buttons">
              <button 
                className={`voice-button ${isListening ? 'listening' : ''}`}
                onClick={startVoiceSearch}
                disabled={!voiceSupported}
                title={
                  !voiceSupported 
                    ? 'Voice search not supported in this browser' 
                    : isListening 
                      ? 'Stop voice input' 
                      : 'Start voice search'
                }
              >
                <FontAwesomeIcon 
                  icon={isListening ? faMicrophoneSlash : faMicrophone} 
                />
                {isListening ? ' Listening...' : ' Voice'}
              </button>
              <button className="search-button" onClick={handleSearch}>
                <FontAwesomeIcon icon={faSearch} /> Search
              </button>
            </div>
          </div>
        </div>
        <div className="example-prompts">
          <p>Try these example searches:</p>
          {voiceSupported && (
            <div className="voice-tip">
              <FontAwesomeIcon icon={faMicrophone} style={{ color: '#e91e63', marginRight: '8px' }} />
              <span>New! Use the Voice button to speak your search queries naturally</span>
            </div>
          )}
          <div className="example-chips">
            <span className="example-chip" onClick={() => selectExamplePrompt("Outfits for a rainy day in Bengaluru")}>Rainy day outfit</span>
            <span className="example-chip" onClick={() => selectExamplePrompt("Professional attire for a job interview")}>Interview outfit</span>
            <span className="example-chip" onClick={() => selectExamplePrompt("Pastel colored sarees for summer")}>Pastel sarees</span>
            <span className="example-chip" onClick={() => selectExamplePrompt("Find similar sarees but in pastel colors")}>Similar in pastel</span>
            <span className="example-chip" onClick={() => selectExamplePrompt("Pink saree with elegant design")}>Pink saree</span>
            <span className="example-chip" onClick={() => selectExamplePrompt("Blue formal shirt with matching accessories")}>Complete outfit</span>
          </div>
        </div>
        <div className="image-upload-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <label className="aisearch-label">
              Drop your image, add your vibe:
            </label>
            {uploadedImages.length < 3 && (
              <div 
                className="image-upload-box" 
                onClick={triggerFileInput}
              >
                Upload image
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
          </div>
          <div className="image-help">
            {/* Restore any previous prompt/sample image links if they existed */}
          </div>
          <div className="image-upload-container">
            {uploadedImages.map((img, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <img 
                  src={img.preview} 
                  alt={`Uploaded ${index}`} 
                  className="uploaded-image-preview" 
                />
                <button 
                  className="remove-image-btn" 
                  onClick={() => removeImage(index)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="search-results">
        {isSearching ? (
          <div className="results-loading">
            <div className="spinner"></div>
            <p>Searching with AI magic...</p>
          </div>
        ) : searchResults.length > 0 ? (
          <>
            <div className="ai-explanation">
              <p>{aiExplanation}</p>
            </div>
            
            <div className="search-results-container">
              {searchResults.map((product, index) => (
                <div className="product-card" key={index}>
                  <img 
                    src={product.img_url} 
                    alt={product.name}
                    className="product-image"
                  />
                  <div className="product-info">
                    <div className="product-brand">{product.brand}</div>
                    <div className="product-name">{product.name}</div>
                    <div className="product-price">₹{product.price}</div>
                    <div className="rating-container">
                      <div className="rating-stars">
                        {renderStarRating(product.rating)}
                      </div>
                      <div className="rating-count">
                        ({product.no_of_rating})
                      </div>
                    </div>
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="product-sizes">
                        {product.sizes.map((size, i) => (
                          <span key={i} className="size-tag">{size}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {suggestions && suggestions.length > 0 && (
              <div className="product-suggestions">
                <h3 className="suggestions-title">AI-Powered Suggestions</h3>
                <p className="suggestions-description">{suggestionText}</p>
                <div className="suggestions-container">
                  {suggestions.map((product, index) => (
                    <div className="suggestion-card" key={index}>
                      <img 
                        src={product.img_url} 
                        alt={product.name}
                        className="suggestion-image"
                      />
                      <div className="suggestion-info">
                        <div className="suggestion-name">{product.name}</div>
                        <div className="suggestion-price">₹{product.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {searchQuery ? (
              <div className="no-results">
                <p>Try searching for something like "outfits for a rainy day" or "casual party wear"</p>
              </div>
            ) : (
              <TrendingNowSection />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AISearch;