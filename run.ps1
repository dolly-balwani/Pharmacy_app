Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "            Starting MediBid AI Full Stack Platform" -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[1/2] Launching FastAPI Backend on http://localhost:8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; & '.\.venv\Scripts\python.exe' -m uvicorn app.main:app --host 0.0.0.0 --port 8000"

Write-Host "[2/2] Launching Next.js Frontend on http://localhost:3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm start -- -p 3000"

Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Green
Write-Host " Both services launched! Opening http://localhost:3000 in browser..." -ForegroundColor Green
Write-Host "=====================================================================" -ForegroundColor Green
Start-Sleep -Seconds 2
Start-Process "http://localhost:3000"

