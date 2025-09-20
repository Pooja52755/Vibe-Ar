/**
 * Script to verify that the application only shows product cards 
 * when manual filters are applied
 */

// Flag to control automatic product display
let autoLoadProducts = false;

/**
 * Check if any filters are applied in the application
 */
function hasActiveFilters() {
    // Check if any makeup filters are active in various ways
    
    // Method 1: Check for filter UI indicators
    const activeFilterElements = document.querySelectorAll('.active-filter, .filter-active, .selected-filter');
    if (activeFilterElements.length > 0) {
        return true;
    }
    
    // Method 2: Check global state if available
    if (window.appliedFilters) {
        const hasFilters = Object.values(window.appliedFilters).some(filter => filter !== null);
        if (hasFilters) {
            return true;
        }
    }
    
    // No active filters found
    return false;
}

document.addEventListener('DOMContentLoaded', function() {
    // Add a test button to verify behavior
    const testButton = document.createElement('button');
    testButton.id = 'test-verification-button';
    testButton.textContent = 'Verify Product Behavior';
    testButton.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        background-color: #3490dc;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 12px;
        font-size: 14px;
        cursor: pointer;
        z-index: 9999;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;
    
    // Add click handler
    testButton.onclick = function() {
        verifyProductDisplayBehavior();
    };
    
    // Add "Show Mock Products" button
    const mockButton = document.createElement('button');
    mockButton.id = 'show-mock-products-button';
    mockButton.textContent = 'Show Mock Products';
    mockButton.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 170px;
        background-color: #e91e63;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 12px;
        font-size: 14px;
        cursor: pointer;
        z-index: 9999;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;
    
    // Add click handler for mock button
    mockButton.onclick = function() {
        showMockProductCards();
    };
    
    // Add to document
    document.body.appendChild(testButton);
    document.body.appendChild(mockButton);
});

/**
 * Verify that product cards are only shown when filters are manually applied
 */
function verifyProductDisplayBehavior() {
    // Create log container
    let logContainer = document.getElementById('verification-log');
    if (!logContainer) {
        logContainer = document.createElement('div');
        logContainer.id = 'verification-log';
        logContainer.style.cssText = `
            position: fixed;
            bottom: 50px;
            right: 10px;
            width: 300px;
            max-height: 200px;
            overflow-y: auto;
            background-color: rgba(0,0,0,0.8);
            color: white;
            border-radius: 4px;
            padding: 10px;
            font-size: 12px;
            font-family: monospace;
            z-index: 9999;
        `;
        document.body.appendChild(logContainer);
    }
    
    // Clear previous logs
    logContainer.innerHTML = '';
    
    // Log test start
    logEntry('Starting verification test...');
    
    // Check if product container exists
    const productContainer = document.getElementById('ai-product-container');
    logEntry(`Product container exists: ${!!productContainer}`);
    
    if (productContainer) {
        // Check if product container is visible
        const isVisible = productContainer.style.display !== 'none';
        logEntry(`Product container visible: ${isVisible}`);
        
        // Check how many product cards are shown
        const productCards = document.querySelectorAll('.product-card');
        logEntry(`Number of product cards: ${productCards.length}`);
        
        // Add a button to show mock products directly
        const showMockButton = document.createElement('button');
        showMockButton.textContent = 'Show Mock Products Now';
        showMockButton.style.cssText = `
            background-color: #e91e63;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            margin-top: 10px;
            cursor: pointer;
            display: block;
            width: 100%;
        `;
        showMockButton.onclick = () => {
            logEntry('Showing mock products directly...');
            if (window.aiFilterSuggestion && typeof window.aiFilterSuggestion.showRandomProducts === 'function') {
                window.aiFilterSuggestion.showRandomProducts();
                logEntry('Used AIFilterSuggestion.showRandomProducts()');
            } else {
                showMockProductCards();
                logEntry('Used fallback showMockProductCards()');
            }
        };
        logContainer.appendChild(showMockButton);
    }
    
    // Check for selected features
    try {
        const appElement = document.querySelector('#app');
        let vueApp = null;
        
        if (appElement && appElement.__vue__) {
            vueApp = appElement.__vue__;
            logEntry('Vue app found, checking for selected features...');
            
            // Check if we can access the features component
            let featuresComponent = null;
            
            if (vueApp.$children && vueApp.$children.length > 0) {
                featuresComponent = vueApp.$children[0].features;
            }
            
            if (featuresComponent) {
                logEntry('Features component found');
                
                // Try to find selected features
                const hasLipstick = checkFeatureSelected(featuresComponent, 'Lipstick', 'Color');
                const hasEyeshadow = checkFeatureSelected(featuresComponent, 'Eyes', null);
                const hasBlush = checkFeatureSelected(featuresComponent, 'Makeup', 'Blush');
                
                logEntry(`Selected filters - Lipstick: ${hasLipstick}, Eyeshadow: ${hasEyeshadow}, Blush: ${hasBlush}`);
                
                // Summary
                if (hasLipstick || hasEyeshadow || hasBlush) {
                    logEntry('✅ Filters are selected, product cards should be shown');
                } else {
                    logEntry('❌ No filters selected, product cards should be hidden');
                }
            } else {
                logEntry('❌ Features component not found');
            }
        } else {
            logEntry('❌ Vue app not found');
        }
    } catch (error) {
        logEntry(`Error during verification: ${error.message}`);
    }
}

