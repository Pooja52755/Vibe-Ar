/**
 * ResizeObserverFix.js - Fix for ResizeObserver loop errors
 * 
 * This script prevents the "ResizeObserver loop completed with undelivered notifications" error
 * by adding debouncing to resize operations and handling recursive size changes gracefully.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Create a flag to track if we're already handling resize operations
    window.__handlingResize = false;
    
    // Override the ResizeObserver constructor to add debouncing
    const OriginalResizeObserver = window.ResizeObserver;
    
    // Only patch if ResizeObserver exists
    if (OriginalResizeObserver) {
        window.ResizeObserver = function(callback) {
            // Debounce time in milliseconds
            const DEBOUNCE_TIME = 20;
            let timeout;
            
            // Create the original observer with our wrapped callback
            const observer = new OriginalResizeObserver(function() {
                // If we're already handling a resize, don't trigger another one
                if (window.__handlingResize) {
                    return;
                }
                
                window.__handlingResize = true;
                
                // Clear any existing timeout
                if (timeout) {
                    clearTimeout(timeout);
                }
                
                // Set a timeout to call the actual callback
                timeout = setTimeout(() => {
                    try {
                        callback.apply(this, arguments);
                    } catch (e) {
                        console.warn('ResizeObserver callback error:', e);
                    } finally {
                        window.__handlingResize = false;
                    }
                }, DEBOUNCE_TIME);
            });
            
            // Return the observer with the original methods
            return observer;
        };
        
        // Copy prototype and static properties
        window.ResizeObserver.prototype = OriginalResizeObserver.prototype;
        Object.keys(OriginalResizeObserver).forEach(key => {
            window.ResizeObserver[key] = OriginalResizeObserver[key];
        });
    }
    
    // Add error handler for ResizeObserver errors
    window.addEventListener('error', function(e) {
        if (e && e.message && e.message.includes('ResizeObserver loop')) {
            // Prevent the error from being reported to the console
            e.stopImmediatePropagation();
        }
    }, true);
    
    // Suppress specific ResizeObserver error in console
    const originalConsoleError = console.error;
    console.error = function() {
        if (arguments[0] && 
            typeof arguments[0] === 'string' && 
            arguments[0].includes('ResizeObserver loop')) {
            return;
        }
        originalConsoleError.apply(this, arguments);
    };
});