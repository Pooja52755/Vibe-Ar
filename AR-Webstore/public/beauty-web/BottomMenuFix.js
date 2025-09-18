/**
 * BottomMenuFix.js - Adds a floating bottom menu for mobile devices
 * 
 * This script adds a fixed position menu at the bottom of the screen
 * for easy access to key features on mobile devices, addressing the
 * issue where the sidebar is being cut off on mobile viewports.
 */

(function() {
  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Wait for app to initialize
    setTimeout(createBottomMenu, 1500);
  });
  
  function createBottomMenu() {
    // Only show on mobile devices
    if (!/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      return;
    }
    
    console.log('Creating bottom menu for mobile');
    
    // Create the menu container
    const bottomMenu = document.createElement('div');
    bottomMenu.className = 'mobile-bottom-menu';
    bottomMenu.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: #fff;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 10px 0;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
      z-index: 1000;
      border-top: 1px solid #eee;
    `;
    
    // Add menu items
    const menuItems = [
      { icon: 'fa-camera', text: 'Camera', action: showCamera },
      { icon: 'fa-magic', text: 'Makeup', action: () => showCategory('makeup') },
      { icon: 'fa-eye', text: 'Eyes', action: () => showCategory('eyes') },
      { icon: 'fa-tint', text: 'Lips', action: () => showCategory('lipstick') },
      { icon: 'fa-image', text: 'Photo', action: uploadPhoto }
    ];
    
    // Create each menu item
    menuItems.forEach(item => {
      const menuItem = document.createElement('div');
      menuItem.className = 'mobile-menu-item';
      menuItem.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 5px;
        flex: 1;
      `;
      
      // Create icon
      const icon = document.createElement('i');
      icon.className = `fas ${item.icon}`;
      icon.style.cssText = `
        font-size: 20px;
        color: #4a6aed;
        margin-bottom: 5px;
      `;
      
      // Create text
      const text = document.createElement('span');
      text.textContent = item.text;
      text.style.cssText = `
        font-size: 12px;
        color: #333;
      `;
      
      // Add click handler
      menuItem.addEventListener('click', item.action);
      
      // Assemble menu item
      menuItem.appendChild(icon);
      menuItem.appendChild(text);
      bottomMenu.appendChild(menuItem);
    });
    
    // Add the menu to the body
    document.body.appendChild(bottomMenu);
    
    // Add padding to body to prevent content from being hidden behind the menu
    document.body.style.paddingBottom = '60px';
    
    // Adjust sidebar position for mobile
    const sidebar = document.querySelector('#sidebar-container, .bnb-layout__side');
    if (sidebar) {
      sidebar.style.paddingBottom = '70px';
    }
  }
  
  // Function to show camera view
  function showCamera() {
    // Hide all feature panels
    hideAllPanels();
    
    // Show camera container
    const cameraContainer = document.querySelector('#camera-container, .bnb-layout__main');
    if (cameraContainer) {
      cameraContainer.style.display = 'block';
    }
    
    // Reset active states
    resetActiveStates();
  }
  
  // Function to show a category
  function showCategory(category) {
    // Find the category link
    const categoryLink = document.querySelector(`[href="#${category}"]`);
    if (categoryLink) {
      // Simulate click
      categoryLink.click();
    }
    
    // Also directly access panels if needed
    const panels = document.querySelectorAll('.panel');
    panels.forEach(panel => {
      // Hide all panels first
      panel.style.display = 'none';
      
      // Show the targeted panel
      if (panel.id === category || panel.dataset.category === category) {
        panel.style.display = 'block';
        panel.style.width = '100%';
        panel.style.maxWidth = '100vw';
        panel.style.overflow = 'hidden';
      }
    });
  }
  
  // Function to upload a photo
  function uploadPhoto() {
    // Create file input if it doesn't exist
    let fileInput = document.querySelector('#mobile-file-input');
    if (!fileInput) {
      fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.id = 'mobile-file-input';
      fileInput.style.display = 'none';
      fileInput.addEventListener('change', handleFileSelect);
      document.body.appendChild(fileInput);
    }
    
    // Trigger file selection
    fileInput.click();
  }
  
  // Handle file selection
  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
      // Find video element to replace
      const video = document.querySelector('video');
      if (video) {
        // Create image element
        const img = document.createElement('img');
        img.src = event.target.result;
        img.style.cssText = `
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
        `;
        
        // Hide video
        video.style.display = 'none';
        
        // Add image to container
        video.parentNode.appendChild(img);
        
        // Update UI state
        document.body.classList.add('using-image');
        
        // Show notification
        showNotification('Photo uploaded successfully! Try makeup effects on your photo.');
      }
    };
    reader.readAsDataURL(file);
  }
  
  // Hide all panels
  function hideAllPanels() {
    const panels = document.querySelectorAll('.panel, .bnb-features');
    panels.forEach(panel => {
      panel.style.display = 'none';
    });
  }
  
  // Reset active states
  function resetActiveStates() {
    document.querySelectorAll('.is-active').forEach(el => {
      el.classList.remove('is-active');
    });
  }
  
  // Show notification
  function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification is-success';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 70px;
      left: 10px;
      right: 10px;
      z-index: 1000;
      padding: 10px;
      background-color: #23d160;
      color: white;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      animation: fadeOut 5s forwards;
    `;
    
    // Add animation style
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeOut {
        0% { opacity: 1; }
        80% { opacity: 1; }
        100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after animation
    setTimeout(() => {
      notification.remove();
      style.remove();
    }, 5000);
  }
})();