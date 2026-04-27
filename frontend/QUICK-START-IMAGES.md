# Quick Start: Adding Background Images

## 🎯 What You Need

Two images for the brand panel (left side) of login/register pages:

1. **darkmode.png** - Shows when dark mode is active
2. **lightmode.jpg** - Shows when light mode is active

## 📍 Where to Put Them

```
frontend/
  └── public/
      ├── darkmode.png   ← Your dark mode image here
      └── lightmode.jpg  ← Your light mode image here
```

## 📏 Image Requirements

### Both Images:
- **Size**: 1920x1080 or higher
- **File size**: < 500KB (optimized for web)
- **Aspect ratio**: 16:9 recommended

### Dark Mode Image (darkmode.png):
- Dark colors (blacks, dark blues, purples)
- Tech/futuristic theme
- PNG format (supports transparency)

### Light Mode Image (lightmode.jpg):
- Light colors (whites, pastels, soft tones)
- Clean/professional theme
- JPG or PNG format

## ✅ How to Add

1. **Get your images** (download, create, or generate)
2. **Optimize them** (compress to < 500KB)
3. **Rename them**:
   - Dark image → `darkmode.png`
   - Light image → `lightmode.jpg`
4. **Copy to** `frontend/public/` folder
5. **Done!** The theme toggle will automatically switch between them

## 🎨 Where to Find Images

### Free Stock Photos:
- [Unsplash](https://unsplash.com) - Search "dark tech" or "minimal light"
- [Pexels](https://pexels.com) - Search "abstract gradient" or "workspace"

### AI Generated:
- [Midjourney](https://midjourney.com) - Generate custom backgrounds
- [DALL-E](https://openai.com/dall-e) - Create unique imagery

### Gradient Generators:
- [Mesh Gradients](https://meshgradient.com)
- [CSS Gradient](https://cssgradient.io)

## 🧪 Testing

1. Run your app: `npm run dev`
2. Go to `/login` or `/register`
3. Click the theme toggle (top-right corner)
4. Verify both images display correctly

## 💡 Tips

- **Text readability**: Images have a semi-transparent overlay, so text stays readable
- **Center focus**: Keep important image details away from center (where content sits)
- **Brand colors**: Match cyan (#00F5C4), purple (#7B61FF), pink (#FF6B9D)
- **Fallback**: If images don't load, solid colors show instead

## ⚠️ Current Status

Placeholder files are in place. Replace them with your actual images for the best experience!

---

**That's it!** Just drop your images in `frontend/public/` and the theme toggle will handle the rest. 🚀
