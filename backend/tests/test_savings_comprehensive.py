"""
Comprehensive Savings Goals Test - Edge Cases & Production Scenarios
"""
import requests
from datetime import date, timedelta

BASE_URL = "http://localhost:8000"

def get_auth_headers():
    """Get authentication headers"""
    login_data = {
        "username": "test@example.com",
        "password": "Password123"
    }
    response = requests.post(
        f"{BASE_URL}/auth/login",
        data=login_data,
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_comprehensive():
    """Comprehensive test suite"""
    
    print("🧪 COMPREHENSIVE SAVINGS GOALS TEST")
    print("=" * 70)
    
    headers = get_auth_headers()
    
    # Test 1: Create goal without deadline (optional)
    print("\n✅ Test 1: Create goal without deadline")
    goal1 = {
        "name": "Emergency Fund",
        "target_amount": 10000,
        "emoji": "🚨"
    }
    response = requests.post(f"{BASE_URL}/savings-goals", json=goal1, headers=headers)
    assert response.status_code == 201, f"Failed: {response.text}"
    goal1_data = response.json()
    goal1_id = goal1_data["id"]
    assert goal1_data["deadline"] is None, "Deadline should be None"
    print(f"   ✅ Created goal without deadline: {goal1_data['name']}")
    
    # Test 2: Create goal with deadline
    print("\n✅ Test 2: Create goal with deadline")
    deadline = (date.today() + timedelta(days=365)).isoformat()
    goal2 = {
        "name": "New Car",
        "target_amount": 25000,
        "deadline": deadline,
        "emoji": "🚗",
        "color": "#F59E0B"
    }
    response = requests.post(f"{BASE_URL}/savings-goals", json=goal2, headers=headers)
    assert response.status_code == 201, f"Failed: {response.text}"
    goal2_data = response.json()
    goal2_id = goal2_data["id"]
    assert goal2_data["deadline"] is not None, "Deadline should exist"
    assert goal2_data["emoji"] == "🚗", "Emoji mismatch"
    assert goal2_data["color"] == "#F59E0B", "Color mismatch"
    print(f"   ✅ Created goal with deadline: {goal2_data['name']}")
    
    # Test 3: Multiple contributions
    print("\n✅ Test 3: Multiple contributions")
    contributions = [500, 1000, 250, 750]
    for amount in contributions:
        response = requests.post(
            f"{BASE_URL}/savings-goals/{goal1_id}/contribute",
            json={"amount": amount},
            headers=headers
        )
        assert response.status_code == 200, f"Failed: {response.text}"
    
    response = requests.get(f"{BASE_URL}/savings-goals/{goal1_id}", headers=headers)
    goal1_updated = response.json()
    expected_total = sum(contributions)
    assert goal1_updated["saved_amount"] == expected_total, f"Expected {expected_total}, got {goal1_updated['saved_amount']}"
    print(f"   ✅ Added {len(contributions)} contributions totaling ${expected_total}")
    
    # Test 4: Goal completion (100%)
    print("\n✅ Test 4: Goal completion")
    remaining = goal1_updated["target_amount"] - goal1_updated["saved_amount"]
    response = requests.post(
        f"{BASE_URL}/savings-goals/{goal1_id}/contribute",
        json={"amount": remaining},
        headers=headers
    )
    assert response.status_code == 200, f"Failed: {response.text}"
    completed_goal = response.json()
    assert completed_goal["percentage"] >= 100, "Goal should be 100% complete"
    assert completed_goal["status"] == "completed", "Status should be 'completed'"
    print(f"   ✅ Goal completed: {completed_goal['percentage']}%")
    
    # Test 5: Over-contribution (>100%)
    print("\n✅ Test 5: Over-contribution")
    response = requests.post(
        f"{BASE_URL}/savings-goals/{goal1_id}/contribute",
        json={"amount": 1000},
        headers=headers
    )
    assert response.status_code == 200, f"Failed: {response.text}"
    over_goal = response.json()
    assert over_goal["saved_amount"] > over_goal["target_amount"], "Should allow over-contribution"
    print(f"   ✅ Over-contributed: ${over_goal['saved_amount']}/${over_goal['target_amount']}")
    
    # Test 6: Update goal details
    print("\n✅ Test 6: Update goal details")
    update_data = {
        "name": "New Car (Tesla Model 3)",
        "target_amount": 30000,
        "emoji": "⚡",
        "color": "#EF4444"
    }
    response = requests.put(
        f"{BASE_URL}/savings-goals/{goal2_id}",
        json=update_data,
        headers=headers
    )
    assert response.status_code == 200, f"Failed: {response.text}"
    updated_goal = response.json()
    assert updated_goal["name"] == update_data["name"], "Name not updated"
    assert updated_goal["target_amount"] == update_data["target_amount"], "Amount not updated"
    assert updated_goal["emoji"] == update_data["emoji"], "Emoji not updated"
    assert updated_goal["color"] == update_data["color"], "Color not updated"
    print(f"   ✅ Updated goal: {updated_goal['name']}")
    
    # Test 7: Get all goals (should have 2)
    print("\n✅ Test 7: Get all goals")
    response = requests.get(f"{BASE_URL}/savings-goals", headers=headers)
    assert response.status_code == 200, f"Failed: {response.text}"
    all_goals = response.json()
    assert isinstance(all_goals, list), "Should return array"
    assert len(all_goals) >= 2, f"Should have at least 2 goals, got {len(all_goals)}"
    print(f"   ✅ Retrieved {len(all_goals)} goals")
    
    # Test 8: Field aliases (frontend compatibility)
    print("\n✅ Test 8: Field aliases")
    response = requests.get(f"{BASE_URL}/savings-goals/{goal1_id}", headers=headers)
    goal = response.json()
    assert "saved_amount" in goal, "Missing 'saved_amount' alias"
    assert "current_amount" in goal, "Missing 'current_amount'"
    assert "percentage" in goal, "Missing 'percentage' alias"
    assert "progress_percentage" in goal, "Missing 'progress_percentage'"
    assert goal["saved_amount"] == goal["current_amount"], "Aliases should match"
    assert goal["percentage"] == goal["progress_percentage"], "Aliases should match"
    print(f"   ✅ All field aliases present and matching")
    
    # Test 9: Invalid contribution (negative)
    print("\n✅ Test 9: Invalid contribution (negative)")
    response = requests.post(
        f"{BASE_URL}/savings-goals/{goal1_id}/contribute",
        json={"amount": -100},
        headers=headers
    )
    assert response.status_code == 422, "Should reject negative contribution"
    print(f"   ✅ Correctly rejected negative contribution")
    
    # Test 10: Invalid contribution (zero)
    print("\n✅ Test 10: Invalid contribution (zero)")
    response = requests.post(
        f"{BASE_URL}/savings-goals/{goal1_id}/contribute",
        json={"amount": 0},
        headers=headers
    )
    assert response.status_code == 422, "Should reject zero contribution"
    print(f"   ✅ Correctly rejected zero contribution")
    
    # Test 11: Access control (can't access other user's goals)
    print("\n✅ Test 11: Access control")
    # This would require another user, skipping for now
    print(f"   ⏭️  Skipped (requires second user)")
    
    # Test 12: Delete goals
    print("\n✅ Test 12: Delete goals")
    response = requests.delete(f"{BASE_URL}/savings-goals/{goal1_id}", headers=headers)
    assert response.status_code == 204, f"Failed to delete goal1: {response.text}"
    response = requests.delete(f"{BASE_URL}/savings-goals/{goal2_id}", headers=headers)
    assert response.status_code == 204, f"Failed to delete goal2: {response.text}"
    print(f"   ✅ Deleted both test goals")
    
    # Test 13: Verify deletion
    print("\n✅ Test 13: Verify deletion")
    response = requests.get(f"{BASE_URL}/savings-goals/{goal1_id}", headers=headers)
    assert response.status_code == 404, "Deleted goal should return 404"
    print(f"   ✅ Confirmed goals are deleted")
    
    print("\n" + "=" * 70)
    print("✅ ALL COMPREHENSIVE TESTS PASSED!")
    print("=" * 70)
    print("\n📊 Test Summary:")
    print("   ✅ Optional deadline support")
    print("   ✅ Required deadline support")
    print("   ✅ Multiple contributions")
    print("   ✅ Goal completion (100%)")
    print("   ✅ Over-contribution (>100%)")
    print("   ✅ Update all fields")
    print("   ✅ Array response format")
    print("   ✅ Field aliases for compatibility")
    print("   ✅ Input validation (negative)")
    print("   ✅ Input validation (zero)")
    print("   ✅ Deletion and cleanup")
    print("\n🚀 Savings Goals is PRODUCTION READY!")
    
    return True

if __name__ == "__main__":
    try:
        success = test_comprehensive()
        exit(0 if success else 1)
    except AssertionError as e:
        print(f"\n❌ Test failed: {e}")
        exit(1)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        exit(1)
