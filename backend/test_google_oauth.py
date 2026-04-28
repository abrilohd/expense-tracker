"""
Test script to verify Google OAuth endpoint
"""
import requests

try:
    # Test the Google login endpoint
    response = requests.get('http://localhost:8000/auth/google/login', allow_redirects=False)
    
    print(f"Status Code: {response.status_code}")
    print(f"Headers: {dict(response.headers)}")
    
    if response.status_code == 307 or response.status_code == 302:
        print(f"\n✅ SUCCESS: Redirect to Google OAuth")
        print(f"Location: {response.headers.get('location', 'N/A')}")
    else:
        print(f"\n❌ ERROR: Expected redirect (307/302), got {response.status_code}")
        print(f"Response: {response.text}")
        
except requests.exceptions.ConnectionError:
    print("❌ ERROR: Cannot connect to backend server at http://localhost:8000")
    print("Make sure the backend server is running: python -m uvicorn app.main:app --reload")
except Exception as e:
    print(f"❌ ERROR: {str(e)}")
