@echo off
echo ====================================================
echo    Starting local server for Beauty Web Experience
echo ====================================================
echo.

echo Checking for existing processes on port 5500...
:: Kill any existing process on port 5500
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5500 ^| findstr LISTENING') do (
    echo Stopping existing process on port 5500: %%a
    taskkill /F /PID %%a 2>nul
)
echo Port check complete.
echo.

echo Setting up environment...
:: Navigate to the beauty-web directory
cd /d D:\ARGEN\Baunda\beauty-web
echo Current directory: %CD%
echo.

:: Check if npx is available
echo Checking for required tools...
where npx >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npx not found. Please make sure Node.js is installed.
    echo.
    echo You can download Node.js from: https://nodejs.org/
    goto ERROR_EXIT
)
echo Tools check complete.
echo.

echo Starting server on http://localhost:5500
echo Serving files from D:\ARGEN\Baunda\beauty-web
echo.
echo ====================================================
echo    SERVER STARTING - PLEASE WAIT
echo    Once the server starts, your browser will open automatically
echo    DO NOT CLOSE THIS WINDOW while using the Beauty Experience
echo ====================================================
echo.

:: Start the server in the current window
start "" http://localhost:5500
cd /d D:\ARGEN\AR-Webstore
echo npx http-server "D:\ARGEN\Baunda\beauty-web" -p 5500 --cors -c-1
npx http-server "D:\ARGEN\Baunda\beauty-web" -p 5500 --cors -c-1

goto EXIT

:ERROR_EXIT
echo.
echo ====================================================
echo    ERROR STARTING SERVER
echo ====================================================
echo.
echo Please try:
echo 1. Make sure Node.js is installed
echo 2. Open the beauty-web directory directly at:
echo    D:\ARGEN\Baunda\beauty-web\index.html
echo.
echo Press any key to exit...
pause >nul

:EXIT