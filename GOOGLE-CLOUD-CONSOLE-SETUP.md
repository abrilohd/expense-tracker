# Google Cloud Console Setup - CRITICAL STEP

## ⚠️ IMPORTANT: Update Authorized Redirect URIs

The 404 error after Google OAuth consent happens because Google is trying to redirect to a URL that's not authorized in your Google Cloud Console.

### Step-by-Step Instructions

#### 1. Go to Google Cloud Console
Open: https://console.cloud.google.com/apis/credentials

#### 2. Find Your OAuth 2.0 Client ID
- Look for the client ID that starts with: `269702079191-305itouics3dmod93gmnvk5t9tl2h9qh`
- Click on it to edit

#### 3. Add ALL These Authorized Redirect URIs

**CRITICAL**: You must add BOTH `localhost` AND `127.0.0.1` versions:

```
http://localhost:8000/auth/google/callback
http://127.0.0.1:8000/auth/google/callback
```

**Why both?**
- Browsers treat `localhost` and `127.0.0.1` as different origins
- Google OAuth is strict about exact URL matching
- Having both ensures it works regardless of which one is used

#### 4. Add Authorized JavaScript Origins

Also add these to the "Authorized JavaScript origins" section:

```
http://localhost:8000
http://127.0.0.1:8000
http://localhost:5173
```

#### 5. Save Changes

Click "SAVE" at the bottom of the page.

**Note**: Changes may take a few minutes to propagate.

### Screenshot Guide

Your Google Cloud Console OAuth configuration should look like this:

```
Application type: Web application
Name: [Your App Name]

Authorized JavaScript origins:
  1. http://localhost:8000
  2. http://127.0.0.1:8000
  3. http://localhost:5173

Authorized redirect URIs:
  1. http://localhost:8000/auth/google/callback
  2. http://127.0.0.1:8000/auth/google/callback
```

### After Updating

1. Wait 1-2 minutes for changes to propagate
2. Clear your browser cache (or use incognito mode)
3. Try the Google OAuth login again

### Testing

After updating Google Cloud Console:

1. Go to `http://localhost:5173/login`
2. Click "Continue with Google"
3. Select your Google account
4. Click "Continue"
5. **Expected**: Should redirect to `http://localhost:5173/dashboard?token=...`
6. **If still 404**: Check the URL in the browser address bar and share it with me

### Common Mistakes

❌ **Wrong**: Only adding `localhost` OR `127.0.0.1` (need both)
❌ **Wrong**: Adding `https://` instead of `http://` for local development
❌ **Wrong**: Forgetting the `/auth/google/callback` path
❌ **Wrong**: Adding trailing slash: `http://localhost:8000/auth/google/callback/`

✅ **Correct**: Both `localhost` and `127.0.0.1` with exact paths as shown above

### Verification

To verify your Google Cloud Console is configured correctly:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID
3. Scroll down to "Authorized redirect URIs"
4. Confirm you see BOTH:
   - `http://localhost:8000/auth/google/callback`
   - `http://127.0.0.1:8000/auth/google/callback`

### Still Getting 404?

If you still get 404 after updating Google Cloud Console:

1. **Check the exact URL** in the browser address bar when you get the 404
2. **Share that URL** with me - it will tell us exactly what redirect URI Google is using
3. **Check backend logs** - look for any incoming requests to `/auth/google/callback`

---

**Last Updated**: April 28, 2026  
**Status**: ⚠️ ACTION REQUIRED - Update Google Cloud Console
