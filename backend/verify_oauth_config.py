"""
Google OAuth Configuration Verification Script
Run this to verify your OAuth setup is correct
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
env_path = Path(__file__).parent / '.env'
load_dotenv(env_path)

def verify_oauth_config():
    """Verify Google OAuth configuration"""
    print("=" * 60)
    print("Google OAuth Configuration Verification")
    print("=" * 60)
    print()
    
    # Check if .env file exists
    if not env_path.exists():
        print("❌ ERROR: .env file not found!")
        print(f"   Expected location: {env_path}")
        print("   Create a .env file based on .env.example")
        return False
    else:
        print(f"✅ .env file found: {env_path}")
    
    print()
    print("-" * 60)
    print("Environment Variables:")
    print("-" * 60)
    
    # Check required variables
    required_vars = {
        'GOOGLE_CLIENT_ID': os.getenv('GOOGLE_CLIENT_ID'),
        'GOOGLE_CLIENT_SECRET': os.getenv('GOOGLE_CLIENT_SECRET'),
        'GOOGLE_REDIRECT_URI': os.getenv('GOOGLE_REDIRECT_URI'),
        'FRONTEND_URL': os.getenv('FRONTEND_URL'),
        'SECRET_KEY': os.getenv('SECRET_KEY'),
    }
    
    all_valid = True
    
    for var_name, var_value in required_vars.items():
        if not var_value or var_value == f"your_{var_name.lower()}_here":
            print(f"❌ {var_name}: NOT SET or using placeholder")
            all_valid = False
        else:
            # Mask sensitive values
            if 'SECRET' in var_name or 'KEY' in var_name:
                masked_value = var_value[:10] + "..." + var_value[-5:] if len(var_value) > 15 else "***"
                print(f"✅ {var_name}: {masked_value}")
            else:
                print(f"✅ {var_name}: {var_value}")
    
    print()
    print("-" * 60)
    print("Configuration Checks:")
    print("-" * 60)
    
    # Check client ID format
    client_id = required_vars['GOOGLE_CLIENT_ID']
    if client_id and client_id.endswith('.apps.googleusercontent.com'):
        print("✅ Client ID format looks correct")
    else:
        print("❌ Client ID format incorrect (should end with .apps.googleusercontent.com)")
        all_valid = False
    
    # Check client secret format
    client_secret = required_vars['GOOGLE_CLIENT_SECRET']
    if client_secret and client_secret.startswith('GOCSPX-'):
        print("✅ Client Secret format looks correct")
    else:
        print("⚠️  Client Secret format unusual (should start with GOCSPX-)")
    
    # Check redirect URI
    redirect_uri = required_vars['GOOGLE_REDIRECT_URI']
    if redirect_uri:
        if redirect_uri.startswith('http://') or redirect_uri.startswith('https://'):
            print(f"✅ Redirect URI format correct: {redirect_uri}")
            if '/auth/google/callback' in redirect_uri:
                print("✅ Redirect URI path correct")
            else:
                print("⚠️  Redirect URI should end with /auth/google/callback")
        else:
            print("❌ Redirect URI must start with http:// or https://")
            all_valid = False
    
    # Check frontend URL
    frontend_url = required_vars['FRONTEND_URL']
    if frontend_url:
        if frontend_url.startswith('http://') or frontend_url.startswith('https://'):
            print(f"✅ Frontend URL format correct: {frontend_url}")
        else:
            print("❌ Frontend URL must start with http:// or https://")
            all_valid = False
    
    # Check secret key
    secret_key = required_vars['SECRET_KEY']
    if secret_key == 'your-super-secret-key-change-in-production':
        print("⚠️  WARNING: Using default SECRET_KEY - change for production!")
        print("   Generate new key: openssl rand -hex 32")
    elif len(secret_key) < 32:
        print("⚠️  WARNING: SECRET_KEY is too short (should be at least 32 characters)")
    else:
        print("✅ SECRET_KEY length is adequate")
    
    print()
    print("-" * 60)
    print("Google Cloud Console Checklist:")
    print("-" * 60)
    print()
    print("Make sure you have configured in Google Cloud Console:")
    print()
    print("1. ✓ Created OAuth 2.0 Client ID")
    print("2. ✓ Added Authorized JavaScript origins:")
    print(f"     - {frontend_url}")
    if redirect_uri:
        backend_origin = redirect_uri.rsplit('/auth', 1)[0]
        print(f"     - {backend_origin}")
    print()
    print("3. ✓ Added Authorized redirect URIs:")
    print(f"     - {redirect_uri}")
    print()
    print("4. ✓ Configured OAuth consent screen")
    print("5. ✓ Added test users (if app not published)")
    print()
    
    print("=" * 60)
    if all_valid:
        print("✅ Configuration looks good!")
        print()
        print("Next steps:")
        print("1. Verify URLs in Google Cloud Console match exactly")
        print("2. Restart your backend server")
        print("3. Test OAuth flow from frontend")
    else:
        print("❌ Configuration has issues - please fix them")
        print()
        print("See GOOGLE-OAUTH-SETUP-GUIDE.md for detailed instructions")
    print("=" * 60)
    
    return all_valid


if __name__ == "__main__":
    verify_oauth_config()
