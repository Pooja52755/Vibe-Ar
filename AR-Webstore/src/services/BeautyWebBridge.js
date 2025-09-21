/**
 * BeautyWebBridge.js
 * Bridge component to connect AI-generated makeup styles with Banuba Beauty Web
 * This component handles the communication and automatic filter application
 */

class BeautyWebBridge {
  constructor() {
    this.beautyWebWindow = null;
    this.pendingMakeupData = null;
    this.isConnected = false;
    
    // Listen for messages from Beauty Web
    window.addEventListener('message', this.handleMessage.bind(this));
    
    // Prefab mapping for Banuba filters
    this.banubaFilterMapping = {
      lipstick: {
        property: 'Lips',
        colorProperty: 'color',
        opacityProperty: 'alpha'
      },
      eyeshadow: {
        property: 'Eyes',
        colorProperty: 'color',
        opacityProperty: 'alpha'
      },
      eyeliner: {
        property: 'Eyeliner', 
        colorProperty: 'color',
        opacityProperty: 'alpha'
      },
      blush: {
        property: 'Blush',
        colorProperty: 'color',
        opacityProperty: 'alpha'
      },
      highlighter: {
        property: 'Highlighter',
        colorProperty: 'color',
        opacityProperty: 'alpha'
      },
      foundation: {
        property: 'Foundation',
        colorProperty: 'color',
        opacityProperty: 'alpha'
      }
    };
  }

  /**
   * Open Beauty Web with AI-generated makeup data
   * @param {Object} makeupData - The AI-generated makeup style
   */
  async openBeautyWebWithMakeup(makeupData) {
    try {
      console.log('[BeautyWebBridge] Opening Beauty Web with makeup data:', makeupData);
      
      // Store makeup data for when Beauty Web is ready
      this.pendingMakeupData = makeupData;
      
      // Add fallback hardcoded makeup for demo reliability
      const fallbackMakeup = {
        lipstick: { color: "#FF6B6B", opacity: 0.8 },
        eyeshadow: { color: "#8B4B9B", opacity: 0.6 },
        eyeliner: { color: "#2C3E50", opacity: 0.9 },
        blush: { color: "#FFB6C1", opacity: 0.5 }
      };
      
      // Store both original and fallback data
      localStorage.setItem('aiGeneratedMakeup', JSON.stringify(makeupData || fallbackMakeup));
      localStorage.setItem('fallbackMakeup', JSON.stringify(fallbackMakeup));
      localStorage.setItem('autoApplyMakeup', 'true');
      
      // Construct Beauty Web URL with better error handling
      let beautyWebUrl = `${window.location.origin}/beauty-web/index.html#`;
      console.log('[BeautyWebBridge] Constructed Beauty Web URL:', beautyWebUrl);
      
      // Open Beauty Web in a new tab
      console.log('[BeautyWebBridge] Opening Beauty Web window...');
      this.beautyWebWindow = window.open(beautyWebUrl, '_blank');
      
      if (!this.beautyWebWindow) {
        // Try alternative URLs if the first one fails
        const alternativeUrls = [
          `${window.location.origin}/public/beauty-web/index.html#`,
          `./beauty-web/index.html#`,
          `/beauty-web/index.html#`
        ];
        
        for (const altUrl of alternativeUrls) {
          console.log('[BeautyWebBridge] Trying alternative URL:', altUrl);
          this.beautyWebWindow = window.open(altUrl, '_blank');
          if (this.beautyWebWindow) {
            beautyWebUrl = altUrl;
            console.log('[BeautyWebBridge] Success with alternative URL:', altUrl);
            break;
          }
        }
        
        if (!this.beautyWebWindow) {
          throw new Error('Failed to open Beauty Web window - popup blocked or URL not accessible');
        }
      }
      
      // Set up periodic check to see if Beauty Web is ready
      this.checkBeautyWebReady();
      
      console.log('[BeautyWebBridge] Beauty Web window opened successfully');
      return true;
    } catch (error) {
      console.error('[BeautyWebBridge] Error opening Beauty Web:', error);
      alert(`Error opening Beauty Web: ${error.message}\n\nPlease check if the Beauty Web application is accessible.`);
      return false;
    }
  }

