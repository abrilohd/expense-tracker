# Personal Expense Tracker - Landing Page

Premium animated landing page for Personal Expense Tracker application.

## Features

- 🎨 Premium dark theme with glass morphism
- ⚡ Optimized performance with lazy loading
- 📱 Fully responsive design
- ♿ WCAG accessibility compliant
- 🔍 SEO optimized with structured data
- 🎭 Smooth animations with reduced-motion support

## Tech Stack

- Pure HTML/CSS/JavaScript
- CSS Custom Properties (Design Tokens)
- IntersectionObserver API
- RequestAnimationFrame for smooth animations

## Design System

All styling uses tokens from `styles/tokens.css`. No hardcoded values allowed.

### Token Categories
- Colors (brand, neutral, semantic)
- Typography (Syne + Inter)
- Spacing (0-64 scale)
- Shadows & Effects
- Animation (duration + easing)
- Border radius
- Z-index layers

## Project Structure

```
landing-page/
├── index.html              # Main HTML file
├── assets/
│   ├── images/            # Images and graphics
│   └── videos/            # Video backgrounds
├── components/            # HTML component templates
├── scripts/
│   ├── counter.js         # Animated counters
│   ├── parallax.js        # Parallax effects
│   └── scroll-effects.js  # Scroll animations
└── styles/
    ├── tokens.css         # Design tokens
    ├── main.css           # Base styles
    ├── nav.css            # Navigation
    ├── hero.css           # Hero section
    ├── features.css       # Features section
    ├── dashboard.css      # Dashboard preview
    ├── stats.css          # Stats & testimonials
    ├── cta.css            # Call-to-action
    └── footer.css         # Footer
```

## Development

No build process required. Open `index.html` in a browser.

## Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

### Netlify
Drag and drop the `landing-page` folder to Netlify dashboard.

### Static Hosting
Upload all files to any static hosting service.

## Performance

- Hero video: preloaded for instant playback
- Feature videos: lazy loaded
- Images: lazy loaded with proper dimensions
- Animations: optimized with RAF and IntersectionObserver
- Reduced motion: respects user preferences

## Accessibility

- Semantic HTML structure
- Single H1 per page
- Proper heading hierarchy
- ARIA labels where needed
- Focus-visible states
- Keyboard navigation support
- Alt text for images
- Reduced motion support

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Proprietary - All rights reserved
