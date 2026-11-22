@echo off
title MediBid AI - Full Stack Platform
echo =====================================================================
echo                Starting MediBid AI Full Stack Platform
echo =====================================================================
echo.
echo [1/2] Launching FastAPI Backend on http://localhost:8000 ...
start "MediBid AI - Backend" cmd /k "cd /d %~dp0backend && .venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000"

echo [2/2] Launching Next.js Frontend on http://localhost:3000 ...
start "MediBid AI - Frontend" cmd /k "cd /d %~dp0frontend && npm start -- -p 3000"

echo.
echo =====================================================================
echo  Both services are running!
echo  - Frontend: http://localhost:3000
echo  - Backend:  http://localhost:8000
echo  - API Docs: http://localhost:8000/docs
echo =====================================================================
echo.
timeout /t 3 >nul
start http://localhost:3000

