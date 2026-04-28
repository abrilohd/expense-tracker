"""
Diagnostic script to check Google OAuth configuration
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("=" * 60)
print("GOOGLE OAUTH CONFIGURATION DIAGNOSTIC")
print("=" * 60)

# Check environment variables
client_id = os.getenv('GOOGLE_CLIENT_ID', '')
client_secret = os.getenv('GOOGLE_CLIENT_SECRET', '')
redirect_uri = os.getenv('GOOGLE_REDIRECT_URI', '')
frontend_url = os.getenv('FRONTEND_URL', '')

print("\n📋 Environment Variables:")
print(f"  GOOGLE_CLIENT_ID: {client_id[:20]}..." if client_id else "  GOOGLE_CLIENT_ID: ❌ NOT SET")
print(f"  GOOGLE_CLIENT_SECRET: {client_secret[:10]}..." if client_secret else "  GOOGLE_CLIENT_SECRET: ❌ NOT SET")
print(f"  GOOGLE_REDIRECT_URI: {redirect_uri}")
print(f"  FRONTEND_URL: {frontend_url}")

print("\n🔍 Configuration Check:")

# Check if all required variables are set
all_set = all([client_id, client_secret, redirect_uri, frontend_url])
if all_set:
    print("  ✅ All required environment variables are set")
else:
    print("  ❌ Some environment variables are missing!")

# Check redirect URI format
if redirect_uri:
    if redirect_uri.startswith('http://'):
        print(f"  ✅ Redirect URI uses http:// (correct for local dev)")
    elif redirect_uri.startswith('https://'):
        print(f"  ⚠️  Redirect URI uses https:// (should be http:// for local dev)")
    
    if '/auth/google/callback' in redirect_uri:
        print(f"  ✅ Redirect URI includes correct path")
    else:
        print(f"  ❌ Redirect URI missing /auth/google/callback path")
    
    # Check if using localhost or 127.0.0.1
    if 'localhost' in redirect_uri:
        print(f"  ℹ️  Using 'localhost' - make sure Google Console has this exact URL")
    elif '127.0.0.1' in redirect_uri:
        print(f"  ℹ️  Using '127.0.0.1' - make sure Google Console has this exact URL")

print("\n📝 Google Cloud Console Setup:")
print("  Go to: https://console.cloud.google.com/apis/credentials")
print("  Add BOTH of these to 'Authorized redirect URIs':")
print("    1. http://localhost:8000/auth/google/callback")
print("    2. http://127.0.0.1:8000/auth/google/callback")

print("\n🧪 Test URLs:")
print(f"  Login endpoint: http://127.0.0.1:8000/auth/google/login")
print(f"  Callback endpoint: {redirect_uri}")
print(f"  Frontend: {frontend_url}")

print("\n🔗 OAuth Flow:")
print("  1. User clicks 'Continue with Google' on frontend")
print("  2. Redirects to: http://127.0.0.1:8000/auth/google/login")
print("  3. Backend redirects to: Google OAuth consent screen")
print("  4. User approves")
print(f"  5. Google redirects to: {redirect_uri}")
print(f"  6. Backend redirects to: {frontend_url}/dashboard?token=...")

print("\n" + "=" * 60)
print("If you're getting 404 after step 4:")
print("  - The redirect URI in Google Console doesn't match")
print("  - Add BOTH localhost AND 127.0.0.1 versions to Google Console")
print("=" * 60)
