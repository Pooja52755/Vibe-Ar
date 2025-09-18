/**
 * FallbackBeautyMock.js
 * A mock implementation to be used as a fallback when the Banuba SDK cannot be loaded
 */

class WebcamMock {
  static async create(options = {}) {
    console.log('Creating mock webcam with options:', options);
    
    try {
      // Try to get a real camera stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: options.width || 640, 
          height: options.height || 480 
        } 
      });
      
      // Create a video element to hold the stream
      const videoElement = document.createElement('video');
      videoElement.srcObject = stream;
      videoElement.autoplay = true;
      videoElement.playsInline = true;
      
      return {
        getVideoElement: () => videoElement,
        stop: () => {
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
        }
      };
    } catch (error) {
      console.error('Error creating mock webcam:', error);
      throw error;
    }
  }
}

class EffectMock {
  static async create(params = {}) {
    console.log('Creating mock effect with params:', params);
    return {
      id: Math.random().toString(36).substring(2, 9),
      params
    };
  }
}

class PlayerMock {
  constructor(options) {
    this.canvas = options.canvas;
    this.source = options.source;
    this.effects = [];
    this.isPlaying = false;
    this.animationFrame = null;
  }
  
  static async create(options) {
    console.log('Creating mock player with options:', options);
    return new PlayerMock(options);
  }
  
  async play() {
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    const videoElement = this.source?.getVideoElement();
    
    if (this.canvas && videoElement) {
      const ctx = this.canvas.getContext('2d');
      
      // Resize canvas to match video
      const resizeCanvas = () => {
        if (videoElement.videoWidth && videoElement.videoHeight) {
          this.canvas.width = videoElement.videoWidth;
          this.canvas.height = videoElement.videoHeight;
        }
      };
      
      // Initial resize
      setTimeout(resizeCanvas, 500);
      
      // Draw video frame and apply effects
      const drawFrame = () => {
        if (!this.isPlaying) return;
        
        // Resize canvas if needed
        if (this.canvas.width !== videoElement.videoWidth || 
            this.canvas.height !== videoElement.videoHeight) {
          resizeCanvas();
        }
        
        // Draw the video frame
        ctx.drawImage(videoElement, 0, 0);
        
        // Apply any active effects
        if (this.effects.length > 0) {
          this.applyEffects(ctx);
        }
        
        // Schedule next frame
        this.animationFrame = requestAnimationFrame(drawFrame);
      };
      
      // Start animation loop
      drawFrame();
    }
  }
  
  stop() {
    this.isPlaying = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    
    // Stop the source if it has a stop method
    if (this.source && typeof this.source.stop === 'function') {
      this.source.stop();
    }
  }
  
  addEffect(effect) {
    this.effects.push(effect);
  }
  
  clearEffects() {
    this.effects = [];
  }
  
  applyEffects(ctx) {
    // This is a very simple mock implementation
    // In a real app, this would apply actual visual effects
    const effect = this.effects[this.effects.length - 1];
    
    if (effect && effect.params && effect.params.makeupParams) {
      const { makeupParams } = effect.params;
      
      // Apply very simple visual indicators for each makeup type
      if (makeupParams.lipstick) {
        const color = makeupParams.lipstick.color;
        this.drawLips(ctx, color);
      }
      
      if (makeupParams.blush) {
        const color = makeupParams.blush.color;
        this.drawBlush(ctx, color);
      }
      
      if (makeupParams.eyeshadow) {
        const color = makeupParams.eyeshadow.color;
        this.drawEyeshadow(ctx, color);
      }
      
      if (makeupParams.eyeliner) {
        const color = makeupParams.eyeliner.color;
        this.drawEyeliner(ctx, color);
      }
    }
  }
  
  // Simple mock makeup effects
  drawLips(ctx, color) {
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    ctx.save();
    
    // Draw a simple lip shape
    ctx.fillStyle = `rgba(${color[0]*255}, ${color[1]*255}, ${color[2]*255}, ${color[3]})`;
    
    const centerX = width / 2;
    const centerY = height * 0.7;
    const lipWidth = width * 0.2;
    const lipHeight = height * 0.05;
    
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, lipWidth, lipHeight, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
  
  drawBlush(ctx, color) {
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    ctx.save();
    
    // Draw simple blush on cheeks
    ctx.fillStyle = `rgba(${color[0]*255}, ${color[1]*255}, ${color[2]*255}, ${color[3]})`;
    
    const cheekY = height * 0.55;
    const cheekRadius = width * 0.08;
    
    // Left cheek
    ctx.beginPath();
    ctx.arc(width * 0.3, cheekY, cheekRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Right cheek
    ctx.beginPath();
    ctx.arc(width * 0.7, cheekY, cheekRadius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
  
  drawEyeshadow(ctx, color) {
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    ctx.save();
    
    // Draw simple eyeshadow
    ctx.fillStyle = `rgba(${color[0]*255}, ${color[1]*255}, ${color[2]*255}, ${color[3]})`;
    
    const eyeY = height * 0.4;
    const eyeWidth = width * 0.1;
    const eyeHeight = height * 0.03;
    
    // Left eye
    ctx.beginPath();
    ctx.ellipse(width * 0.35, eyeY, eyeWidth, eyeHeight, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Right eye
    ctx.beginPath();
    ctx.ellipse(width * 0.65, eyeY, eyeWidth, eyeHeight, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
  
  drawEyeliner(ctx, color) {
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    ctx.save();
    
    // Draw simple eyeliner
    ctx.strokeStyle = `rgba(${color[0]*255}, ${color[1]*255}, ${color[2]*255}, ${color[3]})`;
    ctx.lineWidth = 3;
    
    const eyeY = height * 0.4;
    const eyeWidth = width * 0.1;
    
    // Left eye
    ctx.beginPath();
    ctx.ellipse(width * 0.35, eyeY, eyeWidth, eyeWidth * 0.4, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    // Right eye
    ctx.beginPath();
    ctx.ellipse(width * 0.65, eyeY, eyeWidth, eyeWidth * 0.4, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.restore();
  }
  
  takePhoto() {
    return this.canvas.toDataURL('image/png');
  }
  
  dispose() {
    this.stop();
    this.effects = [];
    this.source = null;
    
    // Clear the canvas
    if (this.canvas) {
      const ctx = this.canvas.getContext('2d');
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

// Export the mock SDK
export const MockSDK = {
  Webcam: WebcamMock,
  Effect: EffectMock,
  Player: PlayerMock
};

export default MockSDK;