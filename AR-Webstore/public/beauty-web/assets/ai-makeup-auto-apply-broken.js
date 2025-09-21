/**
 * AI Makeup Auto-Apply for Beauty Web
 * This script automatically applies AI-generated makeup when Beauty Web loads
 * and adds an "Apply Auto Style" button for manual application
 */

(function() {
  'use strict';
  
  console.log('[AI Makeup Auto-Apply] Initializing...');
  
  let isInitialized = false;
  let pendingMakeupData = null;
  let autoStyleButton = null;
  
  // Initialize the auto-apply system
  function initialize() {
    if (isInitialized) return;
    
    console.log('[AI Makeup Auto-Apply] Initializing system...');
    
    // Check for auto-apply on page load
    if (checkForAutoMakeup()) {
      console.log('[AI Makeup Auto-Apply] Auto-applying makeup on page load...');
      autoApplyMakeup(pendingMakeupData);
    }
    
    isInitialized = true;
  }
  
  // Add "Apply Auto Style" button to the UI
  function addAutoStyleButton() {
    console.log('[AI Makeup Auto-Apply] Attempting to add Auto Style button...');
    
    // Remove any existing button first
    const existingButton = document.getElementById('ai-auto-style-btn');
    if (existingButton) {
      existingButton.remove();
    }
    
    // Wait for the Beauty Web UI to load
    setTimeout(() => {
      // Try multiple placement strategies
      const possibleContainers = [
        document.querySelector('.controls'),
        document.querySelector('.beauty-controls'),
        document.querySelector('.menu'),
        document.querySelector('.ui-controls'),
        document.querySelector('.action-buttons'),
        document.querySelector('.toolbar'),
        document.querySelector('header'),
        document.querySelector('.header'),
        document.querySelector('.top-bar'),
        document.querySelector('nav'),
        document.body
      ];
      
      let buttonContainer = null;
      for (const container of possibleContainers) {
        if (container) {
          buttonContainer = container;
          console.log('[AI Makeup Auto-Apply] Found container:', container.className || container.tagName);
          break;
        }
      }
      
      if (buttonContainer) {
        autoStyleButton = document.createElement('button');
        autoStyleButton.id = 'ai-auto-style-btn';
        autoStyleButton.innerHTML = '✨ Apply Auto Style';
        autoStyleButton.style.cssText = `
          background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
          color: white;
          border: none;
          padding: 15px 25px;
          border-radius: 25px;
          font-weight: bold;
          cursor: pointer;
          font-size: 16px;
          margin: 10px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
          z-index: 99999;
          position: fixed;
          top: 20px;
          right: 20px;
          opacity: 0.95;
        `;
        
        // Also try relative positioning as fallback
        if (buttonContainer !== document.body) {
          autoStyleButton.style.position = 'relative';
          autoStyleButton.style.top = 'auto';
          autoStyleButton.style.right = 'auto';
        }
        
        autoStyleButton.addEventListener('click', applyAutoStyleManually);
        autoStyleButton.addEventListener('mouseover', () => {
          autoStyleButton.style.transform = 'scale(1.05)';
          autoStyleButton.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
        });
        autoStyleButton.addEventListener('mouseout', () => {
          autoStyleButton.style.transform = 'scale(1)';
          autoStyleButton.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        });
        
        buttonContainer.appendChild(autoStyleButton);
        console.log('[AI Makeup Auto-Apply] Auto Style button added successfully to:', buttonContainer.tagName);
      } else {
        console.error('[AI Makeup Auto-Apply] Could not find suitable container for button');
      }
    }, 1000);
    
    // Also try again after a longer delay in case UI loads slowly
    setTimeout(() => {
      if (!document.getElementById('ai-auto-style-btn')) {
        console.log('[AI Makeup Auto-Apply] Retrying button placement...');
        addAutoStyleButton();
      }
    }, 5000);
  }
  
  // Handle manual "Apply Auto Style" button click
  function applyAutoStyleManually() {
    console.log('[AI Makeup Auto-Apply] Manual auto-style application triggered');
    
    // Check for stored makeup data
    const makeupData = localStorage.getItem('aiGeneratedMakeup');
    const fallbackData = localStorage.getItem('fallbackMakeup');
    
    let dataToApply = null;
    
    if (makeupData) {
      try {
        dataToApply = JSON.parse(makeupData);
        console.log('[AI Makeup Auto-Apply] Using AI-generated makeup data');
      } catch (error) {
        console.error('[AI Makeup Auto-Apply] Error parsing AI makeup data:', error);
      }
    }
    
    if (!dataToApply && fallbackData) {
      try {
        dataToApply = JSON.parse(fallbackData);
        console.log('[AI Makeup Auto-Apply] Using fallback makeup data');
      } catch (error) {
        console.error('[AI Makeup Auto-Apply] Error parsing fallback data:', error);
      }
    }
    
    if (!dataToApply) {
      // Ultimate fallback - hardcoded demo makeup
      dataToApply = {
        lipstick: { color: "#FF6B6B", opacity: 0.8 },
        eyeshadow: { color: "#8B4B9B", opacity: 0.6 },
        eyeliner: { color: "#2C3E50", opacity: 0.9 },
        blush: { color: "#FFB6C1", opacity: 0.5 },
        style_name: "Glamorous Look"
      };
      console.log('[AI Makeup Auto-Apply] Using ultimate fallback makeup');
    }
    
    // Apply the makeup
    autoApplyMakeup(dataToApply);
    
    // Provide user feedback
    if (autoStyleButton) {
      const originalText = autoStyleButton.innerHTML;
      autoStyleButton.innerHTML = '✅ Applied!';
      autoStyleButton.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
      
      setTimeout(() => {
        autoStyleButton.innerHTML = originalText;
        autoStyleButton.style.background = 'linear-gradient(45deg, #FF6B6B, #4ECDC4)';
      }, 2000);
    }
  }
  
  // Check if we should auto-apply makeup
  function checkForAutoMakeup() {
    const autoApply = localStorage.getItem('autoApplyMakeup');
    const makeupData = localStorage.getItem('aiGeneratedMakeup');
    const demoData = localStorage.getItem('aiMakeupDemo');
    
    if (autoApply === 'true' && (makeupData || demoData)) {
      console.log('[AI Makeup Auto-Apply] Found auto-apply makeup data');
      
      try {
        const parsedData = makeupData ? JSON.parse(makeupData) : JSON.parse(demoData);
        pendingMakeupData = parsedData;
        
        // Clear the flags to prevent repeated application
        localStorage.removeItem('autoApplyMakeup');
        
        return true;
      } catch (error) {
        console.error('[AI Makeup Auto-Apply] Error parsing makeup data:', error);
      }
    }
    
    return false;
  }
  
  // Apply makeup filters automatically
  function autoApplyMakeup(makeupData) {
    console.log('[AI Makeup Auto-Apply] Applying makeup:', makeupData);
    
    try {
      // Method 1: Try to use existing Beauty Web functions
      if (window.beautifyParams && window.banubaPlayer) {
        applyWithBeautifyParams(makeupData);
      }
      // Method 2: Try to use Banuba SDK directly
      else if (window.BanubaSDK) {
        applyWithBanubaSDK(makeupData);
      }
      // Method 3: Use hardcoded demo approach
      else {
        applyHardcodedDemo(makeupData);
      }
    } catch (error) {
      console.error('[AI Makeup Auto-Apply] Error applying makeup:', error);
      // Fallback to hardcoded demo
      applyHardcodedDemo(makeupData);
    }
  }
  
  // Apply using Beauty Web's beautifyParams (if available)
  function applyWithBeautifyParams(makeupData) {
    console.log('[AI Makeup Auto-Apply] Applying with beautifyParams');
    
    if (makeupData.makeup_filters) {
      Object.entries(makeupData.makeup_filters).forEach(([filterType, filterData]) => {
        if (filterData.color && filterData.opacity) {
          const rgb = hexToRgb(filterData.color);
          if (rgb) {
            updateBeautyParam(filterType, rgb, filterData.opacity);
          }
        }
      });
    }
    
    // Trigger beauty update if function exists
    if (window.updateBeautyFilters) {
      window.updateBeautyFilters();
    }
  }
  
  // Apply using Banuba SDK directly
  function applyWithBanubaSDK(makeupData) {
    console.log('[AI Makeup Auto-Apply] Applying with Banuba SDK');
    
    // This would use the prefab-based approach mentioned in requirements
    if (window.BanubaSDK && window.BanubaSDK.updatePrefab) {
      const prefabConfig = convertToPrefabFormat(makeupData);
      window.BanubaSDK.updatePrefab(prefabConfig);
    }
  }
  
  // Hardcoded demo approach for hackathon
  function applyHardcodedDemo(makeupData) {
    console.log('[AI Makeup Auto-Apply] Applying hardcoded demo with aggressive UI interaction');
    
    // Wait for Beauty Web to be fully loaded
    setTimeout(() => {
      // First try aggressive filter application
      aggressiveFilterApplication(makeupData);
      
      // Then simulate clicking on makeup filters based on the generated data
      const filtersToApply = getHardcodedFilters(makeupData);
      
      filtersToApply.forEach((filter, index) => {
        setTimeout(() => {
          applyHardcodedFilter(filter);
        }, index * 800); // Longer stagger for better UI interaction
      });
      
      // Try to activate any available makeup presets
      setTimeout(() => {
        activateAnyMakeupPreset();
      }, 3000);
      
      // Show success notification
      showAutoApplyNotification(makeupData);
    }, 2000);
  }

  // Aggressive filter application - try every possible UI interaction
  function aggressiveFilterApplication(makeupData) {
    console.log('[AI Makeup Auto-Apply] Starting aggressive filter application');
    
    // Step 1: Force click all possible makeup sections
    const sectionTexts = ['Lipstick', 'Eyes', 'Makeup', 'Face', 'Beauty', 'Filters'];
    sectionTexts.forEach((text, index) => {
      setTimeout(() => {
        clickElementByText(text);
      }, index * 200);
    });
    
    // Step 2: Click any visible filter/preset elements
    setTimeout(() => {
      const clickableSelectors = [
        '.filter-item', '.preset-item', '.makeup-item', '.beauty-filter',
        '[data-filter]', '[data-preset]', '.effect-item', '.look-item',
        'button[class*="filter"]', 'div[class*="preset"]', '.thumbnail',
        '[role="button"]', '.clickable', '.selectable'
      ];
      
      clickableSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, i) => {
          if (i < 3) { // Limit to first 3 to avoid overwhelming
            setTimeout(() => {
              clickElementSafely(el);
            }, i * 100);
          }
        });
      });
    }, 1500);
    
    // Step 3: Try to activate specific makeup features
    setTimeout(() => {
      activateSpecificMakeupFeatures(makeupData);
    }, 2500);
  }

  // Activate any available makeup presets
  function activateAnyMakeupPreset() {
    console.log('[AI Makeup Auto-Apply] Trying to activate any makeup preset');
    
    // Look for preset thumbnails or buttons
    const presetSelectors = [
      '.preset-thumbnail', '.look-thumbnail', '.makeup-preset',
      '[data-look]', '[data-style]', '.style-preset',
      '.makeup-look', '.beauty-look', '.filter-preset'
    ];
    
    for (const selector of presetSelectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        // Click the first available preset
        clickElementSafely(elements[0]);
        console.log('[AI Makeup Auto-Apply] Activated preset:', selector);
        break;
      }
    }
  }

  // Click element by text content
  function clickElementByText(text) {
    const elements = Array.from(document.querySelectorAll('*')).filter(el => 
      el.textContent && el.textContent.trim().toLowerCase().includes(text.toLowerCase()) &&
      (el.tagName === 'BUTTON' || el.tagName === 'DIV' || el.tagName === 'SPAN' || el.tagName === 'A') &&
      el.offsetParent !== null // Visible element
    );
    
    if (elements.length > 0) {
      clickElementSafely(elements[0]);
      console.log('[AI Makeup Auto-Apply] Clicked element with text:', text);
      return true;
    }
    return false;
  }

  // Safe element clicking with multiple event types
  function clickElementSafely(element) {
    if (!element) return false;
    
    try {
      // Scroll element into view first
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Try multiple click events
      setTimeout(() => {
        if (element.click) element.click();
        element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        
        // For touch devices
        element.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));
        element.dispatchEvent(new TouchEvent('touchend', { bubbles: true }));
        
        console.log('[AI Makeup Auto-Apply] Safely clicked element:', element.className || element.tagName);
      }, 100);
      
      return true;
    } catch (error) {
      console.log('[AI Makeup Auto-Apply] Error clicking element:', error);
      return false;
    }
  }

  // Activate specific makeup features based on data
  function activateSpecificMakeupFeatures(makeupData) {
    console.log('[AI Makeup Auto-Apply] Activating specific makeup features');
    
    // Try to find and activate features mentioned in makeup data
    if (makeupData.lips || makeupData.lipstick) {
      clickElementByText('lip');
      clickElementByText('lipstick');
    }
    
    if (makeupData.eyes || makeupData.eyeshadow) {
      clickElementByText('eye');
      clickElementByText('eyeshadow');
    }
    
    if (makeupData.face || makeupData.foundation) {
      clickElementByText('face');
      clickElementByText('foundation');
    }
    
    // Try to find color-related elements and apply colors
    if (makeupData.colors && Array.isArray(makeupData.colors)) {
      makeupData.colors.forEach((color, index) => {
        setTimeout(() => {
          applyColorToInterface(color);
        }, index * 300);
      });
    }
  }

  // Apply color to any color picker interface
  function applyColorToInterface(color) {
    const colorInputs = document.querySelectorAll('input[type="color"]');
    const colorElements = document.querySelectorAll('.color-picker, .color-swatch, [data-color]');
    
    colorInputs.forEach(input => {
      input.value = color;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    // Find color swatches that match or are similar to the target color
    colorElements.forEach(element => {
      const elementColor = element.style.backgroundColor || element.dataset.color;
      if (elementColor && isColorSimilar(elementColor, color)) {
        clickElementSafely(element);
      }
    });
  }

  // Check if two colors are similar (basic implementation)
  function isColorSimilar(color1, color2) {
    // Simple color similarity check
    return color1.toLowerCase().includes(color2.toLowerCase().substring(1, 4)) ||
           color2.toLowerCase().includes(color1.toLowerCase().substring(1, 4));
  }
  
  // Get hardcoded filters based on makeup data
  function getHardcodedFilters(makeupData) {
    const filters = [];
    
    // Determine the style type
    const styleName = makeupData.style_name || makeupData.occasion || 'natural';
    
    if (styleName.toLowerCase().includes('wedding') || styleName.toLowerCase().includes('bridal')) {
      filters.push(
        { type: 'lipstick', color: '#D2527F', name: 'Romantic Pink' },
        { type: 'eyeshadow', color: '#F4C2C2', name: 'Soft Rose' },
        { type: 'blush', color: '#E8A5A5', name: 'Bridal Glow' }
      );
    } else if (styleName.toLowerCase().includes('party') || styleName.toLowerCase().includes('glam')) {
      filters.push(
        { type: 'lipstick', color: '#B22222', name: 'Bold Red' },
        { type: 'eyeshadow', color: '#4B0082', name: 'Smokey Purple' },
        { type: 'blush', color: '#FF6347', name: 'Vibrant Coral' }
      );
    } else {
      // Natural/everyday look
      filters.push(
        { type: 'lipstick', color: '#F8C8DC', name: 'Natural Pink' },
        { type: 'eyeshadow', color: '#F5DEB3', name: 'Neutral Beige' },
        { type: 'blush', color: '#FFB6C1', name: 'Soft Peach' }
      );
    }
    
    return filters;
  }
  
  // Apply a single hardcoded filter with enhanced methods
  function applyHardcodedFilter(filter) {
    console.log('[AI Makeup Auto-Apply] Applying filter with enhanced methods:', filter);
    
    // Multi-approach strategy for better success rate
    setTimeout(() => {
      try {
        // Approach 1: Navigate to the correct section and apply filters
        navigateToMakeupSection(filter.type);
        
        // Approach 2: Try direct filter activation
        setTimeout(() => {
          applySpecificFilter(filter);
        }, 500);
        
        // Approach 3: Try aggressive DOM search and click
        setTimeout(() => {
          aggressiveFilterSearch(filter);
        }, 1000);
        
        // Approach 4: Try SDK-based application
        setTimeout(() => {
          applyViaBanubaSDK(filter);
        }, 1500);
        
      } catch (error) {
        console.error('[AI Makeup Auto-Apply] Error applying filter:', error);
      }
    }, 200);
  }

  // Aggressive filter search - try to find any element related to the filter
  function aggressiveFilterSearch(filter) {
    console.log('[AI Makeup Auto-Apply] Aggressive search for filter:', filter.type);
    
    // Search for elements containing filter type keywords
    const keywords = [filter.type, filter.name, filter.color];
    const searchTerms = keywords.concat([
      filter.type.replace('stick', ''),
      filter.type.replace('shadow', ''),
      filter.type.substring(0, 4) // First 4 chars
    ]);
    
    searchTerms.forEach(term => {
      if (!term) return;
      
      // Search in various attributes and text content
      const selectors = [
        `[data-filter*="${term}"]`,
        `[data-preset*="${term}"]`,
        `[class*="${term}"]`,
        `[id*="${term}"]`,
        `[title*="${term}"]`,
        `[alt*="${term}"]`
      ];
      
      selectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach((el, index) => {
            if (index < 2) { // Limit to first 2 matches
              setTimeout(() => {
                clickElementSafely(el);
              }, index * 200);
            }
          });
        } catch (e) {
          // Continue with other selectors
        }
      });
      
      // Search by text content
      setTimeout(() => {
        clickElementByText(term);
      }, 300);
    });
    
    // Also try to click any visible thumbnails or preview images
    setTimeout(() => {
      const thumbnails = document.querySelectorAll('.thumbnail, .preview, .sample, img[src*="makeup"], img[src*="filter"]');
      thumbnails.forEach((thumb, index) => {
        if (index < 3) { // Limit to first 3
          setTimeout(() => {
            clickElementSafely(thumb);
          }, index * 150);
        }
      });
    }, 500);
  }
  
  // Navigate to the appropriate makeup section
  function navigateToMakeupSection(filterType) {
    console.log('[AI Makeup Auto-Apply] Navigating to section for:', filterType);
    
    // Map filter types to sections
    const sectionMapping = {
      'lipstick': 'Lipstick',
      'eyeshadow': 'Eyes', 
      'eyeliner': 'Eyes',
      'blush': 'Makeup',
      'foundation': 'Makeup'
    };
    
    const targetSection = sectionMapping[filterType] || 'Makeup';
    
    // Try to find and click the section button
    const sectionSelectors = [
      `[data-section="${targetSection}"]`,
      `[aria-label="${targetSection}"]`,
      `button:contains("${targetSection}")`,
      `.section-${targetSection.toLowerCase()}`,
      `div:contains("${targetSection}")`,
      `span:contains("${targetSection}")`
    ];
    
    for (const selector of sectionSelectors) {
      try {
        let element;
        if (selector.includes(':contains')) {
          // Custom contains selector
          const text = selector.match(/contains\("([^"]+)"\)/)[1];
          element = Array.from(document.querySelectorAll('*')).find(el => 
            el.textContent && el.textContent.trim() === text && 
            (el.tagName === 'BUTTON' || el.tagName === 'DIV' || el.tagName === 'SPAN')
          );
        } else {
          element = document.querySelector(selector);
        }
        
        if (element && element.click) {
          console.log('[AI Makeup Auto-Apply] Clicking section:', targetSection);
          element.click();
          return true;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    console.log('[AI Makeup Auto-Apply] Could not find section button for:', targetSection);
    return false;
  }
  
  // Apply specific filter within a section
  function applySpecificFilter(filter) {
    console.log('[AI Makeup Auto-Apply] Applying specific filter:', filter.type, filter.color);
    
    // Approach 1: Try to find and activate filter presets
    const presetSelectors = [
      `[data-preset*="${filter.type}"]`,
      `[data-filter="${filter.type}"]`,
      `.preset-${filter.type}`,
      `.filter-${filter.type}`,
      `[title*="${filter.name}"]`,
      `[aria-label*="${filter.name}"]`
    ];
    
    for (const selector of presetSelectors) {
      const element = document.querySelector(selector);
      if (element && element.click) {
        console.log('[AI Makeup Auto-Apply] Activated preset:', selector);
        element.click();
        break;
      }
    }
    
    // Approach 2: Try to set color and intensity directly
    setTimeout(() => {
      setFilterColorAndIntensity(filter);
    }, 300);
    
    // Approach 3: Try SDK integration
    setTimeout(() => {
      applyViaBanubaSDK(filter);
    }, 600);
  }
  
  // Set filter color and intensity
  function setFilterColorAndIntensity(filter) {
    // Try to find color picker or sliders
    const colorInputs = document.querySelectorAll('input[type="color"], .color-picker, .color-input');
    const sliders = document.querySelectorAll('input[type="range"], .slider, .intensity-slider');
    
    // Set color if color picker found
    colorInputs.forEach(input => {
      if (input.type === 'color') {
        input.value = filter.color;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.dispatchEvent(new Event('input', { bubbles: true }));
        console.log('[AI Makeup Auto-Apply] Set color to:', filter.color);
      }
    });
    
    // Set intensity to medium-high (0.7)
    sliders.forEach(slider => {
      if (slider.type === 'range') {
        const max = parseFloat(slider.max) || 100;
        const min = parseFloat(slider.min) || 0;
        slider.value = min + (max - min) * 0.7;
        slider.dispatchEvent(new Event('change', { bubbles: true }));
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        console.log('[AI Makeup Auto-Apply] Set intensity to:', slider.value);
      }
    });
  }
  
  // Apply via Banuba SDK
  function applyViaBanubaSDK(filter) {
    try {
      // Try different SDK approaches
      if (window.banubaPlayer) {
        // Method 1: Direct player API
        if (window.banubaPlayer.setFilter) {
          window.banubaPlayer.setFilter(filter.type, {
            color: filter.color,
            alpha: 0.7
          });
          console.log('[AI Makeup Auto-Apply] Applied via banubaPlayer.setFilter');
        }
        
        // Method 2: evalJs if available
        if (window.banubaPlayer.evalJs) {
          const jsCode = `
            Player.getInstance().setFilterParameter("${filter.type}", "color", "${filter.color}");
            Player.getInstance().setFilterParameter("${filter.type}", "alpha", 0.7);
          `;
          window.banubaPlayer.evalJs(jsCode);
          console.log('[AI Makeup Auto-Apply] Applied via evalJs');
        }
      }
      
      // Method 3: Global SDK
      if (window.BanubaSDK && window.BanubaSDK.setFilter) {
        window.BanubaSDK.setFilter(filter.type, {
          color: filter.color,
          alpha: 0.7
        });
        console.log('[AI Makeup Auto-Apply] Applied via BanubaSDK.setFilter');
      }
      
      // Method 4: Try window.Player if available
      if (window.Player && window.Player.evalJs) {
        const jsCode = `
          if (typeof setMakeupParameter !== 'undefined') {
            setMakeupParameter('${filter.type}', 'color', '${filter.color}');
            setMakeupParameter('${filter.type}', 'alpha', 0.7);
          }
        `;
        window.Player.evalJs(jsCode);
        console.log('[AI Makeup Auto-Apply] Applied via Player.evalJs');
      }
      
    } catch (error) {
      console.error('[AI Makeup Auto-Apply] SDK application error:', error);
    }
  }
  
  // Update beauty parameter (helper function)
  function updateBeautyParam(filterType, rgb, opacity) {
    if (window.beautifyParams) {
      const paramKey = getBeautyParamKey(filterType);
      if (paramKey && window.beautifyParams[paramKey]) {
        window.beautifyParams[paramKey].color = rgb;
        window.beautifyParams[paramKey].alpha = opacity;
      }
    }
  }
  
  // Get beauty parameter key for filter type
  function getBeautyParamKey(filterType) {
    const mapping = {
      'lipstick': 'lips',
      'eyeshadow': 'eyes',
      'eyeliner': 'eyeliner',
      'blush': 'blush',
      'highlighter': 'highlighter',
      'foundation': 'foundation'
    };
    return mapping[filterType];
  }
  
  // Convert to prefab format for Banuba SDK
  function convertToPrefabFormat(makeupData) {
    const prefabConfig = {};
    
    if (makeupData.makeup_filters) {
      Object.entries(makeupData.makeup_filters).forEach(([filterType, filterData]) => {
        prefabConfig[filterType] = {
          color: hexToRgb(filterData.color),
          alpha: filterData.opacity || 0.7,
          enabled: true
        };
      });
    }
    
    return prefabConfig;
  }
  
  // Convert hex to RGB
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  
  // Show notification that makeup was auto-applied
  function showAutoApplyNotification(makeupData) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
      color: white;
      padding: 15px 20px;
      border-radius: 12px;
      z-index: 10000;
      font-family: Arial, sans-serif;
      font-size: 14px;
      box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
      max-width: 320px;
      animation: slideInRight 0.5s ease-out;
    `;
    
    // Check if any makeup features were detected/applied
    const appliedFeatures = detectAppliedFeatures();
    const statusMessage = appliedFeatures.length > 0 
      ? `Applied ${appliedFeatures.length} makeup features`
      : 'Attempting to apply makeup filters...';
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="font-size: 20px;">✨</div>
        <div>
          <div style="font-weight: bold;">AI Makeup Auto-Apply</div>
          <div style="font-size: 12px; opacity: 0.9;">${makeupData.style_name || 'Custom Style'}</div>
          <div style="font-size: 11px; opacity: 0.8; margin-top: 3px;">${statusMessage}</div>
          ${appliedFeatures.length > 0 ? 
            `<div style="font-size: 10px; opacity: 0.7; margin-top: 2px;">Features: ${appliedFeatures.join(', ')}</div>` : 
            '<div style="font-size: 10px; opacity: 0.7; margin-top: 2px;">Using aggressive UI interaction...</div>'
          }
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add animation styles
    if (!document.getElementById('auto-apply-styles')) {
      const style = document.createElement('style');
      style.id = 'auto-apply-styles';
      style.textContent = `
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Auto-remove after 7 seconds (longer to show more detail)
    setTimeout(() => {
      notification.style.animation = 'slideInRight 0.5s ease-out reverse';
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 500);
    }, 7000);
  }

  // Detect what makeup features are currently applied
  function detectAppliedFeatures() {
    const features = [];
    
    // Check for active/selected makeup elements
    const activeSelectors = [
      '.active[data-filter]',
      '.selected[data-preset]', 
      '.applied[data-effect]',
      '[data-state="active"]',
      '.filter-active',
      '.preset-selected'
    ];
    
    activeSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        const feature = el.dataset.filter || el.dataset.preset || el.dataset.effect || 'makeup';
        if (feature && !features.includes(feature)) {
          features.push(feature);
        }
      });
    });
    
    // Check for visible makeup UI elements that might indicate active filters
    const uiIndicators = [
      '.lipstick-active', '.eyeshadow-active', '.blush-active',
      '[class*="lip"][class*="active"]', 
      '[class*="eye"][class*="active"]',
      '[class*="face"][class*="active"]'
    ];
    
    uiIndicators.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        const featureType = selector.includes('lip') ? 'lipstick' : 
                           selector.includes('eye') ? 'eyeshadow' : 'makeup';
        if (!features.includes(featureType)) {
          features.push(featureType);
        }
      }
    });
    
    console.log('[AI Makeup Auto-Apply] Detected selected features:', features);
    return features;
  }
    
    document.body.appendChild(notification);
    
    // Add animation styles
    if (!document.getElementById('auto-apply-styles')) {
      const style = document.createElement('style');
      style.id = 'auto-apply-styles';
      style.textContent = `
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Auto-remove after 7 seconds (longer to show more detail)
    setTimeout(() => {
      notification.style.animation = 'slideInRight 0.5s ease-out reverse';
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 500);
    }, 7000);
  }
  
  // Initialize the auto-apply system
  function initialize() {
    if (isInitialized) return;
    
    console.log('[AI Makeup Auto-Apply] Checking for auto-apply conditions...');
    
    if (checkForAutoMakeup()) {
      console.log('[AI Makeup Auto-Apply] Auto-apply enabled, waiting for Beauty Web to load...');
      
      // Wait for Beauty Web to be fully loaded
      const checkLoaded = setInterval(() => {
        if (document.readyState === 'complete' && 
            (window.banubaPlayer || window.BanubaSDK || document.querySelector('canvas'))) {
          clearInterval(checkLoaded);
          console.log('[AI Makeup Auto-Apply] Beauty Web loaded, applying makeup...');
          autoApplyMakeup(pendingMakeupData);
        }
      }, 1000);
      
      // Timeout after 15 seconds
      setTimeout(() => {
        clearInterval(checkLoaded);
        if (pendingMakeupData) {
          console.log('[AI Makeup Auto-Apply] Timeout reached, applying hardcoded demo...');
          applyHardcodedDemo(pendingMakeupData);
        }
      }, 15000);
    }
    
    // Listen for messages from AI Styler
    window.addEventListener('message', function(event) {
      if (event.data && event.data.source === 'AI_STYLER') {
        switch (event.data.type) {
          case 'CHECK_READY':
            // Respond that Beauty Web is ready
            event.source.postMessage({
              type: 'READY',
              source: 'BEAUTY_WEB'
            }, '*');
            break;
            
          case 'APPLY_AI_MAKEUP':
            console.log('[AI Makeup Auto-Apply] Received makeup data from AI Styler');
            autoApplyMakeup(event.data.makeupData);
            break;
        }
      }
    });
    
    isInitialized = true;
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  // Also initialize after a short delay to ensure all scripts are loaded
  setTimeout(initialize, 2000);
  
  // Add enhanced functionality after initialization
  setTimeout(() => {
    // Add the Apply Auto Style button
    addAutoStyleButton();
    
    // Set up enhanced message handling
    window.addEventListener('message', function(event) {
      if (event.data && event.data.source === 'AI_STYLER') {
        switch (event.data.type) {
          case 'AI_MAKEUP_DATA':
            console.log('[AI Makeup Auto-Apply] Received AI makeup data:', event.data.makeupData);
            localStorage.setItem('aiGeneratedMakeup', JSON.stringify(event.data.makeupData));
            autoApplyMakeup(event.data.makeupData);
            break;
            
          case 'APPLY_AI_MAKEUP':
            console.log('[AI Makeup Auto-Apply] Received makeup data from AI Styler');
            autoApplyMakeup(event.data.makeupData);
            break;
        }
      }
    });
  }, 3000);
  
})();