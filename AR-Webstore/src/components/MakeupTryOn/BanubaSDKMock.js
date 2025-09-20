/**
 * BanubaSDKMock - A mock implementation of the Banuba SDK for development and testing
 * This allows developers to work on the UI and integration without the actual SDK,
 * which may require licenses or specific browser capabilities.
 */
export class BanubaSDKMock {
  constructor(container) {
    this.container = container;
    this.videoElement = null;
    this.canvasElement = null;
    this.canvasContext = null;
    this.stream = null;
    this.activeFilters = [];
    this.isInitialized = false;
    this.effectsVisible = true;
  }

  /**
   * Initialize the mock SDK
   * @returns {Promise} Resolves when initialization is complete
   */
  async initialize() {
    if (this.isInitialized) return;
    
    console.log("[BanubaSDKMock] Initializing mock SDK");
    
    // Create and style container
    this.container.style.position = 'relative';
    
    // Create video element for camera feed
    this.videoElement = document.createElement('video');
    this.videoElement.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: cover;
    `;
    this.videoElement.autoplay = true;
    this.videoElement.playsInline = true;
    this.videoElement.muted = true;
    
    // Create canvas for drawing effects
    this.canvasElement = document.createElement('canvas');
    this.canvasElement.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `;
    
    // Add elements to container
    this.container.appendChild(this.videoElement);
    this.container.appendChild(this.canvasElement);
    
    // Initialize canvas context
    this.canvasContext = this.canvasElement.getContext('2d');
    
    try {
      // Try to get camera access
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      };
      
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.videoElement.srcObject = this.stream;
      
      // Wait for video to be ready
      await new Promise(resolve => {
        this.videoElement.onloadedmetadata = () => {
          this.canvasElement.width = this.videoElement.videoWidth;
          this.canvasElement.height = this.videoElement.videoHeight;
          resolve();
        };
      });
      
      // Start rendering loop
      this.startRenderLoop();
      this.isInitialized = true;
      console.log("[BanubaSDKMock] Initialization complete");
      
    } catch (error) {
      console.error("[BanubaSDKMock] Error initializing camera:", error);
      
      // Fallback to placeholder if camera access fails
      this.showPlaceholder();
      this.isInitialized = true;
    }
  }

  /**
   * Display a placeholder when camera access fails
   */
  showPlaceholder() {
    console.log("[BanubaSDKMock] Showing placeholder");
    
    // Remove video element
    if (this.videoElement && this.videoElement.parentNode) {
      this.container.removeChild(this.videoElement);
    }
    
    // Create placeholder
    const placeholder = document.createElement('div');
    placeholder.style.cssText = `
      width: 100%;
      height: 100%;
      background-color: #333;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      text-align: center;
      padding: 20px;
    `;
    
    // Create face shape
    const faceShape = document.createElement('div');
    faceShape.style.cssText = `
      width: 120px;
      height: 160px;
      border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
      background-color: #f5f5f5;
      margin-bottom: 20px;
      position: relative;
    `;
    
    // Add eyes
    const leftEye = document.createElement('div');
    leftEye.style.cssText = `
      position: absolute;
      width: 20px;
      height: 20px;
      background-color: #333;
      border-radius: 50%;
      top: 60px;
      left: 30px;
    `;
    
    const rightEye = document.createElement('div');
    rightEye.style.cssText = `
      position: absolute;
      width: 20px;
      height: 20px;
      background-color: #333;
      border-radius: 50%;
      top: 60px;
      right: 30px;
    `;
    
    // Add mouth
    const mouth = document.createElement('div');
    mouth.style.cssText = `
      position: absolute;
      width: 40px;
      height: 20px;
      border-bottom: 4px solid #333;
      border-radius: 0 0 20px 20px;
      top: 100px;
      left: 40px;
    `;
    
    faceShape.appendChild(leftEye);
    faceShape.appendChild(rightEye);
    faceShape.appendChild(mouth);
    
    // Add message
    const message = document.createElement('p');
    message.textContent = "Camera access is required for makeup try-on";
    
    placeholder.appendChild(faceShape);
    placeholder.appendChild(message);
    
    this.container.appendChild(placeholder);
    
    // Store reference for later removal
    this.placeholder = placeholder;
  }

  /**
   * Start the render loop for applying makeup effects
   */
  startRenderLoop() {
    const renderFrame = () => {
      if (!this.isInitialized) return;
      
      // Clear canvas
      this.canvasContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
      
      // Only draw effects if they're visible
      if (this.effectsVisible && this.activeFilters.length > 0) {
        this.drawMakeupEffects();
      }
      
      // Request next frame
      requestAnimationFrame(renderFrame);
    };
    
    // Start loop
    renderFrame();
  }

  /**
   * Draw makeup effects on the canvas
   */
  drawMakeupEffects() {
    if (!this.canvasContext) return;
    
    // Get face region (in a real implementation, this would use face detection)
    // For this mock, we'll just use approximated positions
    const canvasWidth = this.canvasElement.width;
    const canvasHeight = this.canvasElement.height;
    
    const faceWidth = canvasWidth * 0.5;
    const faceHeight = canvasHeight * 0.7;
    const faceX = (canvasWidth - faceWidth) / 2;
    const faceY = (canvasHeight - faceHeight) / 2.5;
    
    // Apply each filter
    this.activeFilters.forEach(filter => {
      const intensity = filter.intensity || 1.0;
      const color = filter.color || '#ff0000';
      
      switch (filter.type.toLowerCase()) {
        case 'lipstick':
          this.drawLipstick(faceX, faceY, faceWidth, faceHeight, color, intensity);
          break;
          
        case 'blush':
          this.drawBlush(faceX, faceY, faceWidth, faceHeight, color, intensity);
          break;
          
        case 'eyeshadow':
          this.drawEyeshadow(faceX, faceY, faceWidth, faceHeight, color, intensity);
          break;
          
        case 'eyeliner':
          this.drawEyeliner(faceX, faceY, faceWidth, faceHeight, color, intensity);
          break;
          
        case 'foundation':
          this.drawFoundation(faceX, faceY, faceWidth, faceHeight, color, intensity);
          break;
      }
    });
  }

  /**
   * Draw lipstick effect
   */
  drawLipstick(faceX, faceY, faceWidth, faceHeight, color, intensity) {
    const ctx = this.canvasContext;
    
    // Position and size
    const lipY = faceY + faceHeight * 0.75;
    const lipWidth = faceWidth * 0.35;
    const lipHeight = faceHeight * 0.08;
    const lipX = faceX + (faceWidth - lipWidth) / 2;
    
    // Set style
    ctx.save();
    ctx.globalAlpha = Math.min(0.7, intensity);
    
    // Draw lips
    ctx.beginPath();
    ctx.ellipse(
      lipX + lipWidth / 2,
      lipY,
      lipWidth / 2,
      lipHeight,
      0,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = color;
    ctx.fill();
    
    ctx.restore();
  }

  /**
   * Draw blush effect
   */
  drawBlush(faceX, faceY, faceWidth, faceHeight, color, intensity) {
    const ctx = this.canvasContext;
    
    // Set style
    ctx.save();
    ctx.globalAlpha = Math.min(0.4, intensity * 0.5);
    
    // Left cheek
    const leftBlushX = faceX + faceWidth * 0.15;
    const blushY = faceY + faceHeight * 0.55;
    const blushRadius = faceWidth * 0.12;
    
    ctx.beginPath();
    ctx.arc(leftBlushX, blushY, blushRadius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    
    // Right cheek
    const rightBlushX = faceX + faceWidth * 0.85;
    
    ctx.beginPath();
    ctx.arc(rightBlushX, blushY, blushRadius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    
    ctx.restore();
  }

  /**
   * Draw eyeshadow effect
   */
  drawEyeshadow(faceX, faceY, faceWidth, faceHeight, color, intensity) {
    const ctx = this.canvasContext;
    
    // Eye positions
    const eyeY = faceY + faceHeight * 0.35;
    const eyeWidth = faceWidth * 0.15;
    const eyeHeight = faceHeight * 0.06;
    const leftEyeX = faceX + faceWidth * 0.25;
    const rightEyeX = faceX + faceWidth * 0.75;
    
    // Set style
    ctx.save();
    ctx.globalAlpha = Math.min(0.6, intensity * 0.7);
    
    // Left eye shadow
    ctx.beginPath();
    ctx.ellipse(
      leftEyeX,
      eyeY - eyeHeight / 2,
      eyeWidth,
      eyeHeight * 1.5,
      0,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = color;
    ctx.fill();
    
    // Right eye shadow
    ctx.beginPath();
    ctx.ellipse(
      rightEyeX,
      eyeY - eyeHeight / 2,
      eyeWidth,
      eyeHeight * 1.5,
      0,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = color;
    ctx.fill();
    
    ctx.restore();
  }

  /**
   * Draw eyeliner effect
   */
  drawEyeliner(faceX, faceY, faceWidth, faceHeight, color, intensity) {
    const ctx = this.canvasContext;
    
    // Eye positions
    const eyeY = faceY + faceHeight * 0.35;
    const eyeWidth = faceWidth * 0.15;
    const eyeHeight = faceHeight * 0.04;
    const leftEyeX = faceX + faceWidth * 0.25;
    const rightEyeX = faceX + faceWidth * 0.75;
    
    // Set style
    ctx.save();
    ctx.globalAlpha = Math.min(0.9, intensity);
    ctx.lineWidth = 2 + intensity * 2;
    ctx.strokeStyle = color;
    
    // Left eye liner
    ctx.beginPath();
    ctx.ellipse(
      leftEyeX,
      eyeY,
      eyeWidth,
      eyeHeight,
      0,
      0,
      Math.PI * 2
    );
    ctx.stroke();
    
    // Left wing
    ctx.beginPath();
    ctx.moveTo(leftEyeX + eyeWidth, eyeY);
    ctx.lineTo(leftEyeX + eyeWidth * 1.5, eyeY - eyeHeight);
    ctx.stroke();
    
    // Right eye liner
    ctx.beginPath();
    ctx.ellipse(
      rightEyeX,
      eyeY,
      eyeWidth,
      eyeHeight,
      0,
      0,
      Math.PI * 2
    );
    ctx.stroke();
    
    // Right wing
    ctx.beginPath();
    ctx.moveTo(rightEyeX - eyeWidth, eyeY);
    ctx.lineTo(rightEyeX - eyeWidth * 1.5, eyeY - eyeHeight);
    ctx.stroke();
    
    ctx.restore();
  }

  /**
   * Draw foundation effect
   */
  drawFoundation(faceX, faceY, faceWidth, faceHeight, color, intensity) {
    const ctx = this.canvasContext;
    
    // Set style
    ctx.save();
    ctx.globalAlpha = Math.min(0.3, intensity * 0.4);
    
    // Draw foundation over the whole face
    ctx.beginPath();
    ctx.ellipse(
      faceX + faceWidth / 2,
      faceY + faceHeight / 2,
      faceWidth / 2,
      faceHeight / 2,
      0,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = color;
    ctx.fill();
    
    ctx.restore();
  }

  /**
   * Apply makeup filters
   * @param {Array} filters - Array of makeup filters to apply
   */
  applyMakeup(filters) {
    console.log("[BanubaSDKMock] Applying makeup filters:", filters);
    this.activeFilters = filters;
  }

  /**
   * Clear all makeup filters
   */
  clearMakeup() {
    console.log("[BanubaSDKMock] Clearing all makeup");
    this.activeFilters = [];
  }

  /**
   * Show makeup effects
   */
  showEffects() {
    this.effectsVisible = true;
  }

  /**
   * Hide makeup effects
   */
  hideEffects() {
    this.effectsVisible = false;
  }

  /**
   * Take a snapshot of the current view
   * @returns {Promise<string>} Promise resolving to base64 image data
   */
  takeSnapshot() {
    return new Promise((resolve, reject) => {
      try {
        // Create a new canvas for the snapshot
        const snapshotCanvas = document.createElement('canvas');
        const ctx = snapshotCanvas.getContext('2d');
        
        // Set dimensions
        snapshotCanvas.width = this.canvasElement.width;
        snapshotCanvas.height = this.canvasElement.height;
        
        // Draw video first
        ctx.drawImage(this.videoElement, 0, 0);
        
        // Then draw makeup effects on top
        if (this.effectsVisible && this.activeFilters.length > 0) {
          ctx.drawImage(this.canvasElement, 0, 0);
        }
        
        // Convert to base64
        const imageData = snapshotCanvas.toDataURL('image/jpeg');
        resolve(imageData);
      } catch (error) {
        console.error("[BanubaSDKMock] Error taking snapshot:", error);
        reject(error);
      }
    });
  }

  /**
   * Destroy the SDK instance and clean up resources
   */
  destroy() {
    console.log("[BanubaSDKMock] Destroying mock SDK");
    
    // Stop video stream if active
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    // Clean up DOM elements
    if (this.videoElement && this.videoElement.parentNode) {
      this.container.removeChild(this.videoElement);
    }
    
    if (this.canvasElement && this.canvasElement.parentNode) {
      this.container.removeChild(this.canvasElement);
    }
    
    if (this.placeholder && this.placeholder.parentNode) {
      this.container.removeChild(this.placeholder);
    }
    
    this.videoElement = null;
    this.canvasElement = null;
    this.canvasContext = null;
    this.activeFilters = [];
    this.isInitialized = false;
  }
}
