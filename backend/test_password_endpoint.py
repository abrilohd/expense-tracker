"""
Quick test to verify the password update endpoint exists
"""
import requests
import sys

# Test if backend is running
try:
    response = requests.get("http://localhost:8000/")
    print("✓ Backend is running")
    print(f"  Response: {response.json()}")
except Exception as e:
    print(f"✗ Backend is not running: {e}")
    sys.exit(1)

# Test if the endpoint exists (should return 401 without auth)
try:
    response = requests.put("http://localhost:8000/auth/password", json={
        "current_password": "test",
        "new_password": "test123"
    })
    
    if response.status_code == 401:
        print("✓ Password endpoint exists (returned 401 Unauthorized as expected)")
    elif response.status_code == 404:
        print("✗ Password endpoint NOT FOUND (404)")
        print("  → You need to restart the backend server!")
    else:
        print(f"? Unexpected status code: {response.status_code}")
        print(f"  Response: {response.text}")
        
except Exception as e:
    print(f"✗ Error testing endpoint: {e}")
    sys.exit(1)
