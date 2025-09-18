/**
 * FixBeautyApp.js - Script to fix beauty web application issues
 * 
 * This script provides fixes for:
 * 1. Back button functionality
 * 2. Mobile layout improvements
 * 3. Feature selection issues
 * 4. Navigation between makeup categories
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add mobile-friendly CSS
    const mobileCss = document.createElement('link');
    mobileCss.rel = 'stylesheet';
    mobileCss.href = './assets/mobile-fixes.css';
    document.head.appendChild(mobileCss);
    
    // Fix back button functionality
    setupBackButton();
    
    // Improve navigation between makeup categories
    fixCategoryNavigation();
    
    // Fix feature selection issues
    fixFeatureSelection();
});

/**
 * Creates and sets up a back button that works on mobile
 */
function setupBackButton() {
    // Wait for Vue app to initialize
    setTimeout(() => {
        // Find the router instance
        const vueApp = document.querySelector('#app').__vue__;
        if (!vueApp || !vueApp.$router) return;
        
        // Create back button element
        const backButton = document.createElement('div');
        backButton.className = 'back-button';
        backButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
        `;
        
        // Add back functionality
        backButton.addEventListener('click', () => {
            vueApp.$router.back();
        });
        
        // Only show back button when not on home route
        vueApp.$router.afterEach((to) => {
            backButton.style.display = to.path === '/' ? 'none' : 'block';
        });
        
        // Add to document
        document.body.appendChild(backButton);
    }, 1000);
}

/**
 * Fixes issues with feature selection on mobile devices
 */
function fixFeatureSelection() {
    // Apply touch-friendly styles to feature buttons
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                const featureItems = document.querySelectorAll('.feature-item');
                featureItems.forEach(item => {
                    // Increase touch target size
                    item.style.minHeight = '44px';
                    item.style.padding = '10px';
                    
                    // Make sure click events work properly
                    const originalClick = item.onclick;
                    item.onclick = null;
                    item.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (originalClick) originalClick.call(item, e);
                    });
                });
            }
        });
    });
    
    // Start observing for feature items
    observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * Improves navigation between different makeup categories
 */
function fixCategoryNavigation() {
    // Make category navigation more responsive
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                const tabButtons = document.querySelectorAll('.tab');
                tabButtons.forEach(tab => {
                    // Enhance tab visibility and touch area
                    tab.style.minWidth = 'auto';
                    tab.style.padding = '10px 15px';
                    
                    // Fix touch event issues
                    const originalClick = tab.onclick;
                    tab.onclick = null;
                    tab.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (originalClick) originalClick.call(tab, e);
                    });
                });
            }
        });
    });
    
    // Start observing for tab elements
    observer.observe(document.body, { childList: true, subtree: true });
}