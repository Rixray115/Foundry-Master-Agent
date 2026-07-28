@echo off
echo Graphify Watch - Auto-rebuild on code changes
echo Watching: %~dp0
echo Press Ctrl+C to stop
echo.
cd /d %~dp0
"C:/Users/ricar/AppData/Local/Python/pythoncore-3.14-64/python.exe" -m graphify . --watch
