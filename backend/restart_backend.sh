#!/bin/bash

echo "========================================"
echo "Restarting Backend Server"
echo "========================================"
echo ""

echo "Step 1: Clearing Python cache..."
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null
find . -type f -name "*.pyc" -delete 2>/dev/null
echo "  Done!"
echo ""

echo "Step 2: Checking if auth.py has password endpoint..."
python verify_password_endpoint.py
if [ $? -ne 0 ]; then
    echo "  ERROR: Password endpoint not found in code!"
    exit 1
fi
echo ""

echo "Step 3: Starting backend server..."
echo "  Press Ctrl+C to stop the server"
echo ""

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
