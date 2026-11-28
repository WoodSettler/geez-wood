@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-studio.ps1"
if errorlevel 1 (
  echo.
  echo Failed to start Geez Wood Studio. See error above.
  pause
)
