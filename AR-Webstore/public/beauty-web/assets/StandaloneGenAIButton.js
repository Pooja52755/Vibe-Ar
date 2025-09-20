/**
 * StandaloneGenAIButton.js
 * 
 * Creates a permanent, standalone GenAI button that's completely
 * independent of the application's state or errors.
 */

(function() {
    console.log('[StandaloneGenAIButton] Initializing...');
    
    // Create the button
    function createButton() {
        // Don't create if it already exists
        if (document.getElementById('standalone-genai-button')) {
            return;
        }
        
        // Create button element
        const button = document.createElement('button');
        button.id = 'standalone-genai-button';
        button.innerHTML = '✨ GenAI Makeup';
        
        // Style the button
        button.style.position = 'fixed';
        button.style.bottom = '90px';
        button.style.right = '20px';
        button.style.zIndex = '999999'; // Extremely high z-index
        button.style.backgroundColor = '#8a2be2'; // Vibrant purple
        button.style.color = 'white';
        button.style.padding = '15px 25px';
        button.style.borderRadius = '50px';
        button.style.fontSize = '18px';
        button.style.fontWeight = 'bold';
        button.style.border = '2px solid white';
        button.style.boxShadow = '0 4px 15px rgba(138, 43, 226, 0.5)';
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.textTransform = 'uppercase';
        button.style.letterSpacing = '1px';
        button.style.transition = 'all 0.3s ease';
        
        // Add hover effect
        button.onmouseenter = function() {
            this.style.backgroundColor = '#9932cc';
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 6px 20px rgba(138, 43, 226, 0.7)';
        };
        
        button.onmouseleave = function() {
            this.style.backgroundColor = '#8a2be2';
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 4px 15px rgba(138, 43, 226, 0.5)';
        };
        
        // Add glow animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes glowing {
                0% { box-shadow: 0 0 10px rgba(138, 43, 226, 0.5); }
                50% { box-shadow: 0 0 20px rgba(138, 43, 226, 0.8), 0 0 30px rgba(138, 43, 226, 0.4); }
                100% { box-shadow: 0 0 10px rgba(138, 43, 226, 0.5); }
            }
            #standalone-genai-button {
                animation: glowing 2s infinite;
            }
        `;
        document.head.appendChild(style);
        
        // Add click event handler
        button.addEventListener('click', function() {
            console.log('[StandaloneGenAIButton] Button clicked');
            
            // Try all possible methods to trigger GenAI makeup
            try {
                // Method 1: Call initGenAIMakeup if available
                if (window.initGenAIMakeup) {
                    console.log('[StandaloneGenAIButton] Calling initGenAIMakeup()');
                    window.initGenAIMakeup();
                    return;
                }
                
                // Method 2: Try to open the modal directly
                if (window.openGenAIMakeupModal) {
                    console.log('[StandaloneGenAIButton] Calling openGenAIMakeupModal()');
                    window.openGenAIMakeupModal();
                    return;
                }
                
                // Method 3: Look for any button with "GenAI" text and click it
                const buttons = Array.from(document.querySelectorAll('button'));
                const genaiButton = buttons.find(btn => 
                    btn.textContent && 
                    btn.textContent.toLowerCase().includes('genai') &&
                    btn !== this // Avoid clicking self
                );
                
                if (genaiButton) {
                    console.log('[StandaloneGenAIButton] Clicking existing GenAI button');
                    genaiButton.click();
                    return;
                }
                
                // Method 4: Try to use the comprehensive fix if available
                if (window.comprehensiveFix && window.comprehensiveFix.patchGenAIMakeup) {
                    console.log('[StandaloneGenAIButton] Using comprehensiveFix');
                    window.comprehensiveFix.patchGenAIMakeup();
                    
                    // Force reinitialize all fixes
                    if (window.comprehensiveFix.reinitialize) {
                        window.comprehensiveFix.reinitialize();
                    }
                    
                    // Try init again after patching
                    setTimeout(() => {
                        if (window.initGenAIMakeup) {
                            window.initGenAIMakeup();
                        }
                    }, 300);
                    return;
                }
                
                // If all else fails, show a message
                console.log('[StandaloneGenAIButton] Could not find any method to trigger GenAI makeup');
                alert('Working on initializing GenAI makeup... Please try again in a moment.');
                
            } catch (error) {
                console.error('[StandaloneGenAIButton] Error triggering GenAI makeup:', error);
            }
        });
        
        // Add to the document
        document.body.appendChild(button);
        console.log('[StandaloneGenAIButton] Button created');
    }
    
    // Create the button when the DOM is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        createButton();
    } else {
        document.addEventListener('DOMContentLoaded', createButton);
    }
    
    // Ensure the button exists even if added dynamically after page load
    setInterval(createButton, 2000);
    
    // Create initially after a delay to ensure the DOM is ready
    setTimeout(createButton, 1000);
    
    console.log('[StandaloneGenAIButton] Script loaded');
})();