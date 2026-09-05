@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title Skybounders Launcher

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo [SKYBOUNDERS] Node.js was not found.
  echo Install Node.js 22 LTS, then run this file again.
  pause
  exit /b 1
)
where npm >nul 2>nul
if errorlevel 1 (
  echo.
  echo [SKYBOUNDERS] npm was not found. Reinstall Node.js 22 LTS.
  pause
  exit /b 1
)

if not exist "node_modules\.bin\electron.cmd" (
  echo [SKYBOUNDERS] First launch: installing dependencies...
  call npm install
  if errorlevel 1 (
    echo.
    echo [SKYBOUNDERS] Dependency installation failed.
    echo Check the npm error above, then run this file again.
    pause
    exit /b 1
  )
)

call npm run self-check
if errorlevel 1 (
  echo.
  echo [SKYBOUNDERS] Self-check failed. Startup stopped safely.
  pause
  exit /b 1
)

echo [SKYBOUNDERS] Launching...
call npm run dev
set "EXITCODE=%ERRORLEVEL%"
echo.
echo [SKYBOUNDERS] Process exited with code %EXITCODE%.
pause
exit /b %EXITCODE%
