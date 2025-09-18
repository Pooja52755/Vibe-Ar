import React, { useState, useEffect } from 'react';

/**
 * DeviceDetector component that identifies the user's device type
 * and provides appropriate UI elements based on the device.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.mobileContent - Content to display on mobile devices
 * @param {React.ReactNode} props.desktopContent - Content to display on desktop devices
 * @param {React.ReactNode} props.fallbackContent - Optional fallback content if needed
 * @returns {React.ReactNode}
 */
const DeviceDetector = ({ 
  mobileContent,
  desktopContent,
  fallbackContent = null
}) => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isDesktop: true,
    browserName: '',
    isSupported: true,
  });

  useEffect(() => {
    const detectDevice = () => {
      // Detect if mobile
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Get browser name
      const getBrowserName = () => {
        const userAgent = navigator.userAgent;
        let browserName = "Unknown";
        
        if (userAgent.indexOf("Chrome") > -1) {
          browserName = "Chrome";
        } else if (userAgent.indexOf("Safari") > -1) {
          browserName = "Safari";
        } else if (userAgent.indexOf("Firefox") > -1) {
          browserName = "Firefox";
        } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) {
          browserName = "Internet Explorer";
        } else if (userAgent.indexOf("Edge") > -1) {
          browserName = "Edge";
        }
        
        return browserName;
      };
      
      const browser = getBrowserName();
      
      // Check if supported (this is a simplified check, expand as needed)
      const isSupported = browser !== "Internet Explorer";
      
      setDeviceInfo({
        isMobile: mobile,
        isDesktop: !mobile,
        browserName: browser,
        isSupported
      });
    };
    
    detectDevice();
    window.addEventListener('resize', detectDevice);
    
    return () => window.removeEventListener('resize', detectDevice);
  }, []);
  
  // Render appropriate content based on device
  if (!deviceInfo.isSupported && fallbackContent) {
    return fallbackContent;
  }
  
  return deviceInfo.isMobile ? mobileContent : desktopContent;
};

export default DeviceDetector;