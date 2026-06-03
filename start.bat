@echo off
cd /d "%~dp0"
echo ================================
echo   LeBron Website - Starting...
echo ================================
echo.
start "" python -m http.server 8080
timeout /t 2 /nobreak >nul
start "" http://127.0.0.1:8080
echo Server started at http://127.0.0.1:8080
echo.
echo Press any key to stop the server and exit...
pause >nul
taskkill /f /im python.exe >nul 2>&1
echo Server stopped.
