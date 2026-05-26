"""
Test Insights API - Complete functionality test
"""
import requests

BASE_URL = "http://localhost:8000"

def test_insights():
    """Test insights API"""
    
    print("🧪 Testing Insights API")
    print("=" * 60)
    
    # Step 1: Login
    print("\n1️⃣ Logging in...")
    login_data = {
        "username": "test@example.com",
        "password": "Password123"
    }
    
    response = requests.post(
        f"{BASE_URL}/auth/login",
        data=login_data,
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    
    if response.status_code != 200:
        print(f"   ❌ Login failed: {response.status_code}")
        return False
    
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("   ✅ Logged in successfully")
    
    # Step 2: Get insights (30 days)
    print("\n2️⃣ Getting insights (30 days)...")
    response = requests.get(f"{BASE_URL}/insights", headers=headers, params={"days": 30})
    if response.status_code != 200:
        print(f"   ❌ Failed: {response.status_code}")
        print(f"   Response: {response.text}")
        return False
    
    data = response.json()
    print(f"   ✅ Got {len(data['insights'])} insights")
    print(f"      Period: {data['period_days']} days")
    print(f"      Generated: {data['generated_at']}")
    
    # Step 3: Display insights
    if data['insights']:
        print("\n3️⃣ Insights:")
        for i, insight in enumerate(data['insights'], 1):
            icon = {
                'warning': '⚠️',
                'success': '✅',
                'tip': '💡',
                'info': 'ℹ️'
            }.get(insight['type'], '📊')
            
            print(f"   {icon} {insight['title']}")
            print(f"      {insight['message']}")
            if insight.get('value'):
                print(f"      Value: {insight['value']}")
    else:
        print("\n3️⃣ No insights generated (no expenses)")
    
    # Step 4: Get insights (7 days)
    print("\n4️⃣ Getting insights (7 days)...")
    response = requests.get(f"{BASE_URL}/insights", headers=headers, params={"days": 7})
    if response.status_code != 200:
        print(f"   ❌ Failed: {response.status_code}")
        return False
    
    data = response.json()
    print(f"   ✅ Got {len(data['insights'])} insights for 7 days")
    
    # Step 5: Get insights (90 days)
    print("\n5️⃣ Getting insights (90 days)...")
    response = requests.get(f"{BASE_URL}/insights", headers=headers, params={"days": 90})
    if response.status_code != 200:
        print(f"   ❌ Failed: {response.status_code}")
        return False
    
    data = response.json()
    print(f"   ✅ Got {len(data['insights'])} insights for 90 days")
    
    print("\n" + "=" * 60)
    print("✅ ALL TESTS PASSED! Insights API is fully functional!")
    print("=" * 60)
    return True

if __name__ == "__main__":
    success = test_insights()
    exit(0 if success else 1)
