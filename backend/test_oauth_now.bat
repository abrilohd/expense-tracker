@echo off
echo ========================================
echo OAuth Configuration Test
echo ========================================
echo.

echo Test 1: Checking backend...
curl -s http://localhost:8000/ >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Backend is running
) else (
    echo [ERROR] Backend is NOT running!
    echo Please start it first: kill_and_restart.bat
    pause
    exit /b 1
)

echo.
echo Test 2: Checking OAuth config...
curl -s http://localhost:8000/auth/oauth-status
echo.

echo.
echo Test 3: Open test page in browser...
echo Opening: test_oauth_browser.html
start test_oauth_browser.html

echo.
echo ========================================
echo Check the browser window that opened
echo Click the buttons to test OAuth
echo ========================================
pause
