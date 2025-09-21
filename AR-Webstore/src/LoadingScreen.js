import React, { useState, useEffect } from "react";
import "./App.css";

const LoadingScreen = () => {
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setShow1(true), 200),
      setTimeout(() => setShow2(true), 500),
      setTimeout(() => setShow3(true), 800),
      setTimeout(() => setShow4(true), 1100)
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="loading-screen">
      {/* Corner images for loading screen with slide-in animation */}
      {show1 && (
        <img src={process.env.PUBLIC_URL + "/png images/a1.jpg"} alt="a1" className="corner-image top-left" loading="eager" draggable="false" />
      )}
      {show2 && (
        <img src={process.env.PUBLIC_URL + "/png images/a2.jpg"} alt="a2" className="corner-image top-right" loading="eager" draggable="false" />
      )}
      {show3 && (
        <img src={process.env.PUBLIC_URL + "/png images/a3.jpeg"} alt="a3" className="corner-image bottom-left" loading="eager" draggable="false" />
      )}
      {show4 && (
        <img src={process.env.PUBLIC_URL + "/png images/a4.jpg"} alt="a4" className="corner-image bottom-right" loading="eager" draggable="false" />
      )}
      <img src={process.env.PUBLIC_URL + "/png images/logo.png"} alt="AuraFit Logo" className="loading-logo" style={{width: 'auto', height: '180px', objectFit: 'contain', marginBottom: '-10px'}} />
      <div className="loading-team" style={{marginTop: '0px', marginBottom: '0px'}}>by team Abhimanyu</div>
      <div style={{height: '40px'}}></div>
      <div className="loading-caption">
        <div className="loading-tagline">Your vibe, your style, your way</div>
      </div>
      <div className="loading-dots">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  );
};

export default LoadingScreen;
