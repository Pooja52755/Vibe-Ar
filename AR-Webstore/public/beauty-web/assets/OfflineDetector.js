/**
 * OfflineDetector.js - Enable offline functionality and detect connection status
 * 
 * This script:
 * 1. Detects when the application is offline
 * 2. Shows appropriate notifications to the user
 * 3. Ensures functionality works without internet connection
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're online and update status
    updateOnlineStatus();
    
    // Add event listeners for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Load fallback resources if needed
    ensureResourcesAvailable();
});

/**
 * Updates UI based on connection status
 */
function updateOnlineStatus() {
    const isOnline = navigator.onLine;
    
    // Add visual indicator
    if (!document.getElementById('connection-status')) {
        const statusIndicator = document.createElement('div');
        statusIndicator.id = 'connection-status';
        statusIndicator.style.position = 'fixed';
        statusIndicator.style.top = '10px';
        statusIndicator.style.right = '10px';
        statusIndicator.style.padding = '5px 10px';
        statusIndicator.style.borderRadius = '4px';
        statusIndicator.style.fontSize = '12px';
        statusIndicator.style.zIndex = '9999';
        document.body.appendChild(statusIndicator);
    }
    
    const statusIndicator = document.getElementById('connection-status');
    
    if (isOnline) {
        statusIndicator.textContent = 'Online';
        statusIndicator.style.backgroundColor = '#4caf50';
        statusIndicator.style.color = 'white';
    } else {
        statusIndicator.textContent = 'Offline Mode';
        statusIndicator.style.backgroundColor = '#ff9800';
        statusIndicator.style.color = 'white';
    }
    
    // Only show for 3 seconds then fade out
    statusIndicator.style.opacity = '1';
    statusIndicator.style.transition = 'opacity 0.3s ease-in-out';
    
    setTimeout(() => {
        statusIndicator.style.opacity = '0.5';
    }, 3000);
}

/**
 * Ensures all resources are available offline
 */
function ensureResourcesAvailable() {
    // If browser supports Service Workers and Cache API
    if ('serviceWorker' in navigator && 'caches' in window) {
        // Handle potential missing resources by using cached versions
        window.addEventListener('error', function(event) {
            // Check if the error is related to loading a resource
            if (event.target instanceof HTMLImageElement || 
                event.target instanceof HTMLScriptElement || 
                event.target instanceof HTMLLinkElement) {
                
                const resourceUrl = event.target.src || event.target.href;
                
                // Try to load from cache
                caches.match(resourceUrl).then(response => {
                    if (response) {
                        console.log('Loaded cached version of:', resourceUrl);
                        // Use the cached resource
                        if (event.target instanceof HTMLImageElement) {
                            event.target.src = response.url;
                        } else if (event.target instanceof HTMLScriptElement) {
                            // For scripts we might need to evaluate them manually
                            response.text().then(scriptContent => {
                                try {
                                    eval(scriptContent);
                                } catch (e) {
                                    console.warn('Error evaluating cached script:', e);
                                }
                            });
                        } else if (event.target instanceof HTMLLinkElement) {
                            event.target.href = response.url;
                        }
                    }
                });
            }
        }, true);
    }
}