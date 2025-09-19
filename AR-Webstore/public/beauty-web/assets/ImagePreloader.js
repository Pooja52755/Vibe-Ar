/**
 * Preload images to ensure they're available when needed
 */
document.addEventListener('DOMContentLoaded', function() {
    // Preload local product images
    const imagesToPreload = [
        '../png images/blue.jpg',
        '../png images/green.jpg',
        '../png images/pink.jpg',
        '../png images/pink_saree.jpg',
        '../png images/room.jpg'
    ];
    
    // Preload function
    function preloadImages(urls) {
        urls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }
    
    // Start preloading
    preloadImages(imagesToPreload);
});