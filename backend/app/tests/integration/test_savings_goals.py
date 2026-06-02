"""
Test Savings Goals API - Complete functionality test
"""
import requests
import json
from datetime import date, timedelta

BASE_URL = "http://localhost:8000"

def test_savings_goals():
    """Test complete savings goals workflow"""
    
    print("🧪 Testing Savings Goals API")
    print("=" * 60)
    
    # Step 1: Login (use existing test user or create one)
    print("\n1️⃣ Logging in...")
    login_data = {
        "username": "test@example.com",
        "password": "Password123"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            data=login_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        if response.status_code == 401:
            print("   Creating test user...")
            register_response = requests.post(
                f"{BASE_URL}/auth/register",
                json={
                    "email": "test@example.com",
                    "password": "test123",
                    "name": "Test User"
                }
            )
            if register_response.status_code == 200:
                print("   ✅ Test user created")
                # Login again
                response = requests.post(
                    f"{BASE_URL}/auth/login",
                    data=login_data,
                    headers={"Content-Type": "application/x-www-form-urlencoded"}
                )
        
        if response.status_code != 200:
            print(f"   ❌ Login failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
        
        token = response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("   ✅ Logged in successfully")
        
    except Exception as e:
        print(f"   ❌ Login error: {e}")
        return False
    
    # Step 2: Get all savings goals (should be empty or existing)
    print("\n2️⃣ Getting all savings goals...")
    try:
        response = requests.get(f"{BASE_URL}/savings-goals", headers=headers)
        if response.status_code != 200:
            print(f"   ❌ Failed to get goals: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
        
        goals = response.json()
        print(f"   ✅ Found {len(goals)} existing goals")
        
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False
    
    # Step 3: Create new savings goal
    print("\n3️⃣ Creating new savings goal...")
    deadline = (date.today() + timedelta(days=180)).isoformat()
    new_goal = {
        "name": "Dream Vacation",
        "target_amount": 5000,
        "deadline": deadline,
        "emoji": "✈️",
        "color": "#34D399"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/savings-goals",
            json=new_goal,
            headers=headers
        )
        
        if response.status_code != 201:
            print(f"   ❌ Failed to create goal: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
        
        created_goal = response.json()
        goal_id = created_goal["id"]
        print(f"   ✅ Created goal #{goal_id}: {created_goal['name']}")
        print(f"      Target: ${created_goal['target_amount']}")
        print(f"      Emoji: {created_goal.get('emoji', 'N/A')}")
        print(f"      Color: {created_goal.get('color', 'N/A')}")
        print(f"      Progress: {created_goal.get('percentage', 0)}%")
        
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False
    
    # Step 4: Add contribution
    print("\n4️⃣ Adding contribution...")
    contribution = {"amount": 1000}
    
    try:
        response = requests.post(
            f"{BASE_URL}/savings-goals/{goal_id}/contribute",
            json=contribution,
            headers=headers
        )
        
        if response.status_code != 200:
            print(f"   ❌ Failed to add contribution: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
        
        updated_goal = response.json()
        print(f"   ✅ Added ${contribution['amount']}")
        print(f"      New saved amount: ${updated_goal.get('saved_amount', updated_goal.get('current_amount'))}")
        print(f"      New progress: {updated_goal.get('percentage', 0)}%")
        
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False
    
    # Step 5: Update goal
    print("\n5️⃣ Updating goal...")
    update_data = {
        "name": "Dream Vacation to Hawaii",
        "emoji": "🏝️"
    }
    
    try:
        response = requests.put(
            f"{BASE_URL}/savings-goals/{goal_id}",
            json=update_data,
            headers=headers
        )
        
        if response.status_code != 200:
            print(f"   ❌ Failed to update goal: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
        
        updated_goal = response.json()
        print(f"   ✅ Updated goal: {updated_goal['name']}")
        print(f"      New emoji: {updated_goal.get('emoji', 'N/A')}")
        
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False
    
    # Step 6: Get single goal
    print("\n6️⃣ Getting single goal...")
    try:
        response = requests.get(f"{BASE_URL}/savings-goals/{goal_id}", headers=headers)
        
        if response.status_code != 200:
            print(f"   ❌ Failed to get goal: {response.status_code}")
            return False
        
        goal = response.json()
        print(f"   ✅ Retrieved goal: {goal['name']}")
        
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False
    
    # Step 7: Get all goals again
    print("\n7️⃣ Getting all goals again...")
    try:
        response = requests.get(f"{BASE_URL}/savings-goals", headers=headers)
        
        if response.status_code != 200:
            print(f"   ❌ Failed to get goals: {response.status_code}")
            return False
        
        goals = response.json()
        print(f"   ✅ Found {len(goals)} total goals")
        for g in goals:
            print(f"      - {g.get('emoji', '💳')} {g['name']}: ${g.get('saved_amount', 0)}/${g['target_amount']} ({g.get('percentage', 0):.1f}%)")
        
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False
    
    # Step 8: Delete goal
    print("\n8️⃣ Deleting test goal...")
    try:
        response = requests.delete(f"{BASE_URL}/savings-goals/{goal_id}", headers=headers)
        
        if response.status_code != 204:
            print(f"   ❌ Failed to delete goal: {response.status_code}")
            return False
        
        print(f"   ✅ Deleted goal #{goal_id}")
        
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False
    
    print("\n" + "=" * 60)
    print("✅ ALL TESTS PASSED! Savings Goals API is fully functional!")
    print("=" * 60)
    return True

if __name__ == "__main__":
    success = test_savings_goals()
    exit(0 if success else 1)
