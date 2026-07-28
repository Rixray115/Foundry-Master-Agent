@echo off
echo ====================================
echo  PI Foundry - Starting all services
echo ====================================
echo.

REM Start RAG (port 7402)
echo [1/2] Starting RAG service...
start "PI-RAG" cmd /c "cd /d %~dp0rag && node server.mjs"
timeout /t 3 /nobreak >nul

REM Start Relay (port 7401)
echo [2/2] Starting Relay...
start "PI-Relay" cmd /c "cd /d %~dp0relay && node server.mjs"
timeout /t 2 /nobreak >nul

REM Check health
echo.
echo Checking services...
curl -s http://127.0.0.1:7402/health 2>nul && echo  RAG: OK || echo  RAG: NOT READY
curl -s http://127.0.0.1:7401/health 2>nul && echo  Relay: OK || echo  Relay: NOT READY

echo.
echo ====================================
echo  Ready! Open Foundry in browser,
echo  then run: pi --cwd %~dp0
echo ====================================
pause
