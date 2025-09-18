/**
 * LooksAndPresetsFix.js
 * This script specifically fixes issues with selecting looks, presets
 * and other makeup collections in the Beauty AR application.
 */

(function() {
  // Run after DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Wait for app to initialize
    setTimeout(initLooksAndPresetsFixes, 2000);
  });
  
  function initLooksAndPresetsFixes() {
    console.log("Initializing Looks and Presets fixes");
    
    // Fix looks section
    fixLooksSection();
    
    // Fix presets section
    fixPresetsSection();
    
    // Fix all collection items
    fixCollectionItems();
    
    // Set up periodic checking for new elements
    setInterval(ensureFixesApplied, 3000);
  }
  
  function fixLooksSection() {
    // Find looks section by ID, class or data attribute
    const looksSection = document.querySelector('#looks, .looks, [data-section="looks"]');
    
    if (looksSection) {
      console.log("Fixing looks section");
      
      // Make section visible
      looksSection.style.display = 'block';
      
      // Find all look items
      const lookItems = looksSection.querySelectorAll('.look-item, .panel-block');
      
      lookItems.forEach(item => {
        // Make item visible and clickable
        item.style.display = 'block';
        item.style.pointerEvents = 'auto';
        item.style.opacity = '1';
        item.style.cursor = 'pointer';
        
        // Add click handler if not already present
        if (!item.dataset.lookFixed) {
          item.addEventListener('click', function(e) {
            // Get look name
            const lookName = item.dataset.look || item.textContent.trim();
            console.log(`Look clicked: ${lookName}`);
            
            // Update active state
            lookItems.forEach(otherItem => {
              otherItem.classList.remove('is-active');
            });
            item.classList.add('is-active');
            
            // Apply the look if possible
            if (window.applyLook) {
              window.applyLook(lookName);
            } else {
              // Try alternative methods to apply the look
              tryApplyLook(lookName);
            }
            
            // Prevent default if it's a link
            e.preventDefault();
            return false;
          });
          
          // Mark as fixed
          item.dataset.lookFixed = 'true';
        }
      });
    }
  }
  
  function fixPresetsSection() {
    // Find presets section by ID, class or data attribute
    const presetsSection = document.querySelector('#presets, .presets, [data-section="presets"]');
    
    if (presetsSection) {
      console.log("Fixing presets section");
      
      // Make section visible
      presetsSection.style.display = 'block';
      
      // Find all preset items
      const presetItems = presetsSection.querySelectorAll('.preset-item, .panel-block');
      
      presetItems.forEach(item => {
        // Make item visible and clickable
        item.style.display = 'block';
        item.style.pointerEvents = 'auto';
        item.style.opacity = '1';
        item.style.cursor = 'pointer';
        
        // Add click handler if not already present
        if (!item.dataset.presetFixed) {
          item.addEventListener('click', function(e) {
            // Get preset name
            const presetName = item.dataset.preset || item.textContent.trim();
            console.log(`Preset clicked: ${presetName}`);
            
            // Update active state
            presetItems.forEach(otherItem => {
              otherItem.classList.remove('is-active');
            });
            item.classList.add('is-active');
            
            // Apply the preset if possible
            if (window.applyPreset) {
              window.applyPreset(presetName);
            } else {
              // Try alternative methods to apply the preset
              tryApplyPreset(presetName);
            }
            
            // Prevent default if it's a link
            e.preventDefault();
            return false;
          });
          
          // Mark as fixed
          item.dataset.presetFixed = 'true';
        }
      });
    }
  }
  
  function fixCollectionItems() {
    // Find all collection sections (likely contains multiple looks/presets)
    const collectionSections = document.querySelectorAll('.collection, .looks-collection, .presets-collection');
    
    collectionSections.forEach(section => {
      console.log("Fixing collection section");
      
      // Make section visible
      section.style.display = 'block';
      
      // Find all collection items
      const items = section.querySelectorAll('.collection-item, .panel-block, .card');
      
      items.forEach(item => {
        // Make item visible and clickable
        item.style.display = 'block';
        item.style.pointerEvents = 'auto';
        item.style.opacity = '1';
        item.style.cursor = 'pointer';
        
        // Add click handler if not already present
        if (!item.dataset.collectionFixed) {
          item.addEventListener('click', function(e) {
            // Get item name
            const itemName = item.dataset.item || item.textContent.trim();
            console.log(`Collection item clicked: ${itemName}`);
            
            // Update active state
            items.forEach(otherItem => {
              otherItem.classList.remove('is-active');
            });
            item.classList.add('is-active');
            
            // Apply the item if possible
            tryApplyCollectionItem(item);
            
            // Prevent default if it's a link
            e.preventDefault();
            return false;
          });
          
          // Mark as fixed
          item.dataset.collectionFixed = 'true';
        }
      });
    });
  }
  
  function tryApplyLook(lookName) {
    // Try different methods to apply a look
    
    // Method 1: Look for specific function in global scope
    if (typeof window.selectLook === 'function') {
      window.selectLook(lookName);
      return;
    }
    
    // Method 2: Try to find and click the look's image or button
    const lookElement = document.querySelector(`[data-look="${lookName}"], .look-item:contains("${lookName}")`);
    if (lookElement) {
      // Find images or buttons inside
      const clickables = lookElement.querySelectorAll('img, button');
      if (clickables.length > 0) {
        clickables.forEach(el => el.click());
        return;
      }
    }
    
    // Method 3: Look for apply button and click it
    const applyButton = document.querySelector('.apply-button, .apply-look');
    if (applyButton) {
      applyButton.click();
    }
  }
  
  function tryApplyPreset(presetName) {
    // Try different methods to apply a preset
    
    // Method 1: Look for specific function in global scope
    if (typeof window.selectPreset === 'function') {
      window.selectPreset(presetName);
      return;
    }
    
    // Method 2: Try to find and click the preset's image or button
    const presetElement = document.querySelector(`[data-preset="${presetName}"], .preset-item:contains("${presetName}")`);
    if (presetElement) {
      // Find images or buttons inside
      const clickables = presetElement.querySelectorAll('img, button');
      if (clickables.length > 0) {
        clickables.forEach(el => el.click());
        return;
      }
    }
    
    // Method 3: Look for apply button and click it
    const applyButton = document.querySelector('.apply-button, .apply-preset');
    if (applyButton) {
      applyButton.click();
    }
  }
  
  function tryApplyCollectionItem(item) {
    // Check if item has an image
    const image = item.querySelector('img');
    if (image) {
      // Simulate click on the image
      image.click();
    }
    
    // Check if item has a button
    const button = item.querySelector('button, .button');
    if (button) {
      // Click the button
      button.click();
    }
    
    // Try clicking any links inside
    const links = item.querySelectorAll('a');
    if (links.length > 0) {
      // Click the first link
      links[0].click();
    }
    
    // If no clickable elements found, try to trigger a custom event
    if (!image && !button && links.length === 0) {
      // Create and dispatch a custom event
      const event = new CustomEvent('itemSelected', { 
        detail: { 
          item: item,
          name: item.dataset.item || item.textContent.trim()
        },
        bubbles: true 
      });
      item.dispatchEvent(event);
    }
  }
  
  function ensureFixesApplied() {
    // Re-apply fixes to catch any dynamically added elements
    fixLooksSection();
    fixPresetsSection();
    fixCollectionItems();
    
    // Additionally, make sure all panels are visible
    const panels = document.querySelectorAll('.panel');
    panels.forEach(panel => {
      const blocks = panel.querySelectorAll('.panel-block');
      if (blocks.length > 0) {
        blocks.forEach(block => {
          block.style.display = 'block';
          block.style.pointerEvents = 'auto';
          block.style.opacity = '1';
          block.style.cursor = 'pointer';
        });
      }
    });
  }
})();