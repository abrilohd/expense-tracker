@echo off
REM Pre-Deployment Test Script for Windows
REM Run this script to test all components before deployment

echo ======================================
echo PRE-DEPLOYMENT FUNCTIONAL TEST
echo ======================================
echo.

set TESTS_PASSED=0
set TESTS_FAILED=0

echo TEST 1: Backend Dependencies
echo ------------------------------
cd backend
pip install -r requirements.txt >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Backend dependencies installed
    set /a TESTS_PASSED+=1
) else (
    echo [FAIL] Backend dependencies installation failed
    set /a TESTS_FAILED+=1
)
cd ..
echo.

echo TEST 2: Backend Health Check
echo ------------------------------
echo Starting backend server...
cd backend
start /B uvicorn app.main:app --host 0.0.0.0 --port 8000
timeout /t 5 /nobreak >nul
cd ..

curl -s http://localhost:8000/health | findstr "ok" >nul
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Backend health endpoint responds
    set /a TESTS_PASSED+=1
) else (
    echo [FAIL] Backend health endpoint failed
    set /a TESTS_FAILED+=1
)
echo.

echo TEST 3: Frontend Build
echo ------------------------------
cd frontend
call npm run build >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Frontend build succeeds
    set /a TESTS_PASSED+=1
    
    if exist "dist\index.html" (
        echo [PASS] Frontend dist/index.html exists
        set /a TESTS_PASSED+=1
    ) else (
        echo [FAIL] Frontend dist/index.html missing
        set /a TESTS_FAILED+=1
    )
) else (
    echo [FAIL] Frontend build failed
    set /a TESTS_FAILED+=1
)
cd ..
echo.

echo TEST 4: Environment Variables
echo ------------------------------

if exist "backend\.env" (
    echo [PASS] Backend .env exists
    set /a TESTS_PASSED+=1
    
    findstr "DATABASE_URL" backend\.env >nul
    if %ERRORLEVEL% EQU 0 (
        echo [PASS] DATABASE_URL configured
        set /a TESTS_PASSED+=1
    ) else (
        echo [FAIL] DATABASE_URL missing
        set /a TESTS_FAILED+=1
    )
    
    findstr "SECRET_KEY" backend\.env >nul
    if %ERRORLEVEL% EQU 0 (
        echo [PASS] SECRET_KEY configured
        set /a TESTS_PASSED+=1
    ) else (
        echo [FAIL] SECRET_KEY missing
        set /a TESTS_FAILED+=1
    )
) else (
    echo [FAIL] Backend .env missing
    set /a TESTS_FAILED+=1
)

if exist "frontend\.env" (
    echo [PASS] Frontend .env exists
    set /a TESTS_PASSED+=1
    
    findstr "VITE_API_URL" frontend\.env >nul
    if %ERRORLEVEL% EQU 0 (
        echo [PASS] VITE_API_URL configured
        set /a TESTS_PASSED+=1
    ) else (
        echo [FAIL] VITE_API_URL missing
        set /a TESTS_FAILED+=1
    )
) else (
    echo [FAIL] Frontend .env missing
    set /a TESTS_FAILED+=1
)
echo.

echo Cleaning up...
taskkill /F /IM uvicorn.exe >nul 2>&1
echo.

echo ======================================
echo TEST SUMMARY
echo ======================================
echo Passed: %TESTS_PASSED%
echo Failed: %TESTS_FAILED%
echo.

if %TESTS_FAILED% EQU 0 (
    echo [SUCCESS] ALL TESTS PASSED
    echo Project is ready for deployment!
    exit /b 0
) else (
    echo [ERROR] SOME TESTS FAILED
    echo Please fix the issues before deploying.
    exit /b 1
)
