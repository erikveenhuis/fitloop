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
2. ✅ **Browse clothing** - Switch between Shirts, Pants, Jackets, Dresses
3. ✅ **Select items** - Click on any clothing item to select it
4. ✅ **Use randomizer** - Try the randomize button for random picks
5. ⚠️ **Try-on (demo mode)** - Currently shows camera feed (needs API key for AI)

### To enable real AI try-on:

1. Sign up at https://replicate.com (free tier available)
2. Get your API key
3. Create `.env` file:
   ```
   VITE_REPLICATE_API_KEY=your_key_here
   ```
4. Restart: `npm run dev`

### To add real clothing images:

1. Add images to `public/clothing/shirts/`, `public/clothing/pants/`, etc.
2. Update paths in `src/utils/imageUtils.js`
3. Refresh browser

---

**Need more details?** Check `SETUP.md` or `README.md`

