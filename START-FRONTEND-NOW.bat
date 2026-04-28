@echo off
echo ==========================================
echo STARTING FRONTEND SERVER
echo ==========================================
echo.

cd frontend

echo Checking for node_modules...
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

echo Starting frontend server...
echo.
echo ==========================================
echo Frontend will be at: http://localhost:5173
echo ==========================================
echo.
echo Press Ctrl+C to stop the server
echo ==========================================
echo.

npm run dev
