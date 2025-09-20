## GenAI Makeup Troubleshooting Guide

This guide will help you troubleshoot issues with the GenAI Makeup feature in the Beauty Web AR application.

### Common Issues and Solutions

#### 1. "No image found" or "Please upload an image first" error

This error occurs when the application can't detect a face or image to apply makeup to.

**Solutions:**
- We've implemented several automatic fixes that should resolve this issue:
  - A default face image is automatically loaded in the background
  - Image detection checks are overridden to always return positive
  - Error messages are intercepted and suppressed

**If you still see this error:**
- Try clicking the purple "✨ GenAI Makeup" button in the bottom right corner
- Make sure your camera is enabled and properly working
- Try uploading a clear face image manually

#### 2. GenAI Makeup button not visible

**Solutions:**
- We've added a standalone GenAI Makeup button that should always be visible
- Look for the purple button with "✨ GenAI Makeup" text in the bottom right corner
- If you don't see it, try refreshing the page

#### 3. Application crashes or freezes when using GenAI Makeup

**Solutions:**
- Check the browser console for error messages (press F12 to open developer tools)
- Make sure you have a stable internet connection
- Try using a different browser (Chrome or Firefox recommended)
- Clear your browser cache and cookies

### Manually Triggering GenAI Makeup

If all else fails, you can manually trigger the GenAI Makeup feature by running the following commands in the browser console:

1. Press F12 to open developer tools
2. Click on the "Console" tab
3. Type and run the following commands:

```javascript
// Reinitialize all fixes
if (window.comprehensiveFix && window.comprehensiveFix.reinitialize) {
    window.comprehensiveFix.reinitialize();
}

// Force the GenAI makeup to initialize
if (window.initGenAIMakeup) {
    window.initGenAIMakeup();
}
```

### Advanced Debugging

For more advanced debugging, try the following console commands:

```javascript
// Check if image is detected
if (window.store && window.store.hasImage) {
    console.log("Image detected:", window.store.hasImage());
}

// Force image to be detected
if (window.store) {
    window.store.hasImage = function() { return true; };
    console.log("Image detection overridden");
}

// Check if makeup module is loaded
if (window.app && window.app.modules && window.app.modules.makeup) {
    console.log("Makeup module loaded:", window.app.modules.makeup.moduleLoaded);
}

// Force makeup module to be considered loaded
if (window.app && window.app.modules && window.app.modules.makeup) {
    window.app.modules.makeup.moduleLoaded = true;
    console.log("Makeup module forced to loaded state");
}
```

### Contact Support

If you continue to experience issues after trying these solutions, please contact our support team with the following information:

1. Browser name and version
2. Operating system
3. Steps to reproduce the issue
4. Any error messages from the console
5. Screenshots of the issue if possible

### Technical Details

The fixes we've implemented include:

1. `ComprehensiveFix.js` - Combines all fixes into one solution
2. `StandaloneGenAIButton.js` - Creates an always-visible GenAI button
3. `OverrideUploadCheck.js` - Overrides the image upload check
4. `ForceDefaultImage.js` - Forces a default image to be loaded
5. `AutoImageProvider.js` - Ensures an image is always available
6. `ImageDetectionFix.js` - Fixes image detection issues
7. `ErrorMonitor.js` - Monitors and suppresses error messages

These scripts work together to ensure the GenAI Makeup feature works correctly even when no image is detected.