/**
 * NavbarUploadButton.js - Modified to fix navigation between makeup categories
 * 
 * This script enhances navigation between makeup categories and fixes
 * the feature application issues.
 */

(function() {
  document.addEventListener('DOMContentLoaded', function() {
    // Wait for the navbar to be loaded
    setTimeout(function() {
      // Find the navbar element
      const navbar = document.querySelector('.navbar');
      
      if (navbar) {
        // Create upload button
        const uploadButton = document.createElement('a');
        uploadButton.className = 'navbar-item upload-button';
        uploadButton.innerHTML = '<i class="fas fa-upload mr-2"></i> Upload Photo';
        
        // Add styles
        uploadButton.style.cssText = `
          background-color: #ff4081;
          color: white !important;
          border-radius: 20px;
          padding: 5px 15px;
          margin: 10px;
          font-weight: bold;
          height: 40px;
          display: flex;
          align-items: center;
          box-shadow: 0 2px 5px rgba(255,64,129,0.3);
        `;
        
        // Create hidden file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        
        // Add click event to button
        uploadButton.addEventListener('click', function(e) {
          e.preventDefault();
          fileInput.click();
        });
        
        // Handle file selection
        fileInput.addEventListener('change', function() {
          if (this.files && this.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
              // Find video element to replace
              const video = document.querySelector('video');
              if (video) {
                // Create image element
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.cssText = `
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  position: absolute;
                  top: 0;
                  left: 0;
                `;
                
                // Hide video
                video.style.display = 'none';
                
                // Add image to container
                video.parentNode.appendChild(img);
                
                // Update UI state
                document.body.classList.add('using-image');
                
                // Show notification
                const notification = document.createElement('div');
                notification.className = 'notification is-success';
                notification.innerHTML = 'Photo uploaded successfully! Try makeup effects on your photo.';
                notification.style.cssText = `
                  position: fixed;
                  top: 70px;
                  right: 20px;
                  z-index: 1000;
                  max-width: 300px;
                  animation: fadeOut 5s forwards;
                `;
                
                document.body.appendChild(notification);
                
                // Add animation
                const style = document.createElement('style');
                style.textContent = `
                  @keyframes fadeOut {
                    0% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { opacity: 0; display: none; }
                  }
                `;
                document.head.appendChild(style);
                
                // Remove notification after animation
                setTimeout(() => {
                  notification.remove();
                  style.remove();
                }, 5000);
              }
            };
            
            reader.readAsDataURL(this.files[0]);
          }
        });
        
        // Add to navbar
        const navbarEnd = navbar.querySelector('.navbar-end');
        if (navbarEnd) {
          navbarEnd.prepend(uploadButton);
        } else {
          navbar.appendChild(uploadButton);
        }
        
        // Fix makeup navigation
        fixMakeupNavigation();
      }
      
      // Function to improve navigation between makeup categories
      function fixMakeupNavigation() {
        // Find all makeup category links
        const makeupLinks = document.querySelectorAll('[href*="#makeup"], [href*="#retouch"], [href*="#lipstick"], [href*="#eyes"]');
        
        // Enhance each link to ensure proper navigation
        makeupLinks.forEach(link => {
          // Save original click handler
          const originalClick = link.onclick;
          
          // Add enhanced click handler
          link.onclick = function(e) {
            // Call original if it exists
            if (originalClick) {
              originalClick.call(this, e);
            }
            
            // Clear active states from other categories
            document.querySelectorAll('.is-active, .active').forEach(activeItem => {
              if (activeItem !== this && !this.contains(activeItem) && !activeItem.contains(this)) {
                activeItem.classList.remove('is-active', 'active');
              }
            });
            
            // Ensure this category becomes active
            this.classList.add('is-active');
            
            // After navigation, ensure feature selections work
            setTimeout(() => {
              // Find feature options in the current category
              const featureOptions = document.querySelectorAll('.panel-block:not(.is-active), .feature-option:not(.is-active)');
              
              // Make sure they're clickable
              featureOptions.forEach(option => {
                option.style.pointerEvents = 'auto';
                option.style.opacity = '1';
                
                // Enhance click behavior
                option.addEventListener('click', function() {
                  // Toggle active state
                  this.classList.toggle('is-active');
                  
                  // Force feature application
                  setTimeout(() => {
                    // Find the effect apply function if available
                    if (window.applyEffect) {
                      window.applyEffect(this.dataset.feature || this.textContent.trim());
                    }
                  }, 100);
                });
              });
            }, 300);
          };
        });
        
        // Fix back button behavior
        const backButtons = document.querySelectorAll('.back-button, .navbar-item');
        backButtons.forEach(button => {
          if (button.textContent.includes('Back')) {
            // Save original click handler
            const originalClick = button.onclick;
            
            // Add enhanced click handler
            button.onclick = function(e) {
              // Call original if it exists
              if (originalClick) {
                originalClick.call(this, e);
              }
              
              // After going back, reset state
              setTimeout(() => {
                // Re-enable all category navigation
                makeupLinks.forEach(link => {
                  link.style.pointerEvents = 'auto';
                  link.style.opacity = '1';
                });
              }, 200);
              
              return true;
            };
          }
        });
      }
    }, 1000); // Wait for components to load
  });
})();
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
            const toast = document.createElement('div');
            toast.className = 'upload-toast';
            toast.textContent = 'Photo uploaded successfully!';
            document.body.appendChild(toast);
            
            // Remove after 3 seconds
            setTimeout(function() {
              document.body.removeChild(toast);
            }, 3000);
          }
        });
        
        // Add button to navbar
        const rightSection = navbar.querySelector('.navbar-end') || navbar.querySelector('.navbar-brand');
        if (rightSection) {
          // Insert before the menu button if it exists
          const menuButton = rightSection.querySelector('.navbar-burger');
          if (menuButton) {
            rightSection.insertBefore(uploadButton, menuButton);
          } else {
            rightSection.appendChild(uploadButton);
          }
        } else {
          // Just append to the navbar if no sections found
          navbar.appendChild(uploadButton);
        }
      }
        // Find all makeup category links
        const makeupLinks = document.querySelectorAll('[href*="#makeup"], [href*="#retouch"], [href*="#lipstick"], [href*="#eyes"]');
        
        // Enhance each link to ensure proper navigation
        makeupLinks.forEach(link => {
          // Save original click handler
          const originalClick = link.onclick;
          
          // Add enhanced click handler
          link.onclick = function(e) {
            // Call original if it exists
            if (originalClick) {
              originalClick.call(this, e);
            }
            
            // Clear active states from other categories
            document.querySelectorAll('.is-active, .active').forEach(activeItem => {
              if (activeItem !== this && !this.contains(activeItem) && !activeItem.contains(this)) {
                activeItem.classList.remove('is-active', 'active');
              }
            });
            
            // Ensure this category becomes active
            this.classList.add('is-active');
            
            // After navigation, ensure feature selections work
            setTimeout(() => {
              // Find feature options in the current category
              const featureOptions = document.querySelectorAll('.panel-block:not(.is-active), .feature-option:not(.is-active)');
              
              // Make sure they're clickable
              featureOptions.forEach(option => {
                option.style.pointerEvents = 'auto';
                option.style.opacity = '1';
                
                // Enhance click behavior
                option.addEventListener('click', function() {
                  // Toggle active state
                  this.classList.toggle('is-active');
                  
                  // Force feature application
                  setTimeout(() => {
                    // Find the effect apply function if available
                    if (window.applyEffect) {
                      window.applyEffect(this.dataset.feature || this.textContent.trim());
                    }
                  }, 100);
                });
              });
            }, 300);
          };
        });
        
        // Fix back button behavior
        const backButtons = document.querySelectorAll('.back-button, .navbar-item');
        backButtons.forEach(button => {
          if (button.textContent.includes('Back')) {
            // Save original click handler
            const originalClick = button.onclick;
            
            // Add enhanced click handler
            button.onclick = function(e) {
              // Call original if it exists
              if (originalClick) {
                originalClick.call(this, e);
              }
              
              // After going back, reset state
              setTimeout(() => {
                // Re-enable all category navigation
                makeupLinks.forEach(link => {
                  link.style.pointerEvents = 'auto';
                  link.style.opacity = '1';
                });
              }, 200);
              
              return true;
            };
          }
        });
      }
    }, 1000); // Wait for components to load
  });
})();