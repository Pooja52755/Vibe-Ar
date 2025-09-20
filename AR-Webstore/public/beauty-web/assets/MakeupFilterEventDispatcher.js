/**
 * MakeupFilterEventDispatcher.js - Dispatches events when makeup filters are applied
 */

(function() {
  console.log('[MakeupFilterEventDispatcher] Initializing...');
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', init);
  
  // For immediate execution if already loaded
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  }
  
  // Store for applied filters
  let appliedFilters = [];
  
  /**
   * Initialize the filter event dispatcher
   */
  function init() {
    console.log('[MakeupFilterEventDispatcher] Setting up...');
    
    // Set up interval to check for Store and setup listeners
    const storeCheckInterval = setInterval(() => {
      if (window.Store) {
        console.log('[MakeupFilterEventDispatcher] Store found, setting up listeners...');
        setupStoreListeners();
        clearInterval(storeCheckInterval);
      }
    }, 500);
    
    // Hook into existing makeup functions if available
    hookIntoExistingFunctions();
  }
  
  /**
   * Set up listeners for the Store changes
   */
  function setupStoreListeners() {
    // Listen for lipstick changes
    window.Store.on('lipstick:changed', (data) => {
      if (data.enabled) {
        const filterInfo = {
          type: 'lipstick',
          color: data.color || '#FF0000',
          intensity: data.value || 1.0
        };
        
        updateAppliedFilter(filterInfo);
        dispatchFilterAppliedEvent(filterInfo);
      } else {
        removeAppliedFilter('lipstick');
      }
    });
    
    // Listen for eye makeup changes
    window.Store.on('eyes-makeup:changed', (name, data) => {
      if (data.enabled) {
        const filterInfo = {
          type: name === 'eyeshadow' ? 'eyeshadow' : 'eyeliner',
          color: data.color || '#000000',
          intensity: data.value || 1.0
        };
        
        updateAppliedFilter(filterInfo);
        dispatchFilterAppliedEvent(filterInfo);
      } else {
        removeAppliedFilter(name === 'eyeshadow' ? 'eyeshadow' : 'eyeliner');
      }
    });
    
    // Listen for face makeup changes
    window.Store.on('face-makeup:changed', (name, data) => {
      if (data.enabled && name === 'blush') {
        const filterInfo = {
          type: 'blush',
          color: data.color || '#FF6B6B',
          intensity: data.value || 1.0
        };
        
        updateAppliedFilter(filterInfo);
        dispatchFilterAppliedEvent(filterInfo);
      } else if (name === 'blush') {
        removeAppliedFilter('blush');
      }
    });
    
    // Listen for foundation changes
    window.Store.on('foundation:changed', (data) => {
      if (data.enabled) {
        const filterInfo = {
          type: 'foundation',
          color: data.color || '#FFCBA4',
          intensity: data.value || 0.5
        };
        
        updateAppliedFilter(filterInfo);
        dispatchFilterAppliedEvent(filterInfo);
      } else {
        removeAppliedFilter('foundation');
      }
    });
    
    // Listen for complete look changes
    window.Store.on('look:changed', (lookData) => {
      console.log('[MakeupFilterEventDispatcher] Look changed:', lookData);
      
      // Reset filters
      appliedFilters = [];
      
      // Check for lipstick
      if (lookData.lipstick && lookData.lipstick.enabled) {
        updateAppliedFilter({
          type: 'lipstick',
          color: lookData.lipstick.color || '#FF0000',
          intensity: lookData.lipstick.value || 1.0
        });
      }
      
      // Check for eyeshadow
      if (lookData.eyeshadow && lookData.eyeshadow.enabled) {
        updateAppliedFilter({
          type: 'eyeshadow',
          color: lookData.eyeshadow.color || '#000000',
          intensity: lookData.eyeshadow.value || 1.0
        });
      }
      
      // Check for eyeliner
      if (lookData.eyeliner && lookData.eyeliner.enabled) {
        updateAppliedFilter({
          type: 'eyeliner',
          color: lookData.eyeliner.color || '#000000',
          intensity: lookData.eyeliner.value || 1.0
        });
      }
      
      // Check for blush
      if (lookData.blush && lookData.blush.enabled) {
        updateAppliedFilter({
          type: 'blush',
          color: lookData.blush.color || '#FF6B6B',
          intensity: lookData.blush.value || 1.0
        });
      }
      
      // Dispatch makeupApplied event with all filters
      dispatchMakeupAppliedEvent();
    });
  }
  
  /**
   * Hook into existing makeup functions
   */
  function hookIntoExistingFunctions() {
    // Look for the Makeup class in window
    if (window.Makeup) {
      console.log('[MakeupFilterEventDispatcher] Found Makeup class, hooking into functions...');
      
      // Hook into lipstick application
      if (typeof window.Makeup.lipstick === 'function') {
        const originalLipstick = window.Makeup.lipstick;
        window.Makeup.lipstick = function(color, value) {
          const result = originalLipstick.apply(this, arguments);
          
          // Dispatch event
          const filterInfo = {
            type: 'lipstick',
            color: color || '#FF0000',
            intensity: value !== undefined ? value : 1.0
          };
          
          updateAppliedFilter(filterInfo);
          dispatchFilterAppliedEvent(filterInfo);
          
          return result;
        };
      }
      
      // Hook into eyeshadow application
      if (typeof window.Makeup.eyeshadow === 'function') {
        const originalEyeshadow = window.Makeup.eyeshadow;
        window.Makeup.eyeshadow = function(color, value) {
          const result = originalEyeshadow.apply(this, arguments);
          
          // Dispatch event
          const filterInfo = {
            type: 'eyeshadow',
            color: color || '#000000',
            intensity: value !== undefined ? value : 1.0
          };
          
          updateAppliedFilter(filterInfo);
          dispatchFilterAppliedEvent(filterInfo);
          
          return result;
        };
      }
      
      // Hook into eyeliner application
      if (typeof window.Makeup.eyeliner === 'function') {
        const originalEyeliner = window.Makeup.eyeliner;
        window.Makeup.eyeliner = function(color, value) {
          const result = originalEyeliner.apply(this, arguments);
          
          // Dispatch event
          const filterInfo = {
            type: 'eyeliner',
            color: color || '#000000',
            intensity: value !== undefined ? value : 1.0
          };
          
          updateAppliedFilter(filterInfo);
          dispatchFilterAppliedEvent(filterInfo);
          
          return result;
        };
      }
      
      // Hook into blush application
      if (typeof window.Makeup.blush === 'function') {
        const originalBlush = window.Makeup.blush;
        window.Makeup.blush = function(color, value) {
          const result = originalBlush.apply(this, arguments);
          
          // Dispatch event
          const filterInfo = {
            type: 'blush',
            color: color || '#FF6B6B',
            intensity: value !== undefined ? value : 1.0
          };
          
          updateAppliedFilter(filterInfo);
          dispatchFilterAppliedEvent(filterInfo);
          
          return result;
        };
      }
    }
    
    // Hook into look application (if exists)
    if (window.applyLook && typeof window.applyLook === 'function') {
      const originalApplyLook = window.applyLook;
      window.applyLook = function(lookData) {
        const result = originalApplyLook.apply(this, arguments);
        
        // Reset filters
        appliedFilters = [];
        
        // Process the look data
        if (lookData) {
          // Check for lipstick
          if (lookData.lipstick && lookData.lipstick.enabled) {
            updateAppliedFilter({
              type: 'lipstick',
              color: lookData.lipstick.color || '#FF0000',
              intensity: lookData.lipstick.value || 1.0
            });
          }
          
          // Check for eyeshadow
          if (lookData.eyeshadow && lookData.eyeshadow.enabled) {
            updateAppliedFilter({
              type: 'eyeshadow',
              color: lookData.eyeshadow.color || '#000000',
              intensity: lookData.eyeshadow.value || 1.0
            });
          }
          
          // Check for eyeliner
          if (lookData.eyeliner && lookData.eyeliner.enabled) {
            updateAppliedFilter({
              type: 'eyeliner',
              color: lookData.eyeliner.color || '#000000',
              intensity: lookData.eyeliner.value || 1.0
            });
          }
          
          // Check for blush
          if (lookData.blush && lookData.blush.enabled) {
            updateAppliedFilter({
              type: 'blush',
              color: lookData.blush.color || '#FF6B6B',
              intensity: lookData.blush.value || 1.0
            });
          }
          
          // Dispatch makeupApplied event with all filters
          dispatchMakeupAppliedEvent();
        }
        
        return result;
      };
    }
  }
  
  /**
   * Update the applied filters list
   * @param {Object} filterInfo - Filter information
   */
  function updateAppliedFilter(filterInfo) {
    // Remove existing filter of the same type
    removeAppliedFilter(filterInfo.type);
    
    // Add the new filter
    appliedFilters.push(filterInfo);
    
    console.log('[MakeupFilterEventDispatcher] Updated applied filters:', appliedFilters);
  }
  
  /**
   * Remove an applied filter by type
   * @param {string} type - Filter type
   */
  function removeAppliedFilter(type) {
    appliedFilters = appliedFilters.filter(filter => filter.type !== type);
  }
  
  /**
   * Dispatch a filter applied event
   * @param {Object} filterInfo - Filter information
   */
  function dispatchFilterAppliedEvent(filterInfo) {
    const event = new CustomEvent('filterApplied', {
      detail: filterInfo
    });
    
    document.dispatchEvent(event);
    console.log('[MakeupFilterEventDispatcher] Dispatched filterApplied event:', filterInfo);
  }
  
  /**
   * Dispatch a makeup applied event with all filters
   */
  function dispatchMakeupAppliedEvent() {
    const event = new CustomEvent('makeupApplied', {
      detail: {
        filters: [...appliedFilters]
      }
    });
    
    document.dispatchEvent(event);
    console.log('[MakeupFilterEventDispatcher] Dispatched makeupApplied event with filters:', appliedFilters);
  }
})();