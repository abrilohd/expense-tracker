@echo off
echo ==========================================
echo Killing Old Backend and Restarting
echo ==========================================
echo.

echo Step 1: Killing all processes on port 8000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
    echo Killing process %%a
    taskkill /F /PID %%a 2>nul
)

echo.
echo Step 2: Waiting 2 seconds...
timeout /t 2 /nobreak >nul

echo.
echo Step 3: Starting backend with new configuration...
echo.

if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
    echo Backend starting at: http://localhost:8000
    echo API docs at: http://localhost:8000/docs
    echo.
    echo LOOK FOR THIS LINE:
    echo    ✅ OAuth configured: Client ID loaded (199412317897...)
    echo.
    echo Press Ctrl+C to stop
    echo.
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
) else (
    echo ERROR: Virtual environment not found!
    pause
)
