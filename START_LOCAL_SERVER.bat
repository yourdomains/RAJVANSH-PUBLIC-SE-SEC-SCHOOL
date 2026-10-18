@echo off
title Rajvansh Public School - 3D Local Server
color 0B
echo ========================================================
echo   RAJVANSH PUBLIC SENIOR SECONDARY SCHOOL - 3D WEBSITE
echo ========================================================
echo.
echo Starting Localhost Web Server on http://localhost:3000/ ...
echo.

start http://localhost:3000/

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1" -Port 3000 -RootDir "%~dp0"
pause
