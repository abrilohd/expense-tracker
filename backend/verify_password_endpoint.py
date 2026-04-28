"""
Verify that the password endpoint is properly defined
"""
import sys
sys.path.insert(0, '.')

try:
    # Import the auth router
    from app.routes.auth import router
    
    # Get all routes
    routes = [route for route in router.routes]
    
    print(f"✓ Auth router loaded successfully")
    print(f"✓ Found {len(routes)} routes:\n")
    
    for route in routes:
        method = list(route.methods)[0] if hasattr(route, 'methods') else 'N/A'
        path = route.path if hasattr(route, 'path') else 'N/A'
        name = route.name if hasattr(route, 'name') else 'N/A'
        print(f"  {method:6} {path:20} -> {name}")
    
    # Check if password endpoint exists
    password_routes = [r for r in routes if hasattr(r, 'path') and 'password' in r.path]
    
    if password_routes:
        print(f"\n✓ Password endpoint found!")
        for route in password_routes:
            method = list(route.methods)[0]
            print(f"  {method} {route.path}")
    else:
        print(f"\n✗ Password endpoint NOT FOUND")
        print(f"  This means there's an issue with the code or imports")
        
except Exception as e:
    print(f"✗ Error loading auth routes: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
