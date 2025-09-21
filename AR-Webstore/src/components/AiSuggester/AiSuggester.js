import React from 'react';
import DeviceDetector from '../ui/DeviceDetector';
import './AiSuggester.css';

const AiSuggester = () => {
  
  // Open universal beauty experience that redirects to local version
  const openUniversalExperience = () => {
    window.open('/beauty.html', '_blank');
  };
  
  // Open local beauty experience directly
  const openLocalExperience = () => {
    window.open('/local-beauty-ar/index.html', '_blank');
  };
  
  // Open beauty web directly
  const openBeautyWeb = () => {
    window.open('/beauty-web/index.html', '_blank');
  };
  
  // Main component render
  return (
    <div className="ai-suggester-container">
      <h1>Virtual Makeup Try-On</h1>
      <p className="ai-suggester-description">
        Try on different makeup looks virtually using our advanced AI beauty filters.
        Our technology lets you see how different makeup styles look on you in real-time!
      </p>
      
      <div className="beauty-web-launcher">
        <DeviceDetector
          mobileContent={
            <>
              <div className="mobile-notice">
                <p><strong>Mobile Device Detected</strong></p>
                <p>For the best experience on mobile devices, please use our local solution:</p>
              </div>
              <button 
                className="beauty-web-button mobile-button"
                onClick={openLocalExperience}
              >
                Open Beauty Experience
              </button>
              <a 
                href="/beauty-web/index.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="beauty-web-button hosted-button"
                onClick={openBeautyWeb}
              >
                Try Direct Access
              </a>
              <p className="mobile-tip">Tip: Allow camera access when prompted for the best experience</p>
            </>
          }
          desktopContent={
            <>
              <button 
                className="beauty-web-button"
                onClick={openUniversalExperience}
              >
                Launch Beauty Experience
              </button>
              <p>Click to launch our full beauty experience in a new tab</p>
            </>
          }
        />
      </div>
      
      <div className="beauty-instructions">
        <h3>Alternative Methods:</h3>
        <p>We now provide multiple ways to access our Beauty AR experience:</p>
        
        <DeviceDetector
          mobileContent={
            <ol>
              <li>Try the <a href="/beauty.html" target="_blank" rel="noopener noreferrer">Universal Beauty Experience</a> (recommended)</li>
              <li>Access our <a href="/local-beauty-ar/index.html" target="_blank" rel="noopener noreferrer">Local Beauty Solution</a> for connection issues</li>
              <li>Use <a href="/beauty-web/index.html" target="_blank" rel="noopener noreferrer">Direct Beauty Web Access</a> for a technical approach</li>
            </ol>
          }
          desktopContent={
            <>
              <ol>
                <li>Try the <a href="/beauty.html" target="_blank" rel="noopener noreferrer">Universal Beauty Experience</a> in a new tab</li>
                <li>Access our <a href="/local-beauty-ar/index.html" target="_blank" rel="noopener noreferrer">Local Beauty Solution</a> for connection issues</li>
                <li>Use <a href="/beauty-web/index.html" target="_blank" rel="noopener noreferrer">Direct Beauty Web Access</a> for a technical approach</li>
              </ol>
              
              <div className="path-display">
                <p>Running from: <code>AR-Webstore/public/</code></p>
              </div>
            </>
          }
        />
      </div>
      
      <div className="preview-image">
        <img 
          src="/assets/preview-beauty.jpg" 
          alt="Beauty AR Preview" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/600x400?text=Beauty+AR+Preview";
          }}
        />
      </div>
      
      <div className="info-section">
        <h2>How it Works</h2>
        <p>Our AI analyzes your facial features and applies realistic makeup effects in real-time. You can try different looks and take screenshots to save your favorite styles.</p>
        
        <h3>Features:</h3>
        <ul>
          <li>Real-time makeup application</li>
          <li>Multiple preset looks to choose from</li>
          <li>Screenshot functionality to save your favorite looks</li>
          <li>High-quality beauty filters powered by Banuba SDK</li>
          <li>Advanced beauty controls in the full experience</li>
          <li>Completely local experience - no external server required!</li>
        </ul>
      </div>
    </div>
  );
};

export default AiSuggester;