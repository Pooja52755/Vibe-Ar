/**
 * AIUploadButton.js - Adds an upload button for images
 * 
 * This script:
 * 1. Adds a prominent "Upload Image" button to the UI
 * 2. Allows users to upload images without auto-applying filters
 * 3. Users will need to manually select filters
 */

document.addEventListener('DOMContentLoaded', function() {
    // Create the upload button
    createUploadButton();
    
    // Position it prominently in the UI
    setTimeout(positionButton, 1000);
});

/**
 * Creates the upload button
 */
function createUploadButton() {
    // Create button container
    const container = document.createElement('div');
    container.id = 'ai-upload-button-container';
    container.style.cssText = `
        position: fixed;
        top: 15px;
        right: 15px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: center;
    `;
    
    // Create the button
    const button = document.createElement('button');
    button.id = 'ai-upload-button';
    button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            <circle cx="12" cy="12" r="4"></circle>
        </svg>
        <span>Upload Image</span>
    `;
    
    button.style.cssText = `
        background-color: #e91e63;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 10px 15px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(233, 30, 99, 0.3);
        transition: all 0.2s ease;
    `;
    
    // Add hover effect
    button.onmouseover = () => {
        button.style.backgroundColor = '#d81b60';
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = '0 6px 12px rgba(233, 30, 99, 0.4)';
    };
    
    button.onmouseout = () => {
        button.style.backgroundColor = '#e91e63';
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 4px 10px rgba(233, 30, 99, 0.3)';
    };
    
    // Add click handler
    button.onclick = () => {
        triggerImageUpload();
    };
    
    // Add button to container
    container.appendChild(button);
    
    // Add label
    const label = document.createElement('div');
    label.textContent = 'Upload your photo';
    label.style.cssText = `
        font-size: 12px;
        color: #666;
        margin-top: 5px;
    `;
    container.appendChild(label);
    
    // Add to document
    document.body.appendChild(container);
}

/**
 * Positions the button in a visible area of the UI
 */
function positionButton() {
    // Find the header or navigation area to position relative to it
    const header = document.querySelector('header, .navbar, nav, .nav');
    const aiButton = document.getElementById('ai-upload-button-container');
    
    if (header && aiButton) {
        // Position below header
        const headerRect = header.getBoundingClientRect();
        aiButton.style.top = (headerRect.bottom + 15) + 'px';
    }
}

/**
 * Triggers the image upload process
 */
function triggerImageUpload() {
    // Show loading indicator
    showLoadingIndicator();
    
    // Create a file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    // Handle file selection
    fileInput.onchange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            // Find the upload function in Banuba SDK
            const appElement = document.querySelector('#app');
            if (!appElement) {
                hideLoadingIndicator();
                alert('App not initialized yet. Please try again in a moment.');
                document.body.removeChild(fileInput);
                return;
            }
            
            let vueApp;
            try {
                vueApp = appElement.__vue__;
            } catch (e) {
                console.warn('Vue app not available:', e);
                // Continue with fallback
                vueApp = null;
            }
            
            if (vueApp) {
                // Try to find upload method
                const uploadMethods = [
                    // Common method names for upload in Banuba
                    'uploadPhoto',
                    'loadPhoto',
                    'setPhoto',
                    'loadImage'
                ];
                
                let uploadMethod = null;
                
                // Search for upload methods recursively in Vue component tree
                const findMethod = (component, methodNames) => {
                    if (!component) return null;
                    
                    for (const name of methodNames) {
                        if (typeof component[name] === 'function') {
                            return component[name].bind(component);
                        }
                    }
                    
                    if (component.$children) {
                        for (const child of component.$children) {
                            const method = findMethod(child, methodNames);
                            if (method) return method;
                        }
                    }
                    
                    return null;
                };
                
                uploadMethod = findMethod(vueApp, uploadMethods);
                
                if (uploadMethod) {
                    // Use the SDK's upload method
                    uploadMethod(file);
                    
                    // No auto-apply of filters
                    setTimeout(() => {
                        hideLoadingIndicator();
                    }, 1500);
                } else {
                    // Fallback: Create a URL and set it as background
                    applyFallbackImageUpload(file);
                }
            } else {
                // Fallback method if Vue app not found
                applyFallbackImageUpload(file);
            }
        }
        
        // Remove the input element
        document.body.removeChild(fileInput);
    };
    
    // Trigger click on file input
    fileInput.click();
}

/**
 * Fallback method to handle image upload when SDK methods aren't available
 */
function applyFallbackImageUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const imageUrl = e.target.result;
        
        // Find image or canvas element to replace
        const imageElements = document.querySelectorAll('.camera-view img, .camera-view canvas, .viewer-container img, .viewer-container canvas');
        if (imageElements.length > 0) {
            if (imageElements[0] instanceof HTMLImageElement) {
                imageElements[0].src = imageUrl;
            } else if (imageElements[0] instanceof HTMLCanvasElement) {
                const ctx = imageElements[0].getContext('2d');
                const img = new Image();
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, imageElements[0].width, imageElements[0].height);
                };
                img.src = imageUrl;
            }
            
            // No auto-apply of filters
            setTimeout(hideLoadingIndicator, 1500);
        } else {
            // Create a new image element if none exists
            const imageContainer = document.querySelector('.camera-view, .viewer-container');
            if (imageContainer) {
                const newImg = document.createElement('img');
                newImg.src = imageUrl;
                newImg.style.width = '100%';
                newImg.style.height = 'auto';
                imageContainer.appendChild(newImg);
                
                // No auto-apply of filters
                setTimeout(hideLoadingIndicator, 1500);
            } else {
                hideLoadingIndicator();
                alert('Could not find a suitable container for the image. Please try again.');
            }
        }
    };
    reader.readAsDataURL(file);
}

/**
 * Show loading indicator
 */
function showLoadingIndicator() {
    if (!document.getElementById('ai-upload-loading')) {
        const loader = document.createElement('div');
        loader.id = 'ai-upload-loading';
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;
        
        loader.innerHTML = `
            <div style="background-color: white; padding: 20px; border-radius: 10px; text-align: center;">
                <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #e91e63; border-radius: 50%; margin: 0 auto; animation: spin 1s linear infinite;"></div>
                <p style="margin-top: 10px; font-weight: bold;">Applying AI Makeup...</p>
            </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(loader);
    } else {
        document.getElementById('ai-upload-loading').style.display = 'flex';
    }
}

/**
 * Hide loading indicator
 */
function hideLoadingIndicator() {
    const loader = document.getElementById('ai-upload-loading');
    if (loader) {
        loader.style.display = 'none';
    }
}