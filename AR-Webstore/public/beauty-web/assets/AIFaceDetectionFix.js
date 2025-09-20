/**
 * AIFaceDetectionFix.js
 * Improves face detection reliability for AI makeup application
 * 
 * This script enhances the face detection capabilities of the Beauty Web
 * AR makeup application to ensure more reliable detection across different
 * lighting conditions, angles, and image qualities.
 */

(function() {
  // Wait for the main app to initialize
  window.addEventListener('DOMContentLoaded', () => {
    // Allow some time for other components to load
    setTimeout(initFaceDetectionFix, 1000);
  });

  function initFaceDetectionFix() {
    console.log('Initializing AI Face Detection Fix...');
    
    // Check if we have access to the app's face detection API
    if (window.bnbObject && window.bnbObject.faceTracker) {
      enhanceBanubaFaceTracker();
    } else {
      // If Banuba object isn't available yet, wait and retry
      const checkInterval = setInterval(() => {
        if (window.bnbObject && window.bnbObject.faceTracker) {
          clearInterval(checkInterval);
          enhanceBanubaFaceTracker();
        }
      }, 500);
      
      // Set a timeout to stop checking after 10 seconds
      setTimeout(() => clearInterval(checkInterval), 10000);
    }
    
    // Add our enhanced detection methods to the global scope
    window.AIFaceDetectionFix = {
      detectFacesInImage,
      enhanceFaceDetection,
      getOptimalImageData,
      checkFaceDetectionStatus
    };
  }
  
  function enhanceBanubaFaceTracker() {
    console.log('Enhancing Banuba Face Tracker...');
    
    // Store the original method
    const originalTrackFaces = window.bnbObject.faceTracker.trackFaces;
    
    // Override the method with our enhanced version
    window.bnbObject.faceTracker.trackFaces = function(imageData, ...args) {
      // First try with the original method
      let result = originalTrackFaces.call(this, imageData, ...args);
      
      // If no faces detected, try our enhanced approach
      if (!result || (Array.isArray(result) && result.length === 0)) {
        const enhancedImageData = enhanceImageForFaceDetection(imageData);
        if (enhancedImageData !== imageData) {
          result = originalTrackFaces.call(this, enhancedImageData, ...args);
        }
      }
      
      return result;
    };
    
    // Add our retry mechanism to the face tracker
    window.bnbObject.faceTracker.retryTracking = function(imageData, maxAttempts = 3) {
      let attempts = 0;
      let result = null;
      
      while (attempts < maxAttempts && (!result || (Array.isArray(result) && result.length === 0))) {
        // Try with different enhancements for each attempt
        const enhancedImageData = getEnhancedImageForAttempt(imageData, attempts);
        result = this.trackFaces(enhancedImageData);
        attempts++;
      }
      
      return result;
    };
  }
  
  function enhanceImageForFaceDetection(imageData) {
    // Create a canvas to manipulate the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match the image data
    canvas.width = imageData.width || 640;
    canvas.height = imageData.height || 480;
    
    // Draw the original image data to the canvas
    ctx.putImageData(imageData, 0, 0);
    
    // Apply auto-levels to improve contrast
    applyAutoLevels(ctx, canvas.width, canvas.height);
    
    // Get the enhanced image data
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
  
  function applyAutoLevels(ctx, width, height) {
    // Get the image data
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Find the min and max values for each channel
    let minR = 255, minG = 255, minB = 255;
    let maxR = 0, maxG = 0, maxB = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      minR = Math.min(minR, data[i]);
      minG = Math.min(minG, data[i + 1]);
      minB = Math.min(minB, data[i + 2]);
      
      maxR = Math.max(maxR, data[i]);
      maxG = Math.max(maxG, data[i + 1]);
      maxB = Math.max(maxB, data[i + 2]);
    }
    
    // Calculate the scaling factors
    const scaleR = 255 / (maxR - minR || 1);
    const scaleG = 255 / (maxG - minG || 1);
    const scaleB = 255 / (maxB - minB || 1);
    
    // Apply auto-levels
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.max(0, Math.min(255, Math.round((data[i] - minR) * scaleR)));
      data[i + 1] = Math.max(0, Math.min(255, Math.round((data[i + 1] - minG) * scaleG)));
      data[i + 2] = Math.max(0, Math.min(255, Math.round((data[i + 2] - minB) * scaleB)));
    }
    
    // Put the enhanced image data back
    ctx.putImageData(imageData, 0, 0);
  }
  
  function getEnhancedImageForAttempt(imageData, attempt) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = imageData.width || 640;
    canvas.height = imageData.height || 480;
    
    ctx.putImageData(imageData, 0, 0);
    
    switch (attempt) {
      case 0:
        // First attempt: auto-levels
        applyAutoLevels(ctx, canvas.width, canvas.height);
        break;
      case 1:
        // Second attempt: increase brightness
        ctx.filter = 'brightness(120%)';
        ctx.drawImage(canvas, 0, 0);
        ctx.filter = 'none';
        break;
      case 2:
        // Third attempt: increase contrast
        ctx.filter = 'contrast(130%)';
        ctx.drawImage(canvas, 0, 0);
        ctx.filter = 'none';
        break;
    }
    
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
  
  function detectFacesInImage(imageElement) {
    return new Promise((resolve, reject) => {
      try {
        // Create a canvas to draw the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions to match the image
        canvas.width = imageElement.naturalWidth || imageElement.width || 640;
        canvas.height = imageElement.naturalHeight || imageElement.height || 480;
        
        // Draw the image to the canvas
        ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
        
        // Get the image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Check if Banuba face tracker is available
        if (window.bnbObject && window.bnbObject.faceTracker) {
          // Try to detect faces with multiple attempts
          const faces = window.bnbObject.faceTracker.retryTracking(imageData, 3);
          
          resolve({
            success: !!(faces && faces.length > 0),
            faces: faces || [],
            message: faces && faces.length > 0 ? 
              `Detected ${faces.length} face(s)` : 
              'No faces detected'
          });
        } else {
          resolve({
            success: false,
            faces: [],
            message: 'Face tracker not available'
          });
        }
      } catch (error) {
        console.error('Error detecting faces:', error);
        resolve({
          success: false,
          faces: [],
          message: `Error: ${error.message}`
        });
      }
    });
  }
  
  function enhanceFaceDetection(appInstance) {
    if (!appInstance || !appInstance.getCurrentImageData) {
      console.warn('Cannot enhance face detection: app instance not available');
      return;
    }
    
    // Store the original method
    const originalGetCurrentImageData = appInstance.getCurrentImageData;
    
    // Override the method with our enhanced version
    appInstance.getCurrentImageData = function() {
      // First try with the original method
      const originalImageData = originalGetCurrentImageData.call(this);
      
      // If no image data or it's invalid, try alternative methods
      if (!originalImageData || !isValidImageData(originalImageData)) {
        return getOptimalImageData();
      }
      
      return originalImageData;
    };
  }
  
  function isValidImageData(imageData) {
    return imageData && 
           imageData.width > 0 && 
           imageData.height > 0 && 
           imageData.data && 
           imageData.data.length > 0;
  }
  
  function getOptimalImageData() {
    // Try to get image data from different sources
    
    // 1. Try to get from the canvas element
    const canvasElements = document.querySelectorAll('canvas');
    for (const canvas of canvasElements) {
      if (canvas.width > 100 && canvas.height > 100) {
        try {
          const ctx = canvas.getContext('2d');
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          if (isValidImageData(imageData)) {
            return imageData;
          }
        } catch (e) {
          // Ignore errors and try next canvas
        }
      }
    }
    
    // 2. Try to get from image elements
    const imageElements = document.querySelectorAll('img');
    for (const img of imageElements) {
      if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          if (isValidImageData(imageData)) {
            return imageData;
          }
        } catch (e) {
          // Ignore errors and try next image
        }
      }
    }
    
    // 3. Try to get from video elements
    const videoElements = document.querySelectorAll('video');
    for (const video of videoElements) {
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          if (isValidImageData(imageData)) {
            return imageData;
          }
        } catch (e) {
          // Ignore errors and try next video
        }
      }
    }
    
    // If all fails, create a default image data
    console.warn('Could not find valid image data, creating a placeholder');
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    // Fill with light gray to help with face detection
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
  
  function checkFaceDetectionStatus() {
    // Check if any faces are being detected in the current view
    if (window.bnbObject && window.bnbObject.faceTracker) {
      const currentImageData = getOptimalImageData();
      const faces = window.bnbObject.faceTracker.trackFaces(currentImageData);
      
      return {
        success: !!(faces && faces.length > 0),
        faceCount: faces ? faces.length : 0,
        message: faces && faces.length > 0 ? 
          `Detected ${faces.length} face(s)` : 
          'No faces detected'
      };
    }
    
    return {
      success: false,
      faceCount: 0,
      message: 'Face tracker not available'
    };
  }
})();