"""
Test Recurring Transactions API - Complete functionality test
"""
import requests
from datetime import date, timedelta

BASE_URL = "http://localhost:8000"

def test_recurring():
    """Test complete recurring transactions workflow"""
    
    print("🧪 Testing Recurring Transactions API")
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
        print(f"       Login failed: {response.status_code}")
        return False
    
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("       Logged in successfully")
    
    # Step 2: Get all recurring (should be empty or existing)
    print("\n2️⃣ Getting all recurring transactions...")
    response = requests.get(f"{BASE_URL}/recurring", headers=headers)
    if response.status_code != 200:
        print(f"       Failed: {response.status_code}")
        print(f"   Response: {response.text}")
        return False
    
    data = response.json()
    print(f"       Found {data['total']} existing recurring transactions")
    print(f"      Active: {data['active_count']}, Inactive: {data['inactive_count']}")
    
    # Step 3: Create expense recurring
    print("\n3️⃣ Creating recurring expense...")
    start_date = date.today().isoformat()
    end_date = (date.today() + timedelta(days=365)).isoformat()
    
    expense_data = {
        "transaction_type": "expense",
        "title": "Monthly Rent",
        "amount": 1500,
        "category_or_source": "Housing",
        "description": "Apartment rent payment",
        "frequency": "monthly",
        "start_date": start_date,
        "end_date": end_date
    }
    
    response = requests.post(f"{BASE_URL}/recurring", json=expense_data, headers=headers)
    if response.status_code != 201:
        print(f"       Failed: {response.status_code}")
        print(f"   Response: {response.text}")
        return False
    
    expense_recurring = response.json()
    expense_id = expense_recurring["id"]
    print(f"       Created recurring expense #{expense_id}: {expense_recurring['title']}")
    print(f"      Amount: ${expense_recurring['amount']}")
    print(f"      Frequency: {expense_recurring['frequency']}")
    print(f"      Next: {expense_recurring['next_occurrence']}")
    
    # Step 4: Create income recurring
    print("\n4️⃣ Creating recurring income...")
    income_data = {
        "transaction_type": "income",
        "title": "Weekly Salary",
        "amount": 2000,
        "category_or_source": "Salary",
        "description": "Weekly paycheck",
        "frequency": "weekly",
        "start_date": start_date
    }
    
    response = requests.post(f"{BASE_URL}/recurring", json=income_data, headers=headers)
    if response.status_code != 201:
        print(f"       Failed: {response.status_code}")
        return False
    
    income_recurring = response.json()
    income_id = income_recurring["id"]
    print(f"       Created recurring income #{income_id}: {income_recurring['title']}")
    
    # Step 5: Get single recurring
    print("\n5️⃣ Getting single recurring...")
    response = requests.get(f"{BASE_URL}/recurring/{expense_id}", headers=headers)
    if response.status_code != 200:
        print(f"       Failed: {response.status_code}")
        return False
    
    print(f"       Retrieved recurring: {response.json()['title']}")
    
    # Step 6: Update recurring
    print("\n6️⃣ Updating recurring...")
    update_data = {
        "title": "Monthly Rent (Updated)",
        "amount": 1600
    }
    
    response = requests.put(f"{BASE_URL}/recurring/{expense_id}", json=update_data, headers=headers)
    if response.status_code != 200:
        print(f"       Failed: {response.status_code}")
        return False
    
    updated = response.json()
    print(f"       Updated: {updated['title']} - ${updated['amount']}")
    
    # Step 7: Toggle recurring (pause)
    print("\n7️⃣ Toggling recurring (pause)...")
    response = requests.post(f"{BASE_URL}/recurring/{expense_id}/toggle", headers=headers)
    if response.status_code != 200:
        print(f"       Failed: {response.status_code}")
        return False
    
    toggled = response.json()
    print(f"       Toggled: is_active = {toggled['is_active']}")
    
    # Step 8: Toggle again (resume)
    print("\n8️⃣ Toggling recurring (resume)...")
    response = requests.post(f"{BASE_URL}/recurring/{expense_id}/toggle", headers=headers)
    if response.status_code != 200:
        print(f"       Failed: {response.status_code}")
        return False
    
    toggled = response.json()
    print(f"       Toggled: is_active = {toggled['is_active']}")
    
    # Step 9: Get upcoming occurrences
    print("\n9️⃣ Getting upcoming occurrences...")
    response = requests.get(f"{BASE_URL}/recurring/{expense_id}/upcoming", headers=headers, params={"count": 5})
    if response.status_code != 200:
        print(f"       Failed: {response.status_code}")
        return False
    
    upcoming = response.json()
    print(f"       Upcoming dates for '{upcoming['title']}':")
    for i, date_str in enumerate(upcoming['upcoming_dates'], 1):
        print(f"      {i}. {date_str}")
    
    # Step 10: Generate transaction now
    print("\n🔟 Generating transaction now...")
    response = requests.post(f"{BASE_URL}/recurring/{income_id}/generate-now", headers=headers)
    if response.status_code != 200:
        print(f"       Failed: {response.status_code}")
        return False
    
    result = response.json()
    print(f"       {result['message']}")
    print(f"      Next occurrence: {result['next_occurrence']}")
    
    # Step 11: Filter by type
    print("\n1️⃣1️⃣ Filtering by type (expense)...")
    response = requests.get(f"{BASE_URL}/recurring", headers=headers, params={"transaction_type": "expense"})
    if response.status_code != 200:
        print(f"       Failed: {response.status_code}")
        return False
    
    filtered = response.json()
    print(f"       Found {len(filtered['items'])} expense recurring transactions")
    
    # Step 12: Filter by status
    print("\n1️⃣2️⃣ Filtering by status (active)...")
    response = requests.get(f"{BASE_URL}/recurring", headers=headers, params={"is_active": True})
    if response.status_code != 200:
        print(f"       Failed: {response.status_code}")
        return False
    
    filtered = response.json()
    print(f"       Found {len(filtered['items'])} active recurring transactions")
    
    # Step 13: Delete recurring
    print("\n1️⃣3️⃣ Deleting recurring transactions...")
    response = requests.delete(f"{BASE_URL}/recurring/{expense_id}", headers=headers)
    if response.status_code != 204:
        print(f"       Failed: {response.status_code}")
        return False
    print(f"       Deleted recurring #{expense_id}")
    
    response = requests.delete(f"{BASE_URL}/recurring/{income_id}", headers=headers)
    if response.status_code != 204:
        print(f"       Failed: {response.status_code}")
        return False
    print(f"       Deleted recurring #{income_id}")
    
    print("\n" + "=" * 60)
    print("    ALL TESTS PASSED! Recurring Transactions API is fully functional!")
    print("=" * 60)
    return True

if __name__ == "__main__":
    success = test_recurring()
    exit(0 if success else 1)
