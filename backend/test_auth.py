"""
Test script to diagnose authentication issues
"""
import sys
sys.path.insert(0, '.')

try:
    print("Testing imports...")
    from app.core.security import hash_password, verify_password
    from app.models.user import User
    from app.db.database import SessionLocal, engine, Base
    print("✓ All imports successful")
    
    print("\nTesting password hashing...")
    hashed = hash_password("test123")
    print(f"✓ Password hashed: {hashed[:20]}...")
    
    print("\nTesting password verification...")
    result = verify_password("test123", hashed)
    print(f"✓ Password verification: {result}")
    
    print("\nTesting database connection...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    print("✓ Database connection successful")
    
    print("\nTesting user creation...")
    test_user = User(
        email="test@test.com",
        hashed_password=hashed,
        is_active=True
    )
    db.add(test_user)
    db.commit()
    db.refresh(test_user)
    print(f"✓ User created with ID: {test_user.id}")
    
    # Cleanup
    db.delete(test_user)
    db.commit()
    db.close()
    print("\n✓ All tests passed!")
    
except Exception as e:
    print(f"\n✗ Error: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
