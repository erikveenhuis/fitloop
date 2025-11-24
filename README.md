# FitLoop - Virtual Try-On Application

A web-based virtual try-on application that lets users see how different clothing items would look on them using AI technology. Built with React, Vite, and TailwindCSS, integrated with Replicate's AI models for realistic virtual try-on experiences.

## Features

- 📷 **Real-time Camera Access** - Use your webcam to see yourself
- 👕 **Multiple Clothing Categories** - Try on shirts, pants, jackets, and dresses
- 🎲 **Randomizer** - Get random clothing suggestions
- 🤖 **AI-Powered Try-On** - Uses advanced AI models to realistically overlay clothing
- 🎨 **Modern UI** - Beautiful, responsive design with TailwindCSS
- ⚡ **Fast Performance** - Built with Vite for optimal development and production builds

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A modern web browser with camera support
- (Optional) Replicate API key for AI try-on functionality

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd fitloop
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Configure Replicate API:
   - Sign up at [Replicate](https://replicate.com)
   - Get your API key from your account settings
   - Create a `.env` file in the root directory:
   ```
   VITE_REPLICATE_API_KEY=your_api_key_here
   ```

4. Start both the backend and frontend servers:
```bash
npm run start
```

This will start:
- Backend API server on `http://localhost:3001`
- Frontend dev server on `http://localhost:5173`

5. Open your browser and navigate to `http://localhost:5173`

**Note**: The app requires both servers to run. The backend handles Replicate API calls to avoid CORS issues.

## Usage

1. **Allow Camera Access**: When prompted, allow the application to access your camera
2. **Select a Category**: Choose from Shirts, Pants, Jackets, or Dresses
3. **Pick a Clothing Item**: Click on any clothing item to try it on
4. **Use Randomizer**: Click the "Randomize" button to try random items
5. **See Results**: The AI will process and show you wearing the selected clothing

## Project Structure

```
fitloop/
├── public/
│   └── clothing/          # Clothing images organized by category
│       ├── shirts/
│       ├── pants/
│       ├── jackets/
│       └── dresses/
├── src/
│   ├── components/        # React components
│   │   ├── CameraCapture.jsx
│   │   ├── ClothingSelector.jsx
│   │   └── RandomizerButton.jsx
│   ├── services/          # API services
│   │   └── tryonAPI.js
│   ├── utils/            # Utility functions
│   │   └── imageUtils.js
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Adding Your Own Clothing

To add your own clothing items:

1. Add image files to the appropriate directory in `public/clothing/`
   - `public/clothing/shirts/` for shirts
   - `public/clothing/pants/` for pants
   - `public/clothing/jackets/` for jackets
   - `public/clothing/dresses/` for dresses

2. Update the clothing database in `src/utils/imageUtils.js`:
```javascript
const CLOTHING_DATABASE = {
  shirts: [
    { id: 'shirt-1', name: 'Blue T-Shirt', path: '/clothing/shirts/shirt-1.jpg' },
    // Add more items...
  ],
  // Other categories...
}
```

### Image Guidelines

- Use high-quality images with transparent or plain backgrounds
- Recommended size: 800x800px or larger
- Supported formats: JPG, PNG, SVG
- For best AI results, use images with the clothing item laid flat or on a mannequin

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Replicate API** - AI model integration (Google Nano Banana Pro)
- **WebRTC** - Camera access via getUserMedia API

## AI Model Information

This application uses virtual try-on models from Replicate. The integration uses Google's Nano Banana Pro model, which supports multi-garment virtual try-on.

### Demo Mode

If you don't configure a Replicate API key, the app will run in demo mode where:
- The camera will still work
- You can select clothing items
- The "try-on" will simply show your camera feed (as a placeholder)
- No actual AI processing will occur

### Production Mode

With a valid Replicate API key:
- Real AI processing occurs
- Clothing items are realistically overlaid on your image
- Processing takes 10-30 seconds per try-on
- Results are high-quality virtual try-ons

## Development

### Available Scripts

- `npm run start` - Start both backend and frontend servers (recommended)
- `npm run dev` - Start only frontend development server
- `npm run server` - Start only backend API server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Architecture

The app now uses a client-server architecture:
- **Frontend (React)** - Handles UI, camera, and user interactions
- **Backend (Express)** - Proxies requests to Replicate API to avoid CORS issues

This keeps your API key secure and resolves browser security restrictions.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready to deploy to any static hosting service.

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with WebRTC support

**Note**: Camera access requires HTTPS in production environments.

## Troubleshooting

### Camera Not Working

- Ensure you've granted camera permissions
- Check if another application is using the camera
- Try refreshing the page
- Use HTTPS (required for camera access in production)

### API Errors

- Verify your Replicate API key is correct
- Check your internet connection
- Ensure you have API credits in your Replicate account
- The free tier has rate limits

### Images Not Loading

- Check that image files exist in `public/clothing/` directories
- Verify paths in `imageUtils.js` match actual file names
- Clear browser cache and reload

## Future Enhancements

- [ ] Save favorite try-ons
- [ ] Share results on social media
- [ ] Upload custom clothing images
- [ ] Multiple person detection
- [ ] AR mode for mobile devices
- [ ] Size recommendations
- [ ] Color variations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Virtual try-on powered by Replicate API
- UI components styled with TailwindCSS
- Icons and design inspiration from modern fashion apps

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Made with ❤️ for fashion and technology enthusiasts
