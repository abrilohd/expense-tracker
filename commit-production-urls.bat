@echo off
echo ========================================
echo Committing production URL updates
echo ========================================

git add .

echo.
echo Files to be committed:
git status --short

echo.
echo ========================================
echo Press any key to commit and push...
echo ========================================
pause

git commit -m "fix: production URLs for landing page and frontend"

git push origin main

echo.
echo ========================================
echo Push complete!
echo ========================================
echo.
echo Landing page now routes to:
echo https://expense-tracker-app-tau-rust.vercel.app
echo.
pause
