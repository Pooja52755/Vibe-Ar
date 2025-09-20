import React, { useState, useEffect, useRef } from 'react';
import './BanubaIntegration.css';
import { BanubaSDKMock } from './BanubaSDKMock';

/**
 * BanubaIntegration Component - Manages integration with Banuba SDK
 * This component handles initializing the Banuba SDK, setting up the camera,
 * and applying makeup filters to the virtual try-on experience.
 */
const BanubaIntegration = ({ onReady }) => {
  const containerRef = useRef(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [error, setError] = useState(null);
  const [currentFilters, setCurrentFilters] = useState([]);
  const sdkInstanceRef = useRef(null);
  
  // Client token for Banuba SDK
  const BANUBA_CLIENT_TOKEN = process.env.REACT_APP_BANUBA_CLIENT_TOKEN || "YOUR_BANUBA_CLIENT_TOKEN_HERE";
  
  /**
   * Initialize Banuba SDK on component mount
   */
  useEffect(() => {
    let isMounted = true;
    
    const initializeSDK = async () => {
      try {
        // Clear any previous errors
        if (isMounted) setError(null);
        
        // Check if we're in development environment and use mock if no token
        if (process.env.NODE_ENV === 'development' && 
            (!BANUBA_CLIENT_TOKEN || BANUBA_CLIENT_TOKEN === "YOUR_BANUBA_CLIENT_TOKEN_HERE")) {
          console.log("[BanubaIntegration] Using mock SDK in development");
          const mockSDK = new BanubaSDKMock(containerRef.current);
          await mockSDK.initialize();
          sdkInstanceRef.current = mockSDK;
          
          if (isMounted) {
            setSdkReady(true);
            if (onReady) onReady(mockSDK);
          }
          return;
        }
        
        // Try to load the real Banuba SDK
        if (window.BanubaSDK) {
          console.log("[BanubaIntegration] Initializing Banuba SDK");
          const sdk = new window.BanubaSDK({
            clientToken: BANUBA_CLIENT_TOKEN,
            container: containerRef.current,
            effectsConfig: {
              assetPath: '/assets/effects'
            }
          });
          
          await sdk.initialize();
          sdkInstanceRef.current = sdk;
          
          if (isMounted) {
            setSdkReady(true);
            if (onReady) onReady(sdk);
          }
        } else {
          // If the SDK isn't available, try to load it from CDN
          console.log("[BanubaIntegration] Loading Banuba SDK from CDN");
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/@banuba/sdk@latest/dist/BanubaSDK.js';
          script.async = true;
          
          script.onload = async () => {
            if (!isMounted) return;
            
            try {
              const sdk = new window.BanubaSDK({
                clientToken: BANUBA_CLIENT_TOKEN,
                container: containerRef.current,
                effectsConfig: {
                  assetPath: '/assets/effects'
                }
              });
              
              await sdk.initialize();
              sdkInstanceRef.current = sdk;
              
              setSdkReady(true);
              if (onReady) onReady(sdk);
            } catch (err) {
              console.error("[BanubaIntegration] Error initializing SDK:", err);
              setError("Failed to initialize makeup try-on. Please check your camera permissions.");
              
              // Fallback to mock if initialization fails
              const mockSDK = new BanubaSDKMock(containerRef.current);
              await mockSDK.initialize();
              sdkInstanceRef.current = mockSDK;
              
              setSdkReady(true);
              if (onReady) onReady(mockSDK);
            }
          };
          
          script.onerror = () => {
            if (!isMounted) return;
            console.error("[BanubaIntegration] Failed to load Banuba SDK");
            setError("Failed to load makeup try-on technology. Please try again later.");
            
            // Use mock if loading fails
            const initMock = async () => {
              const mockSDK = new BanubaSDKMock(containerRef.current);
              await mockSDK.initialize();
              sdkInstanceRef.current = mockSDK;
              
              setSdkReady(true);
              if (onReady) onReady(mockSDK);
            };
            
            initMock();
          };
          
          document.body.appendChild(script);
        }
      } catch (err) {
        if (isMounted) {
          console.error("[BanubaIntegration] Error in SDK initialization:", err);
          setError("Failed to initialize makeup try-on. Please check your camera permissions.");
          
          // Always fallback to mock on error
          const mockSDK = new BanubaSDKMock(containerRef.current);
          await mockSDK.initialize();
          sdkInstanceRef.current = mockSDK;
          
          setSdkReady(true);
          if (onReady) onReady(mockSDK);
        }
      }
    };
    
    initializeSDK();
    
    // Cleanup function
    return () => {
      isMounted = false;
      
      // Cleanup SDK if initialized
      if (sdkInstanceRef.current) {
        try {
          sdkInstanceRef.current.destroy();
        } catch (err) {
          console.error("[BanubaIntegration] Error destroying SDK:", err);
        }
      }
    };
  }, [onReady]);
  
  /**
   * Apply makeup filters to the SDK
   * @param {Array} filters - Array of makeup filters to apply
   */
  const applyMakeupFilters = (filters) => {
    if (!sdkReady || !sdkInstanceRef.current) {
      console.warn("[BanubaIntegration] SDK not ready, cannot apply filters");
      return;
    }
    
    console.log("[BanubaIntegration] Applying makeup filters:", filters);
    
    try {
      sdkInstanceRef.current.applyMakeup(filters);
      setCurrentFilters(filters);
    } catch (err) {
      console.error("[BanubaIntegration] Error applying makeup:", err);
    }
  };
  
  /**
   * Clear all applied makeup filters
   */
  const clearMakeup = () => {
    if (!sdkReady || !sdkInstanceRef.current) return;
    
    try {
      sdkInstanceRef.current.clearMakeup();
      setCurrentFilters([]);
    } catch (err) {
      console.error("[BanubaIntegration] Error clearing makeup:", err);
    }
  };
  
  /**
   * Take a snapshot of the current makeup look
   * @returns {Promise<string>} Base64 encoded image data
   */
  const takeSnapshot = () => {
    if (!sdkReady || !sdkInstanceRef.current) {
      return Promise.reject(new Error("SDK not ready"));
    }
    
    try {
      return sdkInstanceRef.current.takeSnapshot();
    } catch (err) {
      console.error("[BanubaIntegration] Error taking snapshot:", err);
      return Promise.reject(err);
    }
  };
  
  // Expose SDK methods to parent component
  useEffect(() => {
    if (sdkReady && onReady && sdkInstanceRef.current) {
      // Create API object with exposed methods
      const sdkAPI = {
        applyMakeupFilters,
        clearMakeup,
        takeSnapshot,
        sdkInstance: sdkInstanceRef.current
      };
      
      onReady(sdkAPI);
    }
  }, [sdkReady, onReady]);

  return (
    <div className="banuba-integration-container">
      {error && (
        <div className="banuba-error-message">
          {error}
        </div>
      )}
      
      <div 
        ref={containerRef} 
        className="banuba-viewport"
      />
      
      {currentFilters.length > 0 && (
        <div className="banuba-active-filters">
          <button 
            className="banuba-clear-button"
            onClick={clearMakeup}
          >
            Clear Makeup
          </button>
          
          <div className="banuba-filter-chips">
            {currentFilters.map((filter, index) => (
              <div 
                key={index}
                className="banuba-filter-chip"
                style={{
                  backgroundColor: filter.color || '#f0f0f0'
                }}
              >
                {filter.type}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BanubaIntegration;
