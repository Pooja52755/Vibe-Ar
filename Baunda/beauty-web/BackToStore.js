/**
 * BackToStore.js
 * A small script to add a "Back to AR-Webstore" button to the beauty-web application
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create the back button container
    const backButtonContainer = document.createElement('div');
    backButtonContainer.style.position = 'fixed';
    backButtonContainer.style.top = '20px';
    backButtonContainer.style.left = '20px';
    backButtonContainer.style.zIndex = '9999';
    
    // Create the back button
    const backButton = document.createElement('button');
    backButton.textContent = 'Back to AR-Webstore';
    backButton.style.padding = '10px 15px';
    backButton.style.backgroundColor = '#ff4081';
    backButton.style.color = 'white';
    backButton.style.border = 'none';
    backButton.style.borderRadius = '30px';
    backButton.style.cursor = 'pointer';
    backButton.style.fontWeight = 'bold';
    backButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    
    // Add hover effect
    backButton.onmouseover = function() {
        this.style.backgroundColor = '#e91e63';
    };
    backButton.onmouseout = function() {
        this.style.backgroundColor = '#ff4081';
    };
    
    // Add click event to return to AR-Webstore
    backButton.onclick = function() {
        // Navigate back to the AR-Webstore 
        // Using file protocol to navigate back to the exact location of the AR-Webstore
        window.location.href = 'file:///D:/ARGEN/AR-Webstore/index.html';
    };
    
    // Add the button to the container
    backButtonContainer.appendChild(backButton);
    
    // Add the container to the document body
    document.body.appendChild(backButtonContainer);
});