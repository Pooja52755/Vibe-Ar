/**
 * AutoApplyMakeup.js - Handles product recommendations based on manual filter selections
 * 
 * This script:
 * 1. Monitors manually applied makeup filters
 * 2. Shows product recommendations based on selected filters
 * 3. Does not automatically apply filters (only shows products for manual selections)
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize product recommendation functionality
    initProductRecommendations();
});

/**
 * Initialize the product recommendation system
 */
function initProductRecommendations() {
    // Create an observer to detect when filters are applied manually
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' || 
               (mutation.type === 'childList' && mutation.addedNodes.length)) {
                checkForFilterChanges();
            }
        });
    });
    
    // Start observing the document for changes
    observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
    });
    
    // Periodically check for filter changes as a backup
    setInterval(checkForFilterChanges, 2000);
}

/**
 * Check if any makeup filters have been applied manually
 */
function checkForFilterChanges() {
    try {
        // Find the Vue application
        const appElement = document.querySelector('#app');
        if (!appElement) return;
        
        // Try to get the Vue instance safely
        let vueApp;
        try {
            vueApp = appElement.__vue__;
        } catch (e) {
            console.log('Vue app not yet available');
            return;
        }
        
        if (!vueApp) return;
        
        // Get the currently selected features
        const selectedFeatures = getSelectedFeatures(vueApp);
        
        // If we found some selected features, show product recommendations
        if (selectedFeatures && Object.keys(selectedFeatures).length > 0) {
            showProductRecommendations(selectedFeatures);
        }
    } catch (error) {
        console.error('Error checking for filter changes:', error);
    }
}

/**
 * Get currently selected makeup features from the Vue app
 */
function getSelectedFeatures(vueApp) {
    // Function to recursively find components
    const findComponent = (component, componentName) => {
        if (!component) return null;
        
        // Check if this is the component we're looking for
        if (component.$options && 
            component.$options.name === componentName) {
            return component;
        }
        
        // Check if features data is available directly
        if (component.features !== undefined) {
            return component;
        }
        
        // Recursively check children
        if (component.$children) {
            for (const child of component.$children) {
                const result = findComponent(child, componentName);
                if (result) return result;
            }
        }
        
        return null;
    };
    
    // Try to find features component (could be BnbFeatures or similar)
    const featuresComponent = findComponent(vueApp, 'BnbFeatures');
    
    if (!featuresComponent) {
        // If we can't find the specific component, try alternate approaches
        if (vueApp.selectedFeatures) {
            return vueApp.selectedFeatures;
        }
        
        if (vueApp.$children && vueApp.$children[0] && vueApp.$children[0].features) {
            return vueApp.$children[0].features;
        }
        
        return null;
    }
    
    // Extract selected feature information
    const selectedFeatures = {};
    
    // Extract lipstick info
    const lipstickFeature = getFeatureByName(featuresComponent, 'Lipstick', 'Color');
    if (lipstickFeature) {
        selectedFeatures.lipstick = {
            name: lipstickFeature.name,
            color: getColorFromFeature(featuresComponent, 'lipstick')
        };
    }
    
    // Extract eyeshadow info
    const eyeshadowFeature = getFeatureByGroup(featuresComponent, 'Eyes');
    if (eyeshadowFeature) {
        selectedFeatures.eyeshadow = {
            name: eyeshadowFeature.name,
            color: getColorFromFeature(featuresComponent, 'eyesMakeup')
        };
    }
    
    // Extract blush info
    const blushFeature = getFeatureByName(featuresComponent, 'Makeup', 'Blush');
    if (blushFeature) {
        selectedFeatures.blush = {
            name: blushFeature.name,
            color: getColorFromFeature(featuresComponent, 'faceMakeup')
        };
    }
    
    return selectedFeatures;
}

/**
 * Get feature by group and name
 */
function getFeatureByName(component, group, name) {
    // If component has features property
    if (component.features) {
        return component.features.find(feature => 
            feature.group === group && feature.name === name);
    }
    
    // If component has groups property
    if (component.groups) {
        const groupFeatures = component.groups[group];
        if (groupFeatures) {
            return groupFeatures.find(feature => feature.name === name);
        }
    }
    
    return null;
}

/**
 * Get feature by group (any feature in the group)
 */
function getFeatureByGroup(component, group) {
    // If component has features property
    if (component.features) {
        return component.features.find(feature => feature.group === group);
    }
    
    // If component has groups property
    if (component.groups) {
        const groupFeatures = component.groups[group];
        if (groupFeatures && groupFeatures.length > 0) {
            return groupFeatures[0];
        }
    }
    
    return null;
}

/**
 * Get color value from feature type
 */
function getColorFromFeature(component, featureType) {
    // Default colors for different feature types
    const defaultColors = {
        'lipstick': '#C67D95',
        'eyesMakeup': '#E0BFB8',
        'faceMakeup': '#FF92A5'
    };
    
    // Try to find the store in the component
    const store = findStore(component, featureType);
    
    if (store) {
        // For lipstick
        if (featureType === 'lipstick' && store.color) {
            return rgbToHex(store.color.r, store.color.g, store.color.b);
        }
        
        // For eyeshadow
        if (featureType === 'eyesMakeup' && store.shadow && store.shadow.color) {
            return rgbToHex(store.shadow.color.r, store.shadow.color.g, store.shadow.color.b);
        }
        
        // For blush
        if (featureType === 'faceMakeup' && store.blush && store.blush.color) {
            return rgbToHex(store.blush.color.r, store.blush.color.g, store.blush.color.b);
        }
    }
    
    // Return default color if we couldn't find the actual color
    return defaultColors[featureType];
}

/**
 * Find store in Vue component
 */
function findStore(component, storeName) {
    if (!component) return null;
    
    if (component[storeName]) return component[storeName];
    
    if (component.$children) {
        for (const child of component.$children) {
            const result = findStore(child, storeName);
            if (result) return result;
        }
    }
    
    return null;
}

/**
 * Convert RGB to HEX color
 */
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Show product recommendations based on selected features
 */
function showProductRecommendations(selectedFeatures) {
    // Only proceed if we have the AIFilterSuggestion instance
    if (!window.aiFilterSuggestion) return;
    
    // Display product cards for the selected features
    window.aiFilterSuggestion.displayProductCards(selectedFeatures);
}