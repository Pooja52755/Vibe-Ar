/**
 * Adds local product images that will be available offline
 */

// This script will load local product images as a fallback
document.addEventListener('DOMContentLoaded', function() {
    // Define local product image fallbacks using actual product images
    const LOCAL_PRODUCT_IMAGES = {
        'lipstick': [
            './assets/products/lipstick/red.jpg',
            './assets/products/lipstick/pink.jpg',
            './assets/products/lipstick/coral.jpg',
            './assets/products/lipstick/berry.jpg'
        ],
        'eyeshadow': [
            './assets/products/eyeshadow/smoky.jpg',
            './assets/products/eyeshadow/sunset.jpg',
            './assets/products/eyeliner/liquid-black.png',
            './assets/products/eyeliner/gel-blue.png'
        ],
        'blush': [
            './assets/products/blush/coral.png',
            './assets/products/blush/rosy.png',
            './assets/products/lipstick/pink.jpg',
            './assets/products/lipstick/coral.jpg'
        ],
        'foundation': [
            './assets/products/foundation/dewy-glow.jpg',
            './assets/products/foundation/matte-velvet.jpg',
            './assets/products/foundation/bb-cream.jpg'
        ],
        'mascara': [
            './assets/products/mascara/length.jpg',
            './assets/products/mascara/curl.jpg',
            './assets/products/mascara/natural.jpg',
            './assets/products/eyeliner/liquid-black.png',
            './assets/products/eyeshadow/smoky.jpg'
        ],
        'eyeliner': [
            './assets/products/eyeliner/liquid-black.png',
            './assets/products/eyeliner/gel-blue.png',
            './assets/products/eyeshadow/smoky.jpg'
        ],
        'default': [
            './assets/products/lipstick/red.jpg',
            './assets/products/eyeshadow/smoky.jpg',
            './assets/products/blush/coral.png',
            './assets/products/foundation/dewy-glow.jpg'
        ]
    };

    // Function to get currently selected makeup features from the AR app
    function getSelectedFeatures() {
        const selectedFeatures = [];
        
        // Method 1: Check the Vue.js "Selected Features" panel with b-tag elements
        const selectedFeaturesPanel = document.querySelector('.bnb-features');
        if (selectedFeaturesPanel) {
            const tagElements = selectedFeaturesPanel.querySelectorAll('.tag, .b-tag, [class*="tag"]');
            tagElements.forEach(tag => {
                const tagText = tag.textContent.toLowerCase().trim();
                
                // Map the feature names from the panel to product categories
                if (tagText.includes('color') && 
                    tag.closest('section')?.querySelector('h4')?.textContent.toLowerCase().includes('lipstick')) {
                    selectedFeatures.push('lipstick');
                }
                
                // Special handling for makeup looks that are eyeshadow-related
                if (tagText.includes('look')) {
                    if (tagText.includes('bluebell') || tagText.includes('smoky') || 
                        tagText.includes('twilight') || tagText.includes('40s') ||
                        tagText.includes('aster') || tagText.includes('confetti') ||
                        tagText.includes('dolly') || tagText.includes('queen') ||
                        tagText.includes('jasmine') || tagText.includes('coral')) {
                        selectedFeatures.push('eyeshadow');
                    }
                }
                
                if (tagText.includes('foundation') || tagText.includes('base')) {
                    selectedFeatures.push('foundation');
                }
                if (tagText.includes('mascara') || tagText.includes('eyelash')) {
                    selectedFeatures.push('mascara');
                }
                if (tagText.includes('eyeliner') || tagText.includes('liner')) {
                    selectedFeatures.push('eyeliner');
                }
                if (tagText.includes('blush') || tagText.includes('cheek')) {
                    selectedFeatures.push('blush');
                }
                
                // Check the section header to determine category
                const sectionHeader = tag.closest('section')?.querySelector('h4')?.textContent.toLowerCase();
                if (sectionHeader) {
                    if (sectionHeader.includes('lipstick')) {
                        selectedFeatures.push('lipstick');
                    }
                    if (sectionHeader.includes('eyes')) {
                        selectedFeatures.push('eyeshadow');
                    }
                    if (sectionHeader.includes('makeup')) {
                        // For general makeup, try to determine from tag text
                        if (tagText.includes('blush') || tagText.includes('cheek')) {
                            selectedFeatures.push('blush');
                        }
                    }
                }
            });
        }
        
        // Method 2: Check for selected features in various other possible locations
        const featureSelectors = [
            '.selected-feature',
            '.active-feature', 
            '.feature.selected',
            '.feature.active',
            '[data-selected="true"]',
            '.bnb-feature.selected',
            '.makeup-feature.active'
        ];
        
        featureSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                const featureText = (el.textContent || el.getAttribute('data-feature') || '').toLowerCase();
                if (featureText.includes('lip')) selectedFeatures.push('lipstick');
                if (featureText.includes('eye') && featureText.includes('shadow')) selectedFeatures.push('eyeshadow');
                if (featureText.includes('blush')) selectedFeatures.push('blush');
                if (featureText.includes('foundation')) selectedFeatures.push('foundation');
                if (featureText.includes('mascara')) selectedFeatures.push('mascara');
                if (featureText.includes('eyeliner')) selectedFeatures.push('eyeliner');
            });
        });
        
        // Method 3: Also check for active makeup components in the Banuba app
        const banubaElements = document.querySelectorAll('.bnb-makeup [class*="active"], .bnb-makeup [class*="selected"]');
        banubaElements.forEach(el => {
            const className = el.className.toLowerCase();
            if (className.includes('lip')) selectedFeatures.push('lipstick');
            if (className.includes('eye') && !className.includes('liner')) selectedFeatures.push('eyeshadow');
            if (className.includes('blush')) selectedFeatures.push('blush');
            if (className.includes('foundation')) selectedFeatures.push('foundation');
            if (className.includes('mascara')) selectedFeatures.push('mascara');
            if (className.includes('liner')) selectedFeatures.push('eyeliner');
        });
        
        // Remove duplicates and return
        const uniqueFeatures = [...new Set(selectedFeatures)];
        console.log('Detected selected features:', uniqueFeatures);
        return uniqueFeatures;
    }

    // Expose function globally for debugging
    window.getSelectedFeatures = getSelectedFeatures;

    // Function to get product images based on selected features
    function getProductImagesForSelectedFeatures() {
        const selectedFeatures = getSelectedFeatures();
        console.log('Selected makeup features:', selectedFeatures);
        
        if (selectedFeatures.length === 0) {
            // No specific features selected, return all categories
            return LOCAL_PRODUCT_IMAGES;
        }
        
        // Filter product images based on selected features
        const filteredImages = {};
        selectedFeatures.forEach(feature => {
            if (LOCAL_PRODUCT_IMAGES[feature]) {
                filteredImages[feature] = LOCAL_PRODUCT_IMAGES[feature];
            }
        });
        
        // If no matching categories found, fallback to default
        if (Object.keys(filteredImages).length === 0) {
            filteredImages.default = LOCAL_PRODUCT_IMAGES.default;
        }
        
        return filteredImages;
    }

    // Function to check if an image exists using a promise-based approach
    function imageExists(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    // Function to proactively check and replace broken images before they fail
    async function proactiveImageCheck() {
        const images = document.querySelectorAll('img');
        
        for (const img of images) {
            const originalSrc = img.src || img.getAttribute('src');
            if (!originalSrc) continue;
            
            // Skip if it's already a fallback image
            if (originalSrc.includes('assets/looks/') || 
                originalSrc.includes('assets/textures/') || 
                originalSrc.includes('assets/products/')) {
                continue;
            }
            
            try {
                const exists = await imageExists(originalSrc);
                if (!exists) {
                    // Determine product type and replace with fallback
                    let productType = 'default';
                    if (originalSrc.includes('mascara')) productType = 'mascara';
                    else if (originalSrc.includes('lipstick')) productType = 'lipstick';
                    else if (originalSrc.includes('eyeshadow')) productType = 'eyeshadow';
                    else if (originalSrc.includes('blush')) productType = 'blush';
                    else if (originalSrc.includes('foundation')) productType = 'foundation';
                    else if (originalSrc.includes('eyeliner')) productType = 'eyeshadow';
                    
                    const selectedProductImages = getProductImagesForSelectedFeatures();
                    const fallbackImages = selectedProductImages[productType] || 
                                         LOCAL_PRODUCT_IMAGES[productType] || 
                                         LOCAL_PRODUCT_IMAGES.default;
                    const randomIndex = Math.floor(Math.random() * fallbackImages.length);
                    const fallbackSrc = fallbackImages[randomIndex];
                    
                    console.log(`Proactively replacing potentially broken image: ${originalSrc} -> ${fallbackSrc}`);
                    img.src = fallbackSrc;
                }
            } catch (error) {
                console.warn('Error checking image existence:', error);
            }
        }
    }

    // Function to replace broken images with local fallbacks
    function setupImageErrorHandling() {
        // Select all product card images
        document.addEventListener('error', function(event) {
            const target = event.target;
            // Check if the error is from an image
            if (target.tagName === 'IMG') {
                // Try to determine product type from parent element or image source
                let productType = 'default'; // default
                const productCard = target.closest('.product-card');
                const imageSrc = target.src || target.getAttribute('src') || '';
                
                // First, try to determine type from image path
                if (imageSrc.includes('mascara')) {
                    productType = 'mascara';
                } else if (imageSrc.includes('lipstick')) {
                    productType = 'lipstick';
                } else if (imageSrc.includes('eyeshadow')) {
                    productType = 'eyeshadow';
                } else if (imageSrc.includes('blush')) {
                    productType = 'blush';
                } else if (imageSrc.includes('foundation')) {
                    productType = 'foundation';
                } else if (imageSrc.includes('eyeliner')) {
                    productType = 'eyeshadow'; // Use eyeshadow fallbacks for eyeliner
                }
                
                // If path detection didn't work, try from parent element
                if (productType === 'default' && productCard) {
                    const categoryEl = productCard.querySelector('.product-category') || 
                                      productCard.querySelector('span') ||
                                      productCard.querySelector('p:nth-child(3)');
                                      
                    if (categoryEl) {
                        const typeContent = categoryEl.textContent.toLowerCase();
                        if (typeContent.includes('eyeshadow')) {
                            productType = 'eyeshadow';
                        } else if (typeContent.includes('blush')) {
                            productType = 'blush';
                        } else if (typeContent.includes('lipstick')) {
                            productType = 'lipstick';
                        } else if (typeContent.includes('mascara')) {
                            productType = 'mascara';
                        } else if (typeContent.includes('foundation')) {
                            productType = 'foundation';
                        }
                    }
                }
                
                // Get a random fallback image from the appropriate category based on selected features
                const selectedProductImages = getProductImagesForSelectedFeatures();
                const fallbackImages = selectedProductImages[productType] || 
                                     LOCAL_PRODUCT_IMAGES[productType] || 
                                     LOCAL_PRODUCT_IMAGES.default;
                const randomIndex = Math.floor(Math.random() * fallbackImages.length);
                const fallbackSrc = fallbackImages[randomIndex];
                
                // Replace the broken image
                console.log(`Replacing broken image (${imageSrc}) with local fallback: ${fallbackSrc}`);
                target.src = fallbackSrc;
                
                // Prevent the error from firing again on the same image
                target.onerror = null;
                
                // If this is a preview image that should have filters, make sure the filters get applied
                if (target.closest('.bnb-makeup') || target.classList.contains('preview-image') || 
                    target.classList.contains('makeup-preview') || target.id === 'makeup-preview') {
                    
                    console.log('Detected a makeup preview image, checking for filters to apply');
                    
                    // Apply basic filters for preview images
                    setTimeout(() => {
                        // Apply default CSS filters
                        target.style.filter = 'brightness(1.1) contrast(1.1) saturate(1.2)';
                    }, 200);
                }
            }
        }, true); // Capture phase to catch all image errors
    }
    function createProductImagePlaceholders() {
        // Get currently selected makeup features
        const selectedProductImages = getProductImagesForSelectedFeatures();
        const categories = Object.keys(selectedProductImages);
        
        console.log('Creating product placeholders for categories:', categories);
        
        const baseColors = {
            'lipstick': ['#FF5C7A', '#FF7F50', '#DC143C', '#FFB6C1', '#C67D95'],
            'eyeshadow': ['#555555', '#4B0082', '#2F4F4F', '#8B4513', '#6A5ACD'],
            'blush': ['#FFAA99', '#FF92A5', '#FFC0CB', '#F0E68C', '#DDA0DD'],
            'foundation': ['#F5DEB3', '#DEB887', '#D2B48C', '#BC9A6A', '#8D5524'],
            'mascara': ['#000000', '#2D2D2D', '#4A4A4A', '#1A1A1A', '#333333'],
            'eyeliner': ['#000000', '#1e40af', '#4c1d95', '#065f46', '#7c2d12'],
            'default': ['#FF5C7A', '#555555', '#FFAA99', '#F5DEB3']
        };
        
        // For each product card, provide a data-fallback-image attribute
        document.querySelectorAll('.product-card').forEach(card => {
            // Try to determine product type
            let productType = categories[0] || 'default'; // Use first selected category as default
            const typeText = card.querySelector('div:nth-child(3)');
            if (typeText) {
                const typeContent = typeText.textContent.toLowerCase();
                // Match the product type with selected categories
                categories.forEach(category => {
                    if (typeContent.includes(category)) {
                        productType = category;
                    }
                });
            }
            
            // Get a random fallback image from the appropriate category
            const fallbackImages = selectedProductImages[productType] || selectedProductImages[categories[0]] || LOCAL_PRODUCT_IMAGES.default;
            const randomIndex = Math.floor(Math.random() * fallbackImages.length);
            const fallbackSrc = fallbackImages[randomIndex];
            
            // Set a data attribute for the fallback image
            card.setAttribute('data-fallback-image', fallbackSrc);
            card.setAttribute('data-product-type', productType);
            
            // Add a color indicator based on the product
            const existingIndicator = card.querySelector('.color-indicator');
            if (existingIndicator) {
                existingIndicator.remove();
            }
            
            const colorIndicator = document.createElement('div');
            colorIndicator.className = 'color-indicator';
            const colorArray = baseColors[productType] || baseColors.default;
            const colorIndex = randomIndex % colorArray.length;
            colorIndicator.style.cssText = `
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color: ${colorArray[colorIndex]};
                position: absolute;
                top: 5px;
                left: 5px;
                border: 2px solid white;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                z-index: 10;
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

    // Monitor for feature selection changes and update product cards accordingly
    function monitorFeatureSelectionChanges() {
        const observer = new MutationObserver(mutations => {
            let shouldUpdateCards = false;
            
            mutations.forEach(mutation => {
                // Check if any feature-related classes changed
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'class' || mutation.attributeName === 'data-selected')) {
                    const target = mutation.target;
                    if (target.classList.contains('feature') || 
                        target.classList.contains('bnb-feature') ||
                        target.classList.contains('tag') ||
                        target.classList.contains('b-tag') ||
                        target.className.includes('makeup') ||
                        target.className.includes('selected') ||
                        target.className.includes('active')) {
                        shouldUpdateCards = true;
                    }
                }
                
                // Check if new feature elements were added or removed (Vue.js reactivity)
                if (mutation.type === 'childList' && (mutation.addedNodes.length || mutation.removedNodes.length)) {
                    // Check if changes happened in the Selected Features panel
                    const target = mutation.target;
                    if (target.closest && (
                        target.closest('.bnb-features') ||
                        target.closest('.bnb-features__list') ||
                        target.classList.contains('bnb-features') ||
                        target.classList.contains('tag') ||
                        target.classList.contains('b-tag')
                    )) {
                        shouldUpdateCards = true;
                    }
                    
                    // Check added/removed nodes
                    [...mutation.addedNodes, ...mutation.removedNodes].forEach(node => {
                        if (node.nodeType === 1 && (
                            node.className.includes('feature') ||
                            node.className.includes('makeup') ||
                            node.className.includes('tag') ||
                            node.className.includes('b-tag') ||
                            node.querySelector && (
                                node.querySelector('.feature') ||
                                node.querySelector('.bnb-feature') ||
                                node.querySelector('.tag') ||
                                node.querySelector('.b-tag') ||
                                node.querySelector('[class*="makeup"]')
                            )
                        )) {
                            shouldUpdateCards = true;
                        }
                    });
                }
            });
            
            if (shouldUpdateCards) {
                console.log('Feature selection changed, updating product cards...');
                setTimeout(() => {
                    createProductImagePlaceholders();
                    updateProductShowcaseContent();
                }, 500); // Small delay to ensure DOM updates are complete
            }
        });
        
        // Start observing the document for feature changes
        observer.observe(document.body, {
            attributes: true,
            childList: true,
            subtree: true,
            attributeFilter: ['class', 'data-selected', 'data-active']
        });
        
        // Also specifically watch the Selected Features panel if it exists
        setTimeout(() => {
            const featuresPanel = document.querySelector('.bnb-features');
            if (featuresPanel) {
                console.log('Found Selected Features panel, setting up specific observer');
                const featuresObserver = new MutationObserver(() => {
                    console.log('Selected Features panel changed');
                    setTimeout(() => {
                        createProductImagePlaceholders();
                        updateProductShowcaseContent();
                    }, 300);
                });
                
                featuresObserver.observe(featuresPanel, {
                    childList: true,
                    subtree: true,
                    attributes: true
                });
            }
        }, 2000);
    }

    // Function to update product showcase content based on selected features
    function updateProductShowcaseContent() {
        const selectedFeatures = getSelectedFeatures();
        
        // Send message to product showcase iframe if it exists
        const iframe = document.querySelector('#product-showcase-overlay iframe');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({
                action: 'updateProducts',
                selectedFeatures: selectedFeatures
            }, '*');
        }
        
        // Also trigger a custom event for other components
        const event = new CustomEvent('featuresChanged', {
            detail: { selectedFeatures: selectedFeatures }
        });
        document.dispatchEvent(event);
    }

    // Check mascara images and ensure they exist
    imageExists('./assets/products/mascara/length.jpg').then(exists => {
        if (!exists) {
            console.log('Mascara images not found, using default fallbacks');
            LOCAL_PRODUCT_IMAGES.mascara = LOCAL_PRODUCT_IMAGES.default;
        } else {
            console.log('Mascara product images loaded successfully');
        }
    });

    // Initialize image error handling
    setupImageErrorHandling();
    
    // Start monitoring for feature selection changes
    monitorFeatureSelectionChanges();
    
    // When product cards appear, apply the fallback system
    setTimeout(createProductImagePlaceholders, 1000);
    setTimeout(createProductImagePlaceholders, 3000);
    
    // Run proactive image checks
    setTimeout(proactiveImageCheck, 2000);
    setTimeout(proactiveImageCheck, 5000);
    
    // Periodically check for feature changes and update accordingly
    setInterval(() => {
        const selectedFeatures = getSelectedFeatures();
        if (selectedFeatures.length > 0) {
            createProductImagePlaceholders();
        }
    }, 3000); // Check every 3 seconds
});