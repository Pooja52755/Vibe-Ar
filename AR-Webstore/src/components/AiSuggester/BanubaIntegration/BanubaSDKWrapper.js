/**
 * BanubaSDKWrapper.js
 * This wrapper integrates the Banuba WebAR beauty SDK into our React application.
 * It provides a simplified API for applying makeup effects to a video stream.
 * 
 * Note: This version uses a mock implementation for development purposes.
 */

import { BANUBA_CLIENT_TOKEN } from './BanubaToken';
import BanubaSDKMock from './BanubaSDKMock';

// Define makeup types and their default colors
const MAKEUP_TYPES = {
  LIPSTICK: 'lipstick',
  FOUNDATION: 'foundation',
  BLUSH: 'blush',
  EYESHADOW: 'eyeshadow',
};

class BanubaSDKWrapper {
  constructor() {
    this.initialized = false;
    this.player = null;
    this.sdk = null;
  }

  /**
   * Loads the Banuba WebAR SDK
   * In development, this uses a mock implementation
   */
  async loadScript() {
    console.log('Using Banuba SDK Mock for development');
    return BanubaSDKMock;
  }

  /**
   * Initializes the Banuba SDK
   */
  async initialize() {
    if (this.initialized) {
      return true;
    }

    try {
      console.log('Loading Banuba WebAR SDK...');
      
      // Load the SDK script
      this.sdk = await this.loadScript();
      
      // The SDK is now loaded, but we'll create a player when starting the camera
      console.log('Banuba SDK loaded successfully');
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Banuba SDK:', error);
      return false;
    }
  }

  /**
   * Starts the camera with face tracking
   * @param {HTMLVideoElement} videoElement - The video element to display the camera feed
   * @param {HTMLCanvasElement} canvasElement - The canvas element to render effects
   */
  async startCamera(videoElement, canvasElement) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      // Create player with the Banuba SDK
      this.player = await this.sdk.Player.create({
        clientToken: BANUBA_CLIENT_TOKEN,
        proxyVideoElement: videoElement,
        useWorker: true,
        renderOptions: {
          canvas: canvasElement
        }
      });

      // Start the video
      await this.player.startVideo();
      
      return true;
    } catch (error) {
      console.error('Error starting camera:', error);
      return false;
    }
  }

  /**
   * Stops the camera
   */
  stopCamera() {
    if (!this.player) {
      return false;
    }

    try {
      // Stop video in the player
      this.player.stopVideo();
      return true;
    } catch (error) {
      console.error('Error stopping camera:', error);
      return false;
    }
  }

  /**
   * Applies makeup with the specified type and color
   * @param {string} type - Type of makeup (lipstick, foundation, blush, eyeshadow)
   * @param {string} hexColor - Hex color code (e.g., "#FF0000")
   */
  applyMakeup(type, hexColor) {
    if (!this.player) {
      console.error('Banuba player is not initialized');
      return false;
    }

    switch (type) {
      case 'lipstick':
        return this.applyLipstick(hexColor);
      case 'foundation':
        return this.applyFoundation(hexColor);
      case 'blush':
        return this.applyBlush(hexColor);
      case 'eyeshadow':
        return this.applyEyeshadow(hexColor);
      default:
        console.error(`Unsupported makeup type: ${type}`);
        return false;
    }
  }

  /**
   * Applies lipstick effect with the specified color
   * @param {string} hexColor - Hex color code (e.g., "#FF0000")
   */
  applyLipstick(hexColor) {
    if (!this.player) {
      console.error('Banuba player is not initialized');
      return false;
    }

    try {
      // Convert hex to RGB
      const rgba = this._hexToRgba(hexColor);
      
      // Apply lipstick effect
      this.player.applyMakeup({
        lipstick: {
          enabled: true,
          color: rgba
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error applying lipstick effect:', error);
      return false;
    }
  }

  /**
   * Applies foundation effect with the specified color
   * @param {string} hexColor - Hex color code (e.g., "#FF0000")
   */
  applyFoundation(hexColor) {
    if (!this.player) {
      console.error('Banuba player is not initialized');
      return false;
    }

    try {
      // Convert hex to RGB
      const rgba = this._hexToRgba(hexColor);
      
      // Apply foundation effect
      this.player.applyMakeup({
        faceMakeup: {
          enabled: true,
          color: rgba,
          opacity: 0.7
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error applying foundation effect:', error);
      return false;
    }
  }

  /**
   * Applies blush effect with the specified color
   * @param {string} hexColor - Hex color code (e.g., "#FF0000")
   */
  applyBlush(hexColor) {
    if (!this.player) {
      console.error('Banuba player is not initialized');
      return false;
    }

    try {
      // Convert hex to RGB
      const rgba = this._hexToRgba(hexColor);
      
      // Apply blush effect
      this.player.applyMakeup({
        blush: {
          enabled: true,
          color: rgba,
          intensity: 0.6
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error applying blush effect:', error);
      return false;
    }
  }

  /**
   * Applies eyeshadow effect with the specified color
   * @param {string} hexColor - Hex color code (e.g., "#FF0000")
   */
  applyEyeshadow(hexColor) {
    if (!this.player) {
      console.error('Banuba player is not initialized');
      return false;
    }

    try {
      // Convert hex to RGB
      const rgba = this._hexToRgba(hexColor);
      
      // Apply eyeshadow effect
      this.player.applyMakeup({
        eyeshadow: {
          enabled: true,
          color: rgba,
          intensity: 0.8
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error applying eyeshadow effect:', error);
      return false;
    }
  }

  /**
   * Clears all makeup effects
   */
  clearMakeup() {
    if (!this.player) {
      console.error('Banuba player is not initialized');
      return false;
    }

    try {
      this.player.clearMakeup();
      return true;
    } catch (error) {
      console.error('Error clearing makeup effects:', error);
      return false;
    }
  }

  /**
   * Cleans up resources when component unmounts
   */
  cleanup() {
    if (this.player) {
      try {
        this.player.stopVideo();
        this.player.dispose();
        this.player = null;
      } catch (error) {
        console.error('Error during cleanup:', error);
      }
    }
    
    this.initialized = false;
  }

  /**
   * Converts hex color to Banuba RGBA format
   * @param {string} hex - Hex color code (e.g., "#FF0000")
   * @returns {string} - Banuba RGBA format (e.g., "1.0 0.0 0.0 1.0")
   * @private
   */
  _hexToRgba(hex) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    // Return in Banuba's space-separated RGBA format
    return `${r.toFixed(2)} ${g.toFixed(2)} ${b.toFixed(2)} 1.0`;
  }
}

// Create a singleton instance
const banubaSDKWrapper = new BanubaSDKWrapper();

export default banubaSDKWrapper;