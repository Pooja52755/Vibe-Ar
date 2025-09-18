/**
 * StandaloneMenu.js
 * Creates a simplified standalone menu for mobile devices
 */

document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (!isMobile) return;
  
  // Create menu container
  const menuContainer = document.createElement('div');
  menuContainer.className = 'mobile-standalone-menu';
  menuContainer.style.cssText = `
    position: fixed;
    top: 50px;
    left: 10px;
    z-index: 9999;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    width: 90%;
    max-width: 90%;
    display: none;
    overflow-y: auto;
    max-height: 80vh;
  `;
  
  // Create menu items
  const menuItems = [
    { name: 'Looks', icon: '★' },
    { name: 'Presets', icon: '◫' },
    { name: 'Retouch', icon: '◎' },
    { name: 'Makeup', icon: '◉' },
    { name: 'Eyes', icon: '◉' },
    { name: 'Lipstick', icon: '◊' },
    { name: 'Hair', icon: '≈' },
    { name: 'Background', icon: '▣' },
    { name: 'LUTs', icon: '⊞' },
    { name: 'Reset all', icon: '↻' }
  ];
  
  // Create menu HTML
  let menuHTML = '';
  
  menuItems.forEach(item => {
    menuHTML += `
      <div class="menu-item" style="
        padding: 12px 15px;
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
      ">
        <span style="
          margin-right: 10px;
          color: #4a6cf7;
          font-size: 18px;
        ">${item.icon}</span>
        <span style="
          font-size: 16px;
          color: #333;
        ">${item.name}</span>
        <span style="
          margin-left: auto;
          color: #999;
        ">›</span>
      </div>
    `;
  });
  
  menuContainer.innerHTML = menuHTML;
  
  // Create menu toggle button
  const menuToggle = document.createElement('button');
  menuToggle.textContent = '☰ Menu';
  menuToggle.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 10000;
    background-color: #ff4081;
    color: white;
    border: none;
    border-radius: 30px;
    padding: 8px 15px;
    font-weight: bold;
    font-size: 14px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  `;
  
  // Toggle menu on click
  menuToggle.addEventListener('click', function() {
    if (menuContainer.style.display === 'none' || !menuContainer.style.display) {
      menuContainer.style.display = 'block';
    } else {
      menuContainer.style.display = 'none';
    }
  });
  
  // Add to document
  document.body.appendChild(menuToggle);
  document.body.appendChild(menuContainer);
});