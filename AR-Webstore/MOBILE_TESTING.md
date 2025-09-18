# Mobile Beauty AR Experience Guide

This document provides instructions for accessing and testing the Beauty AR Experience on mobile devices.

## Mobile Access Options

### 1. Direct Mobile Page

The most reliable way to access the Beauty AR experience on mobile devices is through the dedicated mobile page:

```
http://[your-server-ip]:3000/mobile-beauty.html
```

This page is specifically designed for mobile devices and provides direct links to the Banuba hosted demos, which are guaranteed to work on mobile browsers.

### 2. From the AR-Webstore App

When accessing the AR-Webstore application on a mobile device:

1. Navigate to the AI Suggester section
2. Click the "Open Mobile Experience" button
3. This will open the mobile-beauty.html page in a new tab

### 3. Alternative Hosted Versions

If you experience any issues with the integrated experience, you can use these direct links:

- [Banuba Beauty Demo](https://demo.banuba.com/beauty/)
- [Mobile-optimized Banuba Demo](https://makeup.banuba.com/)

These are official Banuba hosted demos that are guaranteed to work on mobile devices.

## Troubleshooting Mobile Access

If you encounter "Cannot reach this page" errors on mobile:

1. **Check your server IP**: Make sure you're using the correct server IP address
2. **Use the hosted links**: The Banuba hosted demos are the most reliable option
3. **Network issues**: Ensure you're on the same network as the development server
4. **Clear cache**: Try clearing your browser cache or using incognito/private mode
5. **Alternative browser**: Try a different mobile browser (Chrome, Safari, Firefox)

## Testing on Different Devices

For comprehensive testing across devices:

1. **iOS devices**: Test on Safari and Chrome browsers
2. **Android devices**: Test on Chrome, Firefox, and Samsung Internet browsers
3. **Different screen sizes**: Test on both phones and tablets if possible

## Implementation Details

The mobile experience implementation includes:

1. Automatic device detection and redirection
2. Dedicated mobile-friendly landing page
3. Direct links to official Banuba hosted demos
4. Simplified interface optimized for touch devices

## Feedback and Issues

If you encounter any issues or have feedback about the mobile experience, please document:

- Device type and model
- Browser type and version
- Specific error messages
- Steps to reproduce the issue

This information will help improve the mobile experience for all users.