@echo off
echo ========================================
echo STEP 1: Checking git status
echo ========================================
git status

echo.
echo ========================================
echo STEP 2: Staging all changes
echo ========================================
git add .

echo.
echo ========================================
echo STEP 3: Committing changes
echo ========================================
git commit -m "chore: production ready - clean structure, optimized build, deployment configs"

echo.
echo ========================================
echo STEP 4: Pushing to GitHub
echo ========================================
git push origin main

echo.
echo ========================================
echo COMPLETE
echo ========================================
echo Repository: https://github.com/abrilohd/expense-tracker.git
pause
