/**
 * SidebarFullWidth.js - Force sidebars to full width on mobile
 * 
 * This script directly manipulates the DOM to ensure all sidebars
 * and panels are displayed at full width on mobile devices, preventing
 * the UI from being cut off on smaller screens.
 */

(function() {
  // Run immediately to fix sidebar width issues
  fixSidebarsImmediately();
  
  // Also run after DOM is fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit to ensure all elements are loaded
    setTimeout(fixSidebarsCompletely, 500);
    
    // Run multiple times to ensure fixes are applied
    setTimeout(fixSidebarsCompletely, 1000);
    setTimeout(fixSidebarsCompletely, 2000);
    
    // Set up continuous monitoring
    setInterval(fixSidebarsCompletely, 5000);
  });
  
  // Function to immediately apply critical fixes
  function fixSidebarsImmediately() {
    // Only apply on mobile devices
    if (!/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      return;
    }
    
    // Add viewport meta tag if missing
    ensureViewportMeta();
    
    // Force body styles
    document.documentElement.style.cssText += `
      width: 100% !important;
      max-width: 100vw !important;
      overflow-x: hidden !important;
    `;
    
    document.body.style.cssText += `
      width: 100% !important;
      max-width: 100vw !important;
      overflow-x: hidden !important;
      position: relative !important;
    `;
    
    // Create and append critical style fixes
    const style = document.createElement('style');
    style.textContent = `
      /* Critical mobile fixes */
      html, body {
        width: 100% !important;
        max-width: 100vw !important;
        overflow-x: hidden !important;
        position: relative !important;
      }
      
      .container, .container.is-fluid, .columns, .column, 
      .sidebar, .panel, .bnb-layout__side, .bnb-settings {
        width: 100% !important;
        max-width: 100vw !important;
        overflow-x: hidden !important;
        box-sizing: border-box !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding-right: 0 !important;
        padding-left: 0 !important;
      }
      
      #sidebar-container, .bnb-layout__side {
        width: 100% !important;
        max-width: 100vw !important;
        overflow-x: hidden !important;
        position: relative !important;
        left: 0 !important;
        right: auto !important;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // Function to ensure viewport meta tag is present and correct
  function ensureViewportMeta() {
    let viewport = document.querySelector('meta[name="viewport"]');
    
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }
    
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover';
  }
  
  // Function to completely fix all sidebars and containers
  function fixSidebarsCompletely() {
    // Only apply on mobile devices
    if (!/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      return;
    }
    
    console.log('Applying comprehensive sidebar fixes');
    
    // Fix all containers
    const containers = document.querySelectorAll('.container, .container.is-fluid, .columns, .column');
    containers.forEach(container => {
      container.style.cssText += `
        width: 100% !important;
        max-width: 100vw !important;
        overflow-x: hidden !important;
        box-sizing: border-box !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
      `;
    });
    
    // Fix all sidebars and panels
    const sidebars = document.querySelectorAll('.sidebar, .panel, .bnb-layout__side, .bnb-settings, #sidebar-container');
    sidebars.forEach(sidebar => {
      sidebar.style.cssText += `
        width: 100% !important;
        max-width: 100vw !important;
        overflow-x: hidden !important;
        position: relative !important;
        left: 0 !important;
        right: auto !important;
        box-sizing: border-box !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding-right: 10px !important;
      `;
    });
    
    // Fix all panel blocks and menu items
    const blocks = document.querySelectorAll('.panel-block, .panel-heading, .panel-tabs, .menu-item');
    blocks.forEach(block => {
      block.style.cssText += `
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        overflow-x: hidden !important;
      `;
    });
    
    // Fix camera container
    const cameraContainer = document.querySelector('#camera-container, .bnb-layout__main');
    if (cameraContainer) {
      cameraContainer.style.cssText += `
        width: 100% !important;
        max-width: 100vw !important;
        overflow: hidden !important;
      `;
    }
    
    // Adjust column layout for mobile
    const columnContainer = document.querySelector('.columns');
    if (columnContainer) {
      columnContainer.style.cssText += `
        display: flex !important;
        flex-direction: column !important;
      `;
      
      // Find sidebar and camera columns
      const sidebarColumn = document.querySelector('.column.is-3, .column.is-4');
      const cameraColumn = document.querySelector('.column.is-9, .column.is-8');
      
      if (sidebarColumn && cameraColumn) {
        // Reorder columns for mobile
        cameraColumn.style.order = '1';
        sidebarColumn.style.order = '2';
        
        // Ensure full width
        sidebarColumn.style.width = '100%';
        cameraColumn.style.width = '100%';
      }
    }
    
    // Fix absolute positioned elements that might be cut off
    const absoluteElements = document.querySelectorAll('[style*="position: absolute"]');
    absoluteElements.forEach(el => {
      if (el.getBoundingClientRect().right > window.innerWidth) {
        el.style.right = 'auto';
        el.style.maxWidth = '100vw';
      }
    });
  }
})();