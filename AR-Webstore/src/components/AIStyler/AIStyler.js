import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPaintBrush, 
  faWandMagicSparkles, 
  faStar,
  faMicrophone,
  faMicrophoneSlash,
  faEye,
  faHeart,
  faPalette
} from "@fortawesome/free-solid-svg-icons";
import GeminiService from "../../services/GeminiService";
import BeautyWebBridge from "../../services/BeautyWebBridge";
import "./AIStyler.css";

const AIStyler = () => {
  const [styleQuery, setStyleQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMakeup, setGeneratedMakeup] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef(null);

  // Gemini API key
  const GEMINI_API_KEY = "AIzaSyAilrrFYiO9jT62gzfkLfKeubSsiJ7rq4g";

  // Initialize voice recognition
  React.useEffect(() => {
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
        };
        
        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setStyleQuery(transcript);
        };
        
        recognitionRef.current.onerror = (event) => {
          setIsListening(false);
          console.error('Voice recognition error:', event.error);
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  // Voice search functionality
  const startVoiceInput = () => {
    if (!voiceSupported) return;

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    try {
      recognitionRef.current?.start();
    } catch (error) {
      console.error('Could not start voice recognition:', error);
    }
  };

  // Generate AI makeup recommendations
  const generateMakeupStyle = async () => {
    if (!styleQuery.trim()) return;

    setIsGenerating(true);
    
    try {
      GeminiService.setApiKey(GEMINI_API_KEY);
      
      const prompt = `
        Create a detailed makeup style for: "${styleQuery}"
        
        Please provide a JSON response with the following structure:
        {
          "style_name": "Name of the makeup style",
          "description": "Brief description of the look",
          "makeup_filters": {
            "lipstick": {
              "color": "#hex_color",
              "opacity": 0.8,
              "finish": "matte/glossy/satin"
            },
            "eyeshadow": {
              "primary_color": "#hex_color",
              "secondary_color": "#hex_color",
              "opacity": 0.7,
              "style": "smokey/natural/dramatic"
            },
            "eyeliner": {
              "color": "#hex_color",
              "thickness": "thin/medium/thick",
              "style": "winged/straight/smokey"
            },
            "blush": {
              "color": "#hex_color",
              "opacity": 0.6,
              "placement": "cheeks/apples/sculpted"
            },
            "highlighter": {
              "color": "#hex_color",
              "opacity": 0.5,
              "areas": ["cheekbones", "nose", "brow_bone"]
            },
            "foundation": {
              "coverage": "light/medium/full",
              "finish": "natural/matte/dewy"
            }
          },
          "occasion": "wedding/party/casual/professional/etc",
          "tips": ["tip1", "tip2", "tip3"]
        }
        
        Make sure all hex colors are valid and appropriate for the requested style.
      `;

      const response = await GeminiService.generateMakeupStyle(prompt);
      setGeneratedMakeup(response);
      
    } catch (error) {
      console.error("Error generating makeup style:", error);
      // Fallback to hardcoded styles for demo
      generateFallbackStyle();
    } finally {
      setIsGenerating(false);
    }
  };

  // Fallback styles for demo purposes
  const generateFallbackStyle = () => {
    const fallbackStyles = {
      "wedding makeup": {
        style_name: "Classic Bridal Elegance",
        description: "Timeless and elegant bridal makeup with soft pink tones",
        makeup_filters: {
          lipstick: { color: "#D2527F", opacity: 0.8, finish: "satin" },
          eyeshadow: { primary_color: "#F4C2C2", secondary_color: "#D4A574", opacity: 0.7, style: "natural" },
          eyeliner: { color: "#2C1810", thickness: "medium", style: "winged" },
          blush: { color: "#E8A5A5", opacity: 0.6, placement: "apples" },
          highlighter: { color: "#F9E79F", opacity: 0.5, areas: ["cheekbones", "nose", "brow_bone"] },
          foundation: { coverage: "medium", finish: "dewy" }
        },
        occasion: "wedding",
        tips: ["Use primer for longevity", "Set with powder", "Use waterproof mascara"]
      },
      "party makeup": {
        style_name: "Glamorous Night Out",
        description: "Bold and dramatic makeup perfect for parties and nights out",
        makeup_filters: {
          lipstick: { color: "#B22222", opacity: 0.9, finish: "matte" },
          eyeshadow: { primary_color: "#4B0082", secondary_color: "#FFD700", opacity: 0.8, style: "dramatic" },
          eyeliner: { color: "#000000", thickness: "thick", style: "winged" },
          blush: { color: "#FF6347", opacity: 0.7, placement: "sculpted" },
          highlighter: { color: "#FFE5B4", opacity: 0.7, areas: ["cheekbones", "nose", "brow_bone"] },
          foundation: { coverage: "full", finish: "matte" }
        },
        occasion: "party",
        tips: ["Use setting spray", "Build colors gradually", "Don't forget to blend"]
      },
      "natural makeup": {
        style_name: "Effortless Natural Glow",
        description: "Fresh and natural makeup for everyday wear",
        makeup_filters: {
          lipstick: { color: "#F8C8DC", opacity: 0.5, finish: "glossy" },
          eyeshadow: { primary_color: "#F5DEB3", secondary_color: "#DEB887", opacity: 0.4, style: "natural" },
          eyeliner: { color: "#8B4513", thickness: "thin", style: "straight" },
          blush: { color: "#FFB6C1", opacity: 0.4, placement: "apples" },
          highlighter: { color: "#FFF8DC", opacity: 0.3, areas: ["cheekbones", "nose"] },
          foundation: { coverage: "light", finish: "natural" }
        },
        occasion: "casual",
        tips: ["Less is more", "Focus on skin prep", "Use cream products for natural finish"]
      }
    };

    // Find the closest match
    const queryLower = styleQuery.toLowerCase();
    let selectedStyle = null;

    for (const [key, style] of Object.entries(fallbackStyles)) {
      if (queryLower.includes(key.split(' ')[0])) {
        selectedStyle = style;
        break;
      }
    }

    if (!selectedStyle) {
      selectedStyle = fallbackStyles["natural makeup"];
    }

    setGeneratedMakeup(selectedStyle);
  };

  // Apply makeup to beauty web
  const applyToBeautyWeb = () => {
    if (!generatedMakeup) return;

    // Use the BeautyWebBridge to open Beauty Web with the makeup data
    BeautyWebBridge.openBeautyWebWithMakeup(generatedMakeup);
    
    // Also create hardcoded demo for backup
    BeautyWebBridge.createHardcodedDemo(generatedMakeup);
  };

  // Quick style suggestions
  const quickStyles = [
    { text: "Wedding makeup", icon: faStar },
    { text: "Party night look", icon: faPalette },
    { text: "Natural everyday", icon: faEye },
    { text: "Date night glam", icon: faHeart },
    { text: "Professional look", icon: faPaintBrush },
    { text: "Festival makeup", icon: faWandMagicSparkles }
  ];

  return (
    <div className="ai-styler-container">
      <div className="ai-styler-header">
        <h2>
          <FontAwesomeIcon icon={faWandMagicSparkles} className="header-icon" />
          AI Makeup Styler
        </h2>
        <p>Describe your desired makeup look and get AI-powered beauty recommendations</p>
      </div>

      <div className="style-input-section">
        <div className="input-container">
          <input
            type="text"
            placeholder="Describe your makeup style (e.g., 'wedding makeup', 'party night look')"
            value={styleQuery}
            onChange={(e) => setStyleQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && generateMakeupStyle()}
            className="style-input"
          />
          <div className="input-buttons">
            {voiceSupported && (
              <button 
                className={`voice-btn ${isListening ? 'listening' : ''}`}
                onClick={startVoiceInput}
                title="Voice input"
              >
                <FontAwesomeIcon 
                  icon={isListening ? faMicrophoneSlash : faMicrophone} 
                />
              </button>
            )}
            <button 
              className="generate-btn"
              onClick={generateMakeupStyle}
              disabled={isGenerating || !styleQuery.trim()}
            >
              {isGenerating ? (
                <>
                  <div className="spinner-small"></div>
                  Generating...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faWandMagicSparkles} />
                  Generate Style
                </>
              )}
            </button>
          </div>
        </div>

        <div className="quick-styles">
          <p>Quick suggestions:</p>
          <div className="style-chips">
            {quickStyles.map((style, index) => (
              <button 
                key={index}
                className="style-chip"
                onClick={() => setStyleQuery(style.text)}
              >
                <FontAwesomeIcon icon={style.icon} />
                {style.text}
              </button>
            ))}
          </div>
        </div>
      </div>

      {generatedMakeup && (
        <div className="generated-makeup-container">
          <div className="makeup-preview">
            <h3>{generatedMakeup.style_name}</h3>
            <p className="style-description">{generatedMakeup.description}</p>
            
            <div className="makeup-details">
              <div className="makeup-filters-grid">
                {Object.entries(generatedMakeup.makeup_filters).map(([key, filter]) => (
                  <div key={key} className="filter-card">
                    <div className="filter-header">
                      <span className="filter-name">{key.replace('_', ' ')}</span>
                      {filter.color && (
                        <div 
                          className="color-swatch" 
                          style={{ backgroundColor: filter.color }}
                        ></div>
                      )}
                    </div>
                    <div className="filter-details">
                      {filter.color && <span>Color: {filter.color}</span>}
                      {filter.opacity && <span>Opacity: {Math.round(filter.opacity * 100)}%</span>}
                      {filter.finish && <span>Finish: {filter.finish}</span>}
                      {filter.style && <span>Style: {filter.style}</span>}
                      {filter.thickness && <span>Thickness: {filter.thickness}</span>}
                      {filter.coverage && <span>Coverage: {filter.coverage}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="makeup-tips">
              <h4>Professional Tips:</h4>
              <ul>
                {generatedMakeup.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>

            <div className="action-buttons">
              <button className="apply-makeup-btn" onClick={applyToBeautyWeb}>
                <FontAwesomeIcon icon={faPaintBrush} />
                Try This Look in Beauty AR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIStyler;