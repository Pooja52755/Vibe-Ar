/**
 * product-placeholder.js
 * 
 * Creates placeholder images for product recommendations
 * when actual product images are not available.
 */

(function() {
  // Create and add placeholder images on load
  window.addEventListener('load', createPlaceholderImages);
  
  /**
   * Create placeholder images for products
   */
  function createPlaceholderImages() {
    // Create a simple colored rectangle as placeholder
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // Create product placeholder
    createProductPlaceholder(ctx, canvas);
  }
  
  /**
   * Create a product placeholder image
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {HTMLCanvasElement} canvas - Canvas element
   */
  function createProductPlaceholder(ctx, canvas) {
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f5f5f5');
    gradient.addColorStop(1, '#e0e0e0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add a makeup-themed icon
    ctx.fillStyle = '#ccc';
    
    // Draw a lipstick-like shape
    ctx.fillRect(canvas.width / 2 - 15, canvas.height / 2 - 40, 30, 80);
    
    // Draw a circular top
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2 - 40, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Add a label at the bottom
    ctx.fillStyle = '#999';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Product Image', canvas.width / 2, canvas.height - 30);
    
    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/jpeg');
    
    // Create and add image to page (but hidden)
    const img = document.createElement('img');
    img.src = dataUrl;
    img.style.display = 'none';
    img.id = 'product-placeholder';
    document.body.appendChild(img);
    
    // Store the data URL for later use
    window.productPlaceholderUrl = dataUrl;
    
    // Create the product folder if it doesn't exist
    const productFolder = document.createElement('div');
    productFolder.id = 'product-image-folder';
    productFolder.style.display = 'none';
    document.body.appendChild(productFolder);
    
    // Add the placeholder
    const placeholderImg = document.createElement('img');
    placeholderImg.src = dataUrl;
    placeholderImg.id = 'product_placeholder';
    placeholderImg.style.display = 'none';
    productFolder.appendChild(placeholderImg);
  }
})();