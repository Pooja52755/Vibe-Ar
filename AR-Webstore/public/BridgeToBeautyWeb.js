/**
 * BridgeToBeautyWeb.js - Connects the simplified mobile UI to original beauty-web functionality
 * 
 * This script creates a bridge between our simplified mobile UI and the original beauty-web 
 * functionality, allowing us to leverage the core AR features while providing a better
 * mobile experience.
 */

(function() {
  // Store references to beauty-web functionality
  let beautyWebModules = {
    effectManager: null,
    videoSource: null,
    renderer: null,
    settings: null
  };
  
  // Configuration for mobile UI
  const config = {
    beautyWebPath: '/beauty-web/',
    assetsPath: '/beauty-web/assets/',
    looksPath: '/beauty-web/assets/looks/',
    thumbnailsPath: '/beauty-web/assets/looks/thumbnails/'
  };
  
  // Function to initialize beauty-web core functionality
  async function initBeautyWebCore() {
    try {
      // Load required scripts
      await loadScript(config.beautyWebPath + 'src/lib.js');
      await loadScript(config.beautyWebPath + 'src/store.js');
      await loadScript(config.beautyWebPath + 'src/app.js');
      
      // Wait for Banuba SDK to be ready
      if (typeof BanubaSDK === 'undefined') {
        await loadScript(config.beautyWebPath + 'assets/BanubaSDK.js');
      }
      
      // Create an invisible container for the beauty-web components
      const hiddenContainer = document.createElement('div');
      hiddenContainer.id = 'beauty-web-core';
      hiddenContainer.style.position = 'absolute';
      hiddenContainer.style.left = '-9999px';
      hiddenContainer.style.visibility = 'hidden';
      document.body.appendChild(hiddenContainer);
      
      // Initialize beauty-web components
      if (window.beautyWeb && window.beautyWeb.init) {
        const result = await window.beautyWeb.init({
          container: hiddenContainer,
          token: 'YOUR_BANUBA_TOKEN', // Use the same token as in the beauty-web app
          hideUI: true, // Hide the original UI
          mobileFriendly: true // Enable mobile optimizations
        });
        
        // Store references to key modules
        beautyWebModules.effectManager = result.effectManager;
        beautyWebModules.videoSource = result.videoSource;
        beautyWebModules.renderer = result.renderer;
        beautyWebModules.settings = result.settings;
        
        // Return the initialization result
        return result;
      } else {
        throw new Error('Beauty Web initialization function not found');
      }
    } catch (error) {
      console.error('Failed to initialize Beauty Web core:', error);
      return null;
    }
  }
  
  // Helper function to load scripts
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  
  // Connect simplified UI buttons to beauty-web functionality
  function connectUIControls() {
    // Look selector
    document.querySelectorAll('.look-item').forEach(item => {
      item.addEventListener('click', function() {
        const lookId = this.getAttribute('data-id');
        if (beautyWebModules.effectManager && lookId) {
          beautyWebModules.effectManager.applyLook(lookId);
        }
      });
    });
    
    // Camera switch button
    const cameraButton = document.getElementById('cameraButton');
    if (cameraButton && beautyWebModules.videoSource) {
      cameraButton.addEventListener('click', function() {
        beautyWebModules.videoSource.switchCamera();
      });
    }
    
    // Capture button
    const captureButton = document.getElementById('captureButton');
    if (captureButton && beautyWebModules.renderer) {
      captureButton.addEventListener('click', function() {
        const canvas = beautyWebModules.renderer.captureFrame();
        if (canvas) {
          // Create a download link for the captured image
          canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'beauty-ar-' + new Date().getTime() + '.png';
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
            }, 100);
          });
        }
      });
    }
    
    // Compare button (before/after)
    const compareButton = document.getElementById('compareButton');
    if (compareButton && beautyWebModules.renderer) {
      let comparing = false;
      compareButton.addEventListener('click', function() {
        comparing = !comparing;
        if (beautyWebModules.effectManager) {
          beautyWebModules.effectManager.toggleComparison(comparing);
        }
      });
    }
    
    // Settings button
    const settingsButton = document.getElementById('settingsButton');
    if (settingsButton && beautyWebModules.settings) {
      settingsButton.addEventListener('click', function() {
        // Create a simple settings panel
        const settingsPanel = document.createElement('div');
        settingsPanel.style.position = 'fixed';
        settingsPanel.style.top = '0';
        settingsPanel.style.left = '0';
        settingsPanel.style.width = '100%';
        settingsPanel.style.height = '100%';
        settingsPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        settingsPanel.style.zIndex = '2000';
        settingsPanel.style.display = 'flex';
        settingsPanel.style.flexDirection = 'column';
        settingsPanel.style.alignItems = 'center';
        settingsPanel.style.justifyContent = 'center';
        settingsPanel.style.padding = '20px';
        settingsPanel.innerHTML = `
          <div style="background-color: #fff; width: 90%; max-width: 400px; border-radius: 10px; padding: 20px;">
            <h2 style="margin-bottom: 20px; text-align: center;">Settings</h2>
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px;">Effect Intensity</label>
              <input type="range" min="0" max="100" value="${beautyWebModules.settings.getIntensity() * 100}" id="intensitySlider" style="width: 100%;">
            </div>
            <button id="closeSettings" style="width: 100%; padding: 10px; background-color: #ff4081; color: white; border: none; border-radius: 5px; font-weight: bold;">Close</button>
          </div>
        `;
        document.body.appendChild(settingsPanel);
        
        // Handle intensity slider
        const intensitySlider = document.getElementById('intensitySlider');
        intensitySlider.addEventListener('input', function() {
          const intensity = this.value / 100;
          beautyWebModules.settings.setIntensity(intensity);
        });
        
        // Close button
        document.getElementById('closeSettings').addEventListener('click', function() {
          document.body.removeChild(settingsPanel);
        });
      });
    }
    
    // Back button
    const backButton = document.getElementById('backButton');
    if (backButton) {
      backButton.addEventListener('click', function() {
        window.location.href = '/';
      });
    }
    
    // Category selector
    document.querySelectorAll('.category').forEach(category => {
      category.addEventListener('click', function() {
        const categoryName = this.textContent.trim().toLowerCase();
        if (beautyWebModules.effectManager) {
          // Filter looks by category
          beautyWebModules.effectManager.filterByCategory(categoryName);
          
          // Update look selector UI
          updateLookSelector(categoryName);
        }
      });
    });
  }
  
  // Update look selector based on category
  function updateLookSelector(category) {
    // This is a simplified version - in a real app you would filter actual looks
    const lookSelector = document.getElementById('lookSelector');
    lookSelector.innerHTML = '';
    
    // Sample filtering logic - would be replaced with actual data
    let filteredLooks = [];
    if (category === 'all') {
      filteredLooks = allLooks;
    } else {
      // Filter looks by category
      filteredLooks = allLooks.filter(look => look.categories.includes(category));
    }
    
    // Create look items
    filteredLooks.forEach((look, index) => {
      const lookItem = document.createElement('div');
      lookItem.className = 'look-item' + (index === 0 ? ' active' : '');
      lookItem.style.backgroundImage = `url(${look.thumbnail})`;
      lookItem.setAttribute('data-id', look.id);
      lookSelector.appendChild(lookItem);
      
      // Add click event
      lookItem.addEventListener('click', function() {
        // Remove active class from all items
        document.querySelectorAll('.look-item').forEach(item => {
          item.classList.remove('active');
        });
        
        // Add active class to clicked item
        this.classList.add('active');
        
        // Apply the look
        if (beautyWebModules.effectManager) {
          beautyWebModules.effectManager.applyLook(look.id);
        }
      });
    });
  }
  
  // Sample look data - would be replaced with data from beauty-web
  const allLooks = [
    { 
      id: 'natural', 
      name: 'Natural', 
      thumbnail: config.thumbnailsPath + 'natural.jpg',
      categories: ['all', 'full looks']
    },
    { 
      id: 'glamour', 
      name: 'Glamour', 
      thumbnail: config.thumbnailsPath + 'glamour.jpg',
      categories: ['all', 'full looks']
    },
    { 
      id: 'bold', 
      name: 'Bold', 
      thumbnail: config.thumbnailsPath + 'bold.jpg',
      categories: ['all', 'lipstick']
    },
    { 
      id: 'soft', 
      name: 'Soft', 
      thumbnail: config.thumbnailsPath + 'soft.jpg',
      categories: ['all', 'eyeshadow']
    }
  ];
  
  // Setup the beauty-web video in our viewer
  function setupVideoViewer() {
    if (beautyWebModules.videoSource && beautyWebModules.renderer) {
      const viewer = document.getElementById('viewer');
      if (viewer) {
        // Clear any existing content
        viewer.innerHTML = '';
        
        // Get the video element from beauty-web
        const videoElement = beautyWebModules.videoSource.getVideoElement();
        if (videoElement) {
          viewer.appendChild(videoElement);
          
          // Style the video to fit the viewer
          videoElement.style.width = '100%';
          videoElement.style.height = '100%';
          videoElement.style.objectFit = 'cover';
        }
        
        // Get the canvas element from beauty-web
        const canvasElement = beautyWebModules.renderer.getCanvas();
        if (canvasElement) {
          viewer.appendChild(canvasElement);
          
          // Style the canvas to overlay the video
          canvasElement.style.position = 'absolute';
          canvasElement.style.top = '0';
          canvasElement.style.left = '0';
          canvasElement.style.width = '100%';
          canvasElement.style.height = '100%';
          canvasElement.style.objectFit = 'cover';
        }
      }
    }
  }
  
  // Main initialization function
  async function init() {
    try {
      // Show loading screen
      const loadingScreen = document.getElementById('loading');
      if (loadingScreen) {
        loadingScreen.style.display = 'flex';
      }
      
      // Initialize beauty-web core
      const beautyWebCore = await initBeautyWebCore();
      
      if (beautyWebCore) {
        // Setup video viewer
        setupVideoViewer();
        
        // Connect UI controls
        connectUIControls();
        
        // Hide loading screen
        if (loadingScreen) {
          loadingScreen.style.display = 'none';
        }
      } else {
        // Show error in loading screen
        if (loadingScreen) {
          loadingScreen.innerHTML = `
            <div style="text-align: center; padding: 20px;">
              <h2 style="color: #ff4081; margin-bottom: 20px;">Failed to Load Beauty AR</h2>
              <p style="margin-bottom: 20px;">There was a problem loading the AR features.</p>
              <button id="retryButton" style="padding: 10px 20px; background-color: #ff4081; color: white; border: none; border-radius: 5px;">Retry</button>
              <button id="backToHomeButton" style="padding: 10px 20px; background-color: #333; color: white; border: none; border-radius: 5px; margin-left: 10px;">Back to Home</button>
            </div>
          `;
          
          // Add retry button handler
          document.getElementById('retryButton').addEventListener('click', function() {
            window.location.reload();
          });
          
          // Add back to home button handler
          document.getElementById('backToHomeButton').addEventListener('click', function() {
            window.location.href = '/';
          });
        }
      }
    } catch (error) {
      console.error('Failed to initialize Beauty AR Bridge:', error);
      
      // Show error message
      const loadingScreen = document.getElementById('loading');
      if (loadingScreen) {
        loadingScreen.innerHTML = `
          <div style="text-align: center; padding: 20px;">
            <h2 style="color: #ff4081; margin-bottom: 20px;">Error</h2>
            <p style="margin-bottom: 20px;">Failed to initialize Beauty AR.</p>
            <p style="margin-bottom: 20px; font-size: 12px; color: #aaa;">${error.message}</p>
            <button onclick="window.location.reload()" style="padding: 10px 20px; background-color: #ff4081; color: white; border: none; border-radius: 5px;">Retry</button>
          </div>
        `;
      }
    }
  }
  
  // Export to window object
  window.beautyARBridge = {
    init: init,
    getBeautyWebModules: function() {
      return beautyWebModules;
    }
  };
  
  // Auto-initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', init);
})();