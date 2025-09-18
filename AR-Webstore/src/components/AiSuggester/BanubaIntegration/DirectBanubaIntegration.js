/**
 * DirectBanubaIntegration.js
 * A simplified direct integration with Banuba SDK based on the beauty-web application
 */

import React, { useEffect, useRef, useState } from 'react';
import { BANUBA_CLIENT_TOKEN } from './BanubaToken';
import { MockSDK } from './FallbackBeautyMock';
import './DirectBanubaIntegration.css';

// Predefined makeup looks
const MAKEUP_LOOKS = [
  { id: 'natural', name: 'Natural', icon: '💄', description: 'Subtle everyday look' },
  { id: 'glamour', name: 'Glamour', icon: '✨', description: 'Bold evening makeup' },
  { id: 'dramatic', name: 'Dramatic', icon: '🌟', description: 'Intense eye makeup' },
  { id: 'soft', name: 'Soft', icon: '🌸', description: 'Soft romantic look' },
];

const DirectBanubaIntegration = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [player, setPlayer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLook, setSelectedLook] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [sdkModules, setSdkModules] = useState(null);

  // Load SDK using a more compatible approach
  useEffect(() => {
    const loadBanubaSDK = async () => {
      try {
        setIsLoading(true);
        console.log("Using mock SDK implementation for beauty filters");
        
        // Use our mock SDK directly for development
        setSdkModules(MockSDK);
        setIsInitialized(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading SDK:', error);
        setErrorMessage(`Failed to initialize beauty filters: ${error.message}`);
        setIsLoading(false);
      }
    };

    loadBanubaSDK();

    // Cleanup
    return () => {
      if (player) {
        try {
          player.dispose();
        } catch (error) {
          console.error('Error disposing player:', error);
        }
      }
    };
  }, []);

  // Start camera
  const startCamera = async () => {
    if (!isInitialized || !sdkModules) {
      setErrorMessage('Beauty filters not initialized yet. Please wait...');
      return;
    }

    try {
      setIsLoading(true);
      
      const { Webcam, Player } = sdkModules;
      
      // Create a webcam source
      console.log("Creating webcam instance...");
      const webcam = await Webcam.create({ width: 640, height: 480 });
      
      // Create the player
      console.log("Creating player instance...");
      const newPlayer = await Player.create({
        clientToken: BANUBA_CLIENT_TOKEN,
        canvas: canvasRef.current,
        source: webcam
      });
      
      // Start the player
      console.log("Starting player...");
      await newPlayer.play();
      
      // Connect video element if needed for preview
      if (videoRef.current) {
        try {
          const videoElement = webcam.getVideoElement();
          if (videoElement && videoElement.srcObject) {
            videoRef.current.srcObject = videoElement.srcObject;
            videoRef.current.play();
          }
        } catch (e) {
          console.warn("Couldn't connect video element:", e);
        }
      }
      
      setPlayer(newPlayer);
      setIsCameraActive(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error starting camera:', error);
      setErrorMessage(`Failed to start camera: ${error.message}`);
      setIsLoading(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (player) {
      try {
        player.stop();
        player.dispose();
        
        // Stop video stream
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
        
        setPlayer(null);
        setIsCameraActive(false);
        setSelectedLook(null);
      } catch (error) {
        console.error('Error stopping camera:', error);
      }
    }
  };

  // Apply makeup look
  const applyMakeupLook = async (look) => {
    if (!player || !sdkModules) return;

    try {
      setSelectedLook(look);
      
      const { Effect } = sdkModules;
      let effectParams = {};
      
      switch (look.id) {
        case 'natural':
          effectParams = {
            makeupParams: {
              lipstick: { color: [0.8, 0.4, 0.4, 0.7] },
              blush: { color: [0.9, 0.5, 0.5, 0.3] },
              eyeshadow: { color: [0.6, 0.4, 0.4, 0.5] }
            }
          };
          break;
        case 'glamour':
          effectParams = {
            makeupParams: {
              lipstick: { color: [0.9, 0.2, 0.2, 0.9] },
              eyeshadow: { color: [0.3, 0.3, 0.5, 0.8] },
              eyeliner: { color: [0.0, 0.0, 0.0, 1.0] },
              blush: { color: [0.9, 0.4, 0.4, 0.5] }
            }
          };
          break;
        case 'dramatic':
          effectParams = {
            makeupParams: {
              eyeshadow: { color: [0.2, 0.2, 0.4, 1.0] },
              eyeliner: { color: [0.0, 0.0, 0.0, 1.0], thickness: 1.5 },
              lipstick: { color: [0.7, 0.3, 0.3, 0.8] }
            }
          };
          break;
        case 'soft':
          effectParams = {
            makeupParams: {
              lipstick: { color: [0.9, 0.6, 0.6, 0.6] },
              blush: { color: [0.9, 0.7, 0.7, 0.3] },
              eyeshadow: { color: [0.8, 0.7, 0.7, 0.4] }
            }
          };
          break;
        default:
          // Clear makeup
          player.clearEffects();
          setSelectedLook(null);
          return;
      }
      
      console.log("Creating effect with params:", effectParams);
      const effect = await Effect.create(effectParams);
      
      console.log("Applying effect to player");
      player.clearEffects();
      player.addEffect(effect);
      
    } catch (error) {
      console.error('Error applying makeup:', error);
      setErrorMessage(`Failed to apply makeup: ${error.message}`);
    }
  };

  // Clear makeup
  const clearMakeup = () => {
    if (player) {
      try {
        player.clearEffects();
        setSelectedLook(null);
      } catch (error) {
        console.error('Error clearing makeup:', error);
      }
    }
  };

  // Take screenshot
  const takeScreenshot = () => {
    if (!player) return;

    try {
      const dataUrl = player.takePhoto();
      
      // Create a download link
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'beauty-filter-screenshot.png';
      link.click();
    } catch (error) {
      console.error('Error taking screenshot:', error);
      setErrorMessage(`Failed to take screenshot: ${error.message}`);
    }
  };

  return (
    <div className="direct-banuba-integration" ref={containerRef}>
      <div className="video-container">
        <video 
          ref={videoRef} 
          className="video-element" 
          playsInline 
          autoPlay 
          muted 
        />
        <canvas 
          ref={canvasRef} 
          className="canvas-element" 
        />
        
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        )}
        
        {errorMessage && (
          <div className="error-message">
            <p>{errorMessage}</p>
            <button onClick={() => setErrorMessage(null)}>Dismiss</button>
          </div>
        )}
        
        {!isCameraActive && !isLoading && (
          <div className="start-camera-container">
            <button 
              className="start-camera-button"
              onClick={startCamera}
              disabled={!isInitialized || isLoading}
            >
              Start Beauty Camera
            </button>
            <p>Click to start the camera and try on beauty filters</p>
          </div>
        )}
      </div>
      
      {isCameraActive && (
        <div className="controls-container">
          <div className="makeup-looks">
            <h3>Choose a Look</h3>
            <div className="looks-grid">
              {MAKEUP_LOOKS.map((look) => (
                <div 
                  key={look.id}
                  className={`look-item ${selectedLook?.id === look.id ? 'selected' : ''}`}
                  onClick={() => applyMakeupLook(look)}
                >
                  <div className="look-icon">{look.icon}</div>
                  <div className="look-name">{look.name}</div>
                  <div className="look-description">{look.description}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="action-buttons">
            <button 
              className="clear-button"
              onClick={clearMakeup}
              disabled={!selectedLook}
            >
              Clear Makeup
            </button>
            <button 
              className="screenshot-button"
              onClick={takeScreenshot}
            >
              Take Screenshot
            </button>
            <button 
              className="stop-button"
              onClick={stopCamera}
            >
              Stop Camera
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectBanubaIntegration;