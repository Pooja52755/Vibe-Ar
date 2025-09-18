# Beauty AR Experience Integration

This directory contains the integration files for the Banuba Beauty AR experience in the AR Webstore application.

## Setup and Usage

The Beauty AR Experience is integrated into the AR Webstore application and can be accessed through the "AI Suggester" section in the navigation menu. The experience provides virtual makeup try-on functionality powered by Banuba SDK.

### Files Overview

- `index.html` - The main entry point for the Beauty Experience with mobile-responsive design
- `BanubaClientToken.js` - Contains the authentication token for Banuba SDK

### Access Methods

The Beauty Experience can be accessed in several ways:

1. **Within AR Webstore (Desktop):** Click on "AI Suggester" in the navigation menu and use the "Launch Beauty Experience" button
2. **Direct Link (Desktop/Mobile):** Access `/beauty-web/index.html` directly in your browser
3. **Hosted Version:** Use the link to Banuba's hosted demo for guaranteed compatibility

### Mobile Device Compatibility

- The experience automatically detects mobile devices and provides appropriate options
- For the best experience on mobile devices, use the provided links to Banuba's hosted versions
- Camera and microphone permissions must be granted for the AR functionality to work

### Troubleshooting

- **Camera Access Issues:** Make sure your browser has permission to access your camera
- **Loading Problems:** Try the alternative access methods if the integrated experience doesn't load
- **Mobile Compatibility:** If experiencing issues on mobile devices, use the mobile-friendly link

## Development Notes

- The Beauty Experience uses iframe integration within the AR Webstore
- The experience adapts to different screen sizes and device types
- For adding new features, modify the beauty-web/index.html file and related components

## Credits

This integration uses the Banuba SDK for AR facial recognition and beauty filters.