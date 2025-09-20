import React, { useState, useEffect, useRef } from 'react';
import './MakeupTryOn.css';
import BanubaIntegration from './BanubaIntegration';
import MakeupAI from './MakeupAI';

/**
 * MakeupTryOn Component - Main component for virtual makeup try-on experience
 * This component combines the Banuba SDK integration with AI-powered makeup suggestions
 * to provide a complete virtual makeup try-on experience.
 */
const MakeupTryOn = () => {
  const [banubaAPI, setBanubaAPI] = useState(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  
  /**
   * Handle Banuba SDK initialization
   * @param {Object} api - Banuba SDK API object
   */
  const handleBanubaReady = (api) => {
    console.log("[MakeupTryOn] Banuba SDK ready");
    setBanubaAPI(api);
  };
  
  /**
   * Apply makeup filters from AI suggestions
   * @param {Array} filters - Makeup filters to apply
   */
  const handleApplyMakeup = (filters) => {
    if (banubaAPI && banubaAPI.applyMakeupFilters) {
      banubaAPI.applyMakeupFilters(filters);
    }
  };
  
  /**
   * Toggle camera on/off
   */
  const toggleCamera = () => {
    setCameraActive(!cameraActive);
    
    // Turn effects on/off based on camera state
    if (banubaAPI && banubaAPI.sdkInstance) {
      if (cameraActive) {
        banubaAPI.sdkInstance.hideEffects();
      } else {
        banubaAPI.sdkInstance.showEffects();
      }
    }
  };
  
  /**
   * Toggle controls visibility
   */
  const toggleControls = () => {
    setShowControls(!showControls);
  };
  
  /**
   * Take a snapshot and download it
   */
  const takeAndDownloadSnapshot = async () => {
    try {
      if (!banubaAPI || !banubaAPI.takeSnapshot) {
        console.error("[MakeupTryOn] Snapshot functionality not available");
        return;
      }
      
      const imageData = await banubaAPI.takeSnapshot();
      
      // Create link for download
      const link = document.createElement('a');
      link.href = imageData;
      link.download = `makeup-look-${new Date().getTime()}.jpg`;
      link.click();
      
    } catch (error) {
      console.error("[MakeupTryOn] Error taking snapshot:", error);
    }
  };
  
  /**
   * Close the tutorial
   */
  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('makeupTryOnTutorialSeen', 'true');
  };
  
  // Check if tutorial has been seen before
  useEffect(() => {
    const tutorialSeen = localStorage.getItem('makeupTryOnTutorialSeen');
    if (tutorialSeen === 'true') {
      setShowTutorial(false);
    }
  }, []);

  return (
    <div className="makeup-try-on-container">
      <div className="makeup-try-on-header">
        <h2>Virtual Makeup Try-On</h2>
        <div className="makeup-try-on-controls">
          <button 
            className="control-button"
            onClick={toggleCamera}
            title={cameraActive ? "Pause Camera" : "Resume Camera"}
          >
            {cameraActive ? "📷 Pause" : "📷 Resume"}
          </button>
          
          <button 
            className="control-button"
            onClick={takeAndDownloadSnapshot}
            title="Take Snapshot"
            disabled={!banubaAPI}
          >
            📸 Snapshot
          </button>
          
          <button 
            className="control-button"
            onClick={toggleControls}
            title={showControls ? "Hide Controls" : "Show Controls"}
          >
            {showControls ? "🔽 Hide Panel" : "🔼 Show Panel"}
          </button>
        </div>
      </div>
      
      <div className="makeup-try-on-content">
        {/* Banuba Integration for camera and makeup rendering */}
        <div className="makeup-camera-container">
          <BanubaIntegration onReady={handleBanubaReady} />
          
          {/* Tutorial overlay */}
          {showTutorial && (
            <div className="makeup-tutorial-overlay">
              <div className="makeup-tutorial-content">
                <h3>💄 Welcome to Virtual Makeup Try-On!</h3>
                <p>
                  Try on different makeup looks using our AI-powered makeup assistant.
                  Describe the look you want, and we'll apply it to your face in real-time.
                </p>
                <ul>
                  <li>Use AI to generate personalized makeup looks</li>
                  <li>Try example looks with one click</li>
                  <li>Take snapshots to save your favorite looks</li>
                </ul>
                <button 
                  className="tutorial-close-button"
                  onClick={closeTutorial}
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* MakeupAI component for AI-powered suggestions */}
        {showControls && (
          <div className="makeup-ai-sidebar">
            <MakeupAI 
              onApplyMakeup={handleApplyMakeup}
              banubaInstance={banubaAPI?.sdkInstance}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MakeupTryOn;
