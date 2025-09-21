import React, { useRef, useState, useEffect } from "react";
import LazyLoad from "react-lazyload";
// import "../../Products/ProductList.css";
import QRCode from "qrcode.react";
import Help from "./Help";

// Add loading animation styles
const modelViewerStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(66, 133, 244, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(66, 133, 244, 0); }
    100% { box-shadow: 0 0 0 0 rgba(66, 133, 244, 0); }
  }
  
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
    100% { transform: translateY(0px); }
  }
  
  model-viewer {
    --poster-color: transparent;
    --progress-bar-height: 5px;
    --progress-mask: transparent;
    --progress-bar-color: linear-gradient(90deg, #e91e63 0%, #f48fb1 50%, #9c27b0 100%);
    
    /* Pre-rendering optimizations */
    --min-camera-orbit: auto auto auto;
    --max-camera-orbit: auto auto auto;
    --camera-orbit-damping: 0.9;
    --interaction-prompt: none;
    --interaction-prompt-threshold: 0;
  }
  
  model-viewer::part(default-progress-bar) {
    height: 4px;
    background: linear-gradient(90deg, #e91e63 0%, #f48fb1 50%, #9c27b0 100%);
  }

  /* Ensure AR button is visible in v3.4.0 */
  model-viewer::part(ar-button) {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    background-color: #4285f4 !important;
    border-radius: 4px !important;
    border: none !important;
    position: absolute !important;
    bottom: 16px !important;
    right: 16px !important;
    padding: 12px 18px !important;
    color: white !important;
    font-weight: 500 !important;
    animation: float 2s ease-in-out infinite !important;
  }

  model-viewer::part(ar-button):hover {
    background-color: #3367d6 !important;
  }

  model-viewer::part(ar-button):active {
    background-color: #2850a7 !important;
  }
  
  .ar-overlay-button {
    background: linear-gradient(90deg, #e91e63 0%, #f48fb1 50%, #9c27b0 100%);
    border: none;
    border-radius: 8px;
    color: white;
    padding: 12px 18px;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    transition: all 0.2s ease;
  }
  
  .ar-overlay-button:hover {
    box-shadow: 0 8px 24px rgba(233, 30, 99, 0.25), 0 1.5px 6px rgba(156, 39, 176, 0.12);
    transform: translateY(-4px);
    background: linear-gradient(90deg, #e91e63 0%, #f48fb1 50%, #9c27b0 100%);
  }
  
  .ar-overlay-button:active {
    transform: scale(0.95);
  }
`;

const ModelViewer = ({ item, addToWishlist, removeFromWishlist, wishlist }) => {
  const [display, setDisplay] = useState(false);
  const [ARSupported, setARSupported] = useState(false);
  const [annotate, setAnnotate] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  
  
  let modelViewer1 = {
    backgroundColor: " #ecf0f3",
    overflowX: "hidden",
    posterColor: "#eee",
    width: "100%",
    height: ARSupported ? "85%" : "75%",
    borderRadius: 15,
  };
  
  // Accessing product for full screen start
  const model = useRef();

  // Accessing varient selections element
  const varient = useRef(null);

  console.log(item)

  function toggle() {
    if (!document.fullscreenElement) {
      model.current.requestFullscreen();
    } else if (document.exitFullscreen) document.exitFullscreen();
  }
  // Full screen code end


  const handleAnnotateClick = (annotation) => {
    const { target, position } = annotation;
    model.current.cameraTarget = position;
    model.current.orbit = target
  }

  useEffect(() => {
    if (
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    ) {
      setARSupported(true);
    }
  }, []);

  useEffect(() => {
    // set up event listeners
    const modelViewer = model.current
    modelViewer &&
    modelViewer.addEventListener('load', () => {
      console.log('loaded')
      const availableVariants = modelViewer?.availableVariants;
      console.log(availableVariants)
      for (const variant of availableVariants) {
        const option = document.createElement('option');
        option.value = variant;
        option.textContent = variant;
        varient?.current?.appendChild(option);
      }

      // Adding a default option
      const defaultOption = document.createElement('option');
      defaultOption.value = 'Default';
      defaultOption.textContent = 'Default';
      varient?.current?.appendChild(defaultOption);
    });

    varient?.current?.addEventListener('input', (event) => {
      modelViewer.variantName = event.target.value === 'Default' ? null : event.target.value;
    });
  }, []);
   
  useEffect(() => {
    if(wishlist){
    const isInWishlist = wishlist.some((wishlistItem) => wishlistItem.id === item.id);
    setIsInWishlist(isInWishlist);
    }
  }, [item, wishlist]);

  useEffect(() => {
    // Add custom event listener to handle AR activation
    const handleActivateAR = () => {
      try {
        // Get the activateAR method from the model-viewer element
        if (model.current.activateAR) {
          model.current.activateAR();
        } else {
          // Fallback to clicking the AR button directly
          const arButton = model.current.shadowRoot.querySelector('button.ar-button');
          if (arButton) {
            arButton.click();
          } else {
            console.warn('AR button not found in model-viewer shadow DOM');
          }
        }
      } catch (error) {
        console.error('Error activating AR:', error);
      }
    };

    if (model.current) {
      // For model-viewer version 3.4.0
      model.current.addEventListener('activate-ar', handleActivateAR);
    }

    return () => {
      // Clean up event listener
      const currentModel = model.current;
      if (currentModel) {
        currentModel.removeEventListener('activate-ar', handleActivateAR);
      }
    };
  }, []);

  const handleAddToWishlist = () => {
    if (isInWishlist) {
      removeFromWishlist(item.id);
    } 
    else 
    {
      addToWishlist(item);
    }
  };

  return (
    <div className="model-view">
      {/* Apply the modelViewerStyles */}
      <style>{modelViewerStyles}</style>
      <model-viewer
        key={item.id}
        ref={model}
        style={modelViewer1}
        src={item.modelSrc}
        ios-src={item.iOSSrc}
        alt="A 3D model"
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="auto"
        ar-placement="floor"
        preload
        reveal="auto"
        loading="eager"
        draco-decoder-path="https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
        camera-controls
        auto-rotate
        rotation-per-second="30deg"
        touch-action="pan-y"
        animation-name="Running"
        shadow-intensity="1"
        exposure="1"
        environment-image="neutral"
        skybox-image=""
        min-field-of-view="30deg"
        min-camera-orbit="auto auto auto"
        max-camera-orbit="auto auto auto"
        ar-button-visible
      >
        {/* Custom AR button specific for model-viewer v3.4.0 */}
        <div style={{
          position: "absolute",
          bottom: "16px",
          right: "16px",
          zIndex: 999,
          pointerEvents: "all"
        }}>
          <button 
            onClick={() => {
              if (model.current && model.current.activateAR) {
                model.current.activateAR();
              } else {
                // Dispatch a custom event for our event handler
                const event = new CustomEvent('activate-ar', { bubbles: true });
                model.current.dispatchEvent(event);
              }
            }}
            className="ar-overlay-button"
            style={{ background: "linear-gradient(90deg, #e91e63 0%, #f48fb1 50%, #9c27b0 100%)", color: "white" }}
          >
            View in AR
          </button>
        </div>
        
        <div slot="poster" style={{ 
          background: "rgba(245, 245, 245, 0.8)", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          width: "100%",
          height: "100%",
          borderRadius: "15px",
          backdropFilter: "blur(5px)"
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ 
              width: "48px", 
              height: "48px", 
              borderRadius: "50%", 
              border: "4px solid rgba(200, 200, 200, 0.3)", 
              borderTopColor: "#4285f4", 
              margin: "0 auto 16px", 
              animation: "spin 1s linear infinite" 
            }}></div>
            <div style={{ fontWeight: "500", color: "#333", fontSize: "16px" }}>Loading 3D model...</div>
          </div>
        </div>

        <div slot="error" style={{ 
          background: "rgba(255, 235, 235, 0.9)",
          color: "#d32f2f", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          width: "100%",
          height: "100%",
          borderRadius: "15px",
          flexDirection: "column"
        }}>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>⚠️</div>
          <div style={{ fontWeight: "500", fontSize: "16px" }}>Error loading model</div>
          <div style={{ fontSize: "14px", marginTop: "8px" }}>Please try refreshing the page</div>
        </div>

        {ARSupported && (
          <button className="arbutton" style={{
            backgroundColor: "#4285f4",
            border: "none",
            borderRadius: "30px",
            color: "white",
            padding: "12px 18px",
            fontWeight: "500",
            fontSize: "14px",
            position: "absolute",
            top: "16px",
            right: "16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            transition: "all 0.2s ease",
            zIndex: 100
          }}
          onClick={() => {
            // Try to activate AR through a custom event
            const event = new CustomEvent('activate-ar', { bubbles: true });
            model.current.dispatchEvent(event);
          }}
          >
            <span style={{ marginRight: "8px" }}>🏠</span> View in your space
          </button>
        )}

        <button className="fullscreen-btn" onClick={toggle}>
          &#x26F6;<span>full screen</span>
        </button>
        {display ? (
          <>
            <button
              className={document.fullscreenElement ? "close fz" : "close"}
              onClick={() => setDisplay(false)}
            >
              &#10006;
            </button>
            <Help />
          </>
        ) : (
          <>
            <button className="help-btn" onClick={() => setDisplay(true)}>
              ?<span>help</span>
            </button>
          </>
        )}
        
        <button className="annotate-btn" onClick={() => setAnnotate((prevState) => !prevState)}>
          i
        </button>

        {annotate && item.annotations.map((annotate, idx) => (
          <button
            key={idx}
            class="Hotspot"
            slot={annotate.slot}
            data-position={annotate.position}
            data-normal={annotate.normal}
            data-orbit={annotate.orbit}
            data-target={annotate.target}
            data-visibility-attribute="visible"
            onClick={() => handleAnnotateClick(annotate)}
          >
            <div class="HotspotAnnotation">{annotate.title}</div>
          </button>
        ))}
        
        <div class="controls variant_div">
          <select ref={varient} id="variant"></select>
        </div>

      </model-viewer>
        
      <LazyLoad>
        {/* Card content below the model-viewer */}
        <div className="qr-sec">
          {!ARSupported && (
            <QRCode
              id={item.name}
              value={window.location.href}
              size={110}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
              includeMargin
            />
          )}

          <div className="product-details">
            <div>
              <div className="pname">{item.name}</div>
              <div className="rating-sec">
                <div>Rating</div>
                <div>
                  <span className="star">&#9733;</span>
                  <span className="star">&#9733;</span>
                  <span className="star">&#9733;</span>
                  <span>&#9733;</span>
                  <span>&#9733;</span>
                </div>
              </div>
              <div>Rs. 1000</div>
              {!ARSupported && <h5>Scan the QR code for AR View on mobile</h5>}
            </div>
            <button className="add-icon" onClick={handleAddToWishlist}>
              {isInWishlist ? '-' : '+'}
            </button>
          </div>
        </div>
      </LazyLoad>
    </div>
  );
};

export default ModelViewer;