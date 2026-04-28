"""
Test if .env file is being loaded correctly
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Get the backend directory
BASE_DIR = Path(__file__).resolve().parent
ENV_FILE = BASE_DIR / ".env"

print("=" * 60)
print("Testing .env File Loading")
print("=" * 60)
print()

# Check if .env exists
print(f"1. Checking .env file location:")
print(f"   Path: {ENV_FILE}")
print(f"   Exists: {ENV_FILE.exists()}")
print()

if ENV_FILE.exists():
    # Load .env file
    load_dotenv(ENV_FILE)
    
    print("2. Environment variables loaded:")
    print(f"   GOOGLE_CLIENT_ID: {os.getenv('GOOGLE_CLIENT_ID', 'NOT SET')}")
    print(f"   GOOGLE_CLIENT_SECRET: {os.getenv('GOOGLE_CLIENT_SECRET', 'NOT SET')[:20] if os.getenv('GOOGLE_CLIENT_SECRET') else 'NOT SET'}...")
    print(f"   GOOGLE_REDIRECT_URI: {os.getenv('GOOGLE_REDIRECT_URI', 'NOT SET')}")
    print(f"   FRONTEND_URL: {os.getenv('FRONTEND_URL', 'NOT SET')}")
    print()
    
    # Now test with pydantic settings
    print("3. Testing with Pydantic Settings:")
    try:
        from app.core.config import settings
        print(f"   ✅ Settings imported successfully")
        print(f"   Client ID: {settings.google_client_id[:20] if settings.google_client_id else 'NOT SET'}...")
        print(f"   Client Secret: {settings.google_client_secret[:20] if settings.google_client_secret else 'NOT SET'}...")
        print(f"   Redirect URI: {settings.google_redirect_uri}")
        print(f"   Frontend URL: {settings.frontend_url}")
        print()
        
        if settings.google_client_id:
            print("✅ SUCCESS: OAuth credentials loaded correctly!")
        else:
            print("❌ ERROR: OAuth credentials NOT loaded!")
    except Exception as e:
        print(f"   ❌ Error importing settings: {e}")
else:
    print("❌ ERROR: .env file not found!")
    print(f"   Expected location: {ENV_FILE}")

print()
print("=" * 60)
