#!/bin/bash

# Pre-Deployment Test Script
# Run this script to test all components before deployment

set -e  # Exit on error

echo "======================================"
echo "PRE-DEPLOYMENT FUNCTIONAL TEST"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

# Function to print test result
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC}: $2"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC}: $2"
        ((TESTS_FAILED++))
    fi
}

echo "TEST 1: Backend Dependencies"
echo "------------------------------"
cd backend
if pip install -r requirements.txt > /dev/null 2>&1; then
    print_result 0 "Backend dependencies installed"
else
    print_result 1 "Backend dependencies installation failed"
fi
cd ..
echo ""

echo "TEST 2: Backend Starts"
echo "------------------------------"
echo "Starting backend server..."
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..
sleep 5  # Wait for server to start

# Test health endpoint
if curl -s http://localhost:8000/health | grep -q "ok"; then
    print_result 0 "Backend health endpoint responds"
else
    print_result 1 "Backend health endpoint failed"
fi

# Test root endpoint
if curl -s http://localhost:8000/ | grep -q "Expense Tracker API"; then
    print_result 0 "Backend root endpoint responds"
else
    print_result 1 "Backend root endpoint failed"
fi

echo ""

echo "TEST 3: Backend API Endpoints"
echo "------------------------------"

# Test register
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234!"}')

if echo "$REGISTER_RESPONSE" | grep -q "access_token\|email"; then
    print_result 0 "User registration works"
else
    print_result 1 "User registration failed"
fi

# Test login
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@test.com&password=Test1234!")

if echo "$LOGIN_RESPONSE" | grep -q "access_token"; then
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
    print_result 0 "User login works"
    
    # Test protected endpoint
    if curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8000/expenses | grep -q "\[\]"; then
        print_result 0 "Protected endpoint (expenses) works"
    else
        print_result 1 "Protected endpoint (expenses) failed"
    fi
else
    print_result 1 "User login failed"
fi

echo ""

echo "TEST 4: Frontend Build"
echo "------------------------------"
cd frontend
if npm run build > /dev/null 2>&1; then
    print_result 0 "Frontend build succeeds"
    
    if [ -f "dist/index.html" ]; then
        print_result 0 "Frontend dist/index.html exists"
    else
        print_result 1 "Frontend dist/index.html missing"
    fi
    
    # Check bundle size
    DIST_SIZE=$(du -sh dist | cut -f1)
    echo "   Bundle size: $DIST_SIZE"
else
    print_result 1 "Frontend build failed"
fi
cd ..
echo ""

echo "TEST 5: Environment Variables"
echo "------------------------------"

# Check backend .env
if [ -f "backend/.env" ]; then
    print_result 0 "Backend .env exists"
    
    if grep -q "DATABASE_URL" backend/.env; then
        print_result 0 "DATABASE_URL configured"
    else
        print_result 1 "DATABASE_URL missing"
    fi
    
    if grep -q "SECRET_KEY" backend/.env; then
        print_result 0 "SECRET_KEY configured"
    else
        print_result 1 "SECRET_KEY missing"
    fi
    
    if grep -q "GOOGLE_CLIENT_ID" backend/.env; then
        print_result 0 "GOOGLE_CLIENT_ID configured"
    else
        print_result 1 "GOOGLE_CLIENT_ID missing"
    fi
else
    print_result 1 "Backend .env missing"
fi

# Check frontend .env
if [ -f "frontend/.env" ]; then
    print_result 0 "Frontend .env exists"
    
    if grep -q "VITE_API_URL" frontend/.env; then
        print_result 0 "VITE_API_URL configured"
    else
        print_result 1 "VITE_API_URL missing"
    fi
else
    print_result 1 "Frontend .env missing"
fi

echo ""

# Cleanup
echo "Cleaning up..."
kill $BACKEND_PID 2>/dev/null || true
echo ""

echo "======================================"
echo "TEST SUMMARY"
echo "======================================"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ ALL TESTS PASSED${NC}"
    echo "Project is ready for deployment!"
    exit 0
else
    echo -e "${RED}✗ SOME TESTS FAILED${NC}"
    echo "Please fix the issues before deploying."
    exit 1
fi
