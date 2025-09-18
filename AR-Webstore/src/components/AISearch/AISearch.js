import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUpload, faTimes, faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import GeminiService from "../../services/GeminiService";
import "./AISearch.css";

const AISearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionText, setSuggestionText] = useState("");
  const [aiExplanation, setAiExplanation] = useState("");
  const fileInputRef = useRef(null);

  // Gemini API key would normally be stored securely
  // For demo purposes, we'll set it directly (in production, use environment variables)
  const GEMINI_API_KEY = "AIzaSyAilrrFYiO9jT62gzfkLfKeubSsiJ7rq4g";

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
    fileInputRef.current.click();
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
        <h1>GenAI-Powered Discovery</h1>
        <p>
          Revolutionize your search with Generative AI. Discover products by describing a "vibe" 
          or abstract aesthetic (e.g., "outfits for a rainy day in Bengaluru") or combine images 
          with text prompts ("Find a similar top, but in a pastel color").
        </p>
      </div>

      <div className="search-box">
        <div className="search-input-container">
          <div className="search-text-input">
            <input
              type="text"
              placeholder="Describe what you're looking for or ask a question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="search-button" onClick={handleSearch}>
              <FontAwesomeIcon icon={faSearch} /> Search
            </button>
          </div>
          
          <div className="example-prompts">
            <p>Try these example searches:</p>
            <div className="example-chips">
              <span className="example-chip" onClick={() => selectExamplePrompt("Outfits for a rainy day in Bengaluru")}>
                Rainy day outfit
              </span>
              <span className="example-chip" onClick={() => selectExamplePrompt("Professional attire for a job interview")}>
                Interview outfit
              </span>
              <span className="example-chip" onClick={() => selectExamplePrompt("Pastel colored sarees for summer")}>
                Pastel sarees
              </span>
              <span className="example-chip" onClick={() => selectExamplePrompt("Find similar sarees but in pastel colors")}>
                Similar in pastel
              </span>
              <span className="example-chip" onClick={() => selectExamplePrompt("Pink saree with elegant design")}>
                Pink saree
              </span>
              <span className="example-chip" onClick={() => selectExamplePrompt("Blue formal shirt with matching accessories")}>
                Complete outfit
              </span>
            </div>
          </div>

          <div className="image-upload-section">
            <p>Upload images to find similar items or combine with your text query:</p>
            <div className="image-help">
              <span>Upload a saree image and search for "similar but in pastel colors" or try with our sample images: </span>
              <a href="/png images/pink_saree.jpg" download>Pink Saree</a>,
              <a href="/png images/blue_shirt.webp" download>Blue Shirt</a>,
              <a href="/png images/pink_shirt.webp" download>Pink Shirt</a>
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
              
              {uploadedImages.length < 3 && (
                <div 
                  className="image-upload-box" 
                  onClick={triggerFileInput}
                >
                  <FontAwesomeIcon icon={faUpload} />
                  <p>Upload Image</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    accept="image/*"
                    multiple={uploadedImages.length === 0}
                  />
                </div>
              )}
            </div>
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
              <div className="example-searches">
                <h3>Discover Products with AI</h3>
                <p>Try these powerful AI search capabilities:</p>
                
                <div className="example-search-section">
                  <h4>Search by Description or Feeling</h4>
                  <p>For example: "Professional outfits for a job interview" or "Casual summer look"</p>
                  <div className="example-search-preview">
                    <img src="/png images/coll2_4.png" alt="Professional outfit" />
                    <img src="/png images/coll1_2.png" alt="Casual outfit" />
                  </div>
                </div>
                
                <div className="example-search-section">
                  <h4>Find Similar Items with Color Variations</h4>
                  <p>Upload images of pink sarees and ask for "similar but in pastel colors"</p>
                  <div className="example-search-preview">
                    <div className="search-flow">
                      <div className="image-group">
                        <img src="/png images/pink_saree.jpg" alt="Pink saree" className="smaller-preview" />
                        <div className="image-label">Pink Saree</div>
                      </div>
                      <span className="plus-icon">+</span>
                      <div className="example-prompt">"Find similar sarees but in pastel colors"</div>
                      <span className="arrow-icon">→</span>
                      <div className="results-group">
                        <img src="/png images/green.jpg" alt="Pastel green saree" className="smaller-preview" />
                        <img src="/png images/pastel_pink_saree.webp" alt="Pastel pink saree" className="smaller-preview" />
                        <div className="image-label">Pastel Color Sarees</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="example-search-section">
                  <h4>Get AI-Powered Outfit Suggestions</h4>
                  <p>Search for an item and receive AI suggestions for complementary products</p>
                  <div className="example-search-preview">
                    <div className="search-flow">
                      <div className="example-prompt">"Pink saree for wedding"</div>
                      <span className="arrow-icon">→</span>
                      <div className="results-group">
                        <img src="/png images/pink_saree.jpg" alt="Pink saree" className="smaller-preview" />
                        <div className="image-label">Search Results</div>
                      </div>
                      <span className="plus-icon">+</span>
                      <div className="results-group">
                        <img src="/png images/coll4_2.png" alt="Matching jewelry" className="smaller-preview" />
                        <div className="image-label">AI Suggestions</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="example-search-section">
                  <h4>Search for a Specific Occasion</h4>
                  <p>Try "Outfits for a rainy day in Bengaluru" or "Wedding guest attire"</p>
                </div>
                
                <div className="example-search-section">
                  <h4>Find Sarees by Color</h4>
                  <p>Try "Pink silk saree" or "Pastel green saree for wedding"</p>
                  <div className="example-search-preview">
                    <div className="search-flow">
                      <div className="example-prompt">"Pink silk saree"</div>
                      <span className="arrow-icon">→</span>
                      <img src="/png images/pink_saree.jpg" alt="Pink saree" className="smaller-preview" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AISearch;