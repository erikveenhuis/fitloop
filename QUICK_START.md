# Quick Start Guide

## Your app is ready! 🚀

### IMPORTANT: Restart with the new command!

Stop the current dev server (Ctrl+C) and run:
```bash
npm run start
```

This will start BOTH:
- Backend server (port 3001) - handles API calls
- Frontend dev server (port 5173) - your React app

### Open the app
```
http://localhost:5173
```

### What you can do right now:

1. ✅ **Test the camera** - Allow camera access when prompted
2. ✅ **Upload custom clothing** - Drag & drop your own clothing images
3. ✅ **Browse collection** - Navigate through t-shirts using arrows or keyboard
4. ✅ **View modes** - Toggle between Camera/Input/Output to see AI processing
5. ✅ **3-second countdown** - Pose before photo capture
6. ✅ **Virtual try-on** - Uses AI to realistically overlay clothing on your photo

### To enable real AI try-on:

1. Sign up at https://replicate.com (free tier available)
2. Get your API key
3. Create `.env` file:
   ```
   VITE_REPLICATE_API_KEY=your_key_here
   ```
4. Restart: `npm run dev`

### To add clothing images:

**Option 1: Upload via UI (easiest)**
1. Click or drag & drop images into the upload area
2. Uploaded items appear in the carousel with a "Custom" badge
3. Hover over uploaded items to delete them

**Option 2: Add to source code**
1. Add images to `public/clothing/shirts/`
2. Update paths in `src/utils/imageUtils.js`
3. Refresh browser

### Deployment:

Push to GitHub, and Railway will automatically deploy:
```bash
git push origin main
```

Your app will be live at your Railway domain!

---

**Need more details?** Check `SETUP.md` or `README.md`

