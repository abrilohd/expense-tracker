@echo off
cls
echo ============================================================
echo BACKEND SERVER RESTART SCRIPT
echo ============================================================
echo.

echo [1/4] Stopping any running backend servers...
echo.
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *uvicorn*" 2>nul
timeout /t 2 /nobreak >nul
echo   Done!
echo.

echo [2/4] Clearing Python cache...
echo.
for /d /r . %%d in (__pycache__) do @if exist "%%d" (
    rd /s /q "%%d" 2>nul
    echo   Deleted: %%d
)
del /s /q *.pyc 2>nul
echo   Done!
echo.

echo [3/4] Testing if password endpoint exists in code...
echo.
python test_import.py
if errorlevel 1 (
    echo.
    echo ============================================================
    echo ERROR: Password endpoint not found in code!
    echo ============================================================
    echo.
    echo Please check the error message above.
    echo.
    pause
    exit /b 1
)
echo.

echo [4/4] Starting backend server...
echo.
echo Server will start in 3 seconds...
echo Press Ctrl+C to stop the server when it's running.
echo.
timeout /t 3 /nobreak >nul

echo ============================================================
echo STARTING SERVER NOW
echo ============================================================
echo.

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