/**
 * Show mock product cards regardless of selected filters
 */
function showMockProductCards() {
    // Create log entry
    logEntry('Showing mock product cards...');
    
    // Check if product container exists, create if not
    let productContainer = document.getElementById('ai-product-container');
    if (!productContainer) {
        // Create container
        productContainer = document.createElement('div');
        productContainer.id = 'ai-product-container';
        productContainer.style.cssText = `
            position: fixed;
            bottom: 70px;
            left: 0;
            right: 0;
            background-color: rgba(255, 255, 255, 0.95);
            display: flex;
            flex-direction: column;
            padding: 15px;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
            z-index: 9990;
            max-height: 40vh;
        `;
        
        // Create title
        const title = document.createElement('h3');
        title.textContent = 'Recommended Products';
        title.style.cssText = `
            margin: 0 0 10px 0;
            font-size: 18px;
            font-weight: bold;
            color: #333;
        `;
        productContainer.appendChild(title);
        
        // Create cards container
        const cardsContainer = document.createElement('div');
        cardsContainer.id = 'ai-product-cards';
        cardsContainer.style.cssText = `
            display: flex;
            gap: 15px;
            overflow-x: auto;
            padding: 5px 0 15px 0;
        `;
        productContainer.appendChild(cardsContainer);
        
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
        `;
        closeBtn.onclick = () => { productContainer.style.display = 'none'; };
        productContainer.appendChild(closeBtn);
        
        document.body.appendChild(productContainer);
    }
    
    // Get cards container
    const cardsContainer = document.getElementById('ai-product-cards');
    if (!cardsContainer) {
        logEntry('Could not find cards container');
        return;
    }
    
    // Clear existing cards
    cardsContainer.innerHTML = '';
    
    // Mock product data
    const mockProducts = [
        { 
            name: "Classic Red Lipstick", 
            type: "Lipstick", 
            category: "lipstick",
            color: "#CC0000", 
            image: window.location.pathname.includes('/beauty-web/') ? 'assets/looks/Queen.jpg' : '/beauty-web/assets/looks/Queen.jpg', 
            price: "$18.99" 
        },
        { 
            name: "Smoky Night Palette", 
            type: "Eyeshadow", 
            category: "eyeshadow",
            color: "#333333", 
            image: window.location.pathname.includes('/beauty-web/') ? 'assets/looks/Smoky.jpg' : '/beauty-web/assets/looks/Smoky.jpg', 
            price: "$32.99" 
        },
        { 
            name: "Rosy Glow Blush", 
            type: "Blush", 
            category: "blush",
            color: "#FF92A5", 
            image: window.location.pathname.includes('/beauty-web/') ? 'assets/looks/Coral.jpg' : '/beauty-web/assets/looks/Coral.jpg', 
            price: "$18.99" 
        },
        { 
            name: "Perfect Precision Eyeliner", 
            type: "Eyeliner", 
            category: "eyeliner",
            color: "#000000", 
            image: window.location.pathname.includes('/beauty-web/') ? 'assets/looks/Smoky.jpg' : '/beauty-web/assets/looks/Smoky.jpg', 
            price: "$15.99" 
        },
        { 
            name: "Volume Boost Mascara", 
            type: "Mascara", 
            category: "mascara",
            color: "#000000", 
            image: window.location.pathname.includes('/beauty-web/') ? 'assets/looks/Smoky.jpg' : '/beauty-web/assets/looks/Smoky.jpg', 
            price: "$16.99" 
        }
    ];
    
    // Create product cards
    mockProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.cssText = `
            min-width: 150px;
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            background-color: white;
        `;
        
        card.innerHTML = `
            <div style="width: 100px; height: 100px; background-color: #f5f5f5; border-radius: 4px; display: flex; align-items: center; justify-content: center; margin-bottom: 8px;">
                <img src="${product.image}" style="max-width: 100%; max-height: 100%; object-fit: contain;" 
                     alt="${product.name}" 
                     data-category="${product.category || ''}"
                     data-color="${product.color || ''}"
                     onerror="this.onerror=null; this.style.display='none'; this.parentElement.style.backgroundColor='${product.color || '#f5f5f5'}'; this.parentElement.innerHTML+='<span style=\\'color: white; font-size: 12px; text-shadow: 0 1px 2px rgba(0,0,0,0.5);\\'>${product.name.split(' ')[0]}</span>';">
            </div>
            <div style="font-weight: bold; margin-bottom: 2px;">${product.name}</div>
            <div style="color: #888; font-size: 12px; margin-bottom: 5px;">${product.type}</div>
            <div style="color: #e91e63; font-weight: bold;">${product.price}</div>
            <button style="margin-top: 8px; background-color: #e91e63; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Add to Cart</button>
        `;
        
        cardsContainer.appendChild(card);
    });
    
    // Show the container
    productContainer.style.display = 'flex';
    
    logEntry(`Created ${mockProducts.length} mock product cards`);
}

/**
 * Check if a specific feature is selected
 */
function checkFeatureSelected(component, group, name) {
    try {
        // Try to find if feature is selected based on common patterns
        
        // Check direct feature selection
        if (component.selected && component.selected.length > 0) {
            for (const feature of component.selected) {
                if ((group && feature.group === group) || 
                    (name && feature.name === name)) {
                    return true;
                }
            }
        }
        
        // Check via activeId
        if (component.activeId && component.features) {
            for (const feature of component.features) {
                if (feature.id === component.activeId && 
                    ((group && feature.group === group) || 
                     (name && feature.name === name))) {
                    return true;
                }
            }
        }
        
        // Feature-specific checks
        if (group === 'Lipstick' && component.lipstick && component.lipstick.enabled) {
            return true;
        }
        
        if (group === 'Eyes' && component.eyesMakeup && component.eyesMakeup.enabled) {
            return true;
        }
        
        if (name === 'Blush' && component.faceMakeup && component.faceMakeup.blush && 
            component.faceMakeup.blush.enabled) {
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Error checking feature selection:', error);
        return false;
    }
}

/**
 * Add a log entry to the verification log
 */
function logEntry(message) {
    const logContainer = document.getElementById('verification-log');
    if (logContainer) {
        const entry = document.createElement('div');
        entry.textContent = `> ${message}`;
        entry.style.marginBottom = '5px';
        logContainer.appendChild(entry);
        
        // Scroll to bottom
        logContainer.scrollTop = logContainer.scrollHeight;
        
        // Also log to console
        console.log(`[Verification] ${message}`);
    }
}