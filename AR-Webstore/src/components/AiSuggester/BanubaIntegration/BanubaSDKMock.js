/**
 * BanubaSDKMock.js
 * 
 * This is a mock implementation of the Banuba SDK for development purposes.
 * It simulates the behavior of the actual Banuba WebAR SDK without requiring
 * the actual SDK to be available.
 */

// Mock Banuba SDK
const BanubaSDKMock = {
  Player: {
    create: async (options) => {
      console.log('Mock Banuba Player created with options:', options);
      
      // Simulate a delay for SDK initialization
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        startVideo: async () => {
          console.log('Mock Banuba Player: Starting video...');
          
          // If we have a video element, set up a mock video feed
          if (options.proxyVideoElement) {
            try {
              // Try to get a user media stream for the mock
              const stream = await navigator.mediaDevices.getUserMedia({ video: true });
              options.proxyVideoElement.srcObject = stream;
              options.proxyVideoElement.play();
            } catch (error) {
              console.error('Failed to get user media for mock:', error);
            }
          }
          
          return true;
        },
        
        stopVideo: () => {
          console.log('Mock Banuba Player: Stopping video...');
          
          // Stop all video tracks if we have a stream
          if (options.proxyVideoElement && options.proxyVideoElement.srcObject) {
            const tracks = options.proxyVideoElement.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            options.proxyVideoElement.srcObject = null;
          }
          
          return true;
        },
        
        applyMakeup: (makeupParams) => {
          console.log('Mock Banuba Player: Applying makeup with params:', makeupParams);
          
          // In a real implementation, this would apply visual effects
          // For the mock, we just log the request
          
          // If we have a canvas, draw something to simulate makeup
          if (options.renderOptions && options.renderOptions.canvas) {
            const canvas = options.renderOptions.canvas;
            const ctx = canvas.getContext('2d');
            
            // Make sure canvas dimensions match the video
            if (options.proxyVideoElement) {
              canvas.width = options.proxyVideoElement.videoWidth;
              canvas.height = options.proxyVideoElement.videoHeight;
              
              // Draw the video frame first
              ctx.drawImage(options.proxyVideoElement, 0, 0, canvas.width, canvas.height);
              
              // Now add a subtle overlay based on makeup type
              if (makeupParams.lipstick) {
                // Simulate lipstick by drawing lips area
                simulateLipstick(ctx, canvas.width, canvas.height, makeupParams.lipstick.color);
              }
              
              if (makeupParams.blush) {
                // Simulate blush by drawing on cheeks
                simulateBlush(ctx, canvas.width, canvas.height, makeupParams.blush.color);
              }
              
              if (makeupParams.eyeshadow) {
                // Simulate eyeshadow
                simulateEyeshadow(ctx, canvas.width, canvas.height, makeupParams.eyeshadow.color);
              }
              
              if (makeupParams.faceMakeup) {
                // Simulate foundation
                simulateFoundation(ctx, canvas.width, canvas.height, makeupParams.faceMakeup.color);
              }
            }
          }
          
          return true;
        },
        
        clearMakeup: () => {
          console.log('Mock Banuba Player: Clearing all makeup effects');
          
          // If we have a canvas, clear it or just draw the video without effects
          if (options.renderOptions && options.renderOptions.canvas && options.proxyVideoElement) {
            const canvas = options.renderOptions.canvas;
            const ctx = canvas.getContext('2d');
            
            canvas.width = options.proxyVideoElement.videoWidth;
            canvas.height = options.proxyVideoElement.videoHeight;
            
            // Just draw the video without any effects
            ctx.drawImage(options.proxyVideoElement, 0, 0, canvas.width, canvas.height);
          }
          
          return true;
        },
        
        dispose: () => {
          console.log('Mock Banuba Player: Disposing resources');
          // In a real implementation, this would clean up resources
          return true;
        }
      };
    }
  }
};

// Helper functions to simulate makeup effects on canvas
function simulateLipstick(ctx, width, height, color) {
  // Parse the color
  const parts = color.split(' ');
  const r = parseFloat(parts[0]) * 255;
  const g = parseFloat(parts[1]) * 255;
  const b = parseFloat(parts[2]) * 255;
  const a = parseFloat(parts[3]) || 0.5;
  
  // Draw a semi-transparent colored ellipse in the lower center of the face area
  ctx.save();
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
  
  // Estimate face proportions
  const centerX = width / 2;
  const centerY = height * 0.75;
  const lipWidth = width * 0.2;
  const lipHeight = height * 0.05;
  
  // Draw lips
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, lipWidth, lipHeight, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function simulateBlush(ctx, width, height, color) {
  // Parse the color
  const parts = color.split(' ');
  const r = parseFloat(parts[0]) * 255;
  const g = parseFloat(parts[1]) * 255;
  const b = parseFloat(parts[2]) * 255;
  const a = parseFloat(parts[3]) || 0.3;
  
  // Draw semi-transparent circles on both cheeks
  ctx.save();
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
  
  // Left cheek
  const leftCheekX = width * 0.25;
  const cheekY = height * 0.5;
  const cheekRadius = width * 0.1;
  
  ctx.beginPath();
  ctx.arc(leftCheekX, cheekY, cheekRadius, 0, Math.PI * 2);
  ctx.fill();
  
  // Right cheek
  const rightCheekX = width * 0.75;
  
  ctx.beginPath();
  ctx.arc(rightCheekX, cheekY, cheekRadius, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

function simulateEyeshadow(ctx, width, height, color) {
  // Parse the color
  const parts = color.split(' ');
  const r = parseFloat(parts[0]) * 255;
  const g = parseFloat(parts[1]) * 255;
  const b = parseFloat(parts[2]) * 255;
  const a = parseFloat(parts[3]) || 0.4;
  
  // Draw semi-transparent eyeshadow above each eye
  ctx.save();
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
  
  // Left eye
  const leftEyeX = width * 0.35;
  const eyeY = height * 0.35;
  const eyeWidth = width * 0.08;
  const eyeHeight = height * 0.04;
  
  ctx.beginPath();
  ctx.ellipse(leftEyeX, eyeY, eyeWidth, eyeHeight, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Right eye
  const rightEyeX = width * 0.65;
  
  ctx.beginPath();
  ctx.ellipse(rightEyeX, eyeY, eyeWidth, eyeHeight, 0, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

function simulateFoundation(ctx, width, height, color) {
  // Parse the color
  const parts = color.split(' ');
  const r = parseFloat(parts[0]) * 255;
  const g = parseFloat(parts[1]) * 255;
  const b = parseFloat(parts[2]) * 255;
  const a = parseFloat(parts[3]) || 0.2;
  
  // Apply a very subtle tint to the entire face area
  ctx.save();
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
  
  // Draw an oval covering most of the face
  const centerX = width / 2;
  const centerY = height * 0.4;
  const faceWidth = width * 0.4;
  const faceHeight = height * 0.6;
  
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, faceWidth, faceHeight, 0, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

// Export the mock SDK
export default BanubaSDKMock;