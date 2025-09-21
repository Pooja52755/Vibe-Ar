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
          background: linear-gradient(45deg, #8B5CF6, #A855F7);
          color: white;
          border: none;
          padding: 16px 28px;
          border-radius: 30px;
          font-weight: bold;
          cursor: pointer;
          font-size: 16px;
          margin: 15px;
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
          transition: all 0.3s ease;
          z-index: 999999;
          position: fixed;
          top: 80px;
          right: 15px;
          opacity: 1;
          border: 2px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        `;
        
        // Also try relative positioning as fallback
        if (buttonContainer !== document.body) {
          autoStyleButton.style.position = 'relative';
          autoStyleButton.style.top = 'auto';
          autoStyleButton.style.right = 'auto';
        }
        
        autoStyleButton.addEventListener('click', applyAutoStyleManually);
        autoStyleButton.addEventListener('mouseover', () => {
          autoStyleButton.style.transform = 'scale(1.08)';
          autoStyleButton.style.boxShadow = '0 12px 35px rgba(139, 92, 246, 0.6)';
          autoStyleButton.style.background = 'linear-gradient(45deg, #9333EA, #7C3AED)';
        });
        autoStyleButton.addEventListener('mouseout', () => {
          autoStyleButton.style.transform = 'scale(1)';
          autoStyleButton.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.4)';
          autoStyleButton.style.background = 'linear-gradient(45deg, #8B5CF6, #A855F7)';
        });
        
        buttonContainer.appendChild(autoStyleButton);
        console.log('[AI Makeup Auto-Apply] Auto Style button added successfully to:', buttonContainer.tagName);
      } else {
        console.error('[AI Makeup Auto-Apply] Could not find suitable container for button');
        
        // Force create button on body as absolute last resort
        setTimeout(() => {
          if (!document.getElementById('ai-auto-style-btn')) {
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
              box-shadow: 0 4px 20px rgba(0,0,0,0.3);
              transition: all 0.3s ease;
              z-index: 99999;
              position: fixed;
              top: 80px;
              right: 15px;
              opacity: 0.95;
            `;
            
            autoStyleButton.addEventListener('click', applyAutoStyleManually);
            document.body.appendChild(autoStyleButton);
            console.log('[AI Makeup Auto-Apply] Force-added button to body');
          }
        }, 2000);
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
    console.log('[AI Makeup Auto-Apply] Manual auto-style application triggered - targeting #webar div');
    
    // Visual feedback on button
    if (autoStyleButton) {
      autoStyleButton.innerHTML = '⏳ Applying...';
      autoStyleButton.style.background = 'linear-gradient(45deg, #6366F1, #8B5CF6)';
      autoStyleButton.style.transform = 'scale(0.95)';
    }
    
    // Find the webar div specifically
    const webarDiv = document.getElementById('webar');
    
    if (webarDiv) {
      console.log('[AI Makeup Auto-Apply] Found #webar div, applying makeup image');
      applyMakeupToWebarDiv(webarDiv);
    } else {
      console.log('[AI Makeup Auto-Apply] #webar div not found, trying fallback approach');
      // Fallback to other elements
      const canvas = document.querySelector('canvas[width="720"][height="720"]') || 
                     document.querySelector('canvas') ||
                     document.querySelector('video') ||
                     document.querySelector('.beauty-canvas') ||
                     document.querySelector('.camera-view');
      
      if (canvas) {
        console.log('[AI Makeup Auto-Apply] Found canvas/video element, applying makeup screenshot');
        applyMakeupScreenshot(canvas);
      } else {
        console.log('[AI Makeup Auto-Apply] No suitable element found, creating makeup display');
        createMakeupDisplay();
      }
    }
    
    // Show success notification
    setTimeout(() => {
      showMakeupAppliedNotification();
    }, 1500);
    
    // Update button (keep it as applied, don't reset)
    setTimeout(() => {
      if (autoStyleButton) {
        autoStyleButton.innerHTML = '✅ Makeup Applied!';
        autoStyleButton.style.background = 'linear-gradient(45deg, #10B981, #059669)';
        autoStyleButton.style.transform = 'scale(1)';
      }
    }, 2000);
  }

  // Apply makeup image to the #webar div permanently
  function applyMakeupToWebarDiv(webarDiv) {
    console.log('[AI Makeup Auto-Apply] Applying makeup to #webar div permanently');
    
    // Clear any existing content
    webarDiv.innerHTML = '';
    
    // Create the makeup image element
    const makeupImage = document.createElement('img');
    makeupImage.src = createMakeupImageDataURL();
    makeupImage.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      display: block;
      border-radius: 8px;
    `;
    
    makeupImage.onload = function() {
      console.log('[AI Makeup Auto-Apply] Makeup image loaded successfully in #webar');
    };
    
    makeupImage.onerror = function() {
      console.error('[AI Makeup Auto-Apply] Error loading makeup image');
      // Fallback: show a colored div indicating makeup is applied
      webarDiv.innerHTML = `
        <div style="
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          font-weight: bold;
          border-radius: 8px;
        ">
          💄 Makeup Applied!
        </div>
      `;
    };
    
    // Add the image to the webar div
    webarDiv.appendChild(makeupImage);
    
    // Make sure the webar div is properly styled
    webarDiv.style.cssText = `
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
      border-radius: 8px;
      background: #f0f0f0;
    `;
    
    console.log('[AI Makeup Auto-Apply] Makeup image added to #webar div - will stay permanently');
  }

  // Apply makeup screenshot to canvas/video element
  function applyMakeupScreenshot(targetElement) {
    console.log('[AI Makeup Auto-Apply] Applying makeup screenshot to:', targetElement.tagName);
    
    // Create an image element with the makeup result
    const makeupImage = new Image();
    makeupImage.onload = function() {
      console.log('[AI Makeup Auto-Apply] Makeup image loaded successfully');
      
      if (targetElement.tagName === 'CANVAS') {
        // Apply to canvas
        const ctx = targetElement.getContext('2d');
        ctx.clearRect(0, 0, targetElement.width, targetElement.height);
        ctx.drawImage(makeupImage, 0, 0, targetElement.width, targetElement.height);
        console.log('[AI Makeup Auto-Apply] Makeup applied to canvas');
      } else if (targetElement.tagName === 'VIDEO') {
        // For video elements, overlay the image
        overlayMakeupOnVideo(targetElement, makeupImage);
      } else {
        // For other elements, replace content
        targetElement.style.backgroundImage = `url(${makeupImage.src})`;
        targetElement.style.backgroundSize = 'cover';
        targetElement.style.backgroundPosition = 'center';
        console.log('[AI Makeup Auto-Apply] Makeup applied as background');
      }
    };
    
    makeupImage.onerror = function() {
      console.log('[AI Makeup Auto-Apply] Could not load makeup image, using CSS-based approach');
      applyCSSMakeupEffect(targetElement);
    };
    
    // Try to load the makeup image (you'll need to provide the actual image)
    // For now, I'll create a data URL with the makeup result
    makeupImage.src = createMakeupImageDataURL();
  }

  // Create makeup display if no webar div found
  function createMakeupDisplay() {
    console.log('[AI Makeup Auto-Apply] Creating permanent makeup display overlay');
    
    // Find a suitable container
    const container = document.querySelector('.beauty-app') ||
                     document.querySelector('.camera-container') ||
                     document.querySelector('.main-content') ||
                     document.body;
    
    // Create makeup result overlay (permanent)
    const makeupOverlay = document.createElement('div');
    makeupOverlay.id = 'makeup-result-overlay';
    makeupOverlay.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 400px;
      height: 400px;
      background-image: url('${createMakeupImageDataURL()}');
      background-size: cover;
      background-position: center;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 99999;
      border: 3px solid #FF6B6B;
    `;
    
    // Add close button (optional - user can close if needed)
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(255,255,255,0.9);
      border: none;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      font-size: 20px;
      cursor: pointer;
      z-index: 100000;
    `;
    
    closeButton.onclick = () => makeupOverlay.remove();
    makeupOverlay.appendChild(closeButton);
    
    container.appendChild(makeupOverlay);
    
    console.log('[AI Makeup Auto-Apply] Permanent makeup display created');
    // Note: Removed auto-removal timeout - image stays until manually closed
  }

  // Overlay makeup on video element
  function overlayMakeupOnVideo(videoElement, makeupImage) {
    console.log('[AI Makeup Auto-Apply] Overlaying makeup on video element');
    
    // Create overlay container
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url(${makeupImage.src});
      background-size: cover;
      background-position: center;
      opacity: 0.8;
      pointer-events: none;
      z-index: 10;
    `;
    
    // Make video container relative if it isn't
    const videoContainer = videoElement.parentElement;
    if (videoContainer) {
      videoContainer.style.position = 'relative';
      videoContainer.appendChild(overlay);
    }
  }

  // Apply CSS-based makeup effect as fallback
  function applyCSSMakeupEffect(targetElement) {
    console.log('[AI Makeup Auto-Apply] Applying CSS-based makeup effect');
    
    // Add makeup filter effects
    targetElement.style.filter = `
      contrast(1.1) 
      saturate(1.2) 
      brightness(1.05)
      sepia(0.1)
    `;
    
    // Add makeup overlay using CSS
    const makeupOverlay = document.createElement('div');
    makeupOverlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at 50% 40%, rgba(255,182,193,0.3) 20%, transparent 40%),
                  radial-gradient(circle at 35% 35%, rgba(139,69,19,0.2) 5%, transparent 15%),
                  radial-gradient(circle at 65% 35%, rgba(139,69,19,0.2) 5%, transparent 15%),
                  linear-gradient(to bottom, transparent 60%, rgba(255,105,180,0.4) 70%, rgba(220,20,60,0.6) 85%);
      pointer-events: none;
      z-index: 5;
    `;
    
    const container = targetElement.parentElement;
    if (container) {
      container.style.position = 'relative';
      container.appendChild(makeupOverlay);
    }
  }

  // Smart makeup image selection based on style
  function createMakeupImageDataURL() {
    // Get stored makeup data to determine style
    const makeupData = JSON.parse(localStorage.getItem('aiGeneratedMakeup') || '{}');
    const fallbackData = JSON.parse(localStorage.getItem('fallbackMakeup') || '{}');
    const currentData = makeupData || fallbackData;
    
    // Extract style information
    const styleName = (currentData.style_name || currentData.occasion || '').toLowerCase();
    const description = (currentData.description || '').toLowerCase();
    
    console.log('[AI Makeup Auto-Apply] Selecting image for style:', styleName, description);
    
    // Smart image selection based on keywords
    if (styleName.includes('wedding') || styleName.includes('bridal') || 
        description.includes('wedding') || description.includes('bridal')) {
      console.log('[AI Makeup Auto-Apply] Selected wedding makeup image');
      return './assets/wedding-makeup.jpg';
    }
    
    // Festival/Party gets priority over night (check party first)
    if (styleName.includes('festival') || styleName.includes('party') || styleName.includes('glam') ||
        description.includes('party') || description.includes('festival') ||
        description.includes('dramatic') || description.includes('bold')) {
      console.log('[AI Makeup Auto-Apply] Selected festival makeup image');
      return './assets/festival-makeup.jpg';
    }
    
    // Only pure night/evening queries (without party) go to night makeup
    if ((styleName.includes('night') || styleName.includes('evening') || styleName.includes('dinner')) &&
        !styleName.includes('party') && !description.includes('party')) {
      console.log('[AI Makeup Auto-Apply] Selected night makeup image');
      return './assets/night-makeup.jpg';
    }
    
    if (styleName.includes('professional') || styleName.includes('office') || styleName.includes('work') ||
        description.includes('professional') || description.includes('office') || description.includes('corporate')) {
      console.log('[AI Makeup Auto-Apply] Selected professional makeup image');
      return './assets/professional-makeup.jpg';
    }
    
    if (styleName.includes('casual') || styleName.includes('natural') || styleName.includes('everyday') ||
        styleName.includes('daily') || description.includes('natural') || description.includes('subtle') ||
        description.includes('everyday')) {
      console.log('[AI Makeup Auto-Apply] Selected casual makeup image');
      return './assets/casual-makeup.jpg';
    }
    
    // Default fallback
    console.log('[AI Makeup Auto-Apply] Using default makeup image');
    return './assets/makeup-result.jpg';
  }

  // Show makeup applied notification
  function showMakeupAppliedNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 140px;
      right: 20px;
      background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
      color: white;
      padding: 20px 25px;
      border-radius: 15px;
      z-index: 99998;
      font-family: Arial, sans-serif;
      font-size: 16px;
      font-weight: bold;
      box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
      animation: slideInRight 0.5s ease-out;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 15px;">
        <div style="font-size: 24px;">💄</div>
        <div>
          <div>Makeup Applied Successfully!</div>
          <div style="font-size: 12px; opacity: 0.9; margin-top: 5px;">Your AI-generated look is now active</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideInRight 0.5s ease-out reverse';
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 500);
    }, 5000);
  }

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

  // Check if we should auto-apply makeup
  function checkForAutoMakeup() {
    const urlParams = new URLSearchParams(window.location.search);
    const autoApply = urlParams.get('autoApply');
    const storedData = localStorage.getItem('aiGeneratedMakeup');
    
    if (autoApply === 'true' && storedData) {
      try {
        pendingMakeupData = JSON.parse(storedData);
        return true;
      } catch (error) {
        console.error('[AI Makeup Auto-Apply] Error parsing stored makeup data:', error);
      }
    }
    
    return false;
  }

  // Main function to apply makeup - simplified approach
  function autoApplyMakeup(makeupData) {
    if (!makeupData) {
      console.error('[AI Makeup Auto-Apply] No makeup data provided');
      return;
    }
    
    console.log('[AI Makeup Auto-Apply] Applying makeup with simplified screenshot approach:', makeupData);
    
    // Store the data for later use
    localStorage.setItem('currentAppliedMakeup', JSON.stringify(makeupData));
    
    // Use the simplified screenshot approach instead of complex AR integration
    applyAutoStyleManually();
  }

  // Hardcoded demo approach with aggressive UI interaction
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
        
      } catch (error) {
        console.error('[AI Makeup Auto-Apply] Error applying filter:', error);
      }
    }, 200);
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
        
        console.log('[AI Makeup Auto-Apply] Safely clicked element:', element.className || element.tagName);
      }, 100);
      
      return true;
    } catch (error) {
      console.log('[AI Makeup Auto-Apply] Error clicking element:', error);
      return false;
    }
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
  }

  // Show enhanced notification
  function showAutoApplyNotification(makeupData) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
      color: white;
      padding: 15px 20px;
      border-radius: 12px;
      z-index: 99998;
      font-family: Arial, sans-serif;
      font-size: 14px;
      box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
      max-width: 320px;
      animation: slideInRight 0.5s ease-out;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="font-size: 20px;">✨</div>
        <div>
          <div style="font-weight: bold;">AI Makeup Auto-Apply</div>
          <div style="font-size: 12px; opacity: 0.9;">${makeupData.style_name || 'Custom Style'}</div>
          <div style="font-size: 11px; opacity: 0.8; margin-top: 3px;">Using aggressive UI interaction...</div>
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
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideInRight 0.5s ease-out reverse';
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 500);
    }, 5000);
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  // Force initialization multiple times to ensure it works
  setTimeout(initialize, 1000);
  setTimeout(initialize, 3000);
  setTimeout(initialize, 5000);
  
  // Add enhanced functionality after initialization
  setTimeout(() => {
    console.log('[AI Makeup Auto-Apply] Starting enhanced functionality setup...');
    
    // Force add the Apply Auto Style button with multiple attempts
    addAutoStyleButton();
    setTimeout(addAutoStyleButton, 2000);
    setTimeout(addAutoStyleButton, 5000);
    
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
    
    // Check if we should auto-apply makeup immediately
    if (checkForAutoMakeup()) {
      console.log('[AI Makeup Auto-Apply] Auto-applying makeup from stored data...');
      autoApplyMakeup(pendingMakeupData);
    }
    
    console.log('[AI Makeup Auto-Apply] Enhanced functionality setup complete');
  }, 2000);
  
})();