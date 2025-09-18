/**
 * Layout patch for Banuba beauty web
 * This script fixes layout issues on mobile devices
 */

document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    // Add mobile class to body
    document.body.classList.add('is-mobile-device');
    
    // Function to patch layout elements after they're created
    const patchLayoutElements = () => {
      // Fix sidebar width issues - use specific width for mobile
      const sidebarElements = document.querySelectorAll('.bnb-layout__side');
      sidebarElements.forEach(el => {
        el.style.maxWidth = '85%'; // Make narrower than viewport to fit screen
        el.style.width = '85%';
        el.style.position = 'absolute';
        el.style.left = '0';
        el.style.overflowX = 'hidden';
      });
      
      // Fix panel content sizing
      const panelBlocks = document.querySelectorAll('.panel-block');
      panelBlocks.forEach(el => {
        el.style.width = '100%';
        el.style.maxWidth = '100%';
        el.style.padding = '8px';
      });
      
      // Fix tab sizes
      const tabs = document.querySelectorAll('.tabs a');
      tabs.forEach(el => {
        el.style.padding = '0.5em 0.75em';
        el.style.fontSize = '14px';
      });
      
      // Fix slider sizes for better touch targets
      const sliders = document.querySelectorAll('input[type="range"]');
      sliders.forEach(el => {
        el.style.height = '30px';
      });
      
      // Fix field labels
      const fieldLabels = document.querySelectorAll('.field-label');
      fieldLabels.forEach(el => {
        el.style.fontSize = '14px';
        el.style.marginBottom = '2px';
      });
      
      // Fix columns for better mobile layout
      const columns = document.querySelectorAll('.columns');
      columns.forEach(el => {
        el.style.margin = '0';
      });
      
      const columnElements = document.querySelectorAll('.column');
      columnElements.forEach(el => {
        el.style.padding = '0.25rem';
      });
    };
    
    // Apply patches immediately
    patchLayoutElements();
    
    // And also after a short delay to ensure all elements are rendered
    setTimeout(patchLayoutElements, 1000);
    
    // Create a MutationObserver to watch for DOM changes
    const observer = new MutationObserver(function(mutations) {
      // When DOM changes, apply our fixes
      patchLayoutElements();
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
  }
});