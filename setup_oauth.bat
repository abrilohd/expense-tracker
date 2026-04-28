@echo off
REM Google OAuth Setup Helper Script for Windows
REM This script helps you set up Google OAuth step by step

echo ==========================================
echo Google OAuth Setup Helper
echo ==========================================
echo.

REM Check if backend/.env exists
if not exist "backend\.env" (
    echo [ERROR] backend/.env file not found!
    echo.
    echo Creating backend/.env from template...
    copy "backend\.env.example" "backend\.env"
    echo [OK] Created backend/.env
    echo.
)

echo This script will help you configure Google OAuth.
echo.
echo Before continuing, you need to:
echo 1. Go to https://console.cloud.google.com/apis/credentials
echo 2. Create OAuth 2.0 Client ID
echo 3. Add these Authorized JavaScript origins:
echo    - http://localhost:5173
echo    - http://localhost:8000
echo 4. Add this Authorized redirect URI:
echo    - http://localhost:8000/auth/google/callback
echo.
echo See OAUTH-QUICK-FIX.md for detailed instructions.
echo.

set /p READY="Have you completed the Google Cloud Console setup? (y/n): "

if /i not "%READY%"=="y" (
    echo.
    echo Please complete the Google Cloud Console setup first.
    echo See: OAUTH-QUICK-FIX.md
    exit /b 1
)

echo.
echo Great! Now let's configure your credentials.
echo.

REM Get Client ID
echo Enter your Google Client ID:
echo (Format: 123456789-xxxxxxxx.apps.googleusercontent.com)
set /p CLIENT_ID="> "

if "%CLIENT_ID%"=="" (
    echo [ERROR] Client ID cannot be empty
    exit /b 1
)

REM Get Client Secret
echo.
echo Enter your Google Client Secret:
echo (Format: GOCSPX-xxxxxxxxxxxxx)
set /p CLIENT_SECRET="> "

if "%CLIENT_SECRET%"=="" (
    echo [ERROR] Client Secret cannot be empty
    exit /b 1
)

REM Update .env file
echo.
echo Updating backend/.env...

REM Create a temporary file with updated values
(
    for /f "usebackq delims=" %%a in ("backend\.env") do (
        set "line=%%a"
        setlocal enabledelayedexpansion
        if "!line:~0,17!"=="GOOGLE_CLIENT_ID=" (
            echo GOOGLE_CLIENT_ID=%CLIENT_ID%
        ) else if "!line:~0,21!"=="GOOGLE_CLIENT_SECRET=" (
            echo GOOGLE_CLIENT_SECRET=%CLIENT_SECRET%
        ) else (
            echo !line!
        )
        endlocal
    )
) > "backend\.env.tmp"

REM Replace original file
move /y "backend\.env.tmp" "backend\.env" >nul

echo [OK] Updated backend/.env
echo.

REM Verify configuration
echo Verifying configuration...
echo.

cd backend
python verify_oauth_config.py
cd ..

echo.
echo ==========================================
echo Next Steps:
echo ==========================================
echo.
echo 1. Start the backend server:
echo    cd backend
echo    venv\Scripts\activate
echo    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
echo.
echo 2. Start the frontend:
echo    cd frontend
echo    npm run dev
echo.
echo 3. Test OAuth:
echo    - Go to http://localhost:5173/login
echo    - Click 'Continue with Google'
echo    - You should see Google's consent screen
echo.
echo Setup complete! 🎉
echo.

pause
