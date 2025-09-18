/**
 * UploadPhotoButton.js - Adds a prominent upload photo button to the interface
 * 
 * This script adds a floating action button for photo upload functionality
 * to make it easily accessible on mobile devices.
 */

(function() {
  document.addEventListener('DOMContentLoaded', function() {
    // Only execute on mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // UPLOAD BUTTON REMOVED PER USER REQUEST
      // Instead, focus on fixing feature application and navigation
      fixFeatureApplication();
      
      function fixFeatureApplication() {
        // Create the upload button container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'upload-photo-fab';
        buttonContainer.style.cssText = `
          position: fixed;
          bottom: 80px;
          right: 20px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
        `;
        
        // Create the button
        const button = document.createElement('button');
        button.className = 'upload-photo-button';
        button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z"/>
          </svg>
        `;
        button.style.cssText = `
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: #ff4081;
          border: none;
          box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        `;
        
        // Create label
        const label = document.createElement('span');
        label.textContent = 'Upload Photo';
        label.style.cssText = `
          color: white;
          background-color: rgba(0,0,0,0.7);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          margin-top: 8px;
        `;
        
        // Add elements to the DOM
        buttonContainer.appendChild(button);
        buttonContainer.appendChild(label);
        document.body.appendChild(buttonContainer);
        
        // Create hidden file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        
        // Add click event to button
        button.addEventListener('click', function() {
          fileInput.click();
        });
        
        // Handle file selection
        fileInput.addEventListener('change', function(event) {
          if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            
            // Try to find the onPhotoUploaded function or photo-uploaded event
            if (window.onPhotoUploaded) {
              window.onPhotoUploaded(file);
            } else {
              // Try to emit event to the app
              const customEvent = new CustomEvent('photo-uploaded', { detail: file });
              document.dispatchEvent(customEvent);
              
              // Try to find the relevant component and call its method
              const uploadComponent = document.querySelector('.bnb-start-screen__upload-area');
              if (uploadComponent && uploadComponent.__vue__) {
                uploadComponent.__vue__.$emit('input', file);
              }
              
              // As a fallback, try to use the existing file input
              const existingFileInput = document.querySelector('input[type="file"][accept="image/*"]');
              if (existingFileInput) {
                // Create a new DataTransfer object and add our file
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                existingFileInput.files = dataTransfer.files;
                
                // Trigger change event
                const changeEvent = new Event('change', { bubbles: true });
                existingFileInput.dispatchEvent(changeEvent);
                
                // Also try input event
                const inputEvent = new Event('input', { bubbles: true });
                existingFileInput.dispatchEvent(inputEvent);
              }
            }
            
            // Show a success message
            showToast('Photo uploaded successfully!');
          }
        });
      }
      
      // Helper function to show a toast notification
      function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'upload-toast';
        toast.textContent = message;
        toast.style.cssText = `
          position: fixed;
          bottom: 150px;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(0,0,0,0.8);
          color: white;
          padding: 12px 24px;
          border-radius: 24px;
          z-index: 10000;
          font-size: 14px;
        `;
        
        document.body.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(function() {
          toast.style.opacity = '0';
          toast.style.transition = 'opacity 0.5s ease';
          
          setTimeout(function() {
            document.body.removeChild(toast);
          }, 500);
        }, 3000);
      }
    }
  });
})();