@echo off
echo ========================================
echo Committing PostgreSQL changes
echo ========================================

git add backend/app/db/database.py

git commit -m "fix: add PostgreSQL connection pooling for Railway deployment"

git push origin main

echo.
echo ========================================
echo Push complete!
echo ========================================
pause
