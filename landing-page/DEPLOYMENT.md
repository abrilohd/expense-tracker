# Deployment Guide

## Prerequisites

- Static hosting service (Vercel, Netlify, or similar)
- Domain name (optional)
- Video and image assets in place

## Pre-Deployment Checklist

### Assets
- [ ] Add `hero-loop.webm` and `hero-loop.mp4` to `assets/videos/`
- [ ] Add `dashboard-reveal.webm` and `dashboard-reveal.mp4` to `assets/videos/`
- [ ] Add `dashboard-mockup.webp` to `assets/images/`
- [ ] Add `hero-poster.jpg` to `assets/images/`
- [ ] Add `og-image.jpg` (1200x630) to `assets/images/`
- [ ] Add `twitter-card.jpg` (1200x600) to `assets/images/`
- [ ] Add `favicon.svg` to `assets/images/`
- [ ] Add `apple-touch-icon.png` (180x180) to `assets/images/`

### Configuration
- [ ] Update canonical URL in `index.html`
- [ ] Update Open Graph URLs
- [ ] Update Twitter Card URLs
- [ ] Update site name and description
- [ ] Configure environment variables (if using)

### Testing
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile devices
- [ ] Test with slow 3G connection
- [ ] Test with JavaScript disabled (graceful degradation)
- [ ] Test with reduced motion enabled
- [ ] Validate HTML (https://validator.w3.org/)
- [ ] Check accessibility (https://wave.webaim.org/)
- [ ] Test SEO (https://search.google.com/test/rich-results)

## Deployment Options

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd landing-page
vercel --prod
```

3. Configure custom domain in Vercel dashboard

### Option 2: Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
cd landing-page
netlify deploy --prod
```

Or drag and drop the `landing-page` folder to Netlify dashboard.

### Option 3: GitHub Pages

1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select branch and root folder
4. Configure custom domain (optional)

### Option 4: AWS S3 + CloudFront

1. Create S3 bucket
2. Enable static website hosting
3. Upload all files
4. Create CloudFront distribution
5. Configure custom domain with Route 53

## Post-Deployment

### Verification
- [ ] Check all pages load correctly
- [ ] Verify videos play
- [ ] Test all navigation links
- [ ] Check mobile responsiveness
- [ ] Verify SSL certificate
- [ ] Test form submissions (if applicable)

### SEO Setup
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Verify Open Graph tags with Facebook Debugger
- [ ] Verify Twitter Cards with Twitter Card Validator
- [ ] Set up Google Analytics (optional)

### Monitoring
- [ ] Set up uptime monitoring
- [ ] Configure error tracking (Sentry, etc.)
- [ ] Set up performance monitoring
- [ ] Configure CDN caching rules

## Environment Variables

If using environment variables, configure these in your hosting platform:

```
SITE_URL=https://expensetracker.app
SITE_NAME=ExpenseTracker
TWITTER_HANDLE=@expensetracker
SUPPORT_EMAIL=support@expensetracker.app
```

## Performance Optimization

### Already Implemented
- Lazy loading for images and videos
- Preload for hero video
- Optimized animations with RAF
- Reduced motion support
- Proper caching headers

### Additional Recommendations
- Enable Brotli compression on server
- Use CDN for asset delivery
- Implement service worker for offline support
- Add resource hints (dns-prefetch, preconnect)

## Troubleshooting

### Videos not playing
- Ensure both webm and mp4 formats are present
- Check MIME types are configured correctly
- Verify video files are not corrupted

### Images not loading
- Check file paths are correct
- Verify image files exist
- Check file permissions

### Animations not working
- Check browser compatibility
- Verify JavaScript is enabled
- Check console for errors

### SEO issues
- Validate structured data
- Check robots.txt is accessible
- Verify sitemap is valid XML

## Rollback Plan

If issues occur after deployment:

1. Revert to previous deployment in hosting dashboard
2. Or redeploy previous Git commit
3. Check error logs for issues
4. Fix and redeploy

## Support

For deployment issues, contact your hosting provider's support or check their documentation.
