"""
Quick test script to verify budget API endpoints
Run this after starting the backend server
"""
import requests
import json
from datetime import date, timedelta

BASE_URL = "http://localhost:8000"

# Test credentials (use your actual test user)
TEST_EMAIL = "test@example.com"
TEST_PASSWORD = "test123"

def test_budget_endpoints():
    print("🧪 Testing Budget API Endpoints\n")
    
    # Step 1: Login to get token
    print("1️⃣ Logging in...")
    login_response = requests.post(
        f"{BASE_URL}/auth/login",
        data={"username": TEST_EMAIL, "password": TEST_PASSWORD}
    )
    
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.status_code}")
        print(f"   Response: {login_response.text}")
        return
    
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print(f"✅ Login successful! Token: {token[:20]}...\n")
    
    # Step 2: Create an overall budget
    print("2️⃣ Creating overall budget...")
    today = date.today()
    first_day = date(today.year, today.month, 1)
    last_day = date(today.year, today.month + 1, 1) - timedelta(days=1) if today.month < 12 else date(today.year, 12, 31)
    
    overall_budget = {
        "budget_type": "overall",
        "category": None,
        "amount": 2000.00,
        "period_start": first_day.isoformat(),
        "period_end": last_day.isoformat()
    }
    
    create_response = requests.post(
        f"{BASE_URL}/budgets",
        headers=headers,
        json=overall_budget
    )
    
    if create_response.status_code == 201:
        budget = create_response.json()
        print(f"✅ Overall budget created! ID: {budget['id']}")
        print(f"   Amount: ${budget['amount']}")
        print(f"   Period: {budget['period_start']} to {budget['period_end']}\n")
    else:
        print(f"❌ Failed to create budget: {create_response.status_code}")
        print(f"   Response: {create_response.text}\n")
    
    # Step 3: Create a category budget
    print("3️⃣ Creating category budget (Food)...")
    category_budget = {
        "budget_type": "category",
        "category": "Food",
        "amount": 500.00,
        "period_start": first_day.isoformat(),
        "period_end": last_day.isoformat()
    }
    
    create_response = requests.post(
        f"{BASE_URL}/budgets",
        headers=headers,
        json=category_budget
    )
    
    if create_response.status_code == 201:
        budget = create_response.json()
        print(f"✅ Category budget created! ID: {budget['id']}")
        print(f"   Category: {budget['category']}")
        print(f"   Amount: ${budget['amount']}\n")
    else:
        print(f"❌ Failed to create budget: {create_response.status_code}")
        print(f"   Response: {create_response.text}\n")
    
    # Step 4: Get all budgets
    print("4️⃣ Fetching all budgets...")
    list_response = requests.get(
        f"{BASE_URL}/budgets",
        headers=headers
    )
    
    if list_response.status_code == 200:
        budgets = list_response.json()
        print(f"✅ Found {budgets['total']} budgets:")
        for budget in budgets['items']:
            print(f"   - {budget['budget_type'].upper()}: ${budget['amount']} ({budget['category'] or 'All'})")
        print()
    else:
        print(f"❌ Failed to fetch budgets: {list_response.status_code}\n")
    
    # Step 5: Get budget status
    print("5️⃣ Fetching budget status...")
    status_response = requests.get(
        f"{BASE_URL}/budgets/status",
        headers=headers
    )
    
    if status_response.status_code == 200:
        status_data = status_response.json()
        print(f"✅ Budget Status:")
        print(f"   Total Budgets: {status_data['total_budgets']}")
        print(f"   Active Budgets: {status_data['active_budgets']}")
        print(f"   Warnings: {status_data['warning_count']}")
        print(f"   Exceeded: {status_data['exceeded_count']}")
        print(f"\n   Budget Details:")
        for budget_status in status_data['budgets']:
            budget = budget_status['budget']
            print(f"   - {budget['budget_type'].upper()} ({budget['category'] or 'All'}):")
            print(f"     Spent: ${budget_status['spent_amount']:.2f} / ${budget['amount']:.2f}")
            print(f"     Utilization: {budget_status['utilization_percentage']:.1f}%")
            print(f"     Status: {budget_status['status'].upper()}")
            print(f"     Remaining: ${budget_status['remaining_amount']:.2f}")
        print()
    else:
        print(f"❌ Failed to fetch budget status: {status_response.status_code}\n")
    
    # Step 6: Get budget alerts
    print("6️⃣ Fetching budget alerts...")
    alerts_response = requests.get(
        f"{BASE_URL}/budgets/alerts",
        headers=headers
    )
    
    if alerts_response.status_code == 200:
        alerts = alerts_response.json()
        if alerts:
            print(f"✅ Found {len(alerts)} alerts:")
            for alert in alerts:
                print(f"   - {alert['budget_name']}: {alert['utilization_percentage']:.1f}% ({alert['status']})")
        else:
            print(f"✅ No budget alerts (all budgets are safe)")
        print()
    else:
        print(f"❌ Failed to fetch alerts: {alerts_response.status_code}\n")
    
    print("✅ All tests completed!")

if __name__ == "__main__":
    try:
        test_budget_endpoints()
    except Exception as e:
        print(f"❌ Test failed with error: {str(e)}")
