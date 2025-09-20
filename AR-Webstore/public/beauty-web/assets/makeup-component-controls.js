/**
 * makeup-component-controls.js
 * 
 * This script adds direct controls for individual makeup components
 * allowing fine-tuned adjustment of lipstick, eyebrows, etc.
 */

(function() {
  console.log('[MakeupComponentControls] Initializing...');
  
  // Initialize when the document is ready
  document.addEventListener('DOMContentLoaded', initialize);
  window.addEventListener('load', initialize);
  
  // Try immediate initialization
  if (document.readyState !== 'loading') {
    initialize();
  }
  
  /**
   * Initialize the component controls
   */
  function initialize() {
    console.log('[MakeupComponentControls] Creating component controls panel');
    
    // Create the component controls panel
    createComponentPanel();
    
    // Check periodically to ensure the panel is available
    setInterval(ensurePanelVisible, 5000);
  }
  
  /**
   * Create the component controls panel
   */
  function createComponentPanel() {
    // Remove any existing panel
    const existingPanel = document.getElementById('makeup-component-panel');
    if (existingPanel) {
      existingPanel.parentNode.removeChild(existingPanel);
    }
    
    // Create the panel container
    const panel = document.createElement('div');
    panel.id = 'makeup-component-panel';
    panel.style.cssText = `
      position: fixed;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      background-color: rgba(255, 255, 255, 0.9);
      border-radius: 10px 0 0 10px;
      box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
      padding: 10px;
      z-index: 9999;
      transition: right 0.3s ease;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-height: 80vh;
      overflow-y: auto;
    `;
    
    // Create a toggle button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '🖌️';
    toggleButton.style.cssText = `
      position: absolute;
      left: -40px;
      top: 50%;
      transform: translateY(-50%);
      width: 40px;
      height: 40px;
      background-color: #6200ee;
      color: white;
      border: none;
      border-radius: 10px 0 0 10px;
      font-size: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    // Add toggle functionality
    let isPanelOpen = false;
    toggleButton.onclick = function() {
      isPanelOpen = !isPanelOpen;
      panel.style.right = isPanelOpen ? '0' : '-250px';
    };
    
    // Start with panel closed
    panel.style.right = '-250px';
    
    // Add the toggle button to the panel
    panel.appendChild(toggleButton);
    
    // Add title
    const title = document.createElement('h3');
    title.textContent = 'Makeup Components';
    title.style.cssText = `
      margin: 0 0 10px 0;
      color: #333;
      font-size: 16px;
      text-align: center;
      font-weight: bold;
    `;
    panel.appendChild(title);
    
    // Add component sliders
    const components = [
      { id: 'lipstick', name: 'Lipstick 💋' },
      { id: 'eyebrows', name: 'Eyebrows 🧿' },
      { id: 'eyeshadow', name: 'Eyeshadow 👁️' },
      { id: 'foundation', name: 'Foundation 🧴' },
      { id: 'blush', name: 'Blush 🍑' },
      { id: 'contour', name: 'Contour 🔲' },
      { id: 'highlighter', name: 'Highlighter ✨' }
    ];
    
    components.forEach(component => {
      const componentContainer = document.createElement('div');
      componentContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 5px;
        width: 200px;
      `;
      
      // Component label
      const label = document.createElement('label');
      label.textContent = component.name;
      label.style.cssText = `
        font-size: 14px;
        color: #333;
      `;
      componentContainer.appendChild(label);
      
      // Slider container with value display
      const sliderContainer = document.createElement('div');
      sliderContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
      `;
      
      // Slider
      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = '0';
      slider.max = '100';
      slider.value = '0';
      slider.style.cssText = `
        flex: 1;
      `;
      
      // Value display
      const valueDisplay = document.createElement('span');
      valueDisplay.textContent = '0';
      valueDisplay.style.cssText = `
        width: 30px;
        text-align: center;
        font-size: 14px;
        color: #333;
      `;
      
      // Update value display and apply component when slider changes
      slider.oninput = function() {
        const value = parseInt(this.value);
        valueDisplay.textContent = value;
        
        // Apply the component with appropriate intensity
        if (window.MakeupComponentEnforcer && window.MakeupComponentEnforcer.enforceComponentApplication) {
          window.MakeupComponentEnforcer.enforceComponentApplication(component.id, value / 100);
        }
      };
      
      sliderContainer.appendChild(slider);
      sliderContainer.appendChild(valueDisplay);
      componentContainer.appendChild(sliderContainer);
      
      // Add to panel
      panel.appendChild(componentContainer);
    });
    
    // Apply All button
    const applyButton = document.createElement('button');
    applyButton.textContent = 'Apply All';
    applyButton.style.cssText = `
      margin-top: 10px;
      padding: 8px;
      background-color: #6200ee;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 14px;
      cursor: pointer;
    `;
    
    // Handle apply button click
    applyButton.onclick = function() {
      // Get all slider values
      const componentValues = {};
      
      components.forEach(component => {
        const slider = panel.querySelector(`input[type="range"]`);
        if (slider) {
          const value = parseInt(slider.value);
          if (value > 0) {
            componentValues[component.id] = value / 100;
          }
        }
      });
      
      // Apply all non-zero components
      if (window.MakeupComponentEnforcer && window.MakeupComponentEnforcer.applyMakeupComponents) {
        window.MakeupComponentEnforcer.applyMakeupComponents(componentValues);
      }
    };
    
    panel.appendChild(applyButton);
    
    // Reset button
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.style.cssText = `
      margin-top: 5px;
      padding: 8px;
      background-color: #f44336;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 14px;
      cursor: pointer;
    `;
    
    // Handle reset button click
    resetButton.onclick = function() {
      // Reset all sliders
      panel.querySelectorAll('input[type="range"]').forEach(slider => {
        slider.value = 0;
        slider.dispatchEvent(new Event('input'));
      });
    };
    
    panel.appendChild(resetButton);
    
    // Add the panel to the document
    document.body.appendChild(panel);
  }
  
  /**
   * Ensure the panel is visible
   */
  function ensurePanelVisible() {
    if (!document.getElementById('makeup-component-panel')) {
      createComponentPanel();
    }
  }
})();