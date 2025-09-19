/**
 * Adds local product images that will be available offline
 */

// This script will load local product images as a fallback
document.addEventListener('DOMContentLoaded', function() {
    // Define local product image fallbacks
    const LOCAL_PRODUCT_IMAGES = {
        'lipstick': [
            '../png images/lipstick_red.png',
            '../png images/lipstick_pink.png',
            '../png images/lipstick_coral.png',
            '../png images/lipstick_mauve.png',
            '../png images/lipstick_berry.png'
        ],
        'eyeshadow': [
            '../png images/eyeshadow_smoky.png',
            '../png images/eyeshadow_gold.png',
            '../png images/eyeshadow_rose.png',
            '../png images/eyeshadow_green.png', 
            '../png images/eyeshadow_purple.png'
        ],
        'blush': [
            '../png images/blush_peach.png',
            '../png images/blush_rose.png',
            '../png images/blush_coral.png',
            '../png images/blush_berry.png',
            '../png images/blush_mauve.png'
        ]
    };

    // Function to replace broken images with local fallbacks
    function setupImageErrorHandling() {
        // Select all product card images
        document.addEventListener('error', function(event) {
            const target = event.target;
            // Check if the error is from an image
            if (target.tagName === 'IMG') {
                // Try to determine product type from parent element
                let productType = 'lipstick'; // default
                const productCard = target.closest('.product-card');
                
                if (productCard) {
                    const typeText = productCard.querySelector('div:nth-child(3)');
                    if (typeText) {
                        const typeContent = typeText.textContent.toLowerCase();
                        if (typeContent.includes('eyeshadow')) {
                            productType = 'eyeshadow';
                        } else if (typeContent.includes('blush')) {
                            productType = 'blush';
                        }
                    }
                }
                
                // Get a random fallback image from the appropriate category
                const fallbackImages = LOCAL_PRODUCT_IMAGES[productType];
                const randomIndex = Math.floor(Math.random() * fallbackImages.length);
                const fallbackSrc = fallbackImages[randomIndex];
                
                // Replace the broken image
                console.log(`Replacing broken image with local fallback: ${fallbackSrc}`);
                target.src = fallbackSrc;
                
                // Prevent the error from firing again on the same image
                target.onerror = null;
            }
        }, true); // Capture phase to catch all image errors
    }

    // Create placeholder product image directory structure
    function createProductImagePlaceholders() {
        // Ensure the product image directories exist
        const categories = ['lipstick', 'eyeshadow', 'blush'];
        const baseColors = {
            'lipstick': ['#FF5C7A', '#FF7F50', '#C23B22', '#FFB6C1', '#C67D95'],
            'eyeshadow': ['#555555', '#FFDC73', '#E0BFB8', '#50C878', '#E6E6FA'],
            'blush': ['#FFAA99', '#FF92A5', '#FF6F61', '#C24270', '#C8A2C8']
        };
        
        // For each product card, provide a data-fallback-image attribute
        document.querySelectorAll('.product-card').forEach(card => {
            // Try to determine product type
            let productType = 'lipstick'; // default
            const typeText = card.querySelector('div:nth-child(3)');
            if (typeText) {
                const typeContent = typeText.textContent.toLowerCase();
                if (typeContent.includes('eyeshadow')) {
                    productType = 'eyeshadow';
                } else if (typeContent.includes('blush')) {
                    productType = 'blush';
                }
            }
            
            // Get a random fallback image
            const fallbackImages = LOCAL_PRODUCT_IMAGES[productType];
            const randomIndex = Math.floor(Math.random() * fallbackImages.length);
            const fallbackSrc = fallbackImages[randomIndex];
            
            // Set a data attribute for the fallback image
            card.setAttribute('data-fallback-image', fallbackSrc);
            
            // Add a color indicator based on the product
            const colorIndicator = document.createElement('div');
            const colorIndex = randomIndex % baseColors[productType].length;
            colorIndicator.style.cssText = `
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color: ${baseColors[productType][colorIndex]};
                position: absolute;
                top: 5px;
                left: 5px;
                border: 2px solid white;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            `;
            card.style.position = 'relative';
            card.appendChild(colorIndicator);
            
            // Setup direct image replacement for the card
            const img = card.querySelector('img');
            if (img) {
                img.onerror = function() {
                    this.src = fallbackSrc;
                    this.onerror = null; // Prevent infinite loop
                };
                
                // Check if image is already broken
                if (!img.complete || img.naturalWidth === 0) {
                    img.src = fallbackSrc;
                }
            }
        });
    }

    // Monitor for new product cards and apply image error handling
    function monitorProductCards() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    // Look for newly added product cards
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && (
                            node.classList.contains('product-card') || 
                            node.querySelector('.product-card')
                        )) {
                            // Apply error handling to new cards
                            createProductImagePlaceholders();
                        }
                    });
                }
            });
        });
        
        // Start observing the document
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize image error handling
    setupImageErrorHandling();
    
    // Start monitoring for new product cards
    monitorProductCards();
    
    // When product cards appear, apply the fallback system
    setTimeout(createProductImagePlaceholders, 1000);
    setTimeout(createProductImagePlaceholders, 3000);
});