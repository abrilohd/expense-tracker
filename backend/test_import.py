#!/usr/bin/env python3
"""
Test if the password endpoint can be imported
"""
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("=" * 60)
print("Testing Password Endpoint Import")
print("=" * 60)
print()

# Test 1: Import PasswordUpdate schema
print("Test 1: Importing PasswordUpdate schema...")
try:
    from app.schemas.user import PasswordUpdate
    print("✓ SUCCESS: PasswordUpdate imported")
    print(f"  Fields: {PasswordUpdate.model_fields.keys()}")
except Exception as e:
    print(f"✗ FAILED: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print()

# Test 2: Import auth router
print("Test 2: Importing auth router...")
try:
    from app.routes.auth import router
    print("✓ SUCCESS: Auth router imported")
except Exception as e:
    print(f"✗ FAILED: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print()

# Test 3: Check routes
print("Test 3: Checking routes in auth router...")
try:
    routes = list(router.routes)
    print(f"✓ Found {len(routes)} routes:")
    print()
    
    for route in routes:
        if hasattr(route, 'methods') and hasattr(route, 'path'):
            methods = ', '.join(route.methods)
            path = route.path
            name = route.name if hasattr(route, 'name') else 'unknown'
            print(f"  {methods:6} {path:25} -> {name}")
    
    # Check for password endpoint
    password_routes = [r for r in routes if hasattr(r, 'path') and 'password' in r.path.lower()]
    
    print()
    if password_routes:
        print("✓ PASSWORD ENDPOINT FOUND!")
        for route in password_routes:
            methods = ', '.join(route.methods)
            print(f"  {methods} {route.path}")
        print()
        print("=" * 60)
        print("SUCCESS: Everything is working!")
        print("=" * 60)
        print()
        print("Next step: Restart your backend server:")
        print("  uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")
        print()
    else:
        print("✗ PASSWORD ENDPOINT NOT FOUND")
        print("  Available routes:")
        for route in routes:
            if hasattr(route, 'path'):
                print(f"    {route.path}")
        sys.exit(1)
        
except Exception as e:
    print(f"✗ FAILED: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
