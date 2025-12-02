# Script tự động khởi động Weather App
# Chạy: .\start.ps1

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   WEATHER APP - AUTO START SCRIPT" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Kiểm tra Node.js
Write-Host "[1/5] Kiem tra Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "     ✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "     ❌ Node.js chua duoc cai dat!" -ForegroundColor Red
    Write-Host "     Vui long cai dat Node.js tu: https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Kiểm tra npm
Write-Host "[2/5] Kiem tra npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "     ✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "     ❌ npm chua duoc cai dat!" -ForegroundColor Red
    exit 1
}

# Kiểm tra dependencies
Write-Host "[3/5] Kiem tra dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "     ⚠️  Dependencies chua duoc cai dat" -ForegroundColor Yellow
    Write-Host "     Dang cai dat dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "     ❌ Cai dat that bai!" -ForegroundColor Red
        exit 1
    }
    Write-Host "     ✅ Da cai dat xong" -ForegroundColor Green
} else {
    Write-Host "     ✅ Dependencies da duoc cai dat" -ForegroundColor Green
}

# Kiểm tra port 3000
Write-Host "[4/5] Kiem tra port 3000..." -ForegroundColor Yellow
$portInUse = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "     ⚠️  Port 3000 dang duoc su dung" -ForegroundColor Yellow
    Write-Host "     Dang dung process cu..." -ForegroundColor Yellow
    $process = Get-Process -Id $portInUse.OwningProcess -ErrorAction SilentlyContinue
    if ($process) {
        Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
        Write-Host "     ✅ Da dung process cu" -ForegroundColor Green
    }
} else {
    Write-Host "     ✅ Port 3000 san sang" -ForegroundColor Green
}

# Set environment variables
$env:API_PROVIDER = "openmeteo"
$env:PORT = "3000"

Write-Host "[5/5] Khoi dong server..." -ForegroundColor Yellow
Write-Host "     API Provider: Open-Meteo (Mien phi, khong can key)" -ForegroundColor Cyan
Write-Host "     Server se chay tren: http://localhost:3000" -ForegroundColor Cyan
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   SERVER DANG CHAY..." -ForegroundColor Green
Write-Host "   Nhan Ctrl+C de dung server" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

# Đợi một chút rồi mở trình duyệt
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 3
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -TimeoutSec 5 -ErrorAction Stop
        Start-Process "http://localhost:3000"
        Write-Host "`n✅ Da mo trinh duyet!" -ForegroundColor Green
    } catch {
        Write-Host "`n⚠️  Server dang khoi dong, vui long mo thu cong: http://localhost:3000" -ForegroundColor Yellow
    }
} | Out-Null

# Khởi động server
npm start

