/**
 * IntegratedGenAIButtons.js
 * 
 * This script creates an integrated floating UI panel that includes:
 * 1. Take Photo button
 * 2. Upload Photo button
 * 3. GenAI Makeup button
 * 
 * All buttons are prominently displayed and always accessible.
 */

(function() {
    console.log('[IntegratedGenAIButtons] Initializing...');
    
    // Create and add the buttons as soon as possible
    document.addEventListener('DOMContentLoaded', addIntegratedButtons);
    
    // Also try on window load (as a backup)
    window.addEventListener('load', addIntegratedButtons);
    
    // For immediate execution
    if (document.readyState !== 'loading') {
        addIntegratedButtons();
    }
    
    // Function to add the integrated buttons
    function addIntegratedButtons() {
        // Only create once
        if (document.getElementById('integrated-buttons-container')) {
            console.log('[IntegratedGenAIButtons] Buttons already exist');
            return;
        }
        
        console.log('[IntegratedGenAIButtons] Creating integrated buttons UI');
        
        // Create floating panel container
        const panel = document.createElement('div');
        panel.id = 'integrated-buttons-container';
        panel.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: flex-end;
        `;
        
        // Create Take Photo button
        const takePhotoButton = createButton('take-photo-button', '📷 Take Photo', '#2196F3');
        takePhotoButton.addEventListener('click', handleTakePhoto);
        
        // Create Upload Photo button
        const uploadPhotoButton = createButton('upload-photo-button', '📤 Upload Photo', '#4CAF50');
        uploadPhotoButton.addEventListener('click', handleUploadPhoto);
        
        // Create hidden file input for photo upload
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'integrated-file-input';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', handleFileSelected);
        
        // Create GenAI Makeup button
        const genaiButton = createButton('genai-makeup-button', '✨ GenAI Makeup', '#9C27B0');
        genaiButton.addEventListener('click', handleGenAIMakeup);
        
        // Add everything to the panel
        panel.appendChild(takePhotoButton);
        panel.appendChild(uploadPhotoButton);
        panel.appendChild(fileInput);
        panel.appendChild(genaiButton);
        
        // Add panel to document
        document.body.appendChild(panel);
        
        // Add styles for animations
        addStyles();
        
        console.log('[IntegratedGenAIButtons] Integrated buttons added to page');
    }
    
    // Helper function to create a button with consistent styling
    function createButton(id, text, bgColor) {
        const button = document.createElement('button');
        button.id = id;
        button.innerHTML = text;
        button.style.cssText = `
            background-color: ${bgColor};
            color: white;
            border: none;
            border-radius: 25px;
            padding: 12px 20px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            width: 180px;
            text-align: center;
        `;
        
        // Add hover effects
        button.onmouseenter = function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
        };
        
        button.onmouseleave = function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        };
        
        return button;
    }
    
    // Add CSS styles
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes buttonPulse {
                0% { transform: scale(1); box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
                50% { transform: scale(1.05); box-shadow: 0 6px 12px rgba(0,0,0,0.3); }
                100% { transform: scale(1); box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
            }
            
            @keyframes slideIn {
                from { transform: translateX(100px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            #integrated-buttons-container {
                animation: slideIn 0.5s ease-out;
            }
            
            #integrated-buttons-container button {
                animation: buttonPulse 3s infinite;
                animation-delay: var(--delay, 0s);
            }
            
            #take-photo-button {
                --delay: 0s;
            }
            
            #upload-photo-button {
                --delay: 0.5s;
            }
            
            #genai-makeup-button {
                --delay: 1s;
            }
            
            .toast-message {
                position: fixed;
                bottom: 100px;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 12px 24px;
                border-radius: 24px;
                z-index: 10001;
                font-size: 16px;
                animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
                pointer-events: none;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translate(-50%, 20px); }
                to { opacity: 1; transform: translate(-50%, 0); }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; transform: translate(-50%, 0); }
                to { opacity: 0; transform: translate(-50%, -20px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Handle Take Photo
    function handleTakePhoto() {
        console.log('[IntegratedGenAIButtons] Take Photo clicked');
        
        // Show toast message
        showToast('Opening camera...');
        
        // Try to use native camera functionality
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            // Create camera UI
            const cameraContainer = document.createElement('div');
            cameraContainer.id = 'camera-container';
            cameraContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.9);
                z-index: 10002;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            `;
            
            // Create video element
            const video = document.createElement('video');
            video.id = 'camera-preview';
            video.style.cssText = `
                max-width: 90%;
                max-height: 70%;
                border: 3px solid white;
                border-radius: 8px;
            `;
            video.autoplay = true;
            
            // Create capture button
            const captureButton = document.createElement('button');
            captureButton.id = 'capture-button';
            captureButton.innerHTML = '📸 Capture Photo';
            captureButton.style.cssText = `
                background-color: #e91e63;
                color: white;
                border: none;
                border-radius: 25px;
                padding: 12px 24px;
                font-size: 18px;
                font-weight: bold;
                margin-top: 20px;
                cursor: pointer;
            `;
            
            // Create close button
            const closeButton = document.createElement('button');
            closeButton.id = 'close-camera-button';
            closeButton.innerHTML = '✖ Close';
            closeButton.style.cssText = `
                position: absolute;
                top: 20px;
                right: 20px;
                background-color: rgba(255, 255, 255, 0.2);
                color: white;
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                font-size: 20px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            // Add elements to container
            cameraContainer.appendChild(video);
            cameraContainer.appendChild(captureButton);
            cameraContainer.appendChild(closeButton);
            
            // Add container to document
            document.body.appendChild(cameraContainer);
            
            // Get camera access
            navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                .then(function(stream) {
                    video.srcObject = stream;
                    
                    // Handle capture button click
                    captureButton.addEventListener('click', function() {
                        // Create canvas to capture frame
                        const canvas = document.createElement('canvas');
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        
                        // Convert to data URL
                        const imageDataUrl = canvas.toDataURL('image/png');
                        
                        // Stop camera stream
                        stream.getTracks().forEach(track => track.stop());
                        
                        // Remove camera UI
                        document.body.removeChild(cameraContainer);
                        
                        // Process the captured image
                        processImage(imageDataUrl);
                    });
                    
                    // Handle close button click
                    closeButton.addEventListener('click', function() {
                        // Stop camera stream
                        stream.getTracks().forEach(track => track.stop());
                        
                        // Remove camera UI
                        document.body.removeChild(cameraContainer);
                        
                        showToast('Camera closed');
                    });
                })
                .catch(function(error) {
                    console.error('[IntegratedGenAIButtons] Camera error:', error);
                    document.body.removeChild(cameraContainer);
                    showToast('Could not access camera. Please try uploading a photo instead.');
                });
        } else {
            showToast('Camera not supported on this device. Please try uploading a photo instead.');
        }
    }
    
    // Handle Upload Photo
    function handleUploadPhoto() {
        console.log('[IntegratedGenAIButtons] Upload Photo clicked');
        
        // Trigger file input click
        const fileInput = document.getElementById('integrated-file-input');
        if (fileInput) {
            fileInput.click();
        }
    }
    
    // Handle file selected
    function handleFileSelected(event) {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            
            console.log('[IntegratedGenAIButtons] File selected:', file.name);
            showToast('Image uploaded: ' + file.name);
            
            // Read file as data URL
            const reader = new FileReader();
            reader.onload = function(e) {
                processImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }
    
    // Process the image (either from camera or upload)
    function processImage(imageDataUrl) {
        console.log('[IntegratedGenAIButtons] Processing image...');
        
        // Create image element for the uploaded/captured image
        const img = new Image();
        img.onload = function() {
            // Set the image to the app
            if (window.store && window.store.setImage) {
                window.store.setImage(img);
                showToast('Image processed successfully');
                
                // Highlight the GenAI button to prompt user to click it
                highlightGenAIButton();
            } else {
                // Fallback for direct image setting
                const existingImages = document.querySelectorAll('.bnb-makeup img');
                if (existingImages.length > 0) {
                    for (let i = 0; i < existingImages.length; i++) {
                        existingImages[i].src = imageDataUrl;
                    }
                    showToast('Image processed successfully');
                    
                    // Highlight the GenAI button
                    highlightGenAIButton();
                } else {
                    console.error('[IntegratedGenAIButtons] Could not find image container');
                    showToast('Could not process image. Please try again.');
                }
            }
        };
        img.src = imageDataUrl;
        
        // Store the image for later use
        window.lastProcessedImage = imageDataUrl;
    }
    
    // Highlight the GenAI button to prompt user to click it
    function highlightGenAIButton() {
        const genaiButton = document.getElementById('genai-makeup-button');
        if (genaiButton) {
            // Apply attention-grabbing animation
            genaiButton.style.animation = 'none'; // Reset animation
            setTimeout(() => {
                genaiButton.style.animation = 'buttonPulse 1s infinite';
                genaiButton.style.backgroundColor = '#e91e63'; // Brighter color
                genaiButton.style.transform = 'scale(1.1)';
                
                // Reset after 5 seconds
                setTimeout(() => {
                    genaiButton.style.animation = 'buttonPulse 3s infinite';
                    genaiButton.style.backgroundColor = '#9C27B0';
                    genaiButton.style.transform = 'scale(1)';
                }, 5000);
            }, 10);
        }
    }
    
    // Handle GenAI Makeup
    function handleGenAIMakeup() {
        console.log('[IntegratedGenAIButtons] GenAI Makeup clicked');
        
        // If no image has been processed, show error
        if (!window.lastProcessedImage && !hasImageLoaded()) {
            showToast('Please upload or take a photo first');
            
            // Highlight the upload and take photo buttons
            highlightPhotoButtons();
            return;
        }
        
        // Apply a default makeup style directly
        const defaultStyle = "Natural everyday makeup with light blush and subtle eyeshadow";
        
        // Show processing indicator
        showProcessingIndicator();
        
        // Apply makeup directly without showing the prompt
        applyGenAIMakeup(defaultStyle);
    }
    
    // Check if an image is loaded in the app
    function hasImageLoaded() {
        // Check if store has image
        if (window.store && window.store.hasImage && window.store.hasImage()) {
            return true;
        }
        
        // Check for visible images in the makeup area
        const makeupImages = document.querySelectorAll('.bnb-makeup img');
        if (makeupImages.length > 0) {
            return true;
        }
        
        return false;
    }
    
    // Highlight the photo buttons to prompt user to click them
    function highlightPhotoButtons() {
        const takePhotoButton = document.getElementById('take-photo-button');
        const uploadPhotoButton = document.getElementById('upload-photo-button');
        
        if (takePhotoButton && uploadPhotoButton) {
            // Apply attention-grabbing animation
            takePhotoButton.style.animation = 'none';
            uploadPhotoButton.style.animation = 'none';
            
            setTimeout(() => {
                takePhotoButton.style.animation = 'buttonPulse 1s infinite';
                uploadPhotoButton.style.animation = 'buttonPulse 1s infinite';
                takePhotoButton.style.transform = 'scale(1.1)';
                uploadPhotoButton.style.transform = 'scale(1.1)';
                
                // Reset after 5 seconds
                setTimeout(() => {
                    takePhotoButton.style.animation = 'buttonPulse 3s infinite';
                    uploadPhotoButton.style.animation = 'buttonPulse 3s infinite';
                    takePhotoButton.style.transform = 'scale(1)';
                    uploadPhotoButton.style.transform = 'scale(1)';
                }, 5000);
            }, 10);
        }
    }
    
    // Show GenAI prompt interface
    function showGenAIPrompt() {
        // Try existing implementation first
        if (window.AIPromptEnhancer && typeof window.AIPromptEnhancer.showPrompt === 'function') {
            window.AIPromptEnhancer.showPrompt();
            return;
        }
        
        if (window.showAIMakeupPrompt && typeof window.showAIMakeupPrompt === 'function') {
            window.showAIMakeupPrompt();
            return;
        }
        
        if (window.SimpleGenAIMakeup && typeof window.SimpleGenAIMakeup.showPrompt === 'function') {
            window.SimpleGenAIMakeup.showPrompt();
            return;
        }
        
        // Fallback to our custom implementation
        console.log('[IntegratedGenAIButtons] Using custom GenAI prompt implementation');
        
        // Create dialog container
        const container = document.createElement('div');
        container.id = 'genai-prompt-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10002;
        `;
        
        // Create dialog box
        const dialog = document.createElement('div');
        dialog.id = 'genai-prompt-dialog';
        dialog.style.cssText = `
            background-color: white;
            border-radius: 12px;
            padding: 24px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        `;
        
        // Add header
        const header = document.createElement('h2');
        header.textContent = 'GenAI Makeup';
        header.style.cssText = `
            margin: 0 0 16px 0;
            color: #333;
            font-size: 24px;
            text-align: center;
        `;
        
        // Add instructions
        const instructions = document.createElement('p');
        instructions.textContent = 'Describe the makeup look you want to create:';
        instructions.style.cssText = `
            margin: 0 0 16px 0;
            color: #666;
            font-size: 16px;
        `;
        
        // Add examples section
        const examples = document.createElement('div');
        examples.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 16px;
        `;
        
        // Example prompt chips
        const examplePrompts = [
            'Natural everyday look',
            'Bold red lips',
            'Smokey eye',
            'Summer glow',
            'Evening glamour',
            'Wedding makeup'
        ];
        
        examplePrompts.forEach(prompt => {
            const chip = document.createElement('button');
            chip.textContent = prompt;
            chip.className = 'prompt-chip';
            chip.style.cssText = `
                background-color: #f0f0f0;
                border: none;
                border-radius: 16px;
                padding: 6px 12px;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s ease;
            `;
            
            chip.onmouseenter = function() {
                this.style.backgroundColor = '#e0e0e0';
            };
            
            chip.onmouseleave = function() {
                this.style.backgroundColor = '#f0f0f0';
            };
            
            chip.onclick = function() {
                promptInput.value = this.textContent;
            };
            
            examples.appendChild(chip);
        });
        
        // Add prompt input
        const promptInput = document.createElement('textarea');
        promptInput.id = 'genai-prompt-input';
        promptInput.placeholder = 'e.g., "Natural makeup with pink lips and light blush"';
        promptInput.style.cssText = `
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 16px;
            margin-bottom: 20px;
            min-height: 100px;
            resize: none;
            box-sizing: border-box;
        `;
        
        // Add buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        `;
        
        // Add cancel button
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.cssText = `
            padding: 10px 16px;
            border: none;
            border-radius: 8px;
            background-color: #f5f5f5;
            color: #333;
            font-size: 16px;
            cursor: pointer;
        `;
        
        cancelButton.onclick = function() {
            document.body.removeChild(container);
        };
        
        // Add apply button
        const applyButton = document.createElement('button');
        applyButton.textContent = 'Apply Makeup';
        applyButton.style.cssText = `
            padding: 10px 16px;
            border: none;
            border-radius: 8px;
            background-color: #9C27B0;
            color: white;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
        `;
        
        applyButton.onclick = function() {
            const promptText = promptInput.value.trim();
            if (promptText !== '') {
                // Close the dialog
                document.body.removeChild(container);
                
                // Show processing indicator
                showProcessingIndicator();
                
                // Apply makeup
                applyGenAIMakeup(promptText);
            } else {
                // Shake the input to indicate it's required
                promptInput.style.animation = 'none';
                setTimeout(() => {
                    promptInput.style.animation = 'shake 0.5s';
                }, 10);
            }
        };
        
        // Add shake animation
        const shakeStyle = document.createElement('style');
        shakeStyle.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(shakeStyle);
        
        // Assemble dialog
        buttonsContainer.appendChild(cancelButton);
        buttonsContainer.appendChild(applyButton);
        
        dialog.appendChild(header);
        dialog.appendChild(instructions);
        dialog.appendChild(examples);
        dialog.appendChild(promptInput);
        dialog.appendChild(buttonsContainer);
        
        container.appendChild(dialog);
        document.body.appendChild(container);
        
        // Focus the input
        promptInput.focus();
    }
    
    // Show processing indicator
    function showProcessingIndicator() {
        const processingContainer = document.createElement('div');
        processingContainer.id = 'genai-processing-container';
        processingContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10002;
        `;
        
        const spinner = document.createElement('div');
        spinner.className = 'processing-spinner';
        spinner.style.cssText = `
            width: 50px;
            height: 50px;
            border: 5px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
        `;
        
        const text = document.createElement('p');
        text.textContent = 'Applying AI makeup...';
        text.style.cssText = `
            color: white;
            font-size: 18px;
            margin-top: 20px;
        `;
        
        // Add spin animation
        const spinStyle = document.createElement('style');
        spinStyle.textContent = `
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(spinStyle);
        
        processingContainer.appendChild(spinner);
        processingContainer.appendChild(text);
        document.body.appendChild(processingContainer);
        
        // Remove after 5 seconds or when makeup is applied
        window.processingTimeout = setTimeout(() => {
            if (document.getElementById('genai-processing-container')) {
                document.body.removeChild(processingContainer);
            }
        }, 5000);
    }
    
    // Apply GenAI makeup
    function applyGenAIMakeup(promptText) {
        console.log('[IntegratedGenAIButtons] Applying GenAI makeup with prompt:', promptText);
        
        // Try existing implementation first
        if (window.applyAIMakeup && typeof window.applyAIMakeup === 'function') {
            window.applyAIMakeup(promptText);
            removeProcessingIndicator();
            return;
        }
        
        if (window.SimpleGenAIMakeup && typeof window.SimpleGenAIMakeup.applyMakeup === 'function') {
            window.SimpleGenAIMakeup.applyMakeup(promptText);
            removeProcessingIndicator();
            return;
        }
        
        if (window.EnhancedGenAIMakeup && typeof window.EnhancedGenAIMakeup.applyMakeup === 'function') {
            window.EnhancedGenAIMakeup.applyMakeup(promptText);
            removeProcessingIndicator();
            return;
        }
        
        // Fallback to a mock implementation
        console.log('[IntegratedGenAIButtons] Using mock GenAI makeup implementation');
        
        // Simulate processing delay
        setTimeout(() => {
            // Apply some random styles to show something happened
            applyRandomMakeupStyles();
            
            // Remove processing indicator
            removeProcessingIndicator();
            
            // No success message - let the visual result speak for itself
        }, 1000); // Reduced delay for faster feedback
    }
    
    // Remove processing indicator
    function removeProcessingIndicator() {
        clearTimeout(window.processingTimeout);
        const processingContainer = document.getElementById('genai-processing-container');
        if (processingContainer) {
            document.body.removeChild(processingContainer);
        }
    }
    
    // Apply random makeup styles for the mock implementation
    function applyRandomMakeupStyles() {
        // Find makeup container
        const makeupContainer = document.querySelector('.bnb-makeup');
        if (!makeupContainer) return;
        
        // Apply a filter to simulate makeup
        const filters = [
            'brightness(1.1) contrast(1.05) saturate(1.2)',
            'brightness(1.05) contrast(1.1) saturate(1.3) hue-rotate(5deg)',
            'brightness(1.15) contrast(1.05) saturate(1.1)',
            'brightness(1.1) contrast(1.2) saturate(1.15) sepia(0.1)'
        ];
        
        const randomFilter = filters[Math.floor(Math.random() * filters.length)];
        
        // Find all images in the makeup container
        const images = makeupContainer.querySelectorAll('img');
        images.forEach(img => {
            img.style.filter = randomFilter;
        });
    }
    
    // Show toast message
    function showToast(message) {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast-message');
        existingToasts.forEach(toast => {
            document.body.removeChild(toast);
        });
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        
        // Add to document
        document.body.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 3000);
    }
    
    // Make sure to periodically check and add the buttons
    // in case they get removed by other scripts
    setInterval(function() {
        if (!document.getElementById('integrated-buttons-container')) {
            addIntegratedButtons();
        }
    }, 3000);
})();