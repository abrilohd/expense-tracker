@echo off
echo ========================================
echo Committing Railway deployment fixes
echo ========================================

git add backend/app/db/database.py
git add backend/.env.example
git add RAILWAY-DEPLOYMENT.md

git status

echo.
echo ========================================
echo Ready to commit. Press any key to continue...
echo ========================================
pause

git commit -m "fix: add logging and Railway deployment guide for PostgreSQL"

git push origin main

echo.
echo ========================================
echo Push complete!
echo ========================================
echo.
echo NEXT STEPS:
echo 1. Go to Railway dashboard
echo 2. Check if PostgreSQL database is added
echo 3. Verify DATABASE_URL environment variable exists
echo 4. Check deployment logs for connection success
echo.
pause
