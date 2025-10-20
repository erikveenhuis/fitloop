# Adding High-Quality T-Shirt Images

## Quick Start

### Option 1: Download from Unsplash (Free)

Run the included script to automatically download 8 high-quality t-shirt images:

```bash
node download-tshirts.js
```

This will download professional t-shirt photos from Unsplash (free to use).

### Option 2: Add Your Own Images

1. **Get T-Shirt Images**
   - Take photos of t-shirts laid flat on a clean background
   - Download from free stock photo sites (Unsplash, Pexels, Pixabay)
   - Use product photos from online stores (check licensing)

2. **Image Requirements**
   - **Format**: JPG or PNG
   - **Size**: 800x800px or larger (will be resized automatically)
   - **Background**: Plain white or transparent background works best
   - **Quality**: High resolution for best AI results
   - **Position**: T-shirt laid flat or on mannequin, front-facing

3. **Add to Project**
   - Place images in: `public/clothing/shirts/`
   - Name them: `tshirt-1.jpg`, `tshirt-2.jpg`, etc.

4. **Update Database**
   - Edit: `src/utils/imageUtils.js`
   - Update the paths and names

## Recommended Sources for Free T-Shirt Images

### Unsplash
- https://unsplash.com/s/photos/t-shirt
- High-quality, free to use
- No attribution required (but appreciated)

### Pexels
- https://www.pexels.com/search/t-shirt/
- Free for commercial use
- No attribution required

### Pixabay
- https://pixabay.com/images/search/t-shirt/
- Free for commercial use
- No attribution required

## Best Practices for Virtual Try-On

### Image Quality Tips
1. **Clear Background**: Plain white, grey, or transparent
2. **Good Lighting**: Even, natural lighting
3. **Centered**: T-shirt centered in frame
4. **Wrinkle-Free**: Iron t-shirts before photographing
5. **Flat Lay or Mannequin**: Either works well

### What Works Best
✅ Product photography style
✅ T-shirt laid flat
✅ T-shirt on mannequin or model
✅ High contrast with background
✅ Clear details and colors

### What to Avoid
❌ Cluttered backgrounds
❌ Wrinkled or folded t-shirts
❌ Low resolution images
❌ Dark or poorly lit photos
❌ Angled or perspective shots

## Example Image Setup

```javascript
// In src/utils/imageUtils.js
const CLOTHING_DATABASE = {
  shirts: [
    { id: 'shirt-1', name: 'Classic White Tee', path: '/clothing/shirts/tshirt-1.jpg' },
    { id: 'shirt-2', name: 'Black Essential', path: '/clothing/shirts/tshirt-2.jpg' },
    { id: 'shirt-3', name: 'Navy Blue Crew', path: '/clothing/shirts/tshirt-3.jpg' },
    // Add more...
  ]
}
```

## Testing Your Images

1. Add images to `public/clothing/shirts/`
2. Update `imageUtils.js` with correct paths
3. Refresh the app at http://localhost:5175
4. Browse through carousel to see your t-shirts
5. Test virtual try-on with different t-shirts

## Troubleshooting

**Images not showing?**
- Check file paths in `imageUtils.js`
- Verify files exist in `public/clothing/shirts/`
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

**Try-on quality poor?**
- Use higher resolution images (1000x1000px+)
- Ensure good lighting in photos
- Use plain backgrounds
- Try images with t-shirts laid completely flat

## Advanced: Creating Your Own T-Shirt Photos

If you want the best results, create your own photos:

1. **Equipment**
   - Camera or smartphone
   - Good lighting (natural or softbox)
   - White backdrop or poster board

2. **Setup**
   - Lay t-shirt flat on white surface
   - Remove wrinkles with iron/steamer
   - Position camera directly above
   - Use even lighting from both sides

3. **Shooting**
   - Take multiple shots
   - Ensure t-shirt fills most of frame
   - Keep consistent distance/angle
   - Shoot in good resolution

4. **Processing**
   - Crop to square (1:1 ratio)
   - Adjust brightness if needed
   - Remove background if possible
   - Save as high-quality JPG

---

Need help? Check the main README.md or create an issue!

