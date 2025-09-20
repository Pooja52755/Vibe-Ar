/**
 * Adds local product images that will be available offline
 */

// This script will load local product images as a fallback
document.addEventListener('DOMContentLoaded', function() {
    // Define local product image fallbacks for makeup products (AI Suggester - Banuba)
    const MAKEUP_PRODUCT_IMAGES = {
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

    // Define fashion product images for AI Search (Gen AI)
    const FASHION_PRODUCT_IMAGES = {
        'saree': [
            './png images/myntra_-main/black-sequin-saree--party-nightout-bold.webp',
            './png images/myntra_-main/pastel-pink-organza-saree--pastel-festive-chic.webp',
            './png images/myntra_-main/yellow-cotton-saree--summer-casual-ethnic.webp'
        ],
        'dress': [
            './png images/myntra_-main/Black Satin Slip Dress – party, night-out, chic.jpg',
            './png images/myntra_-main/Floral Print Maxi Dress – vacation, aesthetic, flowy.jpeg',
            './png images/myntra_-main/White Summer Sundress – summer, brunch, aesthetic.jpg',
            './png images/myntra_-main/Velvet Mini Dress – party, luxe, chic.webp',
            './png images/myntra_-main/navy-blue-blazer-dress--formal-office-interview.avif'
        ],
        'top': [
            './png images/myntra_-main/crisp-white-blouse--formal-office-minimal.jpg',
            './png images/myntra_-main/Cropped Sweatshirt – casual, sporty, cozy.webp',
            './png images/myntra_-main/Neon Green Tank Top – party, gym, bold.webp',
            './png images/myntra_-main/Pastel Blue Crop Top – pastel, summer, chic.webp',
            './png images/myntra_-main/pastel-beige-peplum-top--formal-office-minimal.jpg',
            './png images/myntra_-main/pastel-mint-peplum-top--pastel-chic-brunch.webp',
            './png images/myntra_-main/sequin-tube-top--party-nightout-bold.jpg',
            './png images/myntra_-main/tailored-grey-blazer-top--formal-office-professional.jpg'
        ],
        'kurti': [
            './png images/myntra_-main/floral-printed-kurta-set--brunch-ethnic-casual.webp',
            './png images/myntra_-main/Indo-Western Fusion Kurti – college, ethnic-modern, casual.webp',
            './png images/myntra_-main/pastel-blue-kurta-set--ethnic-office-formal.webp',
            './png images/myntra_-main/Pastel Green Anarkali – ethnic, festive, pastel.jpg'
        ],
        'pants': [
            './png images/myntra_-main/beige-formal-trousers--interview-work-minimal.webp',
            './png images/myntra_-main/Black Cargo Pants – streetwear, utility, edgy.jpg',
            './png images/myntra_-main/black-highwaist-trousers--formal-office-interview.avif',
            './png images/myntra_-main/black-palazzo-pants--ethnic-casual-comfy.webp',
            './png images/myntra_-main/Grey Joggers – cozy, sporty, casual.jpg',
            './png images/myntra_-main/modern-dhoti-pant-crop-top--fusion-festive-trendy.jpg',
            './png images/myntra_-main/Pastel Pink Wide-leg Pants – pastel, aesthetic, chic.jpg'
        ],
        'jeans': [
            './png images/myntra_-main/High-waist Ripped Jeans – streetwear, casual, college.jpg',
            './png images/myntra_-main/Retro Flared Jeans – vintage, 90s, aesthetic.avif'
        ],
        'skirt': [
            './png images/myntra_-main/Floral Midi Skirt – summer, aesthetic, brunch.jpg',
            './png images/myntra_-main/grey-pencil-skirt--formal-office-chic.jpg',
            './png images/myntra_-main/metallic-mini-skirt--party-edgy-trendy.webp',
            './png images/myntra_-main/pastel-blue-pleated-skirt--pastel-aesthetic-chic.jpg'
        ],
        'jacket': [
            './png images/myntra_-main/Denim Jacket – college, casual, timeless.jpeg',
            './png images/myntra_-main/Leather Biker Jacket – edgy, party, streetwear.jpg',
            './png images/myntra_-main/Oversized Blazer – formal, chic, streetwear mix.jpg',
            './png images/myntra_-main/Pastel Lavender Puffer Jacket – winter, pastel, cozy.webp',
            './png images/myntra_-main/Pastel Gradient Windbreaker – pastel, streetwear, rainy.webp',
            './png images/myntra_-main/Sequin Jacket – party, night-out, bold.jpg',
            './png images/myntra_-main/tailored-navy-pantsuit--formal-interview-professional.jpg'
        ],
        'sweater': [
            './png images/myntra_-main/Beige Knit Sweater – cozy, autumn, minimal.jpg',
            './png images/myntra_-main/black-turtleneck--winter-minimal-classy.jpg',
            './png images/myntra_-main/Black Graphic Hoodie – streetwear, winter, rainy, cozy.webp',
            './png images/myntra_-main/Oversized Blanket Hoodie – winter, cozy, indoor.jpg',
            './png images/myntra_-main/Oversized Plaid Shirt – casual, cozy, college.jpg'
        ],
        'shoes': [
            './png images/myntra_-main/Black Combat Boots – edgy, winter, rainy.webp',
            './png images/myntra_-main/black-block-heels--office-formal-comfort.jpg',
            './png images/myntra_-main/Chunky Dad Sneakers – streetwear, trendy, GenZ.jpg',
            './png images/myntra_-main/ethnic-juttis--festive-ethnic-traditional.jpeg',
            './png images/myntra_-main/Glittery Heels – party, night-out, chic.jpeg',
            './png images/myntra_-main/Glow-in-the-dark Sneakers – party, rave, edgy.jpg',
            './png images/myntra_-main/Pastel Yellow Slip-ons – pastel, summer, cute.webp',
            './png images/myntra_-main/red-stilettos--party-bold-chic.webp',
            './png images/myntra_-main/White Sneakers – all-season, casual, college.webp',
            './png images/myntra_-main/white-platform-sneakers--streetwear-trendy-casual.webp'
        ],
        'accessories': [
            './png images/myntra_-main/beaded-statement-earrings--festive-ethnic-bold.jpeg',
            './png images/myntra_-main/Black Beanie – winter, streetwear, cozy.jpeg',
            './png images/myntra_-main/Boho Fringe Bag – aesthetic, indie, casual.webp',
            './png images/myntra_-main/Bucket Hat (Beige) – summer, aesthetic, casual.jpg',
            './png images/myntra_-main/Chunky Hoop Earrings – party, bold, trendy.jpg',
            './png images/myntra_-main/Cozy Wool Scarf – winter, cozy, minimal.jpeg',
            './png images/myntra_-main/Ethnic Dupatta with Mirror Work – festive, traditional, chic.jpg',
            './png images/myntra_-main/Mini Pastel Backpack – college, pastel, casual.jpg',
            './png images/myntra_-main/Oversized Round Sunglasses – summer, vacation, GenZ.jpg',
            './png images/myntra_-main/Oversized Tote Bag – chic, minimal, work.jpg',
            './png images/myntra_-main/Pastel Scrunchie Pack – pastel, aesthetic, casual.jpg',
            './png images/myntra_-main/Silver Layered Necklace – party, chic, Y2K.jpg',
            './png images/myntra_-main/silver-clutch-bag--party-chic-nightout.jpg',
            './png images/myntra_-main/Smartwatch – tech, sporty, GenZ.jpg',
            './png images/myntra_-main/Straw Hat – beach, summer, vacation.webp',
            './png images/myntra_-main/structured-tote-bag--office-formal-functional.jpg',
            './png images/myntra_-main/Transparent Raincoat – rainy, monsoon, utility.webp',
            './png images/myntra_-main/Transparent Sling Bag – party, trendy, Y2K.webp',
            './png images/myntra_-main/Transparent Umbrella – rainy, monsoon, utility.webp',
            './png images/myntra_-main/Waterproof Backpack – rainy, college, sporty.webp'
        ],
        'shirt': [
            './png images/myntra_-main/crisp-white-blouse--formal-office-minimal.jpg',
            './png images/myntra_-main/Oversized White T-shirt – casual, streetwear, college.webp',
            './png images/myntra_-main/striped-oversized-shirt--college-casual-streetwear.webp',
            './png images/myntra_-main/Tie-dye T-shirt – aesthetic, streetwear, GenZ.webp',
            './png images/myntra_-main/white-button-down-shirt--formal-interview-minimal.webp'
        ],
        'ethnic': [
            './png images/myntra_-main/black-sequin-saree--party-nightout-bold.webp',
            './png images/myntra_-main/pastel-pink-organza-saree--pastel-festive-chic.webp',
            './png images/myntra_-main/yellow-cotton-saree--summer-casual-ethnic.webp',
            './png images/myntra_-main/floral-printed-kurta-set--brunch-ethnic-casual.webp',
            './png images/myntra_-main/Indo-Western Fusion Kurti – college, ethnic-modern, casual.webp',
            './png images/myntra_-main/pastel-blue-kurta-set--ethnic-office-formal.webp',
            './png images/myntra_-main/Pastel Green Anarkali – ethnic, festive, pastel.jpg',
            './png images/myntra_-main/denim-dungarees--college-casual-cute.jpeg',
            './png images/myntra_-main/modern-dhoti-pant-crop-top--fusion-festive-trendy.jpg'
        ],
        'default': [
            './png images/myntra_-main/black-sequin-saree--party-nightout-bold.webp',
            './png images/myntra_-main/Black Satin Slip Dress – party, night-out, chic.jpg',
            './png images/myntra_-main/crisp-white-blouse--formal-office-minimal.jpg',
            './png images/myntra_-main/High-waist Ripped Jeans – streetwear, casual, college.jpg',
            './png images/myntra_-main/White Sneakers – all-season, casual, college.webp'
        ]
    };

    // Combined product images based on context (AI Search vs AI Suggester)
    let LOCAL_PRODUCT_IMAGES = MAKEUP_PRODUCT_IMAGES;

    // Function to detect if we're in AI Search context (Gen AI) or AI Suggester context (Banuba)
    function detectProductContext() {
        // Check for AI Search indicators
        const isAISearch = document.querySelector('#ai-search') || 
                          document.querySelector('.ai-search') ||
                          document.querySelector('[data-context="ai-search"]') ||
                          window.location.href.includes('ai-search') ||
                          document.body.classList.contains('ai-search-mode');

        // Check for AI Suggester indicators (Banuba makeup context)
        const isAISuggester = document.querySelector('.bnb-makeup') || 
                             document.querySelector('.bnb-features') ||
                             document.querySelector('[data-context="ai-suggester"]') ||
                             document.body.classList.contains('makeup-mode') ||
                             window.location.href.includes('beauty');

        // Check if product cards contain fashion items (sarees, dresses, etc.)
        const productCards = document.querySelectorAll('.product-card');
        let hasFashionProducts = false;
        productCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            if (text.includes('saree') || text.includes('dress') || text.includes('kurti') || 
                text.includes('jeans') || text.includes('shirt') || text.includes('ethnic') ||
                text.includes('trousers') || text.includes('skirt') || text.includes('jacket')) {
                hasFashionProducts = true;
            }
        });

        // Update LOCAL_PRODUCT_IMAGES based on context
        if (hasFashionProducts || isAISearch) {
            console.log('Detected AI Search context - using fashion product images');
            LOCAL_PRODUCT_IMAGES = FASHION_PRODUCT_IMAGES;
            return 'ai-search';
        } else if (isAISuggester) {
            console.log('Detected AI Suggester context - using makeup product images');
            LOCAL_PRODUCT_IMAGES = MAKEUP_PRODUCT_IMAGES;
            return 'ai-suggester';
        } else {
            // Default to makeup if unclear
            console.log('Using default makeup product images');
            LOCAL_PRODUCT_IMAGES = MAKEUP_PRODUCT_IMAGES;
            return 'default';
        }
    }

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
                    // Detect context first
                    const context = detectProductContext();
                    
                    // Determine product type based on context
                    let productType = 'default';
                    
                    if (context === 'ai-search') {
                        // Fashion product detection for AI Search
                        if (originalSrc.includes('saree')) productType = 'saree';
                        else if (originalSrc.includes('dress')) productType = 'dress';
                        else if (originalSrc.includes('kurti') || originalSrc.includes('kurta')) productType = 'kurti';
                        else if (originalSrc.includes('top') || originalSrc.includes('blouse')) productType = 'top';
                        else if (originalSrc.includes('jeans')) productType = 'jeans';
                        else if (originalSrc.includes('pants') || originalSrc.includes('trousers')) productType = 'pants';
                        else if (originalSrc.includes('skirt')) productType = 'skirt';
                        else if (originalSrc.includes('jacket') || originalSrc.includes('blazer')) productType = 'jacket';
                        else if (originalSrc.includes('sweater') || originalSrc.includes('hoodie')) productType = 'sweater';
                        else if (originalSrc.includes('shoes') || originalSrc.includes('sneaker') || originalSrc.includes('heel')) productType = 'shoes';
                        else if (originalSrc.includes('shirt')) productType = 'shirt';
                        else if (originalSrc.includes('ethnic') || originalSrc.includes('anarkali')) productType = 'ethnic';
                        else if (originalSrc.includes('bag') || originalSrc.includes('accessory') || originalSrc.includes('jewelry')) productType = 'accessories';
                    } else {
                        // Makeup product detection for AI Suggester
                        if (originalSrc.includes('mascara')) productType = 'mascara';
                        else if (originalSrc.includes('lipstick')) productType = 'lipstick';
                        else if (originalSrc.includes('eyeshadow')) productType = 'eyeshadow';
                        else if (originalSrc.includes('blush')) productType = 'blush';
                        else if (originalSrc.includes('foundation')) productType = 'foundation';
                        else if (originalSrc.includes('eyeliner')) productType = 'eyeliner';
                    }
                    
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