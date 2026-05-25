@echo off
echo Starting Landing Page Server on http://localhost:5500
echo.
echo Open your browser and go to:
echo http://localhost:5500
echo.
echo Press Ctrl+C to stop the server
echo.
python -m http.server 5500
