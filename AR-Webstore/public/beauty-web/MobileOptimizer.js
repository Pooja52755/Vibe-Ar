/**
 * MobileOptimizer.js - Enhances the mobile experience for Beauty AR
 * 
 * This script fixes various mobile layout issues and ensures proper
 * viewport rendering on smaller screens. It applies various fixes to
 * prevent UI elements from being cut off on mobile devices.
 */

(function() {
  // Run after DOM is ready and component loading is complete
  document.addEventListener('DOMContentLoaded', function() {
    // Wait for components to fully load
    setTimeout(initMobileOptimization, 800);
  });
  
  function initMobileOptimization() {
    // Check if we're on a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      console.log('Mobile device detected, applying optimizations');
      
      // Fix viewport meta tag
      fixViewport();
      
      // Apply container fixes
      fixContainers();
      
      // Fix sidebars
      fixSidebars();
      
      // Fix scrolling issues
      fixScrolling();
      
      // Optimize touch controls
      optimizeControls();
      
      // Monitor and fix layout continually
      monitorLayoutIssues();
    }
  }
  
  function fixViewport() {
    // Find or create viewport meta tag
    let viewport = document.querySelector('meta[name="viewport"]');
    
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }
    
    // Set optimal viewport for mobile AR
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover';
  }
  
  function fixContainers() {
    // Get all container elements
    const containers = document.querySelectorAll('.container, .columns, .column, .panel, .section');
    
    // Fix container widths
    containers.forEach(container => {
      container.style.width = '100%';
      container.style.maxWidth = '100vw';
      container.style.overflow = 'hidden';
      container.style.boxSizing = 'border-box';
      
      // Remove any fixed widths
      if (container.style.width.includes('px')) {
        container.style.width = '100%';
      }
    });
    
    // Fix the main container
    const mainContainer = document.querySelector('.container.is-fluid');
    if (mainContainer) {
      mainContainer.style.cssText += `
        width: 100% !important;
        max-width: 100vw !important;
        padding: 0 !important;
        margin: 0 !important;
        overflow-x: hidden !important;
      `;
    }
  }
  
  function fixSidebars() {
    // Fix sidebars that might be cut off
    const sidebars = document.querySelectorAll('.sidebar, .panel, .menu, aside');
    
    sidebars.forEach(sidebar => {
      sidebar.style.cssText += `
        width: 100% !important;
        max-width: 100vw !important;
        position: relative !important;
        overflow-x: hidden !important;
        box-sizing: border-box !important;
        padding-right: 15px !important;
      `;
      
      // If sidebar has fixed position, make it absolute
      const computedStyle = window.getComputedStyle(sidebar);
      if (computedStyle.position === 'fixed') {
        sidebar.style.position = 'absolute';
        sidebar.style.zIndex = '1000';
      }
    });
    
    // Specifically target makeup panels
    const makeupPanels = document.querySelectorAll('.panel');
    makeupPanels.forEach(panel => {
      panel.style.cssText += `
        width: 100% !important;
        max-width: 100% !important;
        overflow-x: hidden !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
      `;
    });
  }
  
  function fixScrolling() {
    // Fix body scrolling
    document.body.style.cssText += `
      overflow-x: hidden !important;
      width: 100% !important;
      position: relative !important;
    `;
    
    // Fix horizontal scrolling issues
    const scrollContainers = document.querySelectorAll('.panel-blocks, .is-scrollable');
    scrollContainers.forEach(container => {
      container.style.cssText += `
        overflow-x: hidden !important;
        max-width: 100% !important;
      `;
    });
  }
  
  function optimizeControls() {
    // Make buttons and controls larger for touch
    const controls = document.querySelectorAll('button, .button, .navbar-item, .panel-block');
    controls.forEach(control => {
      // Only increase size if it's small
      const rect = control.getBoundingClientRect();
      if (rect.height < 44) {
        control.style.minHeight = '44px';
      }
      
      // Ensure good touch targets
      control.style.cssText += `
        touch-action: manipulation;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
      `;
    });
    
    // Fix control layout in sidebars
    const sidebarControls = document.querySelectorAll('.sidebar button, .panel button, .panel-block');
    sidebarControls.forEach(control => {
      control.style.cssText += `
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
      `;
    });
  }
  
  function monitorLayoutIssues() {
    // Run periodic checks to fix layout issues
    setInterval(() => {
      // Re-apply sidebar fixes
      fixSidebars();
      
      // Check for elements extending beyond viewport
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > window.innerWidth + 5) {
          // Element extends beyond right edge of viewport
          el.style.cssText += `
            max-width: 100vw !important;
            width: 100% !important;
            overflow-x: hidden !important;
            box-sizing: border-box !important;
          `;
        }
      });
    }, 2000);
    
    // Listen for orientation changes
    window.addEventListener('resize', () => {
      fixContainers();
      fixSidebars();
      fixScrolling();
    });
  }
})();