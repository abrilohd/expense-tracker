# 🔧 Google Cloud Console - Exact Changes Needed

## 📍 Your OAuth Client

**Direct Link:** https://console.cloud.google.com/apis/credentials/oauthclient/199412317897-qmg571f724l5mnsiiit2bc3ldlaefhst.apps.googleusercontent.com

---

## ✏️ What to Add

### Section 1: Authorized JavaScript origins

**Currently you have:**
- ✅ http://localhost:5173
- ✅ http://localhost:8000

**ADD THESE (click "+ Add URI" for each):**
- ➕ http://127.0.0.1:5173
- ➕ http://127.0.0.1:8000

**After adding, you should have 4 total:**
```
URIs 1 ✓
http://localhost:5173

URIs 2 ✓
http://localhost:8000

URIs 3 ✓  ← NEW
http://127.0.0.1:5173

URIs 4 ✓  ← NEW
http://127.0.0.1:8000
```

---

### Section 2: Authorized redirect URIs

**Currently you have:**
- ✅ http://localhost:8000/auth/google/callback

**ADD THIS (click "+ Add URI"):**
- ➕ http://127.0.0.1:8000/auth/google/callback

**After adding, you should have 2 total:**
```
URIs 1 ✓
http://localhost:8000/auth/google/callback

URIs 2 ✓  ← NEW
http://127.0.0.1:8000/auth/google/callback
```

---

## 📝 Step-by-Step Instructions

### Step 1: Open Your OAuth Client
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on: "expense tracker" (your OAuth client)
3. You should see the edit screen

### Step 2: Add JavaScript Origins
1. Scroll to "Authorized JavaScript origins"
2. Click "+ ADD URI"
3. Type: `http://127.0.0.1:5173`
4. Click "+ ADD URI" again
5. Type: `http://127.0.0.1:8000`

### Step 3: Add Redirect URI
1. Scroll to "Authorized redirect URIs"
2. Click "+ ADD URI"
3. Type: `http://127.0.0.1:8000/auth/google/callback`

### Step 4: Save Changes
1. Scroll to the bottom
2. Click "SAVE"
3. Wait for "Client ID updated" confirmation

---

## ⚠️ Important Notes

### DO NOT Remove Existing URLs
Keep all the `localhost` URLs! Just ADD the `127.0.0.1` URLs.

### Exact Match Required
- URLs must match EXACTLY (no trailing slashes)
- `http://` not `https://` (for local development)
- Port numbers must match (`:5173`, `:8000`)

### Case Sensitive
- Use lowercase: `http://127.0.0.1:8000`
- NOT: `HTTP://127.0.0.1:8000`

---

## ✅ Verification

After saving, your OAuth client should show:

**Authorized JavaScript origins: 4 URIs**
- http://localhost:5173
- http://localhost:8000
- http://127.0.0.1:5173
- http://127.0.0.1:8000

**Authorized redirect URIs: 2 URIs**
- http://localhost:8000/auth/google/callback
- http://127.0.0.1:8000/auth/google/callback

---

## 🎯 Why Both localhost AND 127.0.0.1?

**Reason:** They are treated as different origins by browsers.

**localhost:**
- DNS name that resolves to 127.0.0.1
- Some tools use this by default

**127.0.0.1:**
- IP address (loopback)
- Your backend is running on this
- More reliable for local development

**Solution:** Support both to avoid CORS issues!

---

## 🐛 Troubleshooting

### "Invalid redirect URI"
- Check for typos
- Make sure no trailing slash
- Verify port number is correct

### "Invalid JavaScript origin"
- Check for typos
- Make sure no path (just domain and port)
- Verify port number is correct

### Changes not taking effect
- Wait 1-2 minutes for Google to propagate changes
- Clear browser cache
- Try incognito mode

---

## 📸 Visual Reference

Your screen should look like this:

```
┌─────────────────────────────────────────────────┐
│ Authorized JavaScript origins                   │
│ For use with requests from a browser            │
│                                                 │
│ URIs 1 ✓                                        │
│ http://localhost:5173                           │
│                                                 │
│ URIs 2 ✓                                        │
│ http://localhost:8000                           │
│                                                 │
│ URIs 3 ✓                                        │
│ http://127.0.0.1:5173                          │
│                                                 │
│ URIs 4 ✓                                        │
│ http://127.0.0.1:8000                          │
│                                                 │
│ [+ Add URI]                                     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Authorized redirect URIs                        │
│ For use with requests from a web server         │
│                                                 │
│ URIs 1 ✓                                        │
│ http://localhost:8000/auth/google/callback      │
│                                                 │
│ URIs 2 ✓                                        │
│ http://127.0.0.1:8000/auth/google/callback     │
│                                                 │
│ [+ Add URI]                                     │
└─────────────────────────────────────────────────┘

                    [SAVE]
```

---

## ⏭️ Next Steps

After saving in Google Cloud Console:

1. ✅ Restart backend server
2. ✅ Restart frontend server
3. ✅ Test OAuth at http://127.0.0.1:5173/login

See `DO-THIS-NOW.md` for complete instructions.

---

**Done?** Click "SAVE" and move to the next step!
