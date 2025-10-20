# FitLoop Setup Guide

## Quick Start

Your virtual try-on application is ready to use! Follow these steps:

### 1. Start the Development Server

The server should already be running. If not:

```bash
npm run dev
```

### 2. Open in Browser

Navigate to: **http://localhost:5173**

### 3. Allow Camera Access

When prompted by your browser, click "Allow" to grant camera permissions.

### 4. Try It Out!

- Select a clothing category (Shirts, Pants, Jackets, or Dresses)
- Click on any clothing item
- Click "Try On Selected Item" button
- Use the Randomizer button for random selections

## Current Status

### ✅ What's Working

- Camera capture and display
- Clothing selection interface
- Category switching
- Randomizer functionality
- Responsive UI design
- All placeholder clothing images

### ⚠️ Demo Mode

The application is currently running in **demo mode** because no Replicate API key is configured. This means:

- Everything works except the actual AI try-on
- When you click "Try On Selected Item", it will display your camera feed instead of a processed image
- This is perfect for testing the UI and functionality

## Enabling AI Try-On

To enable real AI-powered virtual try-on:

### Step 1: Get a Replicate API Key

1. Go to [replicate.com](https://replicate.com)
2. Sign up for a free account
3. Navigate to your account settings
4. Copy your API token

### Step 2: Configure the API Key

Create a `.env` file in the project root:

```bash
VITE_REPLICATE_API_KEY=r8_your_actual_api_key_here
```

### Step 3: Restart the Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

Now the AI try-on will work with real processing!

## Adding Real Clothing Images

The application currently uses placeholder SVG images. To add real clothing:

### Option 1: Replace Existing Files

Replace the SVG files in `public/clothing/` with real images:

```
public/clothing/
  ├── shirts/
  │   ├── shirt-1.jpg (replace shirt-1.svg)
  │   ├── shirt-2.jpg
  │   └── ...
  ├── pants/
  ├── jackets/
  └── dresses/
```

Then update `src/utils/imageUtils.js` to use `.jpg` instead of `.svg`:

```javascript
shirts: [
  { id: 'shirt-1', name: 'Blue T-Shirt', path: '/clothing/shirts/shirt-1.jpg' },
  // ...
]
```

### Option 2: Add New Items

1. Add image files to the category folder
2. Update the `CLOTHING_DATABASE` in `src/utils/imageUtils.js`
3. Restart the dev server

### Image Tips

- Use high-quality images (800x800px or larger)
- Plain or transparent backgrounds work best
- JPG, PNG, or SVG formats supported
- For best AI results: flat-lay or mannequin shots

## Project Structure

```
fitloop/
├── public/
│   ├── clothing/              # Your clothing images
│   │   ├── shirts/
│   │   ├── pants/
│   │   ├── jackets/
│   │   └── dresses/
│   └── vite.svg              # Favicon
├── src/
│   ├── components/           # React components
│   │   ├── CameraCapture.jsx    # Handles webcam
│   │   ├── ClothingSelector.jsx # Clothing grid
│   │   └── RandomizerButton.jsx # Random selection
│   ├── services/
│   │   └── tryonAPI.js       # Replicate API integration
│   ├── utils/
│   │   └── imageUtils.js     # Clothing database
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── .env                      # API keys (create this)
├── package.json
└── README.md
```

## Troubleshooting

### Camera Not Working

**Problem**: "Camera not ready" error

**Solutions**:
- Refresh the page
- Check browser permissions (usually shown in address bar)
- Close other apps using the camera
- Try a different browser
- Use HTTPS in production (required for camera)

### Images Not Showing

**Problem**: Clothing images show as broken

**Solutions**:
- Check file paths in `imageUtils.js` match actual files
- Ensure files are in `public/clothing/` folder
- Clear browser cache
- Check browser console for errors

### API Errors

**Problem**: "Failed to process try-on"

**Solutions**:
- Verify API key is correct in `.env`
- Check internet connection
- Verify Replicate account has credits
- Check API usage limits (free tier has limits)

### Build Errors

**Problem**: npm install or build fails

**Solutions**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use npm's built-in cache clean
npm cache clean --force
npm install
```

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install dependencies
npm install
```

## Browser Support

✅ Chrome/Edge (Recommended)
✅ Firefox
✅ Safari 
✅ Any modern browser with WebRTC

**Note**: Camera requires HTTPS in production!

## Next Steps

### Immediate

1. Test all features in the browser
2. Try different clothing categories
3. Test the randomizer
4. Check responsive design on mobile

### Optional Enhancements

1. Get Replicate API key for real AI try-on
2. Add real clothing images
3. Customize colors in `tailwind.config.js`
4. Add more clothing items
5. Deploy to production (Vercel, Netlify, etc.)

### Production Deployment

When ready to deploy:

```bash
# Build the app
npm run build

# The dist/ folder contains your production files
# Deploy to any static hosting service:
# - Vercel
# - Netlify
# - GitHub Pages
# - Firebase Hosting
```

## Getting Help

- Check the main README.md for detailed documentation
- Review component code for implementation details
- Check browser console for error messages
- Replicate API docs: https://replicate.com/docs

## Architecture Overview

### Flow

1. **Camera** → Captures user's image via WebRTC
2. **Selection** → User selects clothing item
3. **Capture** → App captures current camera frame
4. **API Call** → Sends person + clothing to Replicate
5. **Result** → AI processes and returns try-on image
6. **Display** → Shows result to user

### Key Technologies

- **React 18** - UI framework
- **Vite** - Fast build tool
- **TailwindCSS** - Utility-first styling
- **WebRTC** - Camera access
- **Replicate API** - AI processing
- **Axios** - HTTP requests

## Success! 🎉

Your FitLoop virtual try-on application is now set up and running!

Open http://localhost:5173 in your browser to see it in action.

---

Need help? Check README.md or open an issue on GitHub.

