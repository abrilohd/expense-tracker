@echo off
echo ==========================================
echo Starting Backend Server
echo ==========================================
echo.

REM Activate virtual environment
if exist "venv\Scripts\activate.bat" (
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
) else (
    echo WARNING: Virtual environment not found!
    echo Please create it first: python -m venv venv
    pause
    exit /b 1
)

echo.
echo Starting Uvicorn server...
echo Backend will be available at: http://127.0.0.1:8000
echo API docs will be available at: http://127.0.0.1:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
