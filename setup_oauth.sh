#!/bin/bash

# Google OAuth Setup Helper Script
# This script helps you set up Google OAuth step by step

echo "=========================================="
echo "Google OAuth Setup Helper"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if backend/.env exists
if [ ! -f "backend/.env" ]; then
    echo -e "${RED}❌ backend/.env file not found!${NC}"
    echo ""
    echo "Creating backend/.env from template..."
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✅ Created backend/.env${NC}"
    echo ""
fi

echo "This script will help you configure Google OAuth."
echo ""
echo -e "${YELLOW}Before continuing, you need to:${NC}"
echo "1. Go to https://console.cloud.google.com/apis/credentials"
echo "2. Create OAuth 2.0 Client ID"
echo "3. Add these Authorized JavaScript origins:"
echo "   - http://localhost:5173"
echo "   - http://localhost:8000"
echo "4. Add this Authorized redirect URI:"
echo "   - http://localhost:8000/auth/google/callback"
echo ""
echo -e "${BLUE}See OAUTH-QUICK-FIX.md for detailed instructions.${NC}"
echo ""

read -p "Have you completed the Google Cloud Console setup? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Please complete the Google Cloud Console setup first."
    echo "See: OAUTH-QUICK-FIX.md"
    exit 1
fi

echo ""
echo "Great! Now let's configure your credentials."
echo ""

# Get Client ID
echo -e "${YELLOW}Enter your Google Client ID:${NC}"
echo "(Format: 123456789-xxxxxxxx.apps.googleusercontent.com)"
read -p "> " CLIENT_ID

if [ -z "$CLIENT_ID" ]; then
    echo -e "${RED}❌ Client ID cannot be empty${NC}"
    exit 1
fi

# Get Client Secret
echo ""
echo -e "${YELLOW}Enter your Google Client Secret:${NC}"
echo "(Format: GOCSPX-xxxxxxxxxxxxx)"
read -p "> " CLIENT_SECRET

if [ -z "$CLIENT_SECRET" ]; then
    echo -e "${RED}❌ Client Secret cannot be empty${NC}"
    exit 1
fi

# Update .env file
echo ""
echo "Updating backend/.env..."

# Use sed to replace the values (works on both Linux and macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|GOOGLE_CLIENT_ID=.*|GOOGLE_CLIENT_ID=$CLIENT_ID|" backend/.env
    sed -i '' "s|GOOGLE_CLIENT_SECRET=.*|GOOGLE_CLIENT_SECRET=$CLIENT_SECRET|" backend/.env
else
    # Linux
    sed -i "s|GOOGLE_CLIENT_ID=.*|GOOGLE_CLIENT_ID=$CLIENT_ID|" backend/.env
    sed -i "s|GOOGLE_CLIENT_SECRET=.*|GOOGLE_CLIENT_SECRET=$CLIENT_SECRET|" backend/.env
fi

echo -e "${GREEN}✅ Updated backend/.env${NC}"
echo ""

# Verify configuration
echo "Verifying configuration..."
echo ""

cd backend
python3 verify_oauth_config.py

echo ""
echo "=========================================="
echo "Next Steps:"
echo "=========================================="
echo ""
echo "1. Start the backend server:"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo "2. Start the frontend:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Test OAuth:"
echo "   - Go to http://localhost:5173/login"
echo "   - Click 'Continue with Google'"
echo "   - You should see Google's consent screen"
echo ""
echo -e "${GREEN}Setup complete! 🎉${NC}"
echo ""
