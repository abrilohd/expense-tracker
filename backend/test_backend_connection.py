"""
Test if backend is accessible
"""
import requests
import sys

print("=" * 60)
print("Testing Backend Connection")
print("=" * 60)
print()

# Test 1: Can we reach the root endpoint?
print("Test 1: Checking root endpoint...")
try:
    response = requests.get("http://localhost:8000/", timeout=5)
    print(f"✓ SUCCESS: Backend is accessible")
    print(f"  Status: {response.status_code}")
    print(f"  Response: {response.json()}")
except requests.exceptions.ConnectionError:
    print("✗ FAILED: Cannot connect to backend")
    print("  Backend is not running or not accessible on localhost:8000")
    sys.exit(1)
except Exception as e:
    print(f"✗ FAILED: {e}")
    sys.exit(1)

print()

# Test 2: Check if docs are accessible
print("Test 2: Checking API docs...")
try:
    response = requests.get("http://localhost:8000/docs", timeout=5)
    if response.status_code == 200:
        print(f"✓ SUCCESS: API docs accessible")
        print(f"  URL: http://localhost:8000/docs")
    else:
        print(f"? Unexpected status: {response.status_code}")
except Exception as e:
    print(f"✗ FAILED: {e}")

print()

# Test 3: Check CORS headers
print("Test 3: Checking CORS configuration...")
try:
    response = requests.options(
        "http://localhost:8000/auth/register",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "POST"
        },
        timeout=5
    )
    cors_header = response.headers.get("Access-Control-Allow-Origin")
    if cors_header:
        print(f"✓ SUCCESS: CORS is configured")
        print(f"  Allow-Origin: {cors_header}")
    else:
        print(f"✗ WARNING: CORS headers not found")
        print(f"  This might cause frontend connection issues")
except Exception as e:
    print(f"? Could not test CORS: {e}")

print()

# Test 4: Try to access register endpoint
print("Test 4: Checking /auth/register endpoint...")
try:
    response = requests.post(
        "http://localhost:8000/auth/register",
        json={"email": "test@test.com", "password": "test123"},
        timeout=5
    )
    print(f"✓ Endpoint is accessible")
    print(f"  Status: {response.status_code}")
    if response.status_code == 400:
        print(f"  (400 is expected if email exists - endpoint works!)")
except Exception as e:
    print(f"✗ FAILED: {e}")

print()
print("=" * 60)
print("Connection Test Complete")
print("=" * 60)
print()
print("If all tests passed, the backend is working correctly.")
print("The frontend should be able to connect.")
print()
