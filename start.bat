@echo off
REM Script tự động khởi động Weather App (Windows Batch)
REM Chạy: start.bat

echo.
echo ========================================
echo    WEATHER APP - AUTO START SCRIPT
echo ========================================
echo.

REM Kiểm tra Node.js
echo [1/5] Kiem tra Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo      ERROR: Node.js chua duoc cai dat!
    echo      Vui long cai dat Node.js tu: https://nodejs.org/
    pause
    exit /b 1
)
echo      OK: Node.js da duoc cai dat

REM Kiểm tra npm
echo [2/5] Kiem tra npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo      ERROR: npm chua duoc cai dat!
    pause
    exit /b 1
)
echo      OK: npm da duoc cai dat

REM Kiểm tra dependencies
echo [3/5] Kiem tra dependencies...
if not exist "node_modules" (
    echo      Dang cai dat dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo      ERROR: Cai dat that bai!
        pause
        exit /b 1
    )
    echo      OK: Da cai dat xong
) else (
    echo      OK: Dependencies da duoc cai dat
)

REM Set environment variables
set API_PROVIDER=openmeteo
set PORT=3000

echo [4/5] Khoi dong server...
echo      API Provider: Open-Meteo (Mien phi, khong can key)
echo      Server se chay tren: http://localhost:3000
echo.
echo ========================================
echo    SERVER DANG CHAY...
echo    Nhan Ctrl+C de dung server
echo ========================================
echo.

REM Đợi một chút rồi mở trình duyệt
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:3000"

REM Khởi động server
call npm start

pause