  /**
   * Check if Beauty Web is ready to receive makeup data
   */
  checkBeautyWebReady() {
    const checkInterval = setInterval(() => {
      if (this.beautyWebWindow && !this.beautyWebWindow.closed) {
        try {
          // Try to communicate with Beauty Web
          this.beautyWebWindow.postMessage({
            type: 'CHECK_READY',
            source: 'AI_STYLER'
          }, '*');
        } catch (error) {
          console.log('[BeautyWebBridge] Beauty Web not ready yet...');
        }
      } else {
        clearInterval(checkInterval);
        this.beautyWebWindow = null;
      }
    }, 1000);

    // Stop checking after 30 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
    }, 30000);
  }

  /**
   * Handle messages from Beauty Web
   * @param {MessageEvent} event - The message event
   */
  handleMessage(event) {
    if (event.data && event.data.source === 'BEAUTY_WEB') {
      switch (event.data.type) {
        case 'READY':
          console.log('[BeautyWebBridge] Beauty Web is ready!');
          this.isConnected = true;
          if (this.pendingMakeupData) {
            this.sendMakeupData(this.pendingMakeupData);
          }
          break;
          
        case 'MAKEUP_APPLIED':
          console.log('[BeautyWebBridge] Makeup successfully applied!');
          break;
          
        case 'ERROR':
          console.error('[BeautyWebBridge] Error from Beauty Web:', event.data.error);
          break;
          
        default:
          console.log('[BeautyWebBridge] Unknown message type:', event.data.type);
          break;
      }
    }
  }

  /**
   * Send makeup data to Beauty Web
   * @param {Object} makeupData - The makeup style data
   */
  sendMakeupData(makeupData) {
    if (this.beautyWebWindow && !this.beautyWebWindow.closed) {
      console.log('[BeautyWebBridge] Sending makeup data to Beauty Web:', makeupData);
      
      // Convert AI makeup data to Banuba-compatible format
      const banubaFilters = this.convertToBanubaFormat(makeupData);
      
      this.beautyWebWindow.postMessage({
        type: 'APPLY_AI_MAKEUP',
        source: 'AI_STYLER',
        makeupData: makeupData,
        banubaFilters: banubaFilters
      }, '*');
    }
  }

  /**
   * Convert AI makeup data to Banuba-compatible filter format
   * @param {Object} makeupData - The AI-generated makeup data
   * @returns {Array} Array of Banuba filter configurations
   */
  convertToBanubaFormat(makeupData) {
    const banubaFilters = [];
    
    if (makeupData.makeup_filters) {
      Object.entries(makeupData.makeup_filters).forEach(([filterType, filterData]) => {
        const mapping = this.banubaFilterMapping[filterType];
        if (mapping && filterData.color) {
          banubaFilters.push({
            type: filterType,
            property: mapping.property,
            color: this.hexToRgb(filterData.color),
            hex: filterData.color,
            opacity: filterData.opacity || 0.7,
            alpha: filterData.opacity || 0.7,
            finish: filterData.finish || 'natural',
            style: filterData.style || 'natural'
          });
        }
      });
    }
    
    return banubaFilters;
  }

  /**
   * Convert hex color to RGB
   * @param {string} hex - Hex color code
   * @returns {Object} RGB color object
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16), 
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * Create hardcoded demo for hackathon presentation
   * @param {Object} makeupData - The makeup data
   */
  createHardcodedDemo(makeupData) {
    // Store the makeup data for Beauty Web to pick up
    const demoConfig = {
      ...makeupData,
      autoApply: true,
      demoMode: true,
      presetFilters: [
        {
          type: 'lipstick',
          color: makeupData.makeup_filters?.lipstick?.color || '#D2527F',
          opacity: makeupData.makeup_filters?.lipstick?.opacity || 0.8
        },
        {
          type: 'eyeshadow',
          color: makeupData.makeup_filters?.eyeshadow?.primary_color || '#F4C2C2',
          opacity: makeupData.makeup_filters?.eyeshadow?.opacity || 0.7
        },
        {
          type: 'blush',
          color: makeupData.makeup_filters?.blush?.color || '#E8A5A5',
          opacity: makeupData.makeup_filters?.blush?.opacity || 0.6
        }
      ]
    };
    
    localStorage.setItem('aiMakeupDemo', JSON.stringify(demoConfig));
    localStorage.setItem('enableAutoMakeup', 'true');
    
    return demoConfig;
  }

  /**
   * Generate hardcoded makeup for specific styles (for demo purposes)
   * @param {string} styleName - The style name
   * @returns {Object} Hardcoded makeup configuration
   */
  getHardcodedMakeupForStyle(styleName) {
    const hardcodedStyles = {
      'wedding': {
        lipstick: { color: '#D2527F', opacity: 0.8 },
        eyeshadow: { color: '#F4C2C2', opacity: 0.7 },
        blush: { color: '#E8A5A5', opacity: 0.6 },
        highlighter: { color: '#F9E79F', opacity: 0.5 }
      },
      'party': {
        lipstick: { color: '#B22222', opacity: 0.9 },
        eyeshadow: { color: '#4B0082', opacity: 0.8 },
        blush: { color: '#FF6347', opacity: 0.7 },
        highlighter: { color: '#FFE5B4', opacity: 0.7 }
      },
      'natural': {
        lipstick: { color: '#F8C8DC', opacity: 0.5 },
        eyeshadow: { color: '#F5DEB3', opacity: 0.4 },
        blush: { color: '#FFB6C1', opacity: 0.4 },
        highlighter: { color: '#FFF8DC', opacity: 0.3 }
      }
    };

    const style = styleName.toLowerCase();
    for (const [key, config] of Object.entries(hardcodedStyles)) {
      if (style.includes(key)) {
        return config;
      }
    }
    
    return hardcodedStyles.natural; // default
  }
}

// Create a global instance
window.BeautyWebBridge = window.BeautyWebBridge || new BeautyWebBridge();

export default window.BeautyWebBridge;