/**
 * ScrollHelper.js - Adds enhanced scrolling capabilities
 */

(function() {
  console.log('[ScrollHelper] Initializing scrolling enhancements...');
  
  // Add listeners when DOM is ready
  document.addEventListener('DOMContentLoaded', initScrollHelper);
  
  // Also try when window loads
  window.addEventListener('load', initScrollHelper);
  
  // For immediate execution if already loaded
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initScrollHelper();
  }
  
  /**
   * Initialize scroll helper features
   */
  function initScrollHelper() {
    // Only initialize once
    if (document.getElementById('scroll-helper-initialized')) {
      return;
    }
    
    console.log('[ScrollHelper] Setting up scroll enhancements');
    
    // Create a marker to prevent multiple initializations
    const marker = document.createElement('div');
    marker.id = 'scroll-helper-initialized';
    marker.style.display = 'none';
    document.body.appendChild(marker);
    
    // Add scroll indicator button
    addScrollIndicator();
    
    // Make sure all overflow: hidden are removed
    removeOverflowRestrictions();
    
    // Make panels scrollable
    makeElementsScrollable();
    
    // Add scrollbar to sidebars if needed
    enhanceSidebars();
    
    // Monitor for newly added elements
    observeDOMChanges();
  }
  
  /**
   * Add a floating scroll indicator button
   */
  function addScrollIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    document.body.appendChild(indicator);
    
    // Hide initially
    indicator.style.display = 'none';
    
    // Show when needed
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      if (maxScroll > 100) { // Only show if page is scrollable
        indicator.style.display = 'flex';
        
        // Change direction based on scroll position
        if (scrollPos > maxScroll / 2) {
          indicator.classList.add('scroll-up');
        } else {
          indicator.classList.remove('scroll-up');
        }
      } else {
        indicator.style.display = 'none';
      }
    });
    
    // Scroll on click
    indicator.addEventListener('click', () => {
      if (indicator.classList.contains('scroll-up')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
      }
    });
  }
  
  /**
   * Remove overflow: hidden from any elements
   */
  function removeOverflowRestrictions() {
    // Selectors for elements that should be scrollable
    const selectors = [
      'html', 'body', '#webar', 
      '.bnb-layout', '.bnb-layout__content', '.bnb-layout__side',
      '.panel', '.sidebar', '.sidebar-panel'
    ];
    
    // Remove inline overflow: hidden
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el.style.overflow === 'hidden') {
          el.style.overflow = 'auto';
        }
        if (el.style.overflowY === 'hidden') {
          el.style.overflowY = 'auto';
        }
      });
    });
    
    // Add CSS to override any stylesheet overflow: hidden
    const style = document.createElement('style');
    style.textContent = `
      html, body, #webar, .bnb-layout, .bnb-layout__content, .bnb-layout__side {
        overflow-y: auto !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  /**
   * Make specific elements scrollable
   */
  function makeElementsScrollable() {
    // Look for panels and sidebars
    const panels = document.querySelectorAll('.panel, .sidebar-panel, .bnb-features');
    
    panels.forEach(panel => {
      // Set max height and make scrollable
      panel.style.maxHeight = '80vh';
      panel.style.overflowY = 'auto';
      
      // Add scrollable class for styling
      panel.classList.add('scrollable-panel');
    });
  }
  
  /**
   * Enhance sidebars for better scrolling
   */
  function enhanceSidebars() {
    const sidebar = document.querySelector('.bnb-layout__side');
    if (!sidebar) return;
    
    // Make sure sidebar is scrollable
    sidebar.style.overflowY = 'auto';
    
    // Set max height
    sidebar.style.maxHeight = '100vh';
    
    // Add padding to avoid content being cut off
    sidebar.style.paddingBottom = '20px';
  }
  
  /**
   * Observe DOM for newly added elements
   */
  function observeDOMChanges() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          // Check for newly added panels or sidebars
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // Element node
              if (node.classList && 
                  (node.classList.contains('panel') || 
                   node.classList.contains('sidebar-panel') || 
                   node.classList.contains('bnb-features'))) {
                // Make this new element scrollable
                node.style.maxHeight = '80vh';
                node.style.overflowY = 'auto';
              }
            }
          });
        }
      });
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
  }
})();