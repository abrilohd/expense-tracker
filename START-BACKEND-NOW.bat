@echo off
echo ==========================================
echo STARTING BACKEND SERVER
echo ==========================================
echo.

cd backend

echo Checking for virtual environment...
if not exist "venv\Scripts\activate.bat" (
    echo ERROR: Virtual environment not found!
    echo Creating virtual environment...
    python -m venv venv
    echo.
    echo Installing dependencies...
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
    echo.
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Killing any existing backend processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a 2>nul
)

echo.
echo Starting backend server...
echo.
echo ==========================================
echo Backend will be at: http://localhost:8000
echo API docs at: http://localhost:8000/docs
echo ==========================================
echo.
echo LOOK FOR THIS LINE:
echo    ✅ OAuth configured: Client ID loaded
echo.
echo If you see that line, OAuth is working!
echo.
echo Press Ctrl+C to stop the server
echo ==========================================
echo.

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
