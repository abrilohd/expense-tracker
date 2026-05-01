# ✅ Landing Page v3.0.0 - Deployment Checklist

## Pre-Deployment

- [x] Updated `config.js` to v3.0.0
- [x] Updated `scripts/router.js` to v3.0.0
- [x] Updated `index.html` script tags to v3.0.0
- [x] Updated `vercel.json` with aggressive cache headers
- [x] Added manifest.json headers to fix 401 error
- [x] Created deployment documentation
- [x] Created testing guides

## Deployment Steps

### 1. Commit and Push
```bash
cd landing-page
git add .
git commit -m "feat: Landing Page Router v3.0.0 - Production-first with triple fallback"
git push origin main
```

- [ ] Changes committed
- [ ] Changes pushed to main branch

### 2. Verify Vercel Deployment
- [ ] Go to Vercel dashboard
- [ ] Check deployment status (should be "Ready")
- [ ] Check deployment logs (no errors)
- [ ] Note deployment URL

### 3. Wait for Propagation
- [ ] Wait 5 minutes for CDN propagation
- [ ] Clear browser cache
- [ ] Close all browser tabs with landing page

## Testing (After 5 Minutes)

### Test 1: Version Check
- [ ] Open: `https://expense-tracker-landing-k4qsr35ie-abrsh067-7150s-projects.vercel.app`
- [ ] Hard refresh: `Ctrl + Shift + R`
- [ ] Open Console (F12)
- [ ] Verify console shows "v3.0.0" (not v2.0.2 or v2.0.3)

**Expected:**
```
✅ v3.0.0 Production URLs set
🚀 Landing Page Config v3.0.0 loaded
🚀 Landing Page Router v3.0.0 LOADED
```

### Test 2: URL Verification
- [ ] Check console for "APP_URL:"
- [ ] Should be: `https://expense-tracker-app-tau-rust.vercel.app`
- [ ] Check "Register URL:"
- [ ] Should be: `https://expense-tracker-app-tau-rust.vercel.app/register`

### Test 3: Button Detection
- [ ] Check console for "Found CTA buttons:"
- [ ] Should find at least 4 buttons
- [ ] Each button should be logged with its class/id

### Test 4: Click Test
- [ ] Click "Get Started" button in hero section
- [ ] Check console for:
  ```
  🎯 CTA clicked
  📍 Redirecting to: https://expense-tracker-app-tau-rust.vercel.app/register
  ```
- [ ] Verify redirect to `/register` page
- [ ] Go back to landing page

### Test 5: Multiple Clicks
- [ ] Click "Get Started" 5 times
- [ ] Each click should redirect to `/register`
- [ ] No errors in console

### Test 6: Different Buttons
- [ ] Test "Get Started" in navigation
- [ ] Test "Get Started" in hero section
- [ ] Test "Start Tracking for Free" in CTA section
- [ ] Test "Get Started" in footer
- [ ] All should redirect to `/register`

### Test 7: Incognito Mode
- [ ] Open Incognito/Private window
- [ ] Go to landing page
- [ ] Repeat Tests 1-6
- [ ] Should work identically

### Test 8: Different Browsers
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari (if available)
- [ ] Test in Edge

### Test 9: Mobile
- [ ] Test on mobile device (or DevTools mobile view)
- [ ] Open landing page
- [ ] Check console (if possible)
- [ ] Click "Get Started"
- [ ] Should redirect to `/register`

## Success Criteria

All of these must be true:

- [ ] Console shows "v3.0.0" in all script logs
- [ ] APP_URL is `https://expense-tracker-app-tau-rust.vercel.app`
- [ ] At least 4 CTA buttons detected
- [ ] Clicking "Get Started" redirects to `/register`
- [ ] No JavaScript errors in console
- [ ] Works in Incognito mode
- [ ] Works after hard refresh
- [ ] Works in multiple browsers
- [ ] Manifest.json 401 error is gone (or can be ignored)

## Troubleshooting

### Issue: Still seeing v2.0.2 or v2.0.3
**Actions:**
- [ ] Clear browser cache completely
- [ ] Hard refresh (`Ctrl + Shift + R`)
- [ ] Try Incognito window
- [ ] Wait 5 more minutes for CDN
- [ ] Check Vercel deployment logs

### Issue: Wrong URL in redirect
**Actions:**
- [ ] Check console for "APP_URL:"
- [ ] Should be: `https://expense-tracker-app-tau-rust.vercel.app`
- [ ] If wrong, verify deployment completed
- [ ] Clear cache and refresh

### Issue: Buttons not working
**Actions:**
- [ ] Check console for "Found CTA buttons: X"
- [ ] Should be at least 4
- [ ] If 0, check if router.js loaded
- [ ] Look for v3.0.0 message in console

### Issue: Manifest.json 401 error
**Actions:**
- [ ] Check if error still appears
- [ ] If yes, verify vercel.json deployed
- [ ] Check Vercel deployment logs
- [ ] Note: This error is harmless if routing works

## Post-Deployment

### Documentation
- [ ] Update project README if needed
- [ ] Share deployment guide with team
- [ ] Archive old version documentation

### Monitoring
- [ ] Monitor for 24 hours
- [ ] Check for any user reports
- [ ] Verify analytics/tracking still works

### Cleanup
- [ ] Remove old version files (if any)
- [ ] Update version in package.json (if applicable)
- [ ] Tag release in git: `git tag v3.0.0`

## Sign-Off

**Deployed by:** _______________  
**Date:** _______________  
**Time:** _______________  
**Deployment URL:** _______________  
**Status:** ⬜ Success / ⬜ Issues Found  

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________

---

## Quick Reference

**Landing Page URL:**
```
https://expense-tracker-landing-k4qsr35ie-abrsh067-7150s-projects.vercel.app
```

**Expected Redirect URL:**
```
https://expense-tracker-app-tau-rust.vercel.app/register
```

**Version:** 3.0.0

**Documentation:**
- Full Guide: `ROUTER-V3-DEPLOYMENT.md`
- Quick Test: `QUICK-TEST-v3.md`
- Summary: `../LANDING-PAGE-V3-SUMMARY.md`
