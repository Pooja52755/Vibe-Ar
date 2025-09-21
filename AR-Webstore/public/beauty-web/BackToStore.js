/**
 * BackToStore.js
 * A small script to add a "Back to AR-Webstore" button to the beauty-web application
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Detect if user is on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Create the back button container
    const backButtonContainer = document.createElement('div');
    backButtonContainer.style.position = 'fixed';
    backButtonContainer.style.top = '10px';
    backButtonContainer.style.left = '10px';
    backButtonContainer.style.zIndex = '9999';
    backButtonContainer.style.maxWidth = '120px';
    
    // Create the back button
    const backButton = document.createElement('button');
    backButton.textContent = isMobile ? 'Back' : 'Back to Store';
    backButton.style.padding = isMobile ? '8px 14px' : '12px 20px';
    backButton.style.backgroundColor = '#ff3e6c';
    backButton.style.color = 'white';
    backButton.style.border = 'none';
    backButton.style.borderRadius = '10px'; // Soft corners
    backButton.style.cursor = 'pointer';
    backButton.style.fontWeight = 'bold';
    backButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    backButton.style.fontSize = isMobile ? '13px' : '17px';
    backButton.style.display = 'flex';
    backButton.style.alignItems = 'center';
    backButton.style.justifyContent = 'center';
    
    // Add hover effect
    backButton.onmouseover = function() {
        this.style.backgroundColor = '#e91e63';
    };
    backButton.onmouseout = function() {
        this.style.backgroundColor = '#ff3e6c';
    };
    
    // Add click event to return to AR-Webstore
    backButton.onclick = function() {
        // Navigate back to the AR-Webstore
        window.location.href = '../../index.html';
    };
    
    // Add the button to the container
    backButtonContainer.appendChild(backButton);
    
    // Remove anything under the button (container only contains button now)
    // Add the container to the dashboard instead of document.body
    const dashboard = document.getElementById('dashboard');
    if (dashboard) {
        dashboard.appendChild(backButtonContainer);
    }
});