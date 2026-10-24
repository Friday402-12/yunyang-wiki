@echo off
chcp 65001 >nul
cd /d "%~dp0"

if not exist "node_modules" (
  echo Installing dependencies, please wait...
  call npm install --no-audit --no-fund
)

echo.
echo Starting local preview at http://localhost:5173
echo Press Ctrl+C to stop.
echo.

call npm run dev
pause
