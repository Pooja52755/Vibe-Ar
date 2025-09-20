/**
 * Add custom CSS for the GenAI Makeup interface
 */
(function() {
  // Add custom CSS for better UI
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    /* AI Makeup Button */
    #ai-makeup-button-container {
      position: fixed;
      top: 70px;
      left: 15px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    #ai-makeup-button {
      background-color: #8e44ad;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(142, 68, 173, 0.3);
      transition: all 0.2s ease;
      animation: pulseBounce 2s infinite;
      font-size: 16px;
    }
    
    #ai-makeup-button:hover {
      background-color: #7d3c98;
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(142, 68, 173, 0.4);
      animation: none;
    }
    
    /* AI Prompt Dialog */
    #ai-prompt-container {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    }
    
    .ai-prompt-dialog {
      background-color: white;
      border-radius: 12px;
      padding: 25px;
      width: 90%;
      max-width: 550px;
      box-shadow: 0 5px 25px rgba(0, 0, 0, 0.3);
      max-height: 80vh;
      overflow-y: auto;
    }
    
    .ai-prompt-title {
      margin: 0 0 20px 0;
      font-size: 24px;
      color: #8e44ad;
      text-align: center;
      border-bottom: 2px solid #8e44ad;
      padding-bottom: 15px;
    }
    
    .ai-prompt-description {
      margin: 0 0 20px 0;
      font-size: 16px;
      color: #333;
      text-align: center;
    }
    
    /* Preset tabs */
    .preset-tabs {
      display: flex;
      border-bottom: 1px solid #ddd;
      margin-bottom: 15px;
    }
    
    .preset-tab {
      padding: 10px 20px;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.2s;
    }
    
    .preset-tab.active {
      border-bottom: 3px solid #8e44ad;
      color: #8e44ad;
      font-weight: bold;
    }
    
    /* Preset grid */
    .preset-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .preset-button {
      background-color: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      transition: all 0.2s;
      text-align: center;
    }
    
    .preset-button:hover {
      background-color: #e9e9e9;
      border-color: #8e44ad;
      transform: translateY(-2px);
    }
    
    .preset-button strong {
      font-size: 16px;
      margin-bottom: 5px;
      color: #333;
    }
    
    .preset-button span {
      font-size: 14px;
      color: #666;
    }
    
    /* Custom prompt input */
    .ai-prompt-input {
      width: 100%;
      padding: 12px;
      border: 2px solid #ddd;
      border-radius: 8px;
      margin-bottom: 20px;
      box-sizing: border-box;
      font-size: 16px;
      transition: border-color 0.2s;
    }
    
    .ai-prompt-input:focus {
      border-color: #8e44ad;
      outline: none;
    }
    
    /* Buttons */
    .ai-prompt-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
    }
    
    .ai-button-cancel {
      background-color: #f5f5f5;
      color: #333;
      border: none;
      border-radius: 8px;
      padding: 12px 20px;
      cursor: pointer;
      font-size: 16px;
    }
    
    .ai-button-apply {
      background-color: #8e44ad;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px 20px;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
    }
    
    .ai-button-apply:hover {
      background-color: #7d3c98;
    }
    
    /* Animations */
    @keyframes pulseBounce {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    /* Loading indicator */
    .ai-makeup-loader {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      flex-direction: column;
    }
    
    .ai-loading-spinner {
      width: 80px;
      height: 80px;
      border: 5px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
    }
    
    .ai-loading-message {
      color: white;
      margin-top: 20px;
      font-size: 18px;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    /* Mobile responsiveness */
    @media (max-width: 768px) {
      .ai-prompt-dialog {
        padding: 20px;
        width: 95%;
      }
      
      .preset-grid {
        grid-template-columns: 1fr;
      }
      
      .ai-prompt-title {
        font-size: 20px;
      }
      
      #ai-makeup-button-container {
        top: auto;
        bottom: 20px;
        left: 20px;
      }
    }
  `;
  
  // Add to document
  document.head.appendChild(styleElement);
})();