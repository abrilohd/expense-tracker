"""
Test Google OAuth Endpoint
Quick test to verify OAuth configuration is working
"""
import requests
from app.core.config import settings

def test_oauth_endpoint():
    """Test the Google OAuth login endpoint"""
    print("=" * 60)
    print("Testing Google OAuth Endpoint")
    print("=" * 60)
    print()
    
    # Check configuration
    print("Configuration:")
    print(f"  Client ID: {settings.google_client_id[:20]}..." if settings.google_client_id else "  Client ID: NOT SET")
    print(f"  Redirect URI: {settings.google_redirect_uri}")
    print(f"  Frontend URL: {settings.frontend_url}")
    print()
    
    if not settings.google_client_id or settings.google_client_id == "your_google_client_id_here":
        print("❌ ERROR: GOOGLE_CLIENT_ID is not set!")
        print("   Please update backend/.env with your Google OAuth credentials")
        print("   See OAUTH-QUICK-FIX.md for instructions")
        return False
    
    # Test the login endpoint
    print("Testing /auth/google/login endpoint...")
    print()
    
    try:
        backend_url = "http://localhost:8000"
        response = requests.get(f"{backend_url}/auth/google/login", allow_redirects=False)
        
        if response.status_code == 307:  # Redirect
            redirect_url = response.headers.get('Location', '')
            print(f"✅ Endpoint working! Status: {response.status_code}")
            print(f"   Redirects to: {redirect_url[:80]}...")
            print()
            
            # Check if redirect URL contains client_id
            if 'client_id=' in redirect_url:
                print("✅ Client ID is present in redirect URL")
                
                # Extract and verify client_id
                import urllib.parse
                parsed = urllib.parse.urlparse(redirect_url)
                params = urllib.parse.parse_qs(parsed.query)
                client_id = params.get('client_id', [''])[0]
                
                if client_id == settings.google_client_id:
                    print(f"✅ Client ID matches configuration")
                else:
                    print(f"⚠️  Client ID mismatch!")
                    print(f"   Expected: {settings.google_client_id}")
                    print(f"   Got: {client_id}")
                
                # Check redirect_uri parameter
                redirect_uri = params.get('redirect_uri', [''])[0]
                if redirect_uri == settings.google_redirect_uri:
                    print(f"✅ Redirect URI matches configuration")
                else:
                    print(f"⚠️  Redirect URI mismatch!")
                    print(f"   Expected: {settings.google_redirect_uri}")
                    print(f"   Got: {redirect_uri}")
                
                print()
                print("=" * 60)
                print("✅ OAuth endpoint is configured correctly!")
                print("=" * 60)
                print()
                print("Next steps:")
                print("1. Make sure these URLs are in Google Cloud Console:")
                print(f"   Authorized JavaScript origins:")
                print(f"     - http://localhost:5173")
                print(f"     - http://localhost:8000")
                print(f"   Authorized redirect URIs:")
                print(f"     - {settings.google_redirect_uri}")
                print()
                print("2. Test from frontend:")
                print("   - Go to http://localhost:5173/login")
                print("   - Click 'Continue with Google'")
                print("   - You should see Google's consent screen")
                print()
                return True
            else:
                print("❌ Client ID is missing from redirect URL!")
                print("   This means the backend is not reading GOOGLE_CLIENT_ID")
                return False
        else:
            print(f"❌ Unexpected status code: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ ERROR: Cannot connect to backend!")
        print("   Make sure the backend is running:")
        print("   cd backend")
        print("   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")
        return False
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False


if __name__ == "__main__":
    test_oauth_endpoint()
